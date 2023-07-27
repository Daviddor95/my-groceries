import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import ProductsListScreen from './products_list';
import BarcodeScanScreen from './barcode_scan';
import DateScanScreen from './date_scan';
import AddManual from './add_manual';
import AddProduct from './add_product';


const Stack = createStackNavigator();

/**
 * Screens stack that organize the screens that related to the product's managment in order to create the desiered flow
 * @returns Stack navigator
 */
function ProductsStack() {
    return (
    	<Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#58ab4f', },
											 headerTintColor: '#fff', cardStyle: { backgroundColor: '#e3f2e1', }, }}>
    		<Stack.Screen name="ProductsListScreen" component={ProductsListScreen} options={{
					title: "Product list",
				}} />
        	<Stack.Screen name="Barcode scan" component={BarcodeScanScreen} />
	        <Stack.Screen name="Add manually" component={AddManual} />
    	    <Stack.Screen name="Date scan" component={DateScanScreen} />
        	<Stack.Screen name="Add product" component={AddProduct} />
    	</Stack.Navigator>
    );
}

export default function ProductsScreen() {
    return (
        <ProductsStack />
    )
}
