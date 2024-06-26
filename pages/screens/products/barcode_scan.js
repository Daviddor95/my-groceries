import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, useIsFocused } from '@react-navigation/native';

/**
 * Barcode scan screen that continiously scans the product's barcode using the device's camera
 * @returns View
 */
export default function BarcodeScanScreen() {
	// defines react native hooks
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
	// defines a flag that indicates if the user procceded to the next screen
	var pushed = false;

	/**
	 * Gets camera permissions
	 */
    useEffect(() => {
		const getPermissions = async () => {
        	const { status } = await BarCodeScanner.requestPermissionsAsync();
        	setHasPermission(status === 'granted');
    	};
    	getPermissions();
    }, []);

	/**
	 * Moves to the next screen (Date scan screen)
	 * @param {import('expo-barcode-scanner').BarCodeScannerResult} param0 
	 */
    const handleBarCode = async ({ type, data }) => {
		setScanned(true);
		if (!pushed) {
			navigation.push('Date scan', { barcode: data, kind: type });
			pushed = true;
		}
    };

	// handling different permissions states
    if (hasPermission === null) {
		return (
        	<View style={styles.permissions}>
        		<Text>Waiting for camera permission</Text>
        	</View>
    	);
    }
    if (hasPermission === false) {
    	return (
        	<View style={styles.permissions}>
        		<Text>No permission to access the camera</Text>
        	</View>
    	);
    }

    return (
    	<View style={styles.container}>
        	<Text style={styles.instruction}>Please point the camera to the product's barcode</Text>
        	<View style={styles.scanner}>
        		{isFocused ? (<BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCode}
            			style={StyleSheet.absoluteFillObject}/>) : null }
        		{ scanned && setScanned(false) }
        		<Pressable style={styles.button} onPress={() => {
														navigation.push('Add manually');
													}}>
            		<Text style={styles.instruction2}>Or click here to add the product manually</Text>
        		</Pressable>
        	</View>
    	</View>
    );
}

/**
 * Styles to apply on the components
 */
const styles = StyleSheet.create({
    instruction: {
    	color: 'white',
    	textAlign: 'center',
    	marginTop: 10,
    	marginBottom: 10,
    	fontWeight: 'bold',
    },
    instruction2: {
    	color: 'black',
    	textAlign: 'center',
    	fontWeight: 'bold',
    	margin: 10,
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
    button: {
    	backgroundColor: 'white',
    	alignSelf: 'baseline',
    	position: 'absolute',
    	bottom: 15,
    	borderRadius: 10,
    	elevation: 5,
    },
    permissions: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center',
    },
});
