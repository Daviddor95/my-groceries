
/**
 * Compares product's names with the corresponding real expiration dates
 */
async function checkAll() {
    var count = 0;
    var barcodeDict = {
        "8076809523561": "רוטב עגבניות",
        "7290002331490": "מים נביעות",
        "7296073396864": "סלט חזרת",
        "7290000074375": "קרקר זהב אסם",
        "7296073600749": "חרוזי זיתים ירוק",
        "7290000307237": "גרעיני תירס",
        "8076809512268": "פסטה גירנדולה",
        "8715700110141": "ממרח היינץ",
        "7622300617820": "שוקולד מילקה",
        "7290000120836": "מיונז אמיתי הלמנ",
        "5740900403215": "ממרח לורפק",
        "7290006664532": "דנונה תות 3%",
        "7290004127336": "קוטג' תנובה 9%",
        "7290000408316": "יוגורט ביו 3%"
    }
    for (const [barcode, product] of Object.entries(barcodeDict)) {
        var res = await db_req("products", "barcodes", "get", { ItemCode : { _text: barcode } });
        if (!res || !res.length) {
            console.log("ERROR");
        } else {
            var returnedName = res[0].ManufacturerItemDescription._text;
            if (returnedName == barcodeDict[barcode]) {
                count++;
            }
            console.log('Got: ' + returnedName + ', Expected: ' + barcodeDict[barcode] + ' => ' +
                (returnedName == barcodeDict[barcode]));
        }
    }
    console.log("Summary: passed " + count + " out of " + Object.entries(barcodeDict).length);
    await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Sends a request to the DB driver server
 * @param {string} database 
 * @param {string} coll 
 * @param {string} req_type 
 * @param {object} req 
 * @returns 
 */
async function db_req(database, coll, req_type, req) {
    return res = await fetch('https://mongodbdriver.azurewebsites.net/api/driver?code=kTjkzOm7Ckr4SvjHuD_UQy1I1k-VgtYFSsx5ZH0QYNnqAzFu4nQJow==', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ db: database,
            collection: coll,
            type: req_type,
            content: req }),
    }).then(result => result.json());
}

checkAll();
