import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ArticlesList from './articles_list';


const Stack = createStackNavigator();

export default function ArticlesScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Articles List" component={ArticlesList} />
        </Stack.Navigator>
    )
}
