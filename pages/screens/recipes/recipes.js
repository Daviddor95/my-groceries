import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import * as React from 'react'
import axios from 'axios';
import db_req from '../../../requests/db_req';
const hostKeyFromAzure = "EfuCsPakhgtgH2mNo8E4l6RoFedefApFgkpb2lFE2hgCAzFuOwWgig=="
const API_URL = `https://crawler-mg.azurewebsites.net/api/getrec?code=${hostKeyFromAzure}`

export default function RecipesScreen() {
    const [recipe, setRecipe] = useState("");
    async function fetchRecipe() {
        const ingredients = await getProd();
        //console.log(JSON.parse(ingredients))
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: ingredients,
        });
        const data = await response.json();
        console.log(data)
        return data;
    }
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
        console.log(str)
        return str;
    }
    function generate(){
        fetchRecipe().then((recipe) => {
            console.log("Generated Recipe:", recipe);
            setRecipe(recipe);
        }).catch((error) => {console.error("Error:", error);});
    }

    return (<View><Button title="Generate Recipe" onPress={generate} /><Text>{recipe.content}</Text></View>);
};