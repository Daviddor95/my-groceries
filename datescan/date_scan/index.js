module.exports = async function (context, req) {
    const Buffer = require('buffer/').Buffer;
    const key = process.env.AZURE_KEY;
    const endpoint = process.env.Azure_ENDPOINT + "computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=read&language=en&gender-neutral-caption=False";   // "vision/v3.2/read/analyze?language=en&readingOrder=natural&model-version=latest";
    try {
        const binaryImage = Buffer.from(req.body.img_b64.replace('data:image/jpeg;base64,', ''), 'base64');
        await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': key,
                'Content-Length': Buffer.byteLength(binaryImage)
            },
            body: binaryImage
        }).then(res => res.json()).then((resp) => {
            var rec_date = getDate(resp);
            var jsonRes;
            if (!rec_date) {
                jsonRes = { dateFound: false, error: "Date not recognized" };
            } else {
                jsonRes = { dateFound: true, date: rec_date };
            }
            context.res = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(jsonRes)
            };
        }).catch(err => {
            context.res = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ error: "API call: " + err.message })
            };
        });

        function getDate(ocrRes) {
            var results = ocrRes.readResult.content;
            if (results && results.length) {
                var dates = [];
                var dateStr = results.match(/(?:(?:0?[1-9]|1[0-9]|2[0-9]|3[0-1])(?:\/|-|\.|\s)(?:0?[1-9]|1[0-2])(?:\/|-|\.|\s)(?:\d{4}|\d{2}))|(?:(?:0?[1-9]|1[0-2])(?:\/|-|\.|\s)(?:0?[1-9]|1[0-9]|2[0-9]|3[0-1])(?:\/|-|\.|\s)(?:\d{4}|\d{2}))|(?:(?:\d{4}|\d{2})(?:\/|-|\.|\s)(?:0?[1-9]|1[0-2])(?:\/|-|\.|\s)(?:0?[1-9]|1[0-9]|2[0-9]|3[0-1]))|(?:(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:\/|-|\.|\s)\d{2}(?:\/|-|\.|\s)(?:\d{4}|\d{2}))|(?:(?:\d{2})(?:\/|-|\.|\s)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:\/|-|\.|\s)(?:\d{4}|\d{2}))|(?:\d{2}(?:\/|-|\.)\d{4})|(?:\d{2}(?:\/|-|\.)\d{2})/gi);
                if (dateStr && dateStr.length) {
                    dates = dates.concat(dateStr);
                }
                var datesObj = [];
                var monthsStr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                var currYear = new Date().getFullYear();
                for (const date of dates) {
                    var parts = date.split(/[\s-\.\/]+/);
                    var day = "", month = "", year = "";
                    if (parts.length === 2) {
                        var part0int = parseInt(parts[0]);
                        var part1int = parseInt(parts[1]);
                        if (!isNaN(part1int) && part1int > currYear - 10 && part1int < currYear + 10) {
                            day = "28";
                            if (monthsStr.indexOf(parts[0]) > -1) {
                                month = monthsStr.indexOf(parts[0]) + 1;
                            } else if (!isNaN(part0int) && part0int > 0 && part0int < 13) {
                                month = parts[0];
                            } else {
                                continue;
                            }
                            year = parts[1];
                        } else if (parts[1].length === 2 && !isNaN(part1int)) {
                            if (part1int > (currYear % 100) - 10 && part1int < (currYear % 100) + 10) {
                                day = "28";
                                if (monthsStr.indexOf(parts[0]) > -1) {
                                    month = monthsStr.indexOf(parts[0]) + 1;
                                } else if (!isNaN(part0int) && part0int > 0 && part0int < 13) {
                                    month = parts[0];
                                } else {
                                    continue;
                                }
                                year = "20" + parts[1];
                            } else if (part1int < 13 && part1int > 0) {
                                if (!isNaN(part0int) && part0int > 0 && part0int < 32) {
                                    day = parts[0];
                                } else {
                                    continue;
                                }
                                month = parts[1];
                                year = currYear.toString();
                            } else {
                                continue;
                            }
                        } else if (monthsStr.indexOf(parts[1]) > -1) {
                            day = parts[0];
                            month = monthsStr.indexOf(parts[0]) + 1;
                            year = currYear.toString();
                        } else {
                            continue;
                        }
                    } else if (parts.length === 3) {
                        var part0int = parseInt(parts[0]);
                        var part1int = parseInt(parts[1]);
                        var part2int = parseInt(parts[2]);
                        if (!isNaN(part0int) && part0int > 0 && part0int < 32) {
                            day = parts[0];
                        } else {
                            continue;
                        }
                        if (monthsStr.indexOf(parts[1]) > -1) {
                            month = monthsStr.indexOf(parts[1]) + 1;
                        } else if (!isNaN(part1int) && part1int > 0 && part1int < 13) {
                            month = parts[1];
                        } else {
                            continue;
                        }
                        if (!isNaN(part2int) && part2int > (currYear - 10) && part2int < (currYear + 10)) {
                            year = parts[2];
                        } else if (!isNaN(part2int) && part2int > ((currYear % 100) - 10) && part2int < ((currYear % 100) + 10)) {
                            year = "20" + parts[2];
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                    datesObj.push(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
                }
                if (datesObj.length > 0) {
                    return new Date(Math.max.apply(null, datesObj));
                }
                return null;
            }
            return null;
        }
    } catch (e) {
        const err = JSON.stringify({ error: 'message: ' + e.message + '. stack: ' + e.stack });
        context.res = {
            body: err,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
        };
    }
}
