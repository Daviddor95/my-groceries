
/**
 * Sends request to the DB driver with the given parameters
 * @param {string} database 
 * @param {string} coll 
 * @param {string} req_type 
 * @param {object} req 
 * @returns Promise<Response>
 */
export default async function db_req(database, coll, req_type, req) {
    return res = await fetch('https://mongodbdriver.azurewebsites.net/api/driver?code=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', {
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
