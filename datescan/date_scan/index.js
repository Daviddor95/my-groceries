'use strict';

const async = require('async');
// const fs = require('fs');
// const https = require('https');
// const path = require("path");
// const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const key = process.env.AZURE_KEY;
const endpoint = process.env.Azure_ENDPOINT;
const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);


module.exports = async function (context, req) {
    try {
        async.series([
            async function () {
                const text = await readFromImg(computerVisionClient, req.body.img_b64);
                const recDate = recognizeDate(text);
                if (recDate) {
                    context.res = {
                        "headers": {
                            "content-type": "application/json"
                        },
                        "body": recDate
                    };
                }
                function recognizeDate(readResults) {
                    // for (const page in readResults) {
                        const result = readResults[0];
                        if (result.lines.length) {
                            var dates = [];
                            for (const line of result.lines) {
                                var lineText = line.words.map(w => w.text).join(' ');
                                var dateStr = lineText.match(/(0?[1-9]|[12]\d|30|31)[^\w\d\r\n:](0?[1-9]|1[0-2])[^\w\d\r\n:](\d{4}|\d{2})/);
                                if (dateStr) {
                                    dates = dates.concat(dateStr);  // new Date(dateStr);
                                }
                            }
                            var datesObj = [];
                            for (const date of dates) {
                                const day = Number(date.slice(0, 2));
                                const month = Number(date.slice(3, 5)) - 1;
                                const year = Number(date.slice(6, 10));
                                datesObj.push(new Date(year, month, day));
                            }
                            if (datesObj.length > 1) {
                                return new Date(Math.max.apply(null, datesObj));
                            } else if (datesObj.length === 1) {
                                return datesObj[0];
                            }
                        }
                        else {
                            return null;
                        }
                    // }   
                }
                async function readFromImg(client, img) {
                    var img = Buffer.from(img, 'base64')
                    // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
                    let result = await client.analyzeImageInStream(img);
                    // Operation ID is last path segment of operationLocation (a URL)
                    let operation = result.operationLocation.split('/').slice(-1)[0];
                    // Wait for read recognition to complete
                    // result.status is initially undefined, since it's the result of read
                    while (result.status !== "succeeded") {
                        await sleep(1000);
                        result = await client.getReadResult(operation);
                    }
                    return result.analyzeResult.readResults;
                }
            },
            function () {
                return new Promise((resolve) => {
                    resolve();
                });
            }], (err) => { throw (err); });
        var ret;

    } catch (e) {
        context.res = {
            "status": 500,
            "headers": {
                "content-type": "application/json"
            },
            "body": {
                "message": e.toString()
            }
        }
    }
}


// module.exports = async function (context, req) {
//     context.log('JavaScript HTTP trigger function processed a request.');

//     const name = (req.query.name || (req.body && req.body.name));
//     const responseMessage = name
//         ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//         : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

//     context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: responseMessage
//     };
// }