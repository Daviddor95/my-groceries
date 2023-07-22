import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import * as React from 'react';
import ProductsListScreen from './products_list';
import BarcodeScanScreen from './barcode_scan';
import DateScanScreen from './date_scan';
import AddManual from './add_manual';
import AddProduct from './add_product';


const Stack = createStackNavigator();

function ProductsStack() {
	const route = useRoute();
	var user_id = route.params?.u_id;
    return (
    	<Stack.Navigator>
    		<Stack.Screen name="Products List" component={ProductsListScreen} initialParams={{ u_id: user_id }} />
        	<Stack.Screen name="Barcode scan" component={BarcodeScanScreen} initialParams={{ u_id: user_id }} />
	        <Stack.Screen name="Add manually" component={AddManual} initialParams={{ u_id: user_id }} />
    	    <Stack.Screen name="Date scan" component={DateScanScreen} initialParams={{ u_id: user_id }} />
        	<Stack.Screen name="Add product" component={AddProduct} initialParams={{ u_id: user_id }} />
    	</Stack.Navigator>
    );
}

export default function ProductsScreen() {
    return (
        <ProductsStack />
    )
}
