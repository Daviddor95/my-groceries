import * as React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native';

/**
 * Loading screen (used after user authentication)
 * @returns View
 */
function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../../assets/loading.gif')} />
            <Text>Loading your profile...</Text>
        </View>
    )
}

export default LoadingScreen;

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
	logo: {
		resizeMode: 'center',
	}
});
