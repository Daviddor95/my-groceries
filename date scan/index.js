'use strict';

const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = '0601e32844354c2c8e3f04ad408362c2';
const endpoint = 'https://datescan.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
/**
 * END - Authenticate
 */

function computerVision() {
  async.series([
    async function () {
      const printedTextSampleURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/printed_text.jpg';
      console.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());
      const printedResult = await readTextFromURL(computerVisionClient, printedTextSampleURL);
      printRecText(printedResult);
      async function readTextFromURL(client, url) {
        // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
        let result = await client.read(url);
        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];

        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== "succeeded") { await sleep(1000); result = await client.getReadResult(operation); }
        return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
      }

      // Prints all text from Read result
      function printRecText(readResults) {
        console.log('Recognized text:');
        for (const page in readResults) {
          if (readResults.length > 1) {
            console.log(`==== Page: ${page}`);
          }
          const result = readResults[page];
          if (result.lines.length) {
            for (const line of result.lines) {
              console.log(line.words.map(w => w.text).join(' '));
            }
          }
          else { console.log('No recognized text.'); }
        }
      }

      /**
       * 
       * Download the specified file in the URL to the current local folder
       * 
       */
      function downloadFilesToLocal(url, localFileName) {
        return new Promise((resolve, reject) => {
          console.log('--- Downloading file to local directory from: ' + url);
          const request = https.request(url, (res) => {
            if (res.statusCode !== 200) {
              console.log(`Download sample file failed. Status code: ${res.statusCode}, Message: ${res.statusMessage}`);
              reject();
            }
            var data = [];
            res.on('data', (chunk) => {
              data.push(chunk);
            });
            res.on('end', () => {
              console.log('   ... Downloaded successfully');
              fs.writeFileSync(localFileName, Buffer.concat(data));
              resolve();
            });
          });
          request.on('error', function (e) {
            console.log(e.message);
            reject();
          });
          request.end();
        });
      }

      /**
       * END - Recognize Printed & Handwritten Text
       */
      console.log();
      console.log('-------------------------------------------------');
      console.log('End of quickstart.');

    },
    function () {
      return new Promise((resolve) => {
        resolve();
      })
    }
  ], (err) => {
    throw (err);
  });
}

computerVision();
