import * as React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native';


function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../../assets/loading.gif')} />
            <Text>Loading your profile...</Text>
        </View>
    )
}

export default LoadingScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center' 
    },
	logo: {
		resizeMode: 'center',
	}
});
