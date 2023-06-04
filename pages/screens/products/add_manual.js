import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import db_req from '../../../DB_requests/request';
import { useNavigation } from '@react-navigation/native';
// import onBackPress from '../../components/on_back';

export default function AddManual() {
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

    const onChangeDate = (e, selectedDate) => {
        const newDate = selectedDate;
        setShow(false);
        setDate(date => new Date(newDate));
        setDateStr(dateStr => (new Date(newDate)).toLocaleDateString());
    };

    const showDatePicker = (e) => {
        if (Platform.OS === 'android') {
            setShow(true);
        }
    };

    const addProduct = async (e) => {
        if (name == 0 || quantity == 0 || selectedUnit == 0 || loc == 0) {
            setErr(true);
        } else {
            const updateStr = { $push: { products: { name: name, barcode: barcode, exp_date: dateStr, location: loc, amount: quantity, unit: selectedUnit } } };
            const request = { query: { u_id: "1" }, update: updateStr };
            console.log(await db_req("users", "regular_users", "update", request));
            // BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            navigation.pop();
        }
    };

    return (
        <View>
            <Text style={styles.instruction}>Please fill the following fields about the desired product in order to add it to the products list:</Text>
            <View style={styles.container}>
                <TextInput style={styles.input1} value={name} onChangeText={onNameChange} placeholder='Product name' />
            </View>
            <View style={styles.container}>
                <TextInput style={styles.input2} value={barcode} onChangeText={onBarcodeChange} placeholder='Barcode (Optional)' keyboardType='numeric' />
                <Pressable onPress={showDatePicker}>
                    <View style={styles.dateContainer}>
                        <Text style={{ color: dateStr !== 'Exp. date' ? 'black' : 'darkgray' }}>{dateStr}</Text>
                    </View>
                </Pressable>
            </View>
            <View style={styles.container}>
                <TextInput style={styles.input3} value={quantity} onChangeText={onQuantityChange} placeholder='Quantity' keyboardType='numeric' />
                <View style={styles.pickerContainer}>
                    <Picker style={selectedUnit == 0 ? styles.placeholder : styles.picker} itemStyle={styles.items} mode='dropdown' selectedValue={selectedUnit} onValueChange={(val, index) => { if (val != "0") { setSelectedUnit(val) } } }>
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
                    <Picker style={loc == 0 ? styles.placeholder : styles.picker} itemStyle={styles.items} mode='dropdown' selectedValue={loc} onValueChange={(val, index) => { if (val != "0") { setLoc(val); } } }>
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
                { err && <Text style={styles.instruction}>Some required fields are missing, please make sure you entered the required information about the product.</Text> }
            </View>
            { show && <DateTimePicker testID="dateTimePicker" value={date} mode='date' onChange={onChangeDate} /> }
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
});
