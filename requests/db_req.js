
export default async function db_req(database, coll, req_type, req) {
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
