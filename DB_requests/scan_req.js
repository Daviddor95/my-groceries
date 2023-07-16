
export default async function scan_req(img) {
    return ret = await fetch('https://datescan.azurewebsites.net/api/date_scan?code=6yVtlA7nN71t1o_kH2C3E3CWBCNvfTsdhlfAnBSEsB-kAzFuk8PoNw==', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ img_b64: img }),
    }).then(result => result.json()).catch(err => console.log("scan_req: " + err));
}
