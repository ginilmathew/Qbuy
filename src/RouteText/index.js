/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { AppState, PermissionsAndroid, Platform, StyleSheet, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useDispatch, useSelector } from 'react-redux';
import { navigationRef } from '../Navigations/RootNavigation';
import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
//import Menu from './Menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenF from '../screens/SplashScreen';
import AuthContext from '../contexts/Auth';
import CartContext from '../contexts/Cart';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';
import customAxios from '../CustomeAxios';
import LoaderContext from '../contexts/Loader';
import { isObject } from 'lodash'
import Toast from 'react-native-toast-message';
import axios from 'axios';
import reactotron from '../ReactotronConfig';
import LoadingModal from '../Components/LoadingModal';
import LocationScreen from '../screens/MyAccount/MyAddresses/LocationScreen';
import AddNewLocation from '../screens/MyAccount/MyAddresses/LocationScreen/AddNewLocation';
import Green from '../Route/green';
import PandaContext from '../contexts/Panda';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import CommonUpdateModal from '../Components/CommonUpdateModal';
import { NativeModules } from 'react-native'
import AddDeliveryAddress from '../screens/MyAccount/MyAddresses/LocationScreen/AddDeliveryAddress';
import notifee, { EventType } from '@notifee/react-native';

const { env, mode } = NativeModules.RNENVConfig


// import Menu from './Menu';


const Stack = createNativeStackNavigator();

