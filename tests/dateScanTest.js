
// var req = require('request').defaults({ encoding: null });
var data;

// req.get('https://www.durable-tech.com/hs-fs/hub/74377/file-15507215-jpg/gallery/album/1899/ink-jet-date-coding_1.jpg?width=330&height=230&name=ink-jet-date-coding_1.jpg', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
//     }
// });

var https = require('https');

https.get('https://cdn.w600.comps.canstockphoto.co.il/%D7%94%D7%A6%D7%A4%D7%9F-%D7%97%D7%A1%D7%95%D7%9D-%D7%90%D7%95%D7%9B%D7%9C-%D7%9B%D7%A0%D7%94-%D7%AA%D7%90%D7%A8%D7%99%D7%9A-%D7%A9%D7%9C-%D7%AA%D7%A4%D7%95%D7%92%D7%94-%D7%A6%D7%99%D7%9C%D7%95%D7%9E%D7%99-%D7%A1%D7%98%D7%95%D7%A7_csp9339703.jpg', (resp) => {
    resp.setEncoding('base64');
    body = "data:" + resp.headers["content-type"] + ";base64,";
    resp.on('data', (data) => { body += data});
    resp.on('end', async () => {
        data = body;
        await scan_req(data);
        //return res.json({result: body, status: 'success'});
    });
}).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
});


const scan_req = async function (img) {
    return ret = await fetch('https://datescan.azurewebsites.net/api/date_scan?code=6yVtlA7nN71t1o_kH2C3E3CWBCNvfTsdhlfAnBSEsB-kAzFuk8PoNw==', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ img_b64: img }),
    }).then(result => result.json()).then(x => console.log(x)).catch(err => console.log("scan_req: " + err));
}

// console.log((await ));


