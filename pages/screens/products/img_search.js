import React, { useState } from 'react';
import { View, TextInput, Button, Text, Linking, Image} from 'react-native';
import db_req from '../../../requests/db_req';
import * as ImageManipulator from 'expo-image-manipulator';



const downloadImage = async (url) => {
    
    const manipResult = await ImageManipulator.manipulateAsync(
        url, 
        [{ resize: { width: 150, height: 150 } }],
        { format: 'png', base64: true }
        );
    base64Image = manipResult.base64;
    return base64Image;
};
// const recursiveImageSearching = async(arrayOfPics, picIndex) => {
//     if (picIndex < arrayOfPics.length){
//         const img = arrayOfPics[picIndex];
//         await searchPicByBarcode(img).then((returnValue) => {
//             console.log(typeof returnValue)
//             return returnValue
//         }).catch((error) => {
//             recursiveImageSearching(arrayOfPics, picIndex + 1);
//         });
//     }else{
//         return null;
//     } 
// };

const searchPicByBarcode = async(oneOfResults) => {
    //const firstResult = data.items[0];

    // console.log(firstResult.link)
    const imageData = await downloadImage(oneOfResults.link);
    if ((oneOfResults.link).includes("jpeg") && imageData!=null){
        return "data:image/jpeg;base64," + imageData;
    } else if((oneOfResults.link).includes("png")&& imageData!=null){
        return "data:image/png;base64," + imageData;
    } else if((oneOfResults.link).includes("jpg")&& imageData!=null){
        return "data:image/jpg;base64," + imageData;
    } else {
        return "data:image/png;base64," + imageData;
    }
}
const imgSearch = async (searchTerm, targetWidth, targetHeight) => {
    const cx = 'a35009a4b442446a1'; 
    const apiKey = 'AIzaSyCbip8NqTJgeyLnCh6iyAmaL4s08P76to0';
    const country =  'countryIL'
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${searchTerm}&cr=${country}&searchType=image`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
        //return await recursiveImageSearching(data.items, 0);
        return await searchPicByBarcode (data.items[0])
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
