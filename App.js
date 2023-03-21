import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ProductsScreen from './pages/products';
import RecipesScreen from './pages/recipes';
import ArticlesScreen from './pages/articles';
import DonationsScreen from './pages/donations';
import GroceryListsScreen from './pages/grocery_lists';
import NotificationsScreen from './pages/notifications';
import SettingsScreen from './pages/options';
import StatisticsScreen from './pages/statistics';


const Drawer = createDrawerNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Drawer.Navigator initialRouteName="Products">
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
