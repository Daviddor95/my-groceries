import React, { useState } from 'react';
import { View, TextInput, Button, Text, Linking, Image} from 'react-native';
import db_req from '../../../DB_requests/request';
import * as ImageManipulator from 'expo-image-manipulator';



const downloadImage = async (url) => {
    
    const manipResult = await ImageManipulator.manipulateAsync(
        url, 
        [{ resize: { width: 150, height: 150 } }],
        { format: 'png', base64: true }
        );
    base64Image = manipResult.base64;
    // const response = await fetch(url);
    // const arrayBuffer = await response.arrayBuffer();
    // // Convert the ArrayBuffer to a Uint8Array
    // const uint8Array = new Uint8Array(arrayBuffer);
    // // Convert the Uint8Array to a base64 string
    // let base64Image = '';
    // const base64Characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    // for (let i = 0; i < uint8Array.length; i += 3) {
    //     const chunk = (uint8Array[i] << 16) | (uint8Array[i + 1] << 8) | uint8Array[i + 2];
    //     base64Image +=
    //     base64Characters[(chunk >> 18) & 63] +
    //     base64Characters[(chunk >> 12) & 63] +
    //     base64Characters[(chunk >> 6) & 63] +
    //     base64Characters[chunk & 63];
    // }

    // // Handle padding
    // const padding = uint8Array.length % 3;
    // if (padding === 1) {
    //   base64Image = base64Image.slice(0, -2) + '==';
    // } else if (padding === 2) {
    //   base64Image = base64Image.slice(0, -1) + '=';
    // }

    // Return the base64 encoded image data
    return base64Image;
};

const imgSearch = async (searchTerm, targetWidth, targetHeight) => {
    const cx = 'a35009a4b442446a1'; 
    const apiKey = 'AIzaSyCbip8NqTJgeyLnCh6iyAmaL4s08P76to0';
    const country =  'countryIL'
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${searchTerm}&cr=${country}&searchType=image`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
        const firstResult = data.items[0];
        // console.log(firstResult.link)
        const imageData = await downloadImage(firstResult.link);
        if ((firstResult.link).includes("jpeg") && imageData!=null){
            return "data:image/jpeg;base64," + imageData;
        } else if((firstResult.link).includes("png")&& imageData!=null){
            return "data:image/png;base64," + imageData;
        } else if((firstResult.link).includes("jpg")&& imageData!=null){
            return "data:image/jpg;base64," + imageData;
        } else {
            return "data:image/png;base64," + imageData;
        }
    } else {
        return null;
    }
};



const saveToMongoDB = async (searchTerm, searchResult) => {
    // console.log(typeof(newImages))
    // console.log("okay")
    // console.log(newImages.length)
    // await db_req("products", "images", "addMore", newImages);
    // console.log("ghgfj")
    await db_req("products", "images", "add", {barcode: searchTerm, image: searchResult});
};
    
const ProductImgSearch = async (searchTerm) => {
    const targetWidth = 87;
    const targetHeight = 87;

    // var newImages = "["
    // var newImages = []
    // for (const searchTerm of searchTerms){
    //     let searchResult = await imgSearch(searchTerm, targetWidth, targetHeight);
    //     console.log("nes" +searchTerm+ " ")
    //     // newImages = newImages +"{barcode:"+ searchTerm+", image:" + searchResult+"},"
    //     newImages.push({barcode: searchTerm, image: searchResult})
    // }
    // newImages.slice(0, -1);
    // newImages = newImages +"]"
    const searchResult = await imgSearch(searchTerm, targetWidth, targetHeight)

    if (searchResult) {
        //const newImagesJSON = JSON.stringify(newImages);
        await saveToMongoDB(searchTerm, searchResult);
        return searchResult
    } else {
        console.log('No search result found.');
    }
};
export default ProductImgSearch;
