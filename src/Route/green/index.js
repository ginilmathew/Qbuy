import { StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Checkout from '../../screens/Cart/Checkout';
import AddDetails from '../../screens/Cart/Checkout/AddDetails';
import Payment from '../../screens/Cart/Checkout/Payment';
import Notifications from '../../screens/Notifications';
import Coupons from '../../screens/Cart/Checkout/Coupons';
import Chat from '../../screens/Home/Chat';
import DrawerContent from '../../Components/Common/DrawerContent';
import TabNav from './TabNav';
import ProductSearchScreen from '../../screens/Home/ProductSearchScreen';
import StoreScreen from '../../screens/_Home/StoreScreen';
import SingleProductScreen from '../../screens/_Home/SingleProductScreen';
import RestaurantScreen from '../../screens/_Home/RestaurantScreen';
import CategoryScreen from '../../screens/_Home/CategoryScreen';
import CheckoutScreen from '../../screens/_Home/CheckoutScreen';
import HomeNav from './HomeNav';
import SellWithUs from '../../screens/Drawer/SellWithUS';
import PickupAndDropoff from '../../screens/Home/PickupAndDropoff';
import OurFarms from '../../screens/Home/OurFarms';
import WorkWithPanda from '../../screens/Drawer/WorkWithPanda';
import RegisterAsAffiliate from '../../screens/Drawer/WorkWithPanda/RegisterAsAffiliate';
import CustomerFeedback from '../../screens/Drawer/CustomerFeedback';
import ApplyFranchisee from '../../screens/Drawer/ApplyFranchisee';
import About from '../../screens/Drawer/About';
//import Coupons from '../../screens/_Home/Coupons';

const Drawer = createDrawerNavigator();

const Green = () => {


    

    return (

        <>
            <Drawer.Navigator
                initialRouteName='homepage'
                // swipeEnabled={true}
                swipeEdgeWidth={true}
                screenOptions={{
                    headerShown: false,
                    drawerType: 'front',
                }}
                
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen name="homepage" component={HomeNav} />
                <Drawer.Screen name="ProductSearchScreen" component={ProductSearchScreen} />
                {/* <Drawer.Screen name="restaurant" component={RestaurantScreen} /> */}
                {/* <Drawer.Screen name="Category" component={CategoryScreen} />
                <Drawer.Screen name="checkout" component={CheckoutScreen} /> */}

                <Drawer.Screen name="Chat" component={Chat} />
                <Drawer.Screen name="SellWithUs" component={SellWithUs} />
                <Drawer.Screen name="PickupAndDropoff" component={PickupAndDropoff} />
                <Drawer.Screen name="OurFarms" component={OurFarms} />
                
                <Drawer.Screen name="WorkWithPanda" component={WorkWithPanda} />
                <Drawer.Screen name="RegisterAsAffiliate" component={RegisterAsAffiliate} />
                <Drawer.Screen name="CustomerFeedback" component={CustomerFeedback} />
                <Drawer.Screen name="ApplyFranchisee" component={ApplyFranchisee} />
                <Drawer.Screen name="About" component={About} />
                
                <Drawer.Screen name="Payment" component={Payment}/>

                <Drawer.Screen name="AddDetails" component={AddDetails}/>
                {/* <Drawer.Screen name="Coupons" component={Coupons}/> */}


                <Drawer.Screen name="Notifications" component={Notifications}/>
                {/* <Drawer.Screen name="store" component={StoreScreen} /> */}
                {/* <Drawer.Screen name="SingleItemScreen" component={SingleProductScreen} /> */}





            </Drawer.Navigator>
        </>
    )
}

export default Green

const styles = StyleSheet.create({})