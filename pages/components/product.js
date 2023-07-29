import * as React from 'react'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Image, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker'

const Product = ({id, name, expiryDate, location, amount1, unit, image,
    inProcessOfAddingProduct,setProductDeleted, productDeleted,
     onAdd, onDecline, onDelete, onChangeLocation })=>{
    const [amount, setAmount] = useState(parseInt(amount1));
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
    const [isDeclineButtonDisabled, setIsDeclineButtonDisabled] = useState(false);
    const [isLocDisabled, setIsLocDisabled] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState();
    const img = image
    arrayOfLocs = (["kitchen cabinet", "refrigerator","freezer" ]).filter((item) => item !== location)
    
    const changeArrayOfLocs = (arr) => {
        return arr.map((item) => {
            if (item === "kitchen cabinet") {
                return "cupboard";
            }
            return item;
        });
    };
    arrayOfLocs = changeArrayOfLocs(arrayOfLocs);
    let locationStr = location
    if(location == "kitchen cabinet"){
        locationStr = "cupboard";
    }
    
    
    const handleIncrement = async() => {
        setIsAddButtonDisabled(true);
        setIsDeclineButtonDisabled(true);
        setProductDeleted(true);
        setAmount(amount + 1);
        await onAdd();
        setIsAddButtonDisabled(false);
        setIsDeclineButtonDisabled(false);
        setProductDeleted(false);
    };
  
    const handleDecrement = async() => {
        if (amount > 1) {
            setIsDeclineButtonDisabled(true);
            setIsAddButtonDisabled(true);
            setProductDeleted(true);
            setAmount(amount - 1);
            await onDecline();
            setIsDeclineButtonDisabled(false);
            setIsAddButtonDisabled(false);
            setProductDeleted(false);
        }
    };
  
    const handleDelete = async () => {
        setProductDeleted(true);
        setIsDeclineButtonDisabled(true);
        setIsAddButtonDisabled(true);
        await onDelete();
        setProductDeleted(false);
        setIsDeclineButtonDisabled(false);
        setIsAddButtonDisabled(false);
    };

    const changeLocation = async (newLoc) => {
        setIsLocDisabled(true);
        if(newLoc == "kitchen cabinet"){
            setSelectedLocation("cupboard")
        }else{
            setSelectedLocation(newLoc)
        }
        
        location = newLoc
        await onChangeLocation(newLoc);
        setIsLocDisabled(false);
    };
    return (
    <View style={styles.container}>
        <View style={styles.item}>
            <Image style={styles.productTinyImage} src={img}/>
            <View style={styles.leftContainer}>

                <Text style={styles.name}>{name}</Text>

                <View style={styles.amountContainer}>

                    <TouchableOpacity onPress={handleDecrement} disabled={isDeclineButtonDisabled}>
                        <Ionicons name="remove-circle-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.amount}>{amount}</Text>

                    <TouchableOpacity onPress={handleIncrement} disabled={isAddButtonDisabled}>
                        <Ionicons name="add-circle-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={24} color="black" style={styles.trashCanTinyImage}/>
                    </TouchableOpacity>

                    <Picker selectedValue={selectedLocation} size={14} style={{ height: 50, width: 150 }} 
                    onValueChange={(itemValue, itemIndex) =>{
                        val = itemValue; 
                        if(itemValue == "cupboard")
                        {
                            val = "kitchen cabinet"
                        }; 
                        changeLocation(val)
                    }} 
                    disabled={isLocDisabled}>
                        <Picker.Item label={locationStr} value={location} style={{ fontSize: 14 }} />
                        <Picker.Item 
                        label={arrayOfLocs[0] === "kitchen cabinet" ? "cupboard" : arrayOfLocs[0]} value={arrayOfLocs[0]}
                        style={{ fontSize: 14 }} />
                        <Picker.Item 
                        label={arrayOfLocs[1] === "kitchen cabinet" ? "cupboard" : arrayOfLocs[1]} value={arrayOfLocs[1]} 
                        style={{ fontSize: 14}}/>
                    </Picker>

                </View>

                <Text style={styles.expiryDate}>Expiration Date: {expiryDate}</Text>
          </View>
        </View>
    </View>
    );
};
  
const styles = StyleSheet.create({
    container: {
        padding: 0,
        backgroundColor: '#e3f2e1',
        marginVertical: 5,
        paddingBottom:0,
        borderRadius: 10,
        alignItems: 'center',
    },
    item: {
        padding: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    rightContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flex: 1,
    },
    leftContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 10,
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'right',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amount: {
        paddingHorizontal: 10,
        fontSize: 16,
    },
    expiryDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 3,
        textAlign: 'right',
    },
    productTinyImage: {
        width: 87,
        height: 87,
        resizeMode: 'contain'
    },
    trashCanTinyImage: {
        marginLeft: 10,
    },
});

export default Product;