import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
// import { BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ProductsScreen from './pages/screens/products/products';
import RecipesScreen from './pages/screens/recipes/recipes';
import ArticlesScreen from './pages/screens/articles/articles';
import DonationsScreen from './pages/screens/donations/donations';
import GroceryListsScreen from './pages/screens/grocery_lists/grocery_lists';
import NotificationsScreen from './pages/screens/notifications/notifications';
import SettingsScreen from './pages/screens/options/options';
import StatisticsScreen from './pages/screens/statistics/statistics';


const Drawer = createDrawerNavigator();


export default function App() {

  // const navigation = useNavigation();
  // const status = useDrawerStatus();
  // React.useEffect(() => {
  //     const onBackPress = () => {
  //         // console.log(status);
  //         // if (status === 'open') {
  //             BackHandler.exitApp();
  //         // } else {
  //             // navigation.openDrawer();
  //         // }
  //         return true;
  //     };
  //     const onBack = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //     return () => onBack.remove();
  // }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Drawer.Navigator initialRouteName="Products" screenOptions={{headerShown: false}}>
        <Drawer.Screen name="Products" component={ProductsScreen} />
        <Drawer.Screen name="Recipes" component={RecipesScreen} />
        <Drawer.Screen name="Grocery lists" component={GroceryListsScreen} />
        <Drawer.Screen name="Articles" component={ArticlesScreen} />
        <Drawer.Screen name="Donations" component={DonationsScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Statistics" component={StatisticsScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
