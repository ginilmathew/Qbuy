import { StyleSheet, Text, View, SafeAreaView, Platform, AppState, PermissionsAndroid, NativeModules, Linking } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Navigation from './Navigations'
import PandaProvider from './contexts/Panda/PandaContext'
import AuthProvider from './contexts/Auth/AuthContext'
import { Provider } from 'react-redux'
import store from './Redux/store'
import LoadProvider from './contexts/Loader/loaderContext'
import Route from './Route'
import CartProvider from './contexts/Cart/CartContext'
import Toast from 'react-native-toast-message';
import AddressProvider from './contexts/Address/AddressContext'
import Geolocation from 'react-native-geolocation-service';
import RouteTest from './RouteText'

import {
    QueryClient,
    QueryClientProvider,
    focusManager
} from '@tanstack/react-query'
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging';
import reactotron from 'reactotron-react-native'
import customAxios from './CustomeAxios'
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from './Navigations/RootNavigation'
import Routes from './Routes'
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
import {requestMultiple, PERMISSIONS, requestNotifications, request} from 'react-native-permissions';



const { mode, env } = NativeModules.RNENVConfig


if (__DEV__) {
    import('react-query-native-devtools').then(({ addPlugin }) => {
        addPlugin({ queryClient });
    });
}

const queryClient = new QueryClient()


const App = (props) => {

    


    function onAppStateChange(status) {
        if (Platform.OS !== 'web') {
            focusManager.setFocused(status === 'active')
        }

        
    }

    

    useEffect(() => {
        onlineManager.setEventListener(setOnline => {
            return NetInfo.addEventListener(state => {
              setOnline(!!state.isConnected)
            })
        })
        const subscription = AppState.addEventListener('change', onAppStateChange)
        SplashScreen.hide();
        return () => subscription.remove()
    }, [])


    

    useEffect(() => {
        //getCurrentLocation()
        requestUserPermission()
        onAppBootstrap()
    }, [])

    async function onMessageReceived(message) {

        const { notification } = message


        // Display a notification
        await notifee.displayNotification({
            title: notification?.title,
            body: notification?.body,
            data: message?.data,
            android: message?.data?.image_link ? {
                channelId: 'default',
                importance: AndroidImportance.HIGH,
                style: { type: AndroidStyle.BIGPICTURE, picture: message?.data?.image_link },
                sound: 'default',
                //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            } : {
                channelId: 'default',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    async function onAppBootstrap() {
        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            sound: 'default',
            importance: AndroidImportance.HIGH,
            
        });

        await notifee.createChannel({
            id: 'general',
            name: 'General Notifications',
            sound: 'default',
            importance: AndroidImportance.HIGH,
            
        });

        messaging()
        .subscribeToTopic(`${mode}_${env}_customer_general`)
        .then(() => console.log('Subscribed to topic!'));
        // Register the device with FCM
        let userDetails = await AsyncStorage.getItem("user");
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();

        //console.log({ token })

        if (userDetails) {
            let user = JSON.parse(userDetails)
            // Get the token


            let data = {
                id: user?._id,
                token: token
            }
            customAxios.post('auth/update-devicetoken', data)
                .then(response => {
                })
                .catch(err => {
                })

        }

    }


    useEffect(() => {
        const unsubscribe = messaging().onMessage(onMessageReceived);

        return unsubscribe;
    }, []);

    

    async function requestUserPermission() {

        



        if (Platform.OS === 'android') {
            let permissions = await requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.POST_NOTIFICATIONS])
            // const status = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]);
            
        }
        else{
            let location = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);


            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
            if (enabled) {
            }
            //const status = await Geolocation.requestAuthorization('whenInUse');
        }
       
        //getCurrentLocation()
    }

    

    const linking = {
        prefixes: ['qbuypanda://', 'referBy://'],
    };
     



    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <LoadProvider>
                    <AuthProvider>
                        <AddressProvider>
                            <PandaProvider>
                                <CartProvider>
                                    {/* <AppWithTour/> */}
                                    <NavigationContainer ref={navigationRef} linking={linking} fallback={<Text>Loading...</Text>}>
                                        {/* <RouteTest /> */}
                                        <Routes />
                                    </NavigationContainer>
                                    
                                    <Toast
                                        position='bottom'
                                        bottomOffset={20}
                                    />
                                </CartProvider>
                            </PandaProvider>
                        </AddressProvider>
                    </AuthProvider>
                </LoadProvider>

            </Provider>
        </QueryClientProvider>
    )
}

export default App

const styles = StyleSheet.create({})