import * as React from 'react'
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ImageBackground, StyleSheet, Text, View, Button, FlatList, SafeAreaView,TouchableOpacity,Dimensions, ScrollView} from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Product from '../../components/product';
import db_req from '../../../requests/db_req';
import ProductImgSearch from './img_search';


// sorting the array by ascending expiration  dates
function sortByExpirationDates(givenArray){
    for (const pArrElement of givenArray){
        const expiryDateStr = pArrElement.expiryDate
        const dateElements = expiryDateStr.split("/");
        const [dd, mm, yy] = dateElements;
        const edjustedDate = `${yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        pArrElement.expiryDate = edjustedDate
    }
    givenArray.sort((productI, productJ) => new Date(productI.expiryDate) - new Date(productJ.expiryDate));
    for (const pArrElem of givenArray){
        const expiryDateSting = pArrElem.expiryDate
        const dateElem = expiryDateSting.split("-");
        const [y, m, d] = dateElem;
        const dateToDisplay = `${d}/${m}/${y}`
        pArrElem.expiryDate = dateToDisplay;
    }
    return givenArray;
}

// create a unique id
function generateId(barcode) {
    const timeNow = Date.now();
    console.log(`${barcode}${timeNow}` + "   "+ typeof (`${barcode}${timeNow}`))
    return `${barcode}${timeNow}`;

}

// updating the products of every tab
function updateEveryProductsClass(products,setFrPr,setKCPr, setRefPr){
    const arrayKitchenCabinet = []
    const arrayFreezer = []
    const arrayRefrigerator = []
    for (const p of products){
        if (p.location=="kitchen cabinet"){
            arrayKitchenCabinet.push(p);
        }else if(p.location=="refrigerator"){
            arrayRefrigerator.push(p);
        }else if(p.location=="freezer"){
            arrayFreezer.push(p);
        }
    }
    setFrPr(arrayFreezer)
    setKCPr(arrayKitchenCabinet)
    setRefPr(arrayRefrigerator)
}

// changing the location of a product. for example: from Cupboard ro refrigerator
// setFrPr = setting freezer products
// setKCPr = setting kitchen cabinet products
// setRefPr = setting refrigerator products
const handleChangeLocation = async(productId,newLocation, products, setFrPr, setKCPr, setRefPr) => {
    const elementToFind = products.find(item => item.id === productId)
    
    const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
    const ps = usersDb[0].product
    // if element with no barcode, the way to identify it is by its name.
    // Their name doesn't have any digits in it.
    // find the relevant element
    if(!((/^[0-9]+$/).test(elementToFind.barcode))){
        foundElement = ps.findIndex((item) => {return (
            item.name === elementToFind.name &&
            item.exp_date === elementToFind.expiryDate &&
            item.location === elementToFind.location &&
            item.amount === elementToFind.amount &&
            item.unit === elementToFind.unit
            );
        });
    }else{
        foundElement = ps.findIndex((item) => {return (
            item.barcode === elementToFind.barcode &&
            item.exp_date === elementToFind.expiryDate &&
            item.location === elementToFind.location &&
            item.amount === elementToFind.amount &&
            item.unit === elementToFind.unit
            );
        });
    }
    

    (ps[foundElement]).location = newLocation;
    // update the database
    await db_req("users", "regular_users", "update",
    {query:{ u_id: global.user_details.sub }, update:{ $set: { product: ps } }});
    const index = products.findIndex(item => item.id === productId);
    // update the products array element with the new location
    (products[index]).location = newLocation;
    products = sortByExpirationDates(products);
    // updating products in refrigerator, cupboard and freezer
    updateEveryProductsClass(products, setFrPr,setKCPr, setRefPr);
    
};

// deleting a product arrays and from products and database
const handleDelete = async(productId, products, setProducts, setFrPr, setKCPr, setRefPr) => {
    const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
    const ps = usersDb[0].product
    const elementToFind = products.find(item => item.id === productId)
    // setting products to be without the  product 
    tempProducts = products.filter((item) => item.id !== productId)
    setProducts(tempProducts);
    // updating products in refrigerator, cupboard and freezer
    updateEveryProductsClass(tempProducts, setFrPr, setKCPr, setRefPr);

    // if element with no barcode, the way to identify it is by its name.
    // Their name doesn't have any digits in it.
    // find the relevant element
    if(!((/^[0-9]+$/).test(elementToFind.barcode))){
        foundElement = ps.findIndex((item) => {return (
            item.name === elementToFind.name &&
            item.exp_date === elementToFind.expiryDate &&
            item.location === elementToFind.location &&
            item.amount === elementToFind.amount &&
            item.unit === elementToFind.unit
            );
        });
    }else{
        foundElement = ps.findIndex((item) => {return (
            item.barcode === elementToFind.barcode &&
            item.exp_date === elementToFind.expiryDate &&
            item.location === elementToFind.location &&
            item.amount === elementToFind.amount &&
            item.unit === elementToFind.unit
            );
        });
    }
    
    
    const updatedProductArray = ps.filter((_, index) => index !== foundElement);
    // update database
    await db_req("users", "regular_users", "update",{query:{ u_id: global.user_details.sub }, update:{ $set: { product: updatedProductArray } }});
};

// adding 1 to the amount of a product
const handleAdd = async(productId, products, setFrPr, setKCPr, setRefPr) => {
    const elementToFind = products.find(item => item.id === productId)
    
    const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
    const ps = usersDb[0].product
    // if element with no barcode, the way to identify it is by its name.
    // Their name doesn't have any digits in it.
    // find the relevant element
    if(!((/^[0-9]+$/).test(elementToFind.barcode))){
        foundElement = ps.findIndex((item) => {return (
            item.name === elementToFind.name &&
            item.exp_date === elementToFind.expiryDate &&
            item.location === elementToFind.location &&
            item.amount === elementToFind.amount &&
            item.unit === elementToFind.unit
            );
        });
    }else{
        foundElement = ps.findIndex((item) => {return (
            item.barcode === elementToFind.barcode &&
            item.exp_date === elementToFind.expiryDate &&
            item.location === elementToFind.location &&
            item.amount === elementToFind.amount &&
            item.unit === elementToFind.unit
            );
        });
    }
    
    (ps[foundElement]).amount = (parseInt((ps[foundElement]).amount) + 1).toString();
    await db_req("users", "regular_users", "update",{query:{ u_id: global.user_details.sub }, update:{ $set: { product: ps } }});
    const index = products.findIndex(item => item.id === productId);
    (products[index]).amount = (parseInt((products[index]).amount) +1).toString();
    updateEveryProductsClass(products, setFrPr,setKCPr, setRefPr);
    
};

// subtract 1 from the products amount (if amount>1)
const handleSubtract = async(productId, products, setFrPr,setKCPr, setRefPr) => {
    const elementToFind = products.find(item => item.id === productId)
    if(parseInt(elementToFind.amount)>1){
        const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        const ps = usersDb[0].product
        // if element with no barcode, the way to identify it is by its name.
        // Their name doesn't have any digits in it.
        // find the relevant element
        if(!((/^[0-9]+$/).test(elementToFind.barcode))){
            foundElement = ps.findIndex((item) => {return (
                item.name === elementToFind.name &&
                item.exp_date === elementToFind.expiryDate &&
                item.location === elementToFind.location &&
                item.amount === elementToFind.amount &&
                item.unit === elementToFind.unit
                );
            });
        }else{
            foundElement = ps.findIndex((item) => {return (
                item.barcode === elementToFind.barcode &&
                item.exp_date === elementToFind.expiryDate &&
                item.location === elementToFind.location &&
                item.amount === elementToFind.amount &&
                item.unit === elementToFind.unit
                );
            });
        }
        (ps[foundElement]).amount = (parseInt((ps[foundElement]).amount) - 1).toString();
        await db_req("users", "regular_users", "update",{query:{ u_id: global.user_details.sub }, update:{ $set: { product: ps } }});
        const index = products.findIndex(item => item.id === productId);
        (products[index]).amount = (parseInt((products[index]).amount) -1).toString();
        updateEveryProductsClass(products, setFrPr,setKCPr, setRefPr);
    }
};



// Refrigerator
function Refrigerator({refProducts, isAdded, isDeleted, setProductDeleted, 
    products, setProducts, setFrPr, setKCPr, setRefPr}) {
        return (
        <View style={{backgroundColor: '#e3f2e1', flex: 1 }}>
            <FlatList data={refProducts} keyExtractor={(item) => item.id}
            renderItem={
                ({ item }) => (
                <Product id={item.id} name={item.name} expiryDate={item.expiryDate}
                location={item.location} amount1={item.amount} unit={item.unit}
                image={item.image} inProcessOfAddingProduct = {isAdded} 
                setProductDeleted = {setProductDeleted} isDeleted={isDeleted} 
                onAdd={async() => await handleAdd(item.id, products, setFrPr, setKCPr, setRefPr)} 
                onDecline={() => handleSubtract(item.id, products, setFrPr, setKCPr, setRefPr)} 
                onDelete={() => handleDelete(item.id, products, setProducts, setFrPr, setKCPr, setRefPr)}
                onChangeLocation={(newLocation) => 
                    handleChangeLocation(item.id, newLocation, products, setFrPr, setKCPr, setRefPr)}/>
                    )}
                    />
                    </View>
                    );
    };


    
// Freezer
function Freezer({freezerProducts,  isAdded, isDeleted, setProductDeleted,
    products, setProducts, setFrPr,setKCPr, setRefPr}) {
        return (
        <View style={{backgroundColor: '#e3f2e1', flex: 1 }}>
            <FlatList data={freezerProducts} keyExtractor={(item) => item.id}
            renderItem={
                ({ item }) => (
                <Product id={item.id} name={item.name} expiryDate={item.expiryDate} location={item.location} 
                amount1={item.amount} unit={item.unit} image={item.image} inProcessOfAddingProduct = {isAdded} 
                setProductDeleted = {setProductDeleted} isDeleted={isDeleted} 
                onAdd={async() => await handleAdd(item.id, products, setFrPr, setKCPr, setRefPr)} 
                onDecline={() => handleSubtract(item.id, products, setFrPr, setKCPr, setRefPr)} 
                onDelete={() => handleDelete(item.id, products, setProducts, setFrPr, setKCPr, setRefPr)}
                onChangeLocation={(newLocation) => 
                    handleChangeLocation(item.id, newLocation, products, setFrPr, setKCPr, setRefPr)}/>
                )}/>
                </View>
                );
    }

// Kitchen Cabinet
function KitchenCabinet({kCProducts, isAdded, isDeleted, setProductDeleted,
    products, setProducts, setFrPr, setKCPr, setRefPr}) {
        return (
        <View style={{backgroundColor: '#e3f2e1', flex: 1 }}>
            <FlatList data={kCProducts} keyExtractor={(item) => item.id}
            renderItem={
                ({ item }) => (
                <Product id={item.id} name={item.name} expiryDate={item.expiryDate} location={item.location} 
                amount1={item.amount} unit={item.unit} image={item.image} inProcessOfAddingProduct = {isAdded} 
                setProductDeleted = {setProductDeleted} isDeleted={isDeleted} 
                onAdd={async() => await handleAdd(item.id, products, setFrPr, setKCPr, setRefPr)} 
                onDecline={() => handleSubtract(item.id, products, setFrPr, setKCPr, setRefPr)} 
                onDelete={() => handleDelete(item.id, products, setProducts, setFrPr, setKCPr, setRefPr)}
                onChangeLocation={(newLocation) => 
                    handleChangeLocation(item.id, newLocation, products, setFrPr, setKCPr, setRefPr)}/>
                )}/>
                </View>
            );
    }


// The scaning button 
const FloatingScan = ({setProductAdded,isDeleted}) => {
    const navigation = useNavigation();
    const scanning= async() => {
        navigation.navigate('Barcode scan');
    };
    const handlePress = async() => {
        //check if a product is being deleted now, to avoid bugs
        if(!isDeleted){
            await scanning();
            setProductAdded(true);
        }  
    };
  
    return (
    <TouchableOpacity style={{
        borderWidth: 8,
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        width: 60,
        position: 'absolute',
        top: 620,
        right: 23,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 50,
        elevation: 10
        }}
        onPressIn={handlePress} disabled={isDeleted}>
            <ImageBackground 
            source={require('../../../assets/barcode-scan-custom5.png')} 
            style={{top: 5,right: 2, width: '80%', height: '80%',backgroundColor: 'black', alignItems: 'flex-start',}}
            />
            <Text style={{ color: 'black', fontSize: 0 }}>Scan</Text>
    </TouchableOpacity>);
};
  
const Tab = createMaterialTopTabNavigator();
export default function ProductsListScreen() {
    const [products, setProducts] = useState([]);
    const [kCProducts, setKCPr] = useState([]);
    const [freezerProducts, setFrPr] = useState([]);
    const [refProducts, setRefPr] = useState([]);
    const [isAdded, setProductAdded] = useState(false);
    const [isDeleted, setProductDeleted] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        async function create(){
            // creating a list of all products the user has
            if(products.length == 0){
                await productsListCreate();
            }
        }
        create();

        // 
        async function addProd(){
            const usersDb = await getUser();// getting the users database
            const productsOfUser = usersDb[0].product;// geting the product list of the user
            tempProductsArray = products;
            // if not in the middle of deleting and new product was added after scanning
            // checking if the array of seen products on screen(products)
            // is different than the products in the DB
            if((!isDeleted)&& isAdded && (productsOfUser.length != products.length)){
                const usersDb = await getUser();
                const productsOfUser = usersDb[0].product;
                //getting the last product
                const lastProduct = productsOfUser[productsOfUser.length - 1];
                let barcodeOrName = lastProduct.barcode;
                // adressing situation in which the product has no barcode
                if (lastProduct.barcode == ""){
                    barcodeOrName = lastProduct.name;
                    nameOfProduct = lastProduct.name;
                } else {
                    const currentProduct = await db_req("products", "barcodes", "get", { "ItemCode._text": lastProduct.barcode});
                    nameOfProduct = currentProduct[0].ManufacturerItemDescription._text;
                }
                // search and savein DB the image of the product 
                const currentImage = await getImageOfBarcode(barcodeOrName);
                let img = null;
                if(currentImage.length > 0){
                    img = currentImage[0].image;
                } else {
                    productImage = await ProductImgSearch(barcodeOrName)
                    img = productImage
                }
                
                // adding the new added product to a temporary array
                tempProductsArray.push({
                    id: generateId(barcodeOrName),
                    barcode:barcodeOrName,
                    name: nameOfProduct,
                    expiryDate: lastProduct.exp_date,
                    location: lastProduct.location,
                    amount: lastProduct.amount,
                    unit: lastProduct.unit,
                    image: img
                })
                tempProductsArray = sortByExpirationDates(tempProductsArray)
                // updating products lists
                setProducts(tempProductsArray);
                updateEveryProductsClass(tempProductsArray,setFrPr,setKCPr, setRefPr);
                setProductAdded(false)
            }
        }
        addProd(); 
    }, [isFocused]);

    async function getUser(){
        const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        return usersDb;
    }
    // get image for a barcode from DB
    async function getImageOfBarcode(barc){
        const suitableImage = await db_req("products", "images", "get", { barcode: barc })
        return suitableImage;
    }

    // creating the products lists that will represent the elements on the screen
    async function productsListCreate() {
        usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        const productsOfUser = usersDb[0].product
        productsArray = []
        currentId = 1


        const barcodesArray = []
        for (const prod of productsOfUser){
            if (prod.barcode ==""){
                barcodesArray.push(prod.name);
            }else{
                barcodesArray.push(prod.barcode)
            }
            
        }

        const usersProducts = await db_req("products", "barcodes", "get", { "ItemCode._text":  { $in: barcodesArray }  })
        const suitableImages = await db_req("products", "images", "get", { barcode: { $in: barcodesArray } })
        
        for (const pr of productsOfUser){
            const p = usersProducts.find((element)=> (element.ItemCode._text == pr.barcode));
            if(p!= undefined){
                const nameOfProduct = p.ManufacturerItemDescription._text;
                let productImage = suitableImages.find((element)=> (element.barcode == p.ItemCode._text));
                img = null

                if (productImage == undefined){
                    productImage = await getImageOfBarcode(p.ItemCode._text)
                    if(productImage.length==0){
                        productImage = await ProductImgSearch(p.ItemCode._text)
                        img = productImage
                    }else{
                        img = productImage[0].image
                    }
                    
                }else{
                    img = productImage.image
                }
                
                
                productsArray.push({
                    id: currentId,
                    barcode:pr.barcode,
                    name: nameOfProduct,
                    expiryDate: pr.exp_date,
                    location: pr.location,
                    amount: pr.amount,
                    unit: pr.unit,
                    image: img
                });
                currentId = currentId + 1;
            }else if(pr.barcode ==""){
                nameOfProduct = pr.name
                let productImage = suitableImages.find((element)=> (element.barcode == pr.name));
                img = null

                if (productImage == undefined){
                    productImage = await getImageOfBarcode(pr.name)
                    if(productImage.length==0){
                        productImage = await ProductImgSearch(pr.name)
                        img = productImage
                    }else{
                        img = productImage[0].image
                    }
                }else{
                    img = productImage.image
                }

                productsArray.push({
                    id: currentId,
                    barcode:pr.name,
                    name: nameOfProduct,
                    expiryDate: pr.exp_date,
                    location: pr.location,
                    amount: pr.amount,
                    unit: pr.unit,
                    image: img
                });
                currentId = currentId + 1;

            }
        }
        productsArray = sortByExpirationDates(productsArray)
        setProducts(productsArray);
        updateEveryProductsClass(productsArray,setFrPr,setKCPr, setRefPr);
    }

    return (
        <View style={{ flex: 1,width: Dimensions.get('window').width }}>
            <Tab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: '#fff' },
                    tabBarStyle: { backgroundColor: '#58ab4f', borderTopWidth: 0 }, tabBarActiveTintColor: '#fff',
                    tabBarInactiveTintColor: '#e6e6e6', }}>
                <Tab.Screen name="Cupboard" >
                {() => <KitchenCabinet kCProducts={kCProducts} isAdded = {isAdded} 
                isDeleted = {isDeleted} setProductDeleted={setProductDeleted}
                products={products} setProducts={setProducts} 
                setFrPr={setFrPr} setKCPr={setKCPr}
                setRefPr={setRefPr}/>}
                </Tab.Screen>

                <Tab.Screen name="Refrigerator" >
                {() => <Refrigerator refProducts={refProducts}  isAdded = {isAdded} 
                isDeleted = {isDeleted} setProductDeleted={setProductDeleted}
                products={products} setProducts={setProducts} 
                setFrPr={setFrPr} setKCPr={setKCPr}
                setRefPr={setRefPr}/>}
                </Tab.Screen>

                <Tab.Screen name="Freezer" >
                {() => <Freezer freezerProducts={freezerProducts}  isAdded = {isAdded} 
                isDeleted = {isDeleted} setProductDeleted={setProductDeleted}
                products={products} setProducts={setProducts} 
                setFrPr={setFrPr} setKCPr={setKCPr}
                setRefPr={setRefPr}/>}
                </Tab.Screen>

            </Tab.Navigator>

            <FloatingScan products={products} 
            setProducts={setProducts} isAdded = {isAdded} 
            setProductAdded = {setProductAdded} isDeleted = {isDeleted} 
            setProductDeleted={setProductDeleted}/>
        </View>
    );
}

