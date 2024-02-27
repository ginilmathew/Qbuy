import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../../screens/_Home/CartScreen';
import CheckoutScreen from '../../screens/_Home/CheckoutScreen';
import TabNav from './TabNav';
import CategoryScreen from '../../screens/_Home/CategoryScreen';
import RestaurantScreen from '../../screens/_Home/RestaurantScreen';
import StoreScreen from '../../screens/_Home/StoreScreen';
import SingleProductScreen from '../../screens/_Home/SingleProductScreen';
import Coupons from '../../screens/Cart/Checkout/Coupons';
import MyAddresses from '../../screens/MyAccount/MyAddresses';
import LocationScreen from '../../screens/MyAccount/MyAddresses/LocationScreen';
import AddNewLocation from '../../screens/MyAccount/MyAddresses/LocationScreen/AddNewLocation';
import AddDeliveryAddress from '../../screens/MyAccount/MyAddresses/LocationScreen/AddDeliveryAddress';
import OrderProcessing from '../../screens/_Home/OrderProcessing';
import OrderPlaced from '../../screens/Cart/Checkout/Payment/OrderPlaced';
import RefferRestaurant from '../../screens/Home/RefferRestaurant';

const Stack = createNativeStackNavigator();

const HomeNav = () => {
    return (
        <Stack.Navigator initialRouteName='dashboard' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" component={TabNav} />
            <Stack.Screen name="cartpage" component={CartScreen} />
            <Stack.Screen name="checkout" component={CheckoutScreen} />
            <Stack.Screen name="order" component={OrderProcessing} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="restaurant" component={RestaurantScreen} />
            <Stack.Screen name="store" component={StoreScreen} />
            <Stack.Screen name="SingleItemScreen" component={SingleProductScreen} />
            <Stack.Screen name="Coupons" component={Coupons}/>
            <Stack.Screen name="MyAddresses" component={MyAddresses}/>
            <Stack.Screen name="LocationScreen" component={LocationScreen}/>
            <Stack.Screen name="AddNewLocation" component={AddNewLocation}/>
            <Stack.Screen name="AddDeliveryAddress" component={AddDeliveryAddress}/>
            <Stack.Screen name="OrderPlaced" component={OrderPlaced}/>
            <Stack.Screen name="RefferRestaurant" component={RefferRestaurant}/>

        </Stack.Navigator>
    )
}

export default HomeNav

const styles = StyleSheet.create({})