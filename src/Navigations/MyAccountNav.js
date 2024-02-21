import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyAccount from '../screens/MyAccount';
import MyAddresses from '../screens/MyAccount/MyAddresses';
import LocationScreen from '../screens/MyAccount/MyAddresses/LocationScreen';
import AddDeliveryAddress from '../screens/MyAccount/MyAddresses/LocationScreen/AddDeliveryAddress';
import PandaCoins from '../screens/MyAccount/PandaCoins';
import AffiliateBonus from '../screens/MyAccount/AffiliateBonus';
import AddNewLocation from '../screens/MyAccount/MyAddresses/LocationScreen/AddNewLocation';
import EditProfile from '../screens/MyAccount/EditProfile';
import FashionCategory from '../screens/FashionCategory';
import CategoryScreen from '../screens/Home/CategoryScreen';
import SingleItemScreen from '../screens/Home/SingleItemScreen';
import SingleHotel from '../screens/Home/SingleHotel';
import StoreScreen from '../screens/Home/StoreScreen';
import Wishlist from '../screens/Wishlist';


const Stack = createNativeStackNavigator();

const MyAccountNav = () => {
    return (
        <Stack.Navigator initialRouteName='MyAccount'  screenOptions={{ headerShown: false }}> 
            <Stack.Screen name="MyAccount" component={MyAccount}/>
            {/* <Stack.Screen name="MyAddresses" component={MyAddresses}/> */}
            {/* <Stack.Screen name="LocationScreen" component={LocationScreen}/> */}
            {/* <Stack.Screen name="AddNewLocation" component={AddNewLocation}/> */}
            {/* <Stack.Screen name="AddDeliveryAddress" component={AddDeliveryAddress}/> */}
            <Stack.Screen name="PandaCoins" component={PandaCoins}/>
            <Stack.Screen name="AffiliateBonus" component={AffiliateBonus}/>
            <Stack.Screen name="EditProfile" component={EditProfile}/>
            <Stack.Screen name="FashionCategory" component={FashionCategory}/>
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="SingleItemScreen" component={SingleItemScreen} />
            <Stack.Screen name="SingleHotel" component={SingleHotel} />
            <Stack.Screen name="store" component={StoreScreen} />
            <Stack.Screen name="Wishlist" component={Wishlist} />

        </Stack.Navigator>
    )
}

export default MyAccountNav

const styles = StyleSheet.create({})