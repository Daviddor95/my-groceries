import * as React from 'react'
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ImageBackground, StyleSheet, Text, View, Button, FlatList, SafeAreaView,TouchableOpacity,Dimensions, ScrollView} from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Product from '../../components/product';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import db_req from '../../../requests/db_req';
import scan_req from '../../../requests/scan_req';
import ProductImgSearch from './img_search';

const styles = StyleSheet.create({
    container: {
        flex: 1,
      //backgroundColor: '#fff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 20,
      marginLeft: 20,
      marginBottom: 10,
    },
    item: {
      fontSize: 18,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      marginHorizontal: 20,
      marginBottom: 10,
    },
    listContainer: {
      paddingBottom: 20,
    },
    // productTinyImage: {
    //     width: 75,
    //     height: 75,
    // },
});


//const navigation = useNavigation();
function Refrigerator({products, setProducts, productAdded}) {
    const handleDelete = async(productId) => {
        const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        const ps = usersDb[0].product
        const elementToFind = products.find(item => item.id === productId)
        setProducts(products.filter((item) => item.id !== productId));

        const foundElement = ps.findIndex((item) => {return (
            item.barcode === elementToFind.barcode &&
            item.exp_date === elementToFind.expiryDate &&
            item.location === elementToFind.location &&
            item.amount === elementToFind.amount &&
            item.unit === elementToFind.unit
            );
        });
        const updatedProductArray = ps.filter((_, index) => index !== foundElement);
        await db_req("users", "regular_users", "update",{query:{ u_id: global.user_details.sub }, update:{ $set: { product: updatedProductArray } }});
    };

    const handleAdd = async(productId) => {
        const elementToFind = products.find(item => item.id === productId)
        
        const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        const ps = usersDb[0].product
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
        
    };

    const handleDecline = async(productId) => {
        const elementToFind = products.find(item => item.id === productId)
        if(parseInt(elementToFind.amount)>1){
            const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
            const ps = usersDb[0].product
            if(!((/^[0-9]+$/).test(elementToFind.barcode))){
                console.log("here")
                foundElement = ps.findIndex((item) => {return (
                    item.name === elementToFind.name &&
                    item.exp_date === elementToFind.expiryDate &&
                    item.location === elementToFind.location &&
                    item.amount === elementToFind.amount &&
                    item.unit === elementToFind.unit
                    );
                });
            }else{
                console.log("there")
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
        }
        
    };
    
    return (
    <View>
        <FlatList data={products} keyExtractor={(item) => item.id}
        renderItem={
            ({ item }) => (
            <Product id={item.id} name={item.name} expiryDate={item.expiryDate} location={item.location} amount1={item.amount} unit={item.unit}
            image={item.image} inProcessOfAddingProduct = {productAdded} onAdd={async() => await handleAdd(item.id)} onDecline={() => handleDecline(item.id)} changeLoc={null} changeDate={null} changeUnit={null}
            onDelete={() => handleDelete(item.id)}/>
        )}
        />
    </View>
    );
};


    

function Freezer() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Freezer!</Text>
    </View>
    );
}

function KitchenCabinet() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Kitchen Cabinet!</Text>
    </View>
    );
}



const FloatingScan = ({products, setProducts, productAdded, setProductAdded}) => {
    const actions = [{text: 'Scan',name: 'scanFunc'}];
    const navigation = useNavigation();
    const scanning= async() => {
        navigation.navigate('Barcode scan');
    };
    const handlePress = async() => {
        await scanning();
        const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        const productsOfUser = usersDb[0].product;
        const lastProduct = productsOfUser[productsOfUser.length - 1];
        const BeforeLastProduct = productsOfUser[productsOfUser.length - 2];
        if(lastProduct.name != BeforeLastProduct.name){
            setProductAdded(true)
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
        onPressIn={handlePress}>
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
    const [productAdded, setProductAdded] = useState(false);
    const [productDeleted, setProductDeleted] = useState(false);
    const isFocused = useIsFocused();
    
    const scanning = {text: "Scan"};
    //icon: require("./images/ic_accessibility_white.png"),
    useEffect(() => {
        async function create(){
            if(products.length == 0){
                await productsListCreate();
            }
        }
        create();

        async function addProd(){
            if(productAdded){
                const usersDb = await getUser();
                //const productsOfUser = usersDb.product
                const productsOfUser = usersDb[0].product;
                const lastProduct = productsOfUser[productsOfUser.length - 1];
                let barcodeOrName = lastProduct.barcode;
                if(lastProduct.barcode==""){
                    barcodeOrName = lastProduct.name;
                    nameOfProduct = lastProduct.name;
                }else{
                    const currentProduct = await db_req("products", "barcodes", "get", { "ItemCode._text": lastProduct.barcode});
                    nameOfProduct = currentProduct[0].ManufacturerItemDescription._text;
                }
                const currentImage = await getImageOfBarcode(barcodeOrName);
                // console.log(currentImage)
                // console.log(currentImage[0])
                let img = null;
                if(currentImage.length>0){
                    img = currentImage[0].image;
                } else {
                    //productImage = await ProductImgSearch(currentProduct[0].ItemCode._text)
                    productImage = await ProductImgSearch(barcodeOrName)
                    img = productImage
                }
                
                

                products.push({
                    id: products.length+1,
                    barcode:barcodeOrName,
                    name: nameOfProduct,
                    expiryDate: lastProduct.exp_date,
                    location: lastProduct.location,
                    amount: lastProduct.amount,
                    unit: lastProduct.unit,
                    image: img
                })
                setProductAdded(false)
            }
        }
        addProd();
        
    }, [isFocused]);
    async function getUser(){
        const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        return usersDb;
    }
    async function getImageOfBarcode(barc){
        const suitableImage = await db_req("products", "images", "get", { barcode: barc })
        return suitableImage;
    }

    async function productsListCreate() {
        usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        const productsOfUser = usersDb[0].product
        const productsArray = []
        currentId = 1

        console.log(productsOfUser)
        const barcodesArray = []
        for (const prod of productsOfUser){
            if (prod.barcode ==""){
                barcodesArray.push(prod.name);
                console.log(prod.name);
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
        setProducts(productsArray);
    }
    
    return (
        <View style={{ flex: 1,width: Dimensions.get('window').width }}>
            <Tab.Navigator>
                <Tab.Screen name="cupboard" component={KitchenCabinet}/>
                <Tab.Screen name="Refrigerator" >
                {() => <Refrigerator products={products} setProducts={setProducts} productAdded = {productAdded} setProductAdded = {setProductAdded}/>}
                </Tab.Screen>
                <Tab.Screen options={{}} name="Freezer" component={Freezer}/>
                {/* <FloatingScan actions={scanning} onPressItem={name => {console.log(`selected button: ${name}`);}}/> */}
            </Tab.Navigator>
            <FloatingScan products={products} setProducts={setProducts} productAdded = {productAdded} setProductAdded = {setProductAdded}/>
        </View>
    );
}

