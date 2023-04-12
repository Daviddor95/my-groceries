const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, { connectTimeoutMS: 30000 }, { keepAlive: 1});

module.exports = async function (context, req) {
    try {
        const db = client.db(req.body.db);
        const collection = db.collection(req.body.collection);
        const ret = await collection.find(req.body.query).toArray();
        context.res = {
            "headers": {
                "content-type": "application/json"
            },
            "body": ret
        };
    } catch (e) {
        context.res = {
            "status": 500,
            "headers": {
                "content-type": "application/json"
            },
            "body": {
                "message": e.toString()
            }
        }
    }
}
