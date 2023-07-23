import * as React from 'react'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Image ,StyleSheet, Text, View,TouchableOpacity} from 'react-native';

const Product = ({id, name, expiryDate, location, amount1, unit, image, onAdd, onDecline, changeLoc, changeDate, changeUnit, onDelete })=>{
    const [amount, setAmount] = useState(parseInt(amount1));
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
    const [isDeclineButtonDisabled, setIsDeclineButtonDisabled] = useState(false);
    //const img = require('./../../assets/tomato.jpg'); // need to be evantually the "item.image"
    const img = image
    
    
    const handleIncrement = async() => {
        setIsAddButtonDisabled(true);
        setAmount(amount + 1);
        await onAdd();
        setIsAddButtonDisabled(false);
        //another line needs to be added for updating the database of the user
    };
  
    const handleDecrement = async() => {
        if (amount > 1) {
            //another line needs to be added for updating the database of the user
            setIsDeclineButtonDisabled(true);
            setAmount(amount - 1);
            await onDecline();
            setIsDeclineButtonDisabled(false);
        }
    };
  
    const handleDelete = async () => {
        await onDelete();
        //another line needs to be added for updating the database of the user
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
        backgroundColor: '#F5F5F5',
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
        //marginBottom: 0,
    },
    productTinyImage: {
        width: 87,
        height: 87,
        resizeMode: 'contain'
    },
    trashCanTinyImage: {
        marginLeft: 10,
        //marginLeft: 180,
        //marginLeft: 150,
        //marginLeft: 90,
    },
});

export default Product;