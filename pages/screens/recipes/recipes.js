import 'react-native-gesture-handler';
import { useState } from 'react';
import { View, Text, TextInput, Button, Pressable } from 'react-native';
import * as React from 'react'
import db_req from '../../../requests/db_req';
import {ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
const hostKeyFromAzure = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
const API_URL = `https://crawler-mg.azurewebsites.net/api/getrec?code=${hostKeyFromAzure}`

function RecipesStack() {
    const [recipe, setRecipe] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function fetchRecipe() {
        // get the products and their information
        const ingredients = await getProd();
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: ingredients,
        });
        const data = await response.json();
        return data;
    }
    // creating an array with product name, amount and expiration date,
    // and passing it to concatinated string which is the return value
    async function getProd(){
        const usersDb = await db_req("users", "regular_users", "get", {u_id:global.user_details.sub });
        const ps = usersDb[0].product
        newArrPr = []
        for(const p of ps){
            const expiryDateStr = p.exp_date
            const dateElements = expiryDateStr.split("/");
            const [dd, mm, yy] = dateElements;
            const edjustedDate = `${yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
            if(p.hasOwnProperty("name")){
                newArrPr.push({name:p.name, expDate:edjustedDate, amount: p.amount})
            }else{
                const currentProduct = await db_req("products", "barcodes", "get", { "ItemCode._text": p.barcode});
                nameOfProduct = currentProduct[0].ManufacturerItemDescription._text;
                amoun = (parseInt(p.amount) * parseInt(currentProduct[0].Quantity._text)).toString();
                newArrPr.push({name:nameOfProduct, expDate:edjustedDate, amount: currentProduct[0].UnitQty._text + " " + amoun })
            }
        }
        str = ""
        i = 1
        for (const ar of newArrPr){
            str = str + "Product's number " +i+ "name is "
            + ar.name + ", it's expiration date is "+ ar.expDate + "and its amount is" + ar.amount+".";
        }
        return str;
    }
    // generating a recipe
    const generate = function(){
        fetchRecipe().then((recipe) => {
            setRecipe(recipe);
        }).catch((error) => 
        {console.error("Error:", error);}).finally(() => {
            setIsLoading(false);
        });
    } 

    const Generator = function() {
        return (
            <View>
                <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.instruction}>Click the button bellow and wait for the recipe to be generated 
                        (using AI) based on your products and their expiration dates</Text>
                    {isLoading ? (<View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" /> </View>) : 
                        (<ScrollView style={styles.recipeContainer}>{recipe && <Text style={styles.recipeText}>{recipe.content}</Text>}</ScrollView>)}
                    <Pressable onPress={generate} style={styles.submit} disabled={isLoading}>
                        <Text style={styles.buttonText}>Generate Recipe</Text>
                    </Pressable>
                </View>

                </ScrollView>
            </View>
        )
    };
    
    return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#58ab4f', shadowColor: 'transparent' },
                        headerTintColor: '#fff', cardStyle: { backgroundColor: '#e3f2e1', }, }}>
        <Stack.Screen name='generator' component={Generator} options={{ title: "Recipes", }} />
    </Stack.Navigator>
    );
};

export default function RecipesScreen() {
    return (
        <RecipesStack />
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recipeText: {
        fontSize: 16,
        textAlign: 'left',
        marginVertical: 20,
        marginLeft:20
    },
    submit: {
        marginBottom: 15,
        marginRight: 10,
        marginLeft: 10,
        padding: 15,
        borderRadius: 10,
        borderColor: 'lightskyblue',
        backgroundColor: 'lightskyblue',
        elevation: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    generateButton: {
        marginVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instruction: {
		padding: 10,
        marginTop: 5,
		fontSize: 16,
		textAlign: 'center'
	},
    recipeContainer: {
        maxHeight: 1000, 
    },
});
  
