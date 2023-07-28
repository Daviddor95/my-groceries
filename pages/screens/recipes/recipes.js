import { useState } from 'react';
import { View, Text, TextInput, Button, Pressable } from 'react-native';
import * as React from 'react'
import db_req from '../../../requests/db_req';
import {ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
const hostKeyFromAzure = "EfuCsPakhgtgH2mNo8E4l6RoFedefApFgkpb2lFE2hgCAzFuOwWgig=="
const API_URL = `https://crawler-mg.azurewebsites.net/api/getrec?code=${hostKeyFromAzure}`

export default function RecipesScreen() {
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
    function generate(){
        fetchRecipe().then((recipe) => {
            setRecipe(recipe);
        }).catch((error) => 
        {console.error("Error:", error);}).finally(() => {
            setIsLoading(false);
        });
    }

    return (
    <View>
        <View  style={styles.container}>
        <Pressable onPress={generate} style={styles.submit}>
            <Text style={styles.buttonText}>Generate Recipe</Text>
        </Pressable>
        </View>
        
        {isLoading ? (<View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" /> </View>) : 
            (<ScrollView>{recipe && <Text style={styles.recipeText}>{recipe.content}</Text>}</ScrollView>)}
            </View>);
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
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
        flex: 1,
        marginTop: 35,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});
  