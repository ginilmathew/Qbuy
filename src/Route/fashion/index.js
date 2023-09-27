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

const Drawer = createDrawerNavigator();

const Fashion = () => {
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
                <Drawer.Screen name="TabNavigator" component={TabNav} />
                <Drawer.Screen name="ProductSearchScreen" component={ProductSearchScreen} />

                <Drawer.Screen name="Chat" component={Chat} />
                <Drawer.Screen name="Checkout" component={Checkout}/>
                <Drawer.Screen name="Payment" component={Payment}/>

                <Drawer.Screen name="AddDetails" component={AddDetails}/>
                <Drawer.Screen name="Coupons" component={Coupons}/>


                <Drawer.Screen name="Notifications" component={Notifications}/>



            </Drawer.Navigator>
        </>
    )
}

export default Fashion

const styles = StyleSheet.create({})