import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Cart from '../screens/Cart';
import OrderPlaced from '../screens/Cart/Checkout/Payment/OrderPlaced';
import CartTest from '../screens/Cart/indextest';
import StoreScreen from '../screens/Home/StoreScreen';



const Stack = createNativeStackNavigator();

const CartNav = () => {
    return (
        <Stack.Navigator initialRouteName='Cart'  screenOptions={{ headerShown: false, detachPreviousScreen: true }} > 
            <Stack.Screen name="Cart" component={Cart}/>
            <Stack.Screen name="store" component={StoreScreen}/>

            {/* <Stack.Screen name="Cart" component={CartTest}/> */}
            {/* <Stack.Screen name="OrderPlaced" component={OrderPlaced}/> */}


           
        </Stack.Navigator>
    )
}

export default CartNav

const styles = StyleSheet.create({})