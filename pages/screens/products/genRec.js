import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import db_req from '../../../requests/db_req';
const hostKeyFromAzure = "EfuCsPakhgtgH2mNo8E4l6RoFedefApFgkpb2lFE2hgCAzFuOwWgig=="
const API_URL = `https://crawler-mg.azurewebsites.net/api/getrec?code=${hostKeyFromAzure}`

const RecipeGenerator = () => {
    const [recipe, setRecipe] = useState("");
    async function fetchRecipe() {
        const ingredients = await getProd();
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({ ingredients }),
        });
        const data = await response.json();
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
                amoun = (parseInt(p.amount) * parseInt(p.Quantity._text)).toString();
                newArrPr.push({name:nameOfProduct, expDate:edjustedDate, amount: p.UnitQty._text + " " + amoun })
            }
        }
        return newArrPr;
    }
    function generate(){
        fetchRecipe().then((recipe) => {
            console.log("Generated Recipe:", recipe);
            setRecipe(recipe);
        }).catch((error) => {console.error("Error:", error);});
    }
    

    return (<View><Text>{recipe}</Text><Button title="Generate Recipe" onPress={generate} /></View>);
};

export default RecipeGenerator;
