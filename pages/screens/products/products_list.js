import * as React from 'react'
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Animated, Image ,ImageBackground, StyleSheet, Text, View, Button, FlatList, SafeAreaView,TouchableOpacity,Dimensions, ScrollView} from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons'; // import icons from expo vector icons library
import Product from '../../components/product';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import db_req from '../../../DB_requests/request';
import scan_req from '../../../DB_requests/scan_req';
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
function Refrigerator() {
    const [products, setProducts] = useState([]);
    const [databaseUpdated, setDatabaseUpdated] = useState(false);
    const isFocused = useIsFocused();
    async function productsListCreate() {
        const usersDb = await db_req("users", "regular_users", "get", {u_id:"1" });
        //const productsOfUser = usersDb.product
        const productsOfUser = usersDb[0].product
        const productsArray = []
        currentId = 1
        for (const p of productsOfUser){
            currentProduct = await db_req("products", "barcodes", "get", { ItemCode: { _text: p.barcode } });
            productImage = await db_req("products", "images", "get", { barcode: p.barcode });
            if (currentProduct.length > 0){
                nameOfProduct = currentProduct[0].ManufacturerItemDescription._text
                if (productImage.length > 0){
                    img = productImage[0].image
                } else {
                    await ProductImgSearch(p.barcode);
                    productImage = await db_req("products", "images", "get", { barcode: p.barcode });
                    img = productImage[0].image
                }
                productsArray.push({
                    id: currentId,
                    name: nameOfProduct,
                    expiryDate: p.exp_date,
                    location: p.location,
                    amount: p.amount,
                    unit: p.unit,
                    image: img
                });
                
            }
            currentId = currentId + 1;
            
        }
        setProducts(productsArray);
    }
    useEffect(() => {
        productsListCreate();
    }, [isFocused]);
    
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



const FloatingScan = () => {
    const actions = [{text: 'Scan',name: 'scanFunc'}];
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate('Barcode scan');
        
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
    const scanning = {text: "Scan"};
    //icon: require("./images/ic_accessibility_white.png"),
    return (
        <View style={{ flex: 1,width: Dimensions.get('window').width }}>
            <Tab.Navigator>
                <Tab.Screen name="cupboard" component={KitchenCabinet}/>
                <Tab.Screen name="Refrigerator" component={Refrigerator}/>
                <Tab.Screen 
                options={{
                }}
                name="Freezer" component={Freezer}/>
                {/* <FloatingScan actions={scanning} onPressItem={name => {console.log(`selected button: ${name}`);}}/> */}
            </Tab.Navigator>
            <FloatingScan />
        </View>
    );
}

