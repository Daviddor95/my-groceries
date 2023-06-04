import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { StyleSheet, Text, View, BackHandler } from 'react-native';
// import { useDrawerStatus } from '@react-navigation/drawer';
// import { useNavigation, useIsFocused } from '@react-navigation/native';
// import { Actions } from 'react-native-router-flux';
import ArticlesList from './articles_list';

// import { withNavigationFocus } from 'react-navigation';

const Stack = createStackNavigator();


export default function ArticlesScreen() {
    // const navigation = useNavigation();
    // const status = useDrawerStatus();
    // const isFocused = useIsFocused();
    // const onBackPress = () => {

        // if (isFocused) {
        //     console.log(status);
        //     if (status === 'open') {
        //         BackHandler.exitApp();
        //     } else {
        //         navigation.openDrawer();
        //     }
        //     return true;
        // }
    // React.useEffect(() => {
    //     const onBack = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    //     return () => onBack.remove();
    // }, []);
    //  onBackPress={ () => BackHandler.exitApp() }  navigation, status
    
        // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        //     <Text>Articles</Text>
        //     {/* { isFocused && BackHandler.addEventListener('hardwareBackPress', onBackPress) } */}
        //     {/* { !isFocused && BackHandler.removeEventListener('hardwareBackPress', onBackPress) } */}
        // </View>
    
    return (
        <Stack.Navigator>
            <Stack.Screen name="Articles List" component={ArticlesList} />
        </Stack.Navigator>
    )
}
