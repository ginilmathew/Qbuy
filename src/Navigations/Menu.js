import { StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import DrawerContent from './DrawerContent';
import Chat from '../screens/Home/Chat';
import Checkout from '../screens/Cart/Checkout';
import AddDetails from '../screens/Cart/Checkout/AddDetails';
import Payment from '../screens/Cart/Checkout/Payment';
import Notifications from '../screens/Notifications';
import Coupons from '../screens/Cart/Checkout/Coupons';
import ProductSearchScreen from '../screens/Home/ProductSearchScreen';
import { navigationRef } from './RootNavigation';

const Drawer = createDrawerNavigator();

const Menu = () => {
    console.log(navigationRef.getCurrentRoute())

    return (

        <>
            <Drawer.Navigator
                initialRouteName='TabNavigator'
                // swipeEnabled={true}
                swipeEdgeWidth={true}
                screenOptions={{
                    headerShown: false,
                    drawerType: 'front',
                }}
                
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen name="TabNavigator" component={TabNavigator} />
                <Drawer.Screen name="Chat" component={Chat} />
                <Drawer.Screen name="Checkout" component={Checkout}/>
                <Drawer.Screen name="Payment" component={Payment}/>

                <Drawer.Screen name="AddDetails" component={AddDetails}/>
                {/* <Drawer.Screen name="Coupons" component={Coupons}/> */}


                <Drawer.Screen name="Notifications" component={Notifications}/>


            </Drawer.Navigator>
        </>
    )
}

export default Menu

const styles = StyleSheet.create({})