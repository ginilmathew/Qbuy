import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/Home';
import Category from '../../screens/Home/Category';
import SingleHotel from '../../screens/Home/SingleHotel';
import PickupAndDropoff from '../../screens/Home/PickupAndDropoff';
import RefferRestaurant from '../../screens/Home/RefferRestaurant';
import SellWithUs from '../../screens/Drawer/SellWithUS';
import WorkWithPanda from '../../screens/Drawer/WorkWithPanda';
import CustomerFeedback from '../../screens/Drawer/CustomerFeedback';
import ApplyFranchisee from '../../screens/Drawer/ApplyFranchisee';
import RegisterAsAffiliate from '../../screens/Drawer/WorkWithPanda/RegisterAsAffiliate';
import SingleItemScreen from '../../screens/Home/SingleItemScreen';
import OurFarms from '../../screens/Home/OurFarms';
import Wishlist from '../../screens/Wishlist';
import FashionCategory from '../../screens/FashionCategory';
import QBuyGreen from '../../screens/Home/QBuyGreen';
import CategoryScreen from '../../screens/_Home/CategoryScreen';
//import StoreScreen from '../../screens/Home/StoreScreen';
import ViewAllStore from '../../screens/Home/QBuyGreen/ViewAllStore';
import PandaContext from '../../contexts/Panda';
import reactotron from '../../ReactotronConfig';
import QBuyFashion from '../../screens/Home/QBuyFashion';
import QbuyPanda from '../../screens/Home';
import TagScreen from '../../screens/Home/TagScreen';
//import PandaHome from '../../screens/Home/pandaHome';
import PandaHome from '../../screens/_Home/PandaHome'
import QbuyfashionHome from '../../screens/Home/QBuyFashion/QbuyfashionHome';
import About from '../../screens/Drawer/About';
import RestaurantScreen from '../../screens/_Home/RestaurantScreen';
import StoreScreen from '../../screens/_Home/StoreScreen';
import SingleProductScreen from '../../screens/_Home/SingleProductScreen';
import GreenHome from '../../screens/_Home/GreenHome';
import FashionHome from '../../screens/_Home/FashionHome';
import CheckoutScreen from '../../screens/_Home/CheckoutScreen';
// import PandaHome from '../../screens/PandaHome';







const Stack = createNativeStackNavigator();

const HomeNav = () => {

    const pandaContext = useContext(PandaContext)

  



    return (
        <View style={{ flex: 1, marginBottom: 70 }}>
            <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home"
                    component={
                        pandaContext?.active === "green" ?
                            GreenHome :
                            pandaContext?.active === "panda" ?
                            PandaHome:
                                pandaContext?.active === "fashion" ?
                                    FashionHome : GreenHome
                    } />
                <Stack.Screen name="SingleHotel" component={SingleHotel} />
                <Stack.Screen name="checkout" component={CheckoutScreen} />
                {/* <Stack.Screen name="SingleItemScreen" component={SingleProductScreen} /> */}
                {/* <Stack.Screen name="restaurant" component={RestaurantScreen} />
                <Stack.Screen name="Category" component={CategoryScreen} /> */}
                <Stack.Screen name="pandaCategory" component={CategoryScreen} />
                {/* <Stack.Screen name="store" component={StoreScreen} /> */}
                {/* <Stack.Screen name="PickupAndDropoff" component={PickupAndDropoff} />
                <Stack.Screen name="OurFarms" component={OurFarms} /> */}
                {/* <Stack.Screen name="RefferRestaurant" component={RefferRestaurant} /> */}
                
                {/* <Stack.Screen name="WorkWithPanda" component={WorkWithPanda} />
                <Stack.Screen name="RegisterAsAffiliate" component={RegisterAsAffiliate} />
                <Stack.Screen name="CustomerFeedback" component={CustomerFeedback} />
                <Stack.Screen name="ApplyFranchisee" component={ApplyFranchisee} />
                <Stack.Screen name="About" component={About} /> */}
                <Stack.Screen name="ViewAllStore" component={ViewAllStore} />
                <Stack.Screen name="Wishlist" component={Wishlist} />
                <Stack.Screen name="FashionCategory" component={FashionCategory} />
                <Stack.Screen name="tagScreen" component={TagScreen}/>
            </Stack.Navigator>
        </View>
    )
}

export default HomeNav

const styles = StyleSheet.create({})