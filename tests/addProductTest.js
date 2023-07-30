
/**
 * Compares user's products with the added products
 */
async function checkAll() {
    var count = 0;
    var barcodes = [
        "8076809523561",
        "7290002331490",
        "7296073396864",
        "7290000074375",
        "7296073600749",
        "7290000307237",
        "8076809512268",
        "8715700110141",
        "7622300617820",
        "7290000120836",
        "5740900403215",
        "7290006664532",
        "7290004127336",
        "7290000408316"
    ];
    for (const barcode of barcodes) {
        var testProduct = {
                        barcode: barcode,
                        exp_date: new Date(2023, 8, 1),
                        location: "refrigerator",
                        amount: 1,
                        unit: "unit"
                    };
        const updateStr = { $push: { ["product"]: testProduct } };
        const request = { query: { u_id: "2" }, update: updateStr };
        await db_req("users", "regular_users", "update", request);
        var res = await db_req("users", "regular_users", "get", { u_id: "2" });
        if (!res || !res.length) {
            console.log("ERROR");
        } else {
            var products = res[0].product;
            if (contains(testProduct, products)) {
                count++;
            }
            console.log('Product: ' + JSON.stringify(testProduct, null, 2) +
            ' added to the user\'s product list successfully => ' + (contains(testProduct, products)));
        }
    }
    console.log("Summary: passed " + count + " out of " + barcodes.length);
    await db_req("users", "regular_users", "update", { query: { u_id: "2" }, update: { $set: { product: [] } } });
    var res = await db_req("users", "regular_users", "get", { u_id: "2" });
    if (!res || !res.length || res[0].product.length) {
        console.log("ERROR");
    }
}

/**
 * Checks if the given products array contains the given product
 * @param {object} prod 
 * @param {object[]} arr 
 * @returns 
 */
function contains(prod, arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        delete arr[i]._id;
        if (JSON.stringify(arr[i]) === JSON.stringify(prod)) {
            return true;
        }
    }
    return false;
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


