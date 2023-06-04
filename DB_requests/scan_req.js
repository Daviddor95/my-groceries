
export default async function scan_req(img) {
    return await fetch('https://datescan.azurewebsites.net/api/date_scan?code=ZPwu7op5mIsd4Ekir0xxWMrRtglqS5CMg1OjockbMHyTAzFudhHwUg==', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ img_b64: img }),
    }).then(result => result.json());
}