const RouteTest = () => {

    const DeviceVersion = DeviceInfo.getVersion();
    const userContext = useContext(AuthContext);
    const cartContext = useContext(CartContext);
    const loadingContext = useContext(LoaderContext);
    const [location, setLocation] = useState(null);
    const { active } = useContext(PandaContext);
    const [user, setUserDetails] = useState(null);
    const [versionUpdate, setversionUpdate] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [initialScreen, setInitialScreen] = useState(null);




    // async function requestUserPermission() {
    //     if(Platform.OS === 'ios'){
    //         const authStatus = await messaging().requestPermission();
    //         const enabled =
    //             authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //             authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    //         if (enabled) {
    //             console.log('Authorization status:', authStatus);
    //         }
    //     }
    //     else{
    //         PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    //     }

    //     let user = JSON.parse(await AsyncStorage.getItem("user"))
    //     //if (authorizationStatus) {

    //         await messaging().registerDeviceForRemoteMessages();
    //         const token = await messaging().getToken();



    //         if (user?._id) {
    //             let data = {
    //                 id: user?._id,
    //                 token
    //             }
    //             await axios.post(`${API_URL}auth/adddevicetoken`, data)
    //                 .then(async response => {
    //                 })
    //                 .catch(async error => {
    //                 })
    //         }


    // }

    // async function onMessageReceived(message) {
    //     // Request permissions (required for iOS)
    //     await notifee.requestPermission()

    //     // Create a channel (required for Android)
    //     const channelId = await notifee.createChannel({
    //         id: 'default',
    //         name: 'Default Channel',
    //     });

    //     // Display a notification
    //     await notifee.displayNotification({
    //         title: message?.notification?.title,
    //         body: message?.notification?.body,
    //         data: message?.data,
    //         android: {
    //             channelId,
    //             smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
    //             // pressAction is needed if you want the notification to open the app when pressed
    //             pressAction: {
    //                 id: 'default',
    //             },
    //         },
    //     });
    // }

    // useEffect(() => {
    //     // Assume a message-notification contains a "type" property in the data payload of the screen to open

    //     messaging().onNotificationOpenedApp(remoteMessage => {
       
          

    //     });

    //     // Check whether an initial notification is available
    //     messaging()
    //         .getInitialNotification()
    //         .then(remoteMessage => {
                
    //         });

    //     messaging().onMessage(onMessageReceived);
    //     messaging().setBackgroundMessageHandler(onMessageReceived);
    // }, []);


    useEffect(() => {

        checkUserAddress()

        //getCurrentLocation();

    }, []);


    const getCureentDeviceLocation = async () => {
        await Geolocation.getCurrentPosition(
            async position => {
                if (position) {

                    let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${position?.coords?.latitude},${position.coords?.longitude}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`);



                    //let address = getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude);
                    let location = {
                        latitude: position?.coords?.latitude,
                        longitude: position.coords?.longitude,
                        address: response?.data?.results[0]?.formatted_address
                    }

                    await AsyncStorage.setItem("location", JSON.stringify(location))
                    userContext.setLocation([position?.latitude, position?.longitude]);
                    userContext.setCurrentAddress(response?.data?.results[0]?.formatted_address)
                    setInitialScreen('green');
                }
                else {
                    let user = await AsyncStorage.getItem("user");
                    if (user) {
                        setInitialScreen('AddNewLocation')
                    }
                    else {
                        setInitialScreen("Login")
                    }

                }
            },
            async error => {
                let user = await AsyncStorage.getItem("user");
                if (user) {
                    setInitialScreen('AddNewLocation')
                }
                else {
                    setInitialScreen("Login")
                }
            },
            {
                accuracy: {
                    android: 'high',
                    ios: 'best',
                },
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 0,
                forceRequestLocation: true,
                forceLocationManager: false,
                showLocationDialog: true,
            },
        )
    }


    const checkUserAddress = async () => {
        let location = await AsyncStorage.getItem("location")
        reactotron.log({ location })
        if (location) {
            let locationData = JSON.parse(location)
            reactotron.log({ locationData })
            userContext.setLocation([locationData?.latitude, locationData?.longitude]);
            userContext.setCurrentAddress(locationData?.address)
        }
        let user = await AsyncStorage.getItem("user");
        if (user) {
            getProfile()
            getCartDetails()
            getAddressList()
        }
        else {
            let location = await AsyncStorage.getItem("location")
            reactotron.log({ location })
            if (location) {
                let locationData = JSON.parse(location)
                reactotron.log({ locationData })
                userContext.setLocation([locationData?.latitude, locationData?.longitude]);
                userContext.setCurrentAddress(locationData?.address)
                setInitialScreen('green');
            }
            else {
                reactotron.log("get current user location")
                getCureentDeviceLocation()
            }
        }


    }





    const VersionManagement = (data) => {
        SplashScreen.hide();
        if (DeviceVersion * 1 < data?.current_version * 1) {
            if (DeviceVersion * 1 < data?.current_version * 1 && data?.update) {
                setversionUpdate(true);
                setForceUpdate(true);
            } else if (DeviceVersion * 1 < data?.current_version * 1 && !data?.update) {
                setversionUpdate(true);
            }
        } else {
            setInitialScreen('green');
        }
    }


    const ColoseUpdateModal = useCallback(() => {
        setversionUpdate(false);
        setInitialScreen('green');
    }, [versionUpdate]);

    const getProfile = useCallback(async () => {
        loadingContext.setLoading(true);
        await customAxios.get('customer/customer-profile')
            .then(async response => {
                loadingContext.setLoading(false);
                userContext.setUserData(response?.data?.data);
                setUserDetails(response?.data?.data)


                VersionManagement(response?.data?.data)

                // setInitialScreen('green');
                //setInitialScreen('green')
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error,
                });
                // setInitialScreen('Login');
                await AsyncStorage.clear()
                loadingContext.setLoading(false);
            })
    }, [])

    const getCartDetails = useCallback(async () => {
        if (user) {
            loadingContext.setLoading(true);
            let value = {
                user_id: user?._id,
                type: active,
            }
            await customAxios.post('customer/cart/newshow-cart', value)
                .then(async response => {
                    if (isObject(response?.data?.data)) {
                        cartContext.setCart(response?.data?.data)
                    }
                    else {
                        await AsyncStorage.removeItem('cartId')
                    }
                    loadingContext.setLoading(false);

                })
                .catch(async error => {
                    Toast.show({
                        type: 'error',
                        text1: error,
                    });
                    loadingContext.setLoading(false);
                })
        }

    }, [user])

    const getAddressList = async () => {
        loadingContext.setLoading(true)
        await customAxios.get('customer/address/list')
            .then(async response => {
                if (response?.data?.data?.length > 0) {
                    if (response?.data?.data?.length === 1) {
                        await userContext.setLocation([response?.data?.data?.[0]?.area?.latitude, response?.data?.data?.[0]?.area?.longitude])
                        await userContext?.setCurrentAddress(response?.data?.data?.[0]?.area?.address)
                        setTimeout(() => {
                            setInitialScreen('green');
                        }, 200);
                    }
                    else {
                        let defaultAdd = response?.data?.data?.find(add => add?.default === true)
                        if (defaultAdd) {
                            await userContext.setLocation([defaultAdd?.area?.latitude, defaultAdd?.area?.longitude])
                            await userContext?.setCurrentAddress(defaultAdd?.area?.address)
                            setTimeout(() => {
                                setInitialScreen('green');
                            }, 200);
                        }
                        else {
                            await userContext.setLocation([response?.data?.data?.[0]?.area?.latitude, response?.data?.data?.[0]?.area?.longitude])
                            await userContext?.setCurrentAddress(response?.data?.data?.[0]?.area?.address)
                            setTimeout(() => {
                                setInitialScreen('green');
                            }, 200);
                        }
                    }


                }
                else {
                    let location = await AsyncStorage.getItem("location")
                    if (location) {
                        let locationData = JSON.parse(location)
                        userContext.setLocation([locationData?.latitude, locationData?.longitude]);
                        userContext.setCurrentAddress(locationData?.address)
                        setInitialScreen('green');
                    }
                    else {
                        getCureentDeviceLocation()
                    }
                }

            })
            .catch(async error => {
                //getAddressFromCoordinates()
                Toast.show({
                    type: 'error',
                    text1: error,
                });

            })
            .finally(() => {
                loadingContext.setLoading(false)
            })
    }



    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const subscription = AppState.addEventListener('change', async nextAppState => {

                if (nextAppState === 'active') {

                    await customAxios.post('customer/login-status-update', { login_status: true })

                } else {
                    await customAxios.post('customer/login-status-update', { login_status: false })

                }
            });
            return () => {
                subscription.remove();
            };
        }
    }, []);


 



    if (!initialScreen) {
        SplashScreen.hide()
        return (
            <>
                <SplashScreenF />
                {versionUpdate && <CommonUpdateModal isopen={versionUpdate} CloseModal={ColoseUpdateModal} ForceUpdate={forceUpdate} />}
            </>

        )
    }



    return (
        <>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>

                    {/* <Stack.Screen name="SplashScreen" component={SplashScreenF} /> */}
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Otp" component={Otp} />
                    <Stack.Screen name="LocationScreen" component={LocationScreen} options={{ title: 'home' }} />
                    <Stack.Screen name="AddNewLocation" component={AddNewLocation} />
                    {/* <Stack.Screen name="panda" component={Panda} />
                    <Stack.Screen name="fashion" component={Fashion} /> */}
                    <Stack.Screen name="green" component={Green} />
                    <Stack.Screen name="AddDeliveryAddress" component={AddDeliveryAddress} />
                </Stack.Navigator>
            </NavigationContainer>
            {/* <LoadingModal isVisible={true} /> */}

            {versionUpdate && <CommonUpdateModal isopen={versionUpdate} CloseModal={ColoseUpdateModal} />}
        </>
    )
}

export default RouteTest

const styles = StyleSheet.create({})
