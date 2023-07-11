const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, { connectTimeoutMS: 30000 }, { keepAlive: 1});

module.exports = async function (context, req) {
    try {
        const db = client.db(req.body.db);
        const collection = db.collection(req.body.collection);
        var ret;
        if (req.body.type === 'get') {
            ret = await collection.find(req.body.content).toArray();
        } else if (req.body.type === 'add') {
            ret = await collection.insertOne(req.body.content);
        } else if (req.body.type === 'update') {
            ret = await collection.updateOne(req.body.content.query, req.body.content.update);
        }
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
