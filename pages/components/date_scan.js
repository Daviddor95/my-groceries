import * as React from 'react';
import { Text, View } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from 'react';
import db_req from '../../DB_requests/request';


export default function DateScanScreen() {
    const route = useRoute();
    const product_barcode = "" + route.params?.barcode;
    const [productInfo, setProductInfo] = useState([]);
    useEffect(() => {
		async function getProductName() {
			const res = await db_req("products", "barcodes", "get", { ItemCode : { _text: product_barcode } });
			const extractedInfo = res.map(item => {
                return {
                    manufacturer: item.ManufacturerItemDescription._text,
                };
			});
			setProductInfo(extractedInfo);
		}
		getProductName();
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Date scan, barcode: {route.params?.barcode} name: {productInfo.length > 0 ? productInfo[0].manufacturer : "product not found"} </Text>
        </View>
    )
}
