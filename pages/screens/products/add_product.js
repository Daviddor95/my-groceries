import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import db_req from '../../../requests/db_req';
import { useNavigation, useRoute } from '@react-navigation/native';


export default function AddProduct() {
    const [quantity, onQuantityChange] = React.useState('');
    const [selectedUnit, setSelectedUnit] = React.useState('');
    const [loc, setLoc] = React.useState('');
    const [err, setErr] = React.useState(false);
    const navigation = useNavigation();
    const route = useRoute();

    const add = async (e) => {
        if (quantity == 0 || selectedUnit == 0 || loc == 0) {
            setErr(true);
        } else {
            const updateStr = { $push: { ["product"]: {
                                                        barcode: route.params?.prod_barcode,
                                                        exp_date: route.params?.expDate,
                                                        location: loc,
                                                        amount: quantity,
                                                        unit: selectedUnit
                                                    }
                                                }
                                            };
            const request = { query: { u_id: global.user_details.sub }, update: updateStr };
            console.log(await db_req("users", "regular_users", "update", request));
            navigation.navigate('Products List', { isScaneed: true });
        }
    };

    return (
        <View>
            <Text style={styles.instruction}>Detected expiration date: {route.params?.expDate}.</Text>
            <Text style={styles.instruction}>
                Please select the product's location and quantity in order to add it to the products list:
            </Text>
            <View style={styles.container}>
                <TextInput style={styles.input} value={quantity} onChangeText={onQuantityChange} placeholder='Quantity'
                    keyboardType='numeric' />
                <View style={styles.pickerContainer}>
                    <Picker style={selectedUnit == 0 ? styles.placeholder : styles.picker} itemStyle={styles.items}
                        onValueChange={(val, index) => { if (val != "0") { setSelectedUnit(val) } } }
                        mode='dropdown' selectedValue={selectedUnit}>
                        <Picker.Item label='Select unit' value='0' style={styles.placeholder} />
                        <Picker.Item label='grams' value='grams' />
                        <Picker.Item label='kilograms' value='kilograms' />
                        <Picker.Item label='milliliters' value='milliliters' />
                        <Picker.Item label='liters' value='liters' />
                        <Picker.Item label='units' value='units' />
                        <Picker.Item label='packs' value='packs' />
                    </Picker>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    <Picker style={loc == 0 ? styles.placeholder : styles.picker} itemStyle={styles.items}
                        onValueChange={(val, index) => { if (val != "0") { setLoc(val); } } }
                        mode='dropdown' selectedValue={loc}>
                        <Picker.Item label='Select location' value='0' style={styles.placeholder} />
                        <Picker.Item label='kitchen cabinet' value='kitchen cabinet' />
                        <Picker.Item label='refrigerator' value='refrigerator' />
                        <Picker.Item label='freezer' value='freezer' />
                    </Picker>
                </View>
                <Pressable style={styles.submit} onPress={add}>
                    <Text style={styles.buttonText}>Add product</Text>
                </Pressable>
            </View>
            <View style={styles.container}>
                { err && <Text style={styles.instruction}>
                    Some required fields are missing, please make sure you entered the required information about the product.
                    </Text> }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    instruction: {
        padding: 10,
        marginTop: 5,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        marginLeft: 10,
        padding: 10,
        borderRadius: 10,
        borderColor: 'gray',
        backgroundColor: 'white',
        elevation: 5,
    },
    picker: {
        padding: 10,
        backgroundColor: 'white',
        color: 'black',
    },
    pickerContainer: {
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        marginLeft: 10,
        height: 48,
        overflow: 'hidden',
        flex: 2,
        elevation: 5,
        borderRadius: 10,
        borderColor: 'gray',
    },
    submit: {
        flex: 1,
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        marginLeft: 10,
        padding: 15,
        borderRadius: 10,
        borderColor: 'lightskyblue',
        backgroundColor: 'lightskyblue',
        elevation: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    placeholder: {
        padding: 10,
        backgroundColor: 'white',
        color: 'darkgray',
    },
});
