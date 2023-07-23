import 'react-native-gesture-handler';
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { AppRegistry, StyleSheet, Alert, View, Text, Pressable, Image } from 'react-native';
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
import db_req from './requests/db_req';


AppRegistry.registerComponent("main", () => App);
WebBrowser.maybeCompleteAuthSession();
const Drawer = createDrawerNavigator();
const clientId = '7qhntrjqsufkivi2h730p2egef';
const userPoolUrl = 'https://mygroceries0292444e-0292444e-dev.auth.us-east-1.amazoncognito.com';
// const useProxy = Platform.select({ web: false, default: true });
// const redirectUri = AuthSession.makeRedirectUri({ useProxy });
//const redirectUri = 'exp://192.168.68.109:8081/--/products/';//David's
const redirectUri = 'exp://pe8r9jq.ellakha.8081.exp.direct/--/products/';//Ella's

global.user_details = null;


export default function App() {
	const [authTokens, setAuthTokens] = React.useState(null);
	const [user, setUser] = React.useState(null);
	const [show, setShow] = React.useState(true);

	const discoveryDocument = React.useMemo(() => ({
		authorizationEndpoint: userPoolUrl + '/logout',
		tokenEndpoint: userPoolUrl + '/oauth2/token',
		revocationEndpoint: userPoolUrl + '/oauth2/revoke',
		userInfoEndpoint: userPoolUrl + '/oauth2/userInfo',
		endSessionEndpoint: userPoolUrl + '/logout',
	}), []);

	const [request, response, promptAsync] = useAuthRequest({
		clientId,
		responseType: ResponseType.Code,
		redirectUri,
		usePKCE: true,
		scopes: ['openid', 'profile', 'email'],
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
				setShow(false);
				async function info() {
					await exchangeFn({
						clientId: clientId,
						code: response.params.code,
						redirectUri: redirectUri,
						extraParams: {
							code_verifier: request.codeVerifier || "",
						},
					});
				}
				info();
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
	};

	const userInfo = async () => {
		global.user_details = await fetchUserInfoAsync(authTokens, discoveryDocument);
		setUser(global.user_details);
		var user = await db_req("users", "regular_users", "get", { u_id : global.user_details.sub });
		if (!user.length) {
			var new_user = { u_id : global.user_details.sub,
							name: global.user_details.name,
							grocery_lists: [],
							recipes: [],
							articles: [],
							notifications: [],
							statistics: {},
							product: []
						};
			await db_req("users", "regular_users", "add", new_user);
		}
	};

	return (
		<NavigationContainer>
		{ authTokens ? (
		<>
			<StatusBar style="auto" />
			<Drawer.Navigator initialRouteName="Products" screenOptions={{headerShown: false}} drawerContent={props => {
					return (
						<DrawerContentScrollView {...props} onLayout={userInfo}>
							{ user ? (
								<>
									<Text style={styles.drawer_welcome}>Hello {user.name}</Text>
									<Pressable style={styles.drawer_button} onPress={() => { 
											props.navigation.navigate("Products");
										}}>
										<Text style={styles.drawer_text}>Products</Text>
									</Pressable>
								</>
							) : null }
							<Pressable style={styles.drawer_button} onPress={async () => {
																				await logout();
																				setShow(true);
																				}}>
								<Text style={styles.drawer_text}>Log out</Text>
							</Pressable>
						</DrawerContentScrollView>
					)
				}}>
				{ user ? (
					<>
					<Drawer.Screen name="Products" component={ProductsScreen} />
					<Drawer.Screen name="Recipes" component={RecipesScreen} />
					<Drawer.Screen name="Grocery lists" component={GroceryListsScreen} />
					<Drawer.Screen name="Articles" component={ArticlesScreen} />
					<Drawer.Screen name="Donations" component={DonationsScreen} />
					<Drawer.Screen name="Notifications" component={NotificationsScreen} />
					<Drawer.Screen name="Statistics" component={StatisticsScreen} />
					<Drawer.Screen name="Settings" component={SettingsScreen} />
					</>
				) : (
					<Drawer.Screen name="Products" component={ProductsScreen} />
				) }
				
			</Drawer.Navigator>
		</>
		) : (
		<>
			<StatusBar style="auto" />
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Image style={styles.logo} source={require('./assets/start_screen_logo.png')} />
				<Text style={styles.instruction}>Please sign in, or sign up if you don't have an account, in order to synchronize your groceries</Text>
				{ show ? (
					<Pressable style={styles.login} disabled={!request} onPress={async () => { await promptAsync(); }}>
						<Text style={styles.login_text}>Sign in or sign up</Text>
					</Pressable>
				) : null }
			</View>
		</>
		)}
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	drawer_button: {
		backgroundColor: 'transparent',
	},
	drawer_text: {
    	color: 'darkgray',
    	textAlign: 'center',
    	fontWeight: 'bold',
    	margin: 10,
		fontSize: 16
	},
	login: {
        backgroundColor: 'limegreen',
        borderRadius: 10,
        elevation: 5,
    },
    login_text: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        margin: 20,
		fontSize: 18
    },
	instruction: {
		padding: 10,
        marginTop: 5,
		marginBottom: 60,
		fontSize: 16,
		textAlign: 'center'
	},
	logo: {
		resizeMode: 'center',
		marginBottom: 30,
		width: 625,
		height: 111
	},
	drawer_welcome: {
		color: 'black',
    	textAlign: 'center',
    	fontWeight: 'bold',
    	margin: 10,
		fontSize: 18
	}
});
