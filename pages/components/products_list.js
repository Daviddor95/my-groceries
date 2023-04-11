import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProductsListScreen() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Products list</Text>
            <Button title={'Scan'} onPress={() => navigation.push('Barcode scan')} />
        </View>
    )
}
