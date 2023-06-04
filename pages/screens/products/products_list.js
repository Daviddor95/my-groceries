import * as React from 'react'
import { useState } from 'react';
import { Animated,StyleSheet, Text, View, Button, FlatList, SafeAreaView,TouchableOpacity, ScrollView} from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons'; // import icons from expo vector icons library

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
});

//const navigation = useNavigation();
const Refrigerator= () => {
    const [foodProducts, setFoodProducts] = useState([
        { key: '1', name: 'Banana' },
        { key: '2', name: 'Apple' },
        { key: '3', name: 'Orange' },
        { key: '4', name: 'Mango' },
        { key: '5', name: 'Pineapple' },
        { key: '6', name: 'Banana' },
        { key: '7', name: 'Apple' },
        { key: '8', name: 'Orange' },
        { key: '9', name: 'Mango' },
        { key: '10', name: 'Pineapple' },
        { key: '11', name: 'Banana' },
        { key: '12', name: 'Apple' },
        { key: '13', name: 'Orange' },
        { key: '14', name: 'Mango' },
        { key: '15', name: 'Pineapple' },
    ]);
    return (
    <SafeAreaView style={styles.container}>
        <FlatList 
        data={foodProducts}
        renderItem={({ item }) => ProductDetail(0, item)}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContainer}/>
        </SafeAreaView>
      );
    };
    // return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <Text>Refrigerator!</Text>
    // </View>
    // );};

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


const ProductDetail = (amount, item) => {
    
    return (
    <View>
        <Text style={styles.item}>{item.name}</Text>
        <Text>amount is {amount}</Text>
        <Button title="+" onPress={() => Alert.alert('plus')}/>
        <Button title="-" onPress={() => Alert.alert('minus')}/>
        <Button title="X" onPress={() => Alert.alert('X')}/>
    </View>
    // <TouchableOpacity onPress={handlePress}>
    //     <Text style={{ color: 'black', fontSize: 17 }}>Scan</Text>
    // </TouchableOpacity>
    );
};


const FloatingScan = () => {
    const actions = [{text: 'Scan',name: 'scanFunc'}];
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate('Barcode scan');
    };
  
    return (
    <TouchableOpacity style={{
        borderWidth: 1,
        //borderColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        position: 'absolute',
        top: 570,
        right: 10,
        height: 60,
        //backgroundColor: 'blue',
        borderRadius: 100,
        zIndex: 999,
        }}
        onPress={handlePress}>
            <Text style={{ color: 'black', fontSize: 17 }}>Scan</Text>
    </TouchableOpacity>);
};
//const styles = StyleSheet.create({floatingScanButton: {position: 'absolute',bottom: 20,right: 20,},});
  
const Tab = createMaterialTopTabNavigator();
export default function ProductsListScreen() {
    const scanning = {text: "Scan"};
    //icon: require("./images/ic_accessibility_white.png"),
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator>
                <Tab.Screen name="Kitchen Cabinet" component={KitchenCabinet}/>
                <Tab.Screen name="Refrigerator" component={Refrigerator}/>
                <Tab.Screen name="Freezer" component={Freezer}/>
                {/* <FloatingScan actions={scanning} onPressItem={name => {console.log(`selected button: ${name}`);}}/> */}
            </Tab.Navigator>
            <FloatingScan />
        </View>
    );
}

