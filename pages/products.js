import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import ProductsListScreen from './components/products_list';
import BarcodeScanScreen from './components/barcode_scan';
import DateScanScreen from './components/date_scan';

const Stack = createStackNavigator();


function ProductsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Products List" component={ProductsListScreen} />
        <Stack.Screen name="Barcode scan" component={BarcodeScanScreen} />
        <Stack.Screen name="Date scan" component={DateScanScreen} />
      </Stack.Navigator>
    );
  }


export default function ProductsScreen() {
    return (
        // <NavigationContainer>
            <ProductsStack />
        /* </NavigationContainer> */
    )
}
