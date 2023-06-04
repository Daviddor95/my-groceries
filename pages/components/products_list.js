import * as React from 'react'
import { useState } from 'react';
import { Animated, Image ,ImageBackground, StyleSheet, Text, View, Button, FlatList, SafeAreaView,TouchableOpacity,Dimensions, ScrollView} from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons'; // import icons from expo vector icons library
import Product from './product';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    const [products, setProducts] = useState([
        { id: '1', name: 'Apple', expiryDate: '21.04.23' },
        { id: '2', name: 'Banana', expiryDate: '21.04.25' },
        { id: '3', name: 'Orange', expiryDate: '21.04.28' },
        { id: '4', name: 'Apple', expiryDate: '21.04.23' },
        { id: '5', name: 'Banana', expiryDate: '21.04.25' },
        { id: '6', name: 'Orange', expiryDate: '21.04.28' },
        { id: '7', name: 'Apple', expiryDate: '21.04.23' },
        { id: '8', name: 'Banana', expiryDate: '21.04.25' },
        { id: '9', name: 'Orange', expiryDate: '21.04.28' },
        { id: '10', name: 'Apple', expiryDate: '21.04.23' },
        { id: '11', name: 'Banana', expiryDate: '21.04.25' },
        { id: '12', name: 'Orange', expiryDate: '21.04.28' },
        { id: '13', name: 'Apple', expiryDate: '21.04.23' },
        { id: '14', name: 'Banana', expiryDate: '21.04.25' },
        { id: '15', name: 'Orange', expiryDate: '21.04.28' },

    ]);
    
    const handleDelete = (productId) => {
        setProducts(products.filter((item) => item.id !== productId));
        //maybe another line needs to be added for updating the database of the user
    };
    
    return (
    <View>
        <FlatList data={products} keyExtractor={(item) => item.id}
        renderItem={
            ({ item }) => (
            <Product name={item.name} expiryDate={item.expiryDate} onDelete={() => handleDelete(item.id)}/>
        )}
        />
    </View>
    );
};
    // const [foodProducts, setFoodProducts] = useState([
    //     { key: '1', name: 'Banana' },
    //     { key: '2', name: 'Apple' },
    //     { key: '3', name: 'Orange' },
    //     { key: '4', name: 'Mango' },
    //     { key: '5', name: 'Pineapple' },
    //     { key: '6', name: 'Banana' },
    //     { key: '7', name: 'Apple' },
    //     { key: '8', name: 'Orange' },
    //     { key: '9', name: 'Mango' },
    //     { key: '10', name: 'Pineapple' },
    //     { key: '11', name: 'Banana' },
    //     { key: '12', name: 'Apple' },
    //     { key: '13', name: 'Orange' },
    //     { key: '14', name: 'Mango' },
    //     { key: '15', name: 'Pineapple' },
    // ]);
    // return (
    // <SafeAreaView style={styles.container}>
    //     <FlatList 
    //     data={foodProducts}
    //     renderItem={({ item }) => ProductDetail(item)}
    //     keyExtractor={(item) => item.key}
    //     contentContainerStyle={styles.listContainer}/>
    //     </SafeAreaView>
    //   );};

    

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



// function ProductDetail (item) {
//     const img = require('./../../assets/tomato.jpg'); // need to be evantually the "item.image"
//         //const [amount, setAmount] = useState(0);
//     return (
//     <View>
//         <Image style={styles.productTinyImage} source={img}/>
//         <Text style={styles.item}>{item.name}</Text>
//         {/*<Text>amount is {amount}</Text>*/}
//         {/* <Button title="+" onPress={()=>setAmount(amount + 1)}/>
//         <Button title="-" onPress={()=>setAmount(amount - 1)}/>
//         <Button title="X" onPress={()=>setAmount(0)}/> */}
//     </View>
//     );
// }


const FloatingScan = () => {
    const actions = [{text: 'Scan',name: 'scanFunc'}];
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate('Barcode scan');
    };
  
    return (
    <TouchableOpacity style={{
        borderWidth: 8,
        //borderColor: 'black',
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        width: 60,
        position: 'absolute',
        top: 620,
        right: 23,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 50,
        //shadowColor: 'black', // IOS
        //shadowOffset: { height: 1, width: 1 }, // IOS
        //shadowOpacity: 1, // IOS
        //shadowRadius: 70, //IOS
        elevation: 10
        //zIndex: 999,
        }}
        onPressIn={handlePress}>
            <ImageBackground 
            source={require('./../../assets/barcode-scan-custom5.png')} 
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
                    // tabBarLabel: 'Freezer',
                    // //tabBarLabelStyle: {width:40, fontSize:12},
                    // tabBarItemStyle: { width: 50 }, 
                    // //tabBarIconStyle: { marginRight: '60%', width: 60 },
                    // //tabBarIndicatorStyle: { width: 50 }
                }}
                name="Freezer" component={Freezer}/>
                {/* <FloatingScan actions={scanning} onPressItem={name => {console.log(`selected button: ${name}`);}}/> */}
            </Tab.Navigator>
            <FloatingScan />
        </View>
    );
}

