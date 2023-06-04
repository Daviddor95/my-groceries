import { BackHandler } from 'react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';


export default function onBackPress() {
    const navigation = useNavigation();
    const status = useDrawerStatus();
    console.log(status);
    if (status === 'open') {
        BackHandler.exitApp();
    } else {
        navigation.openDrawer();
    }
    return true;
}

