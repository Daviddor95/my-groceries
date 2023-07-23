import * as React from 'react'
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Animated, Image ,ImageBackground, StyleSheet, Text, View, Button, FlatList, SafeAreaView,TouchableOpacity,Dimensions, ScrollView} from 'react-native';
import { useNavigation,useRoute, NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons'; // import icons from expo vector icons library
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

function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
  
    for (let i = 0; i < arr1.length; i++) {
      // Implement your own comparison logic here
      if (arr1[i] !== arr2[i]) return false;
    }
  
    return true;
  }
//const navigation = useNavigation();
function Refrigerator({products, setProducts}) {
    const handleDelete = (productId) => {
        setProducts(products.filter((item) => item.id !== productId));
    };
    
    return (
    <View>
        <FlatList data={products} keyExtractor={(item) => item.id}
        renderItem={
            ({ item }) => (
            <Product name={item.name} expiryDate={item.expiryDate} location={null} amount1={null} unit={null}
            image={item.image} onAdd={null} onDecline={null} changeLoc={null} changeDate={null} changeUnit={null}
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
    const route = useRoute();
    const scanning= async() => {
        navigation.navigate('Barcode scan', { u_id: route.params?.u_id });
    };
    const handlePress = async() => {
        await scanning();
        setProductAdded(true)
        // const usersDb = await db_req("users", "regular_users", "get", {u_id:"1" });
        // //const productsOfUser = usersDb.product
        // const allProd = usersDb[0].product
        // const addedProduct = allProd[allProd.length-1]
        // console.log(addedProduct)
        // console.log(addedProduct.barcode)
        // productImage = await db_req("products", "images", "get", { barcode: addedProduct.barcode })
        // console.log("imglen"+productImage.length)
        // const pr = await db_req("products", "barcodes", "get", { "ItemCode._text": addedProduct.barcode})
        // console.log(pr)
        // const nameOfProduct = pr[0].ManufacturerItemDescription._text
        // console.log(nameOfProduct)
        // img = null
        // if (productImage == undefined){
        //     console.log("fgfdhgf")
        //     productImage = await ProductImgSearch(addedProduct.barcode)
        //     console.log("hfgjhfhhhhhhhh"+productImage.length)
        //     img = productImage
        // }else{
        //     img = productImage.image
        // }
        // console.log("here")

        // setProducts((prevProducts) => [prevProducts,
        //     {
        //         id: products.length+1,
        //         name: nameOfProduct,
        //         expiryDate: addedProduct.exp_date,
        //         location: addedProduct.location,
        //         amount: addedProduct.amount,
        //         unit: addedProduct.unit,
        //         image: img
        //     }
        // ]);
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
                const usersDb = await getUser("1");
                //const productsOfUser = usersDb.product
                const productsOfUser = usersDb[0].product;
                const lastProduct = productsOfUser[productsOfUser.length - 1];
                const currentProduct = await db_req("products", "barcodes", "get", { "ItemCode._text": lastProduct.barcode});
                //console.log(currentProduct)
                //console.log(currentProduct[0][0])
                const nameOfProduct = currentProduct[0].ManufacturerItemDescription._text;
                const currentImage = await getImageOfBarcode(lastProduct.barcode);
                // console.log(currentImage)
                // console.log(currentImage[0])
                let img = null;
                if(currentImage.length>0){
                    img = currentImage[0].image;
                } else {
                    productImage = await ProductImgSearch(currentProduct[0].ItemCode._text)
                    img = productImage
                }
                

                products.push({
                    id: products.length+1,
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
    async function getUser(uId){
        const usersDb = await db_req("users", "regular_users", "get", {u_id:uId });
        return usersDb;
    }
    async function getImageOfBarcode(barc){
        const suitableImage = await db_req("products", "images", "get", { barcode: barc })
        return suitableImage;
    }

    async function productsListCreate() {
        usersDb = await db_req("users", "regular_users", "get", {u_id:"1" });
        const productsOfUser = usersDb[0].product
        const productsArray = []
        currentId = 1

        const barcodesArray = []
        for (const prod of productsOfUser){
            barcodesArray.push(prod.barcode)
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
                {() => <Refrigerator products={products} setProducts={setProducts} />}
                </Tab.Screen>
                <Tab.Screen options={{}} name="Freezer" component={Freezer}/>
                {/* <FloatingScan actions={scanning} onPressItem={name => {console.log(`selected button: ${name}`);}}/> */}
            </Tab.Navigator>
            <FloatingScan products={products} setProducts={setProducts} productAdded = {productAdded} setProductAdded = {setProductAdded}/>
        </View>
    );
}

