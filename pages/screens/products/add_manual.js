import * as React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import db_req from '../../../requests/db_req';
import { useNavigation } from '@react-navigation/native';

/**
 * Add manual screen that adds the product to the DB according to the user entered details
 * @returns View
 */
export default function AddManual() {
    // defines react native hooks
    const [name, onNameChange] = React.useState('');
    const [barcode, onBarcodeChange] = React.useState('');
    const [quantity, onQuantityChange] = React.useState('');
    const [selectedUnit, setSelectedUnit] = React.useState('');
    const [date, setDate] = React.useState(new Date());
    const [dateStr, setDateStr] = React.useState('Exp. date');
    const [show, setShow] = React.useState(false);
    const [loc, setLoc] = React.useState('');
    const [err, setErr] = React.useState(false);
    const navigation = useNavigation();

    /**
     * Listener for the manual date picker
     */
    const onChangeDate = (e, selectedDate) => {
        const newDate = selectedDate;
        setShow(false);
        if (e.type == "set") {
            setDate(date => new Date(newDate));
            setDateStr(dateStr => (new Date(newDate)).toLocaleDateString("en-GB"));
        }
    };

    /**
     * Shows the manual date picker
     * @param {Event} e 
     */
    const showDatePicker = (e) => {
        if (Platform.OS === 'android') {
            setShow(true);
        }
    };

    /**
     * Adds the product to the DB and returns to the products list
     * @param {Event} e 
     */
    const addProduct = async (e) => {
        if (name == 0 || quantity == 0 || selectedUnit == 0 || loc == 0) {
            setErr(true);
        } else {
            const updateStr = { $push: {
                                    product: {
                                        name: name,
                                        barcode: barcode,
                                        exp_date: dateStr,
                                        location: loc,
                                        amount: quantity,
                                        unit: selectedUnit
                                    }
                                }
                            };
            const request = { query: { u_id: global.user_details.sub }, update: updateStr };
            await db_req("users", "regular_users", "update", request);
            navigation.popToTop();
        }
    };

    return (
        <View>
            <Text style={styles.instruction}>
                Please fill the following fields about the desired product in order to add it to the products list:
            </Text>
            <View style={styles.container}>
                <TextInput style={styles.input1} value={name} onChangeText={onNameChange} placeholder='Product name' />
            </View>
            <View style={styles.container}>
                <TextInput style={styles.input2} value={barcode} onChangeText={onBarcodeChange}
                    placeholder='Barcode (Optional)' keyboardType='numeric' />
                <Pressable onPress={showDatePicker}>
                    <View style={styles.dateContainer}>
                        <Text style={{ color: dateStr !== 'Exp. date' ? 'black' : 'darkgray' }}>{dateStr}</Text>
                    </View>
                </Pressable>
            </View>
            <View style={styles.container}>
                <TextInput style={styles.input3} value={quantity} onChangeText={onQuantityChange}
                    placeholder='Quantity' keyboardType='numeric' />
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
                <Pressable style={styles.submit} onPress={addProduct}>
                    <Text style={styles.buttonText}>Add product</Text>
                </Pressable>
            </View>
            <View style={styles.container}>
                { err && <Text style={styles.instruction}>
                    Some required fields are missing, please make sure you entered the required information about the 
                    product.
                </Text> }
            </View>
            <View style={styles.container}>
                <Image style={styles.img} source={require('../../../assets/groceries.png')} />
            </View>
            { show && <DateTimePicker testID="dateTimePicker" value={date} mode='date' onChange={onChangeDate} /> }
        </View>
    )
}

/**
 * Styles to apply on the components
 */
const styles = StyleSheet.create({
    instruction: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input1: {
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
    input2: {
        flex: 2,
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
    input3: {
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
    dateContainer: {
        flex: 1,
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        marginLeft: 10,
        padding: 15,
        borderRadius: 10,
        borderColor: 'gray',
        backgroundColor: 'white',
        elevation: 5,
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
    img: {
		resizeMode: 'contain',
		marginBottom: 20,
		height: 300,
	},
});
