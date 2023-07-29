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
import SettingsScreen from './pages/screens/options/options';
import db_req from './requests/db_req';
import LoadingScreen from './pages/screens/products/loading';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});
// initializes required components
AppRegistry.registerComponent("main", () => App);
WebBrowser.maybeCompleteAuthSession();
const Drawer = createDrawerNavigator();
// defines constants and a global variable for the signed in user's details
const clientId = '7qhntrjqsufkivi2h730p2egef';
const userPoolUrl = 'https://mygroceries0292444e-0292444e-dev.auth.us-east-1.amazoncognito.com';
const redirectUri = 'exp://192.168.68.109:8081/--/products/';//David's
//const redirectUri = 'exp://pe8r9jq.ellakha.8081.exp.direct/--/products/';//Ella's
global.user_details = null;

/**
 * Defines the application structure anf flow, including account authentication an notifications
 * @returns NavigationContainer
 */
export default function App() {
	// defines react native hooks
	const [authTokens, setAuthTokens] = React.useState(null);
	const [show, setShow] = React.useState(true);
	const [isSignedIn, setIsSignedIn] = React.useState(false);
	const [name, setName] = React.useState('');
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();
	
	// authentication redirect URLs
	const discoveryDocument = React.useMemo(() => ({
		authorizationEndpoint: userPoolUrl + '/logout',
		tokenEndpoint: userPoolUrl + '/oauth2/token',
		revocationEndpoint: userPoolUrl + '/oauth2/revoke',
		userInfoEndpoint: userPoolUrl + '/oauth2/userInfo',
		endSessionEndpoint: userPoolUrl + '/logout',
	}), []);

	// creates the required object for user authentication
	const [request, response, promptAsync] = useAuthRequest({
		clientId,
		responseType: ResponseType.Code,
		redirectUri,
		usePKCE: true,
		scopes: ['openid', 'profile', 'email'],
    }, discoveryDocument );

	/**
	 * Handles the user authentication
	 */
	React.useEffect(() => {
		/**
		 * exchanges tokens
		 * @param {*} exchangeTokenReq 
		 */
		const exchangeFn = async (exchangeTokenReq) => {
			try {
				const exchangeTokenResponse = await exchangeCodeAsync(exchangeTokenReq, discoveryDocument);
				setAuthTokens(exchangeTokenResponse);
			} catch (error) {
				console.error(error);
			}
		};
		// handles the response
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

	useEffect(() => {
		// listeners taken from 
		// https://docs.expo.dev/push-notifications/receiving-notifications/#notification-event-listeners
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification);
		});
		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response);
		});
		Notifications.removeNotificationSubscription(notificationListener.current);
		Notifications.removeNotificationSubscription(responseListener.current);
		
		async function pushNotification(){
			if(isSignedIn){
				const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
				const ps = usersDb[0].product
				newArrPr = []
				//create an array of elements with product name and expiration date
				for(const p of ps){
					const expiryDateStr = p.exp_date
					const dateElements = expiryDateStr.split("/");
					const [dd, mm, yy] = dateElements;
					// change from this format 11/01/2023 to 01-11-2023
					// so subtracting dates will be simplier
					const edjustedDate = `${yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
					if(p.hasOwnProperty("name")){
						newArrPr.push({name:p.name, expDate:edjustedDate})
					}else{
						const currentProduct = await db_req("products", "barcodes", "get", { "ItemCode._text": p.barcode});
                    	nameOfProduct = currentProduct[0].ManufacturerItemDescription._text;
						newArrPr.push({name:nameOfProduct, expDate:edjustedDate})
					}
				}
				// send the array to function that schedule notification
				// and updates the body of the notification to be baised on newArrPr
				await schedulePushNotification(newArrPr);
			}
        }
		pushNotification();
	},[isSignedIn]);

	/**
	 * Logs out the current user
	 */
	const logout = async () => {
		const revokeResponse = await revokeAsync({
					"clientId": clientId,
					"token": authTokens.refreshToken
				},
				discoveryDocument
    	);
    	if (revokeResponse) {
    		setAuthTokens(null);
    	}
		setIsSignedIn(false);
	};

	/**
	 * Gets the user information, and creates a user in the DB if there is no such user there
	 */
	const userInfo = async () => {
		var details = await fetchUserInfoAsync(authTokens, discoveryDocument);
		global.user_details = details
		setName(details.name);
		var user = await db_req("users", "regular_users", "get", { u_id : details.sub });
		if (!user.length) {
			var new_user = { u_id : details.sub,
							name: details.name,
							grocery_lists: [],
							recipes: [],
							articles: [],
							notifications: [],
							statistics: {},
							product: []
						};
			await db_req("users", "regular_users", "add", new_user);
		}
		setIsSignedIn(true);
	};

	/**
	 * Calls the userInfo function
	 */
	const callUserInfo = () => {
		userInfo();
	}

	return (
		<NavigationContainer>
			<StatusBar style="auto" />
			{ authTokens ? (
				<Drawer.Navigator name='Drawer' initialRouteName="Loading" screenOptions={{ headerShown: false }}
					drawerContent={props => {
						return (
							<DrawerContentScrollView {...props}>
								{ isSignedIn ? (
									<Text style={styles.drawer_welcome}>Hello {name}</Text>
								) : null }
								<Pressable style={styles.drawer_button} onPress={() => { 
												props.navigation.navigate("ProductsScreen");
											}}>
									<Text style={styles.drawer_text}>Products</Text>
								</Pressable>
								<Pressable style={styles.drawer_button} onPress={() => { 
												props.navigation.navigate("RecipesScreen");
											}}>
									<Text style={styles.drawer_text}>Recipes</Text>
								</Pressable>
								<Pressable style={styles.drawer_button} onPress={async () => {
																						await logout();
																						setShow(true);
																					}}>
									<Text style={styles.drawer_text}>Log out</Text>
								</Pressable>
							</DrawerContentScrollView>
						)
					}}>
					{ isSignedIn ? (
						<>
							<Drawer.Screen name="ProductsScreen" component={ProductsScreen} />
							<Drawer.Screen name="RecipesScreen" component={RecipesScreen} />
							<Drawer.Screen name="Settings" component={SettingsScreen} />
						</>
					) : (
						<>
							{ callUserInfo() }
							<Drawer.Screen name="LoadingScreen" component={LoadingScreen} />
						</>
					)}
				</Drawer.Navigator>
			) : (
				<View style={styles.container}>
					<Image style={styles.logo} source={require('./assets/start_screen_logo.png')} />
					<Text style={styles.instruction}>Please sign in, or sign up if you don't have an account, 
					in order to synchronize your groceries</Text>
					{ show ? (
						<Pressable style={styles.login} disabled={!request} onPress={async () => {
																							await promptAsync();
																						}}>
							<Text style={styles.login_text}>Sign in or sign up</Text>
						</Pressable>
					) : null }
				</View>
			)}
		</NavigationContainer>
	);
}

/**
 * Styles to apply on the components
 */
const styles = StyleSheet.create({
	container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
		backgroundColor: '#e3f2e1'
    },
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


async function schedulePushNotification(pro) {
	let body = "The following products will expire soon:\n";
	for (const produ of pro) {
		const expDat = new Date(produ.expDate);
    	const today = new Date();
    	const timeDifference = expDat.getTime() - today.getTime();
    	const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

		// edit the body of notification to be all the products with epiration date in less then 4 days
    	if (daysDifference <= 3 && daysDifference >0) {
      	body += `${produ.name} (expires in ${daysDifference} days)\n`;
    	} else if (daysDifference ==0) {
			body += `${produ.name} (expires today!)\n`;
		} else if (daysDifference <0) {
			body += `${produ.name} (already expired! ${produ.expDate})\n`;
		}
	}
	
	const currentDate = new Date();
	const currentHour = currentDate.getHours();
	const currentMinutes = currentDate.getMinutes();
	await Notifications.cancelAllScheduledNotificationsAsync();
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "Expiration Notification",
			body: body,
			data: { data: 'goes here' },
		},
		// setting notification to be sent a minute after signing in
		trigger: { hour: currentHour, minute: currentMinutes+1, repeats: true, },
	});
}

// code is taken from https://docs.expo.dev/versions/latest/sdk/notifications/
async function registerForPushNotificationsAsync() {
	let token;
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}
  
	if (Device.isDevice){
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
	  	if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
	  	}
	  	if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
	  	}
	  	token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		alert('Must use physical device for Push Notifications');
	}
	return token;
}
  