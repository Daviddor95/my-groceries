import * as React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default function ProductsListScreen() {
    const navigation = useNavigation();
    return (
        <View  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Products list</Text>
            <Button title={'Scan'} onPress={() => navigation.navigate('Barcode scan')} />
        </View>
    )
}
