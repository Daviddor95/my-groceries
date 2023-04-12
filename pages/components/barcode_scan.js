import React, { useState, useEffect } from 'react';
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
        <View style={styles.topSection}>
          <Text style={styles.instruction}>Please point the camera to the product's barcode</Text>
        </View>
        <View style={styles.bottomSection}>
          {isFocused ? (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCode}
              style={[styles.scanner, StyleSheet.absoluteFillObject]}
            />) : null }
          { scanned && setScanned(false) }
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    topSection: {
      backgroundColor: 'black',
    },
    instruction: {
      color: 'white',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    scanner: {
      backgroundColor: 'black',
    },
    container: {
      flex: 1,
    },
    bottomSection: {
      flex: 1,
    },
    permissions: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
