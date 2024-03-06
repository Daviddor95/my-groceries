import db_req from '../../../requests/db_req';
import * as ImageManipulator from 'expo-image-manipulator';


// resize the image and parse it to base64
const downloadImage = async (url, width, height ) => {
    
    const manipResult = await ImageManipulator.manipulateAsync(
        url, 
        [{ resize: { width: width, height: height } }],
        { format: 'png', base64: true }
        );
    base64Image = manipResult.base64;
    return base64Image;
};

const searchPicByBarcode = async(oneOfResults, width, height) => {
    // resize the image and parse it to base64  
    const imageData = await downloadImage(oneOfResults.link, width, height);
    // update the image string acording to the original image type
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
    try{
        const cx = 'a35009a4b442446a1'; 
        const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        const country =  'countryIL'
        // search engine for images of products in israel searched by barcode
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${searchTerm}&cr=${country}&searchType=image`;
        const response = await fetch(url);
        // convert fata to json
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return await searchPicByBarcode (data.items[0], targetWidth, targetHeight)
        } else {
            return null;
        }

    }catch{
        return null
    }
    
};


//save the image to DB
const saveToMongoDB = async (searchTerm, searchResult) => {
    await db_req("products", "images", "add", {barcode: searchTerm, image: searchResult});
};
    
const ProductImgSearch = async (searchTerm) => {
    const targetWidth = 150;
    const targetHeight = 150;

    // get the image of product
    const searchResult = await imgSearch(searchTerm, targetWidth, targetHeight)
    if (searchResult) {
        // save the image string
        await saveToMongoDB(searchTerm, searchResult);
        // return the image string
        return searchResult
    } else {
        imageOfProduct = await db_req("products", "images", "get", { barcode: "no image found" })
        await saveToMongoDB(searchTerm, imageOfProduct[0].image);
        console.log('No search result found.');
        return imageOfProduct[0].image;
    }
};
export default ProductImgSearch;
