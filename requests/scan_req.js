
/**
 * Sends request to the date scan server with the given image
 * @param {string} img
 * @returns Promise<Response>
 */
export default async function scan_req(img) {
    return ret = await fetch('https://datescan.azurewebsites.net/api/date_scan?code=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ img_b64: img }),
    }).then(result => result.json()).catch(err => console.log("scan_req: " + err));
}
