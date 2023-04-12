import * as React from 'react';
import { Text, View } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from 'react';


export default function DateScanScreen() {
    const route = useRoute();
    const product_barcode = "" + route.params?.barcode;
    const [productInfo, setProductInfo] = useState([]);
    useEffect(() => {
      async function getProductInfo() {
        const res = await fetch('https://mongodbdriver.azurewebsites.net/api/driver?code=kTjkzOm7Ckr4SvjHuD_UQy1I1k-VgtYFSsx5ZH0QYNnqAzFu4nQJow==', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ barcode: product_barcode }),
        }).then(result => result.json());
        const extractedInfo = res.map(item => {
          return {
            manufacturer: item.ManufacturerItemDescription._text,
          };
        });
        setProductInfo(extractedInfo);
      }
      getProductInfo();
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Date scan, barcode: {route.params?.barcode} name: {productInfo.length > 0 ? productInfo[0].manufacturer : "aaa"} </Text>
        </View>
    )
}
