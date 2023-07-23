import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from "@react-navigation/native";
import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImageManipulator from 'expo-image-manipulator';
import db_req from '../../../requests/db_req';
import scan_req from '../../../requests/scan_req';


export default function DateScanScreen() {
    const [permission, reqPermission] = Camera.useCameraPermissions();
    const [productInfo, setProductInfo] = useState([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const route = useRoute();
    const camRef = useRef(null);
    const product_barcode = "" + route.params?.barcode;
    const interval = 8000;
    var continiousScan;
    var scanned = false;
    var dateStr = '';

    useEffect(() => {
		async function getProductName() {
			const res = await db_req("products", "barcodes", "get", { ItemCode : { _text: product_barcode } });
			const extractedInfo = res.map(item => {
                return {
                    manufacturer: item.ManufacturerItemDescription._text,
                };
			});
			setProductInfo(extractedInfo);
		}
		getProductName();
        return () => {
            setShow(false);
        }
    }, []);

    if (!permission) {
        return (
            <View style={styles.permissions}>
                <Text>Waiting for camera permission</Text>
            </View>
        )
    }
    if (!permission.granted) {
        return (
            <View style={styles.permissions}>
                <Text>No permission to access the camera</Text>
                <Pressable style={styles.button} onPress={reqPermission}>
                    <Text style={styles.buttonText}>Click here to try again</Text>
                </Pressable>
            </View>
        )
    }

    const onChangeDate = (e, selectedDate) => {
        setShow(false);
        clearInterval(continiousScan);
        if (e.type == "set") {
            scanned = true;
            setDate(new Date(selectedDate));
            dateStr = new Date(selectedDate).toLocaleDateString("en-GB");
            navigation.push('Add product', {
                                                prod_barcode: product_barcode,
                                                expDate: dateStr,
                                                passData: route.params?.passData
                                            });
        } else {
            continiousScan = setInterval(async function() { await scan() } , interval);
        }
    };

    const showDatePicker = (e) => {
        clearInterval(continiousScan);
        setShow(true);
    };

    const onPicture = async ({ uri, width, height, exif, base64 }) => {
        const resizeImg = await ImageManipulator.manipulateAsync(uri, [], { format: 'jpeg', base64: true });
        const b64img = resizeImg.base64;
        var res = await scan_req(b64img);
        if (res && res.dateFound && !scanned) {
            dateStr = new Date(res.date).toLocaleDateString("en-GB");
            setDate(new Date(res.date));
            scanned = true;
            clearInterval(continiousScan);
            navigation.push('Add product', {
                                            prod_barcode: product_barcode,
                                            expDate: dateStr,
                                            });
        }
    };

    const scan = async () => {
        if (scanned) {
            clearInterval(continiousScan);
        } else if (camRef && (await camRef.current) && !scanned) {
            console.log("scanning...");
            ((await camRef.current).takePictureAsync({ exif: true, base64: true, skipProcessing: false }))
                .then(async (uri, width, height, exif, base64) => await onPicture(uri, width, height, exif, base64))
                .catch(err => console.log(err));
        }
    };

    const onCameraReady = async () => {
        if (camRef && (await camRef.current)) {
            continiousScan = setInterval(async function() { await scan() } , interval);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.details}>
                Product: {productInfo.length > 0 ? productInfo[0].manufacturer : "Loading..."}, barcode: {route.params?.barcode}
            </Text>
            <Text style={styles.instruction}>Please point the camera to the product's expiration date</Text>
            <View style={styles.scanner}>
                {isFocused ? (
                    <Camera ref={camRef} onCameraReady={onCameraReady} style={styles.camera}></Camera>
                ) : null }
                <Pressable style={styles.button} onPress={showDatePicker}>
                    <Text style={styles.buttonText}>Or click here to enter the expiration date manually</Text>
                </Pressable>
            </View>
            { show && <DateTimePicker testID="dateTimePicker" value={date} mode='date' onChange={onChangeDate} /> }
        </View>
    )
}

const styles = StyleSheet.create({
    permissions: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'white',
        alignSelf: 'baseline',
        position: 'absolute',
        bottom: 15,
        borderRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        margin: 10,
    },
    details: {
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    instruction: {
        color: 'white',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scanner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
