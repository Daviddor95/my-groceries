import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, useIsFocused } from '@react-navigation/native';


export default function BarcodeScanScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    useEffect(() => {
      const getPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
      getPermissions();
    }, []);
    const handleBarCode = async ({ type, data }) => {
      setScanned(true);
      navigation.push('Date scan', { barcode: data, kind: type })
    };
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
        <Text>Please point your phone's camera to the product's barcode</Text>
        {isFocused ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCode}
            style={StyleSheet.absoluteFillObject}
          />) : null }
        { scanned && setScanned(false) }
      </View>
    );
}

const styles = StyleSheet.create({
    instruction: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    container: {
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    permissions: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center' },
  });
