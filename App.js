import 'react-native-gesture-handler';
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { AppRegistry, Button, Alert, View, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuthRequest, exchangeCodeAsync, revokeAsync, ResponseType, fetchUserInfoAsync } from 'expo-auth-session';
import ProductsScreen from './pages/screens/products/products';
import RecipesScreen from './pages/screens/recipes/recipes';
import ArticlesScreen from './pages/screens/articles/articles';
import DonationsScreen from './pages/screens/donations/donations';
import GroceryListsScreen from './pages/screens/grocery_lists/grocery_lists';
import NotificationsScreen from './pages/screens/notifications/notifications';
import SettingsScreen from './pages/screens/options/options';
import StatisticsScreen from './pages/screens/statistics/statistics';


AppRegistry.registerComponent("main", () => App);
WebBrowser.maybeCompleteAuthSession();
const Drawer = createDrawerNavigator();
const clientId = '7qhntrjqsufkivi2h730p2egef';
const userPoolUrl = 'https://mygroceries0292444e-0292444e-dev.auth.us-east-1.amazoncognito.com';
//const redirectUri = 'exp://192.168.68.100:8081/--/products/';//David's
const redirectUri = 'exp://pe8r9jq.ellakha.8081.exp.direct/--/products/';//Ella's


export default function App() {
	const [authTokens, setAuthTokens] = React.useState(null);
	const discoveryDocument = React.useMemo(() => ({
		authorizationEndpoint: userPoolUrl + '/logout',
		tokenEndpoint: userPoolUrl + '/oauth2/token',
		revocationEndpoint: userPoolUrl + '/oauth2/revoke',
		userInfoEndpoint: userPoolUrl + '/userinfo',
	}), []);

	const [request, response, promptAsync] = useAuthRequest({
		clientId,
		responseType: ResponseType.Code,
		redirectUri,
		usePKCE: true,
    }, discoveryDocument );

	React.useEffect(() => {
		const exchangeFn = async (exchangeTokenReq) => {
			try {
				const exchangeTokenResponse = await exchangeCodeAsync(exchangeTokenReq, discoveryDocument);
				setAuthTokens(exchangeTokenResponse);
			} catch (error) {
				console.error(error);
			}
		};
		if (response) {
			if (response.error) {
				Alert.alert('Authentication error', response.params.error_description || 'something went wrong');
				return;
			}
			if (response.type === 'success') {
				exchangeFn({
					clientId: clientId,
	        		code: response.params.code,
    	    		redirectUri: redirectUri,
        			extraParams: {
        				code_verifier: request.codeVerifier || "",
        			},
        		});
    		}
    	}
	}, [discoveryDocument, request, response]);

	const logout = async () => {
		const revokeResponse = await revokeAsync({
					"clientId": "7qhntrjqsufkivi2h730p2egef",
					"token": authTokens.refreshToken
				},
				discoveryDocument
    	);
    	if (revokeResponse) {
    		setAuthTokens(null);
    	}
		// console.log('authTokens: ' + JSON.stringify(authTokens, null, 2));
	};

	return (
		<NavigationContainer>
		{ authTokens ? (
		<>
		{/* {console.log(fetchUserInfoAsync({"clientId": "7qhntrjqsufkivi2h730p2egef", "token": authTokens.refreshToken}, discoveryDocument))} */}
			<StatusBar style="auto" />
			<Drawer.Navigator initialRouteName="Products" screenOptions={{headerShown: false}} drawerContent={prop => {
					return (
						<DrawerContentScrollView {...prop}>
							<Button title='Products' onPress={() => prop.navigation.navigate("Products")} />
							<Button title='Log out' onPress={async () => {
																await logout();
																}} />
						</DrawerContentScrollView>
					)
				}}>
				<Drawer.Screen name="Products" component={ProductsScreen} />
				<Drawer.Screen name="Recipes" component={RecipesScreen} />
				<Drawer.Screen name="Grocery lists" component={GroceryListsScreen} />
				<Drawer.Screen name="Articles" component={ArticlesScreen} />
				<Drawer.Screen name="Donations" component={DonationsScreen} />
				<Drawer.Screen name="Notifications" component={NotificationsScreen} />
				<Drawer.Screen name="Statistics" component={StatisticsScreen} />
				<Drawer.Screen name="Settings" component={SettingsScreen} />
			</Drawer.Navigator>
		</>
		) : (
		<>
			<StatusBar style="auto" />
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>Login</Text>
				<Button title="Login" onPress={() => promptAsync()} />
			</View>
		</>
		)}
		</NavigationContainer>
	);
}
