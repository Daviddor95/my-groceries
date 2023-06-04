import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
// import { Button, TouchableOpacity } from 'react-native';
import db_req from '../../../DB_requests/request';
import scan_req from '../../../DB_requests/scan_req';


export default function DateScanScreen() {
    const [permission, reqPermission] = Camera.useCameraPermissions();
    const [productInfo, setProductInfo] = useState([]);
    // const [isReady, setIsReady] = useState(false);
    const [date, setDate] = useState();
    const navigation = useNavigation();
    const route = useRoute();
    const camRef = useRef(null);
    const product_barcode = "" + route.params?.barcode;
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
    const onCameraReady = async () => {
        // setIsReady(true);onPress={() => {  }  camRef.current
        if (camRef.current) {
            const continiousScan = setInterval(function() { scan() } , 6000);
            const onPicture = async ({ uri, width, height, exif, base64 }) => {
                console.log(base64.substring(50000, 50100));
                const res = await scan_req(base64);
                // console.log(res);
                console.log(res);
                // const resDate = res.map(d => {JSON.parse(res).body.date
                //     return {
                //         exp_date: d,
                //     };
                // });
                // console.log(resDate);
                if (res) {
                    // console.log(resDate[0].body);
                    camRef.current.pausePreview();
                    navigation.pop();
                    // send data to database
                    clearInterval(continiousScan);
                } else {
                    console.log("YYYYYYYYYYYYYYYYYYYYY");
                }
            };
            const scan = async () => {
                if (camRef.current) {
                    await camRef.current.takePictureAsync({ exif: true, base64: true, quality: 0.4 }).then((uri, width, height, exif, base64) => onPicture(uri, width, height, exif, base64)).catch(err => console.log(err));
                }
                // const picture = await camRef.current.takePictureAsync({ base64: true });, imageType: camConst.ImageType.jpg var camConst = await camRef.Constants;
                // const picUri = picture.uri;
                // if (picUri) {
                //     const res = await scan_req(picture);
                //     if (res) {
                //         // setDate(res);
                //     }
                // }     , date: {date.toString()}
            };
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.details}>Product: {productInfo.length > 0 ? productInfo[0].manufacturer : "Not found"}, barcode: {route.params?.barcode}</Text>
            <Text style={styles.instruction}>Please point the camera to the product's expiration date</Text>
            <View style={styles.scanner}>
                <Camera ref={camRef} onCameraReady={onCameraReady} style={styles.camera}></Camera>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Or click here to enter the expiration date manually</Text>
                </Pressable>
            </View>
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

