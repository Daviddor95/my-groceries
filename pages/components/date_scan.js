import * as React from 'react'
import { Text, View } from 'react-native';
import { useRoute } from "@react-navigation/native"


export default function DateScanScreen() {
    const route = useRoute()

    // const { MongoClient, ServerApiVersion } = require('mongodb');
    // const uri = "mongodb+srv://daviddor:k1jOAxt8wJxIGNYf@mygroceries.csefsud.mongodb.net/?retryWrites=true&w=majority";
    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    // client.connect(async err => {
    //   const collection = client.db("MyGroceries").collection("sample_airbnb");
    //   const findResult = await collection.find({
    //     _id: "10006546",
    //   });
    //   await findResult.forEach(console.dir);
    //   client.close();
    // });
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Date scan, barcode: {route.params?.barcode} kind: {route.params?.kind} </Text>
        </View>
    )
}
