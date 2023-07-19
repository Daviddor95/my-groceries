import React, { useState } from 'react';
import { View, TextInput, Button, Text, Linking } from 'react-native';
//import fetch from 'node-fetch';
//import RNFetchBlob from 'rn-fetch-blob';
//import RNFetchBlob from 'react-native-fetch-blob';
// import RNFS from 'react-native-fs';
import db_req from '../../../DB_requests/request';

// function arrayBufferToBase64(arrayBuffer) {
//     const uint8Array = new Uint8Array(arrayBuffer);
//     let base64String = '';
//     const base64Chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
//     for (let i = 0; i < uint8Array.length; i += 3) {
//         const triplet = (uint8Array[i] << 16) + (uint8Array[i + 1] << 8) + uint8Array[i + 2];
//         base64String +=base64Chars[(triplet >> 18) & 63] +base64Chars[(triplet >> 12) & 63] +
//         base64Chars[(triplet >> 6) & 63] +
//         base64Chars[triplet & 63];
//     }
  
//     // Handle the padding at the end of the Base64 string
//     const paddingLength = 3 - (uint8Array.length % 3);
//     base64String = base64String.slice(0, base64String.length - paddingLength) + '='.repeat(paddingLength);
//     return base64String;
// }
const downloadImage = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    // Convert the ArrayBuffer to a Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    // Convert the Uint8Array to a base64 string
    let base64Image = '';
    const base64Characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    for (let i = 0; i < uint8Array.length; i += 3) {
        const chunk = (uint8Array[i] << 16) | (uint8Array[i + 1] << 8) | uint8Array[i + 2];
        base64Image +=
        base64Characters[(chunk >> 18) & 63] +
        base64Characters[(chunk >> 12) & 63] +
        base64Characters[(chunk >> 6) & 63] +
        base64Characters[chunk & 63];
    }

    // Handle padding
    const padding = uint8Array.length % 3;
    if (padding === 1) {
      base64Image = base64Image.slice(0, -2) + '==';
    } else if (padding === 2) {
      base64Image = base64Image.slice(0, -1) + '=';
    }

    // Return the base64 encoded image data
    return base64Image;
    // const response = await fetch(url);
    // const data = await response.arrayBuffer();
    // const base64Data = arrayBufferToBase64(data)
    // return data;
};

const imgSearch = async (searchTerm) => {
    const cx = 'a35009a4b442446a1'; 
    const apiKey = 'AIzaSyCbip8NqTJgeyLnCh6iyAmaL4s08P76to0';
    const country =  'countryIL'
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${searchTerm}&cr=${country}&searchType=image`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
        const firstResult = data.items[0];
        console.log(firstResult.link)
        const imageData = await downloadImage(firstResult.link);
        if ((firstResult.link).includes("jpeg")){
            return "data:image/jpeg;base64," + imageData;
        } else if((firstResult.link).includes("png")){
            return "data:image/png;base64," + imageData;
        } else if((firstResult.link).includes("jpg")){
            return "data:image/jpg;base64," + imageData;
        }
        return imageData, null; // Include the image binary data in the result
    } else {
        return null;
    }
};
// const handleOpenLink = () => {
//     if (searchResult && searchResult.link) {Linking.openURL(searchResult.link);}
// };


const saveToMongoDB = async (searchResult, searchTerm) => {
    // Implement your MongoDB save logic here
    // Use your MongoDB connection and insert the searchResult with imageData into your desired collection
    // You'll need to use the appropriate MongoDB driver for your Node.js environment
    // Here's an example using the "mongodb" driver:
  
    // const { MongoClient } = require('mongodb');
    // const client = new MongoClient('mongodb://localhost:27017');
    // await client.connect();
    // const db = client.db('yourDatabaseName');
    // const collection = db.collection('yourCollectionName');
    // await collection.insertOne(searchResult);
    await db_req("products", "images", "add", { barcode: searchTerm, image: searchResult});
    // await client.close();
  
    // Note: Make sure to properly handle errors and connection management in your actual implementation.
};
    
const ProductImgSearch = async (searchTerm) => {
    console.log("mi shenichnas hadar")
    const searchResult = await imgSearch(searchTerm);
    console.log("marbin besimha")
    //console.log('Search Result:', searchResult);
    if (searchResult) {
        //console.log('Search Result:', searchResult);
        // handleOpenLink(searchResult);
        await saveToMongoDB(searchResult, searchTerm);
        //console.log('Image data saved to MongoDB.');
    } else {
        console.log('No search result found.');
    }
};
export default ProductImgSearch;
