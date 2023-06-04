import * as React from 'react'
import { Text, View } from 'react-native';
// import { useDrawerStatus } from '@react-navigation/drawer';
// import { useNavigation } from '@react-navigation/native';
// import { Actions } from 'react-native-router-flux';


export default function ArticlesList() {
    // const navigation = useNavigation();
    // const status = useDrawerStatus();
    // const onBackPress = () => {
    //     switch (Actions.currentScene) {
    //         case 'Articles List':
    //             if (status === 'open') {
    //                 BackHandler.exitApp();
    //             } else {
    //                 navigation.openDrawer();
    //             }
    //             break;
    //         default:
    //             Actions.pop();
    //     }
    //     return true;
    // };
    // React.useEffect(() => {
    //     const onBack = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    //     return () => onBack.remove();
    // }, []);
    return (
        <View  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Articles list</Text>
        </View>
    )
}
