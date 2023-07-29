const fs = require('fs');
const { globSync } = require('glob');
var count = 0;

/**
 * Compares all recognized expiration dates with the corresponding real expiration dates
 * @param {string} directory 
 */
async function checkAll(directory) {
    var images = globSync(directory + '/*.jpg', { withFileTypes: false });
    for (const img of images) {
        await check('.\\' + img);
    }
    console.log("Summary: passed " + count + " out of " + images.length);
    await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Compares a recognized expiration date with the corresponding real expiration date
 * @param {string} name 
 */
async function check(name) {
    const file64 = fs.readFileSync(name, {encoding: 'base64'});
    var res = await scan_req(file64);
    if (!res) {
        console.log("ERROR");
    } else if (res.dateFound) {
        var resDate = new Date(res.date).toLocaleDateString("en-GB");
        var fileName = name.substring(name.lastIndexOf('\\') + 1);
        var date;
        switch (fileName) {
            case '1.jpg':
                date = new Date(2023, 6, 20).toLocaleDateString("en-GB");
                break;
            case '2.jpg':
                date = new Date(2023, 8, 14).toLocaleDateString("en-GB");
                break;
            case '3.jpg':
                date = new Date(2023, 4, 1).toLocaleDateString("en-GB");
                break;
            case '4.jpg':
                date = new Date(2024, 0, 26).toLocaleDateString("en-GB");
                break;
            case '5.jpg':
                date = new Date(2026, 1, 16).toLocaleDateString("en-GB");
                break;
            case '6.jpg':
                date = new Date(2023, 4, 18).toLocaleDateString("en-GB");
                break;
            case '7.jpg':
                date = new Date(2025, 9, 26).toLocaleDateString("en-GB");
                break;
            case '8.jpg':
                date = new Date(2023, 6, 26).toLocaleDateString("en-GB");
                break;
            case '9.jpg':
                date = new Date(2025, 5, 9).toLocaleDateString("en-GB");
                break;
            case '10.jpg':
                date = new Date(2023, 11, 3).toLocaleDateString("en-GB");
                break;
            case '11.jpg':
                date = new Date(2024, 1, 4).toLocaleDateString("en-GB");
                break;
            case '12.jpg':
                date = new Date(2024, 5, 17).toLocaleDateString("en-GB");
                break;
            case '13.jpg':
                date = new Date(2024, 10, 14).toLocaleDateString("en-GB");
                break;
            default:
                break;
        }
        if (resDate == date) {
            count++;
        }
        console.log('Recognized: ' + resDate + ', Expected: ' + date + ' => ' + (resDate == date));
    }
}

/**
 * Sends a request to the server
 * @param {string} img 
 * @returns 
 */
const scan_req = async function (img) {
    return ret = await fetch('https://datescan.azurewebsites.net/api/date_scan?code=6yVtlA7nN71t1o_kH2C3E3CWBCNvfTsdhlfAnBSEsB-kAzFuk8PoNw==', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ img_b64: img }),
    }).then(result => result.json()).catch(err => console.log("scan_req: " + err));
}

checkAll('./assets/dateScanAssets');
