import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import ProductsListScreen from './components/products_list';
import BarcodeScanScreen from './components/barcode_scan';
import DateScanScreen from './components/date_scan';
import AddManual from './components/add_manual';


const Stack = createStackNavigator();

function ProductsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Products List" component={ProductsListScreen} />
        <Stack.Screen name="Barcode scan" component={BarcodeScanScreen} />
        <Stack.Screen name="Add manually" component={AddManual} />
        <Stack.Screen name="Date scan" component={DateScanScreen} />
      </Stack.Navigator>
    );
  }


export default function ProductsScreen() {
    return (
          <ProductsStack />
    )
}
