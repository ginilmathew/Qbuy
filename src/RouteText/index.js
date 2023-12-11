/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { AppState, PermissionsAndroid, Platform, StyleSheet, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { NavigationContainer, TabActions, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useDispatch, useSelector } from 'react-redux';
import * as RootNavigation from '../Navigations/RootNavigation';
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
import Checkout from '../screens/Cart/Checkout';
import MyAddresses from '../screens/MyAccount/MyAddresses';
import Location from '../screens/Location';
import ManualLocation from '../screens/Location/ManualLocation';
import { BASE_URL } from '../config/constants';
import VersionUpgrade from '../screens/auth/VersionUpgrade';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../helper/productHelper';
// import OrderPlaced from '../screens/Cart/Checkout/Payment/OrderPlaced';

const { env, mode } = NativeModules.RNENVConfig


// import Menu from './Menu';


const Stack = createNativeStackNavigator();

const RouteTest = () => {

    const DeviceVersion = DeviceInfo.getVersion();
    const userContext = useContext(AuthContext);
    const cartContext = useContext(CartContext);
    const loadingContext = useContext(LoaderContext);
    const { active } = useContext(PandaContext);
    const [user, setUserDetails] = useState(null);
    const [versionUpdate, setversionUpdate] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [initialScreen, setInitialScreen] = useState(null);
    const navigation = useNavigation()







    useEffect(() => {

        async function checkVersion() {
            let versions = await axios.get(`${BASE_URL}common/version`)

            if (versions?.data?.message === "Success") {
                const versionInfo = versions?.data?.data

                const DeviceVersion = await DeviceInfo.getVersion();

                if (versionInfo?.update === true) {
                    if (parseFloat(DeviceVersion) < parseFloat(versionInfo?.current_version)) {
                        setInitialScreen("version")
                    }
                    else {
                        currentPosition()
                    }
                }
                else {
                    currentPosition()
                }

                reactotron.log({ DeviceVersion, versionInfo })

            }
            else {
                currentPosition()
            }



            reactotron.log({ versions })
        }

        checkVersion()
        //checkUserAddress()

    }, []);


    async function getAddressFromCoordinates(latitude, longitude) {
        let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`);



            let Value = {
                location: response?.data?.results[0]?.formatted_address,
                city: response?.data?.results[0]?.address_components?.filter(st =>
                    st.types?.includes('locality')
                )[0]?.long_name,
                latitude: latitude,
                longitude: longitude,
            };


            //addressContext.setCurrentAddress(Value);

            let location = {
                latitude: latitude,
                longitude: longitude,
                address: Value?.location
            }


            await AsyncStorage.setItem("location", JSON.stringify(location))
            userContext.setLocation([latitude, longitude]);
            userContext.setCurrentAddress(response?.data?.results[0]?.formatted_address)
            let user = await AsyncStorage.getItem("user");
            if (user) {
                setInitialScreen('green');
                getProfile()
                getAddressList()
            }
            else {
                setInitialScreen('green');
            }

    }




    const currentPosition = async() => {
        await Geolocation.getCurrentPosition(
            position => {

                reactotron.log({position})

                //getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude)

                getAddressFromCoordinates(position?.coords?.latitude, position?.coords?.longitude);
                // userContext.setLocation([position?.coords?.latitude, position.coords?.longitude])
                
            },
            error => {
                checkUserAddress()

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
        );
    }


    const checkUserAddress = async () => {

        
        
        let location = await AsyncStorage.getItem("location")
        reactotron.log({ location })
        //return false;
        if (location) {
            let locationData = JSON.parse(location)
            userContext.setLocation([locationData?.latitude, locationData?.longitude]);
            userContext.setCurrentAddress(locationData?.address)
        }
        let user = await AsyncStorage.getItem("user");
        if (user) {
            setInitialScreen('green');
            getProfile()
            //if (!location) {
                getAddressList()
            //}
        }
        else {
            let location = await AsyncStorage.getItem("location")
            reactotron.log({ location })
            if (location) {
                setInitialScreen('green');
            }
            else {
                //reactotron.log("get current user location")
                setInitialScreen("Login")
            }
        }


    }




    const getProfile = useCallback(async () => {
        loadingContext.setLoading(true);
        await customAxios.get('customer/customer-profile')
            .then(async response => {
                loadingContext.setLoading(false);
                userContext.setUserData(response?.data?.data);
                setUserDetails(response?.data?.data)
                getCartDetails(response?.data?.data)


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

    const getCartDetails = async (user) => {
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

    const getAddressList = async () => {
        loadingContext.setLoading(true)
        await customAxios.get('customer/address/list')
            .then(async response => {
                if (response?.data?.data?.length > 0) {
                    if (response?.data?.data?.length === 1) {
                        cartContext.setDefaultAddress(response?.data?.data?.[0])
                        //await userContext.setLocation([response?.data?.data?.[0]?.area?.latitude, response?.data?.data?.[0]?.area?.longitude])
                       // await userContext?.setCurrentAddress(response?.data?.data?.[0]?.area?.address)
                        // let location = {
                        //     latitude: response?.data?.data?.[0]?.area?.latitude,
                        //     longitude: response?.data?.data?.[0]?.area?.longitude,
                        //     address: response?.data?.data?.[0]?.area?.address
                        // }
                        // await AsyncStorage.setItem("location", JSON.stringify(location))
                        // setTimeout(() => {
                        //     setInitialScreen('green');
                        // }, 200);
                    }
                    else {
                        let defaultAdd = response?.data?.data?.find(add => add?.default === true)
                        if (defaultAdd) {
                            cartContext.setDefaultAddress(defaultAdd)
                            // await userContext.setLocation([defaultAdd?.area?.latitude, defaultAdd?.area?.longitude])
                            // await userContext?.setCurrentAddress(defaultAdd?.area?.address)
                            // let location = {
                            //     latitude: defaultAdd?.area?.latitude,
                            //     longitude: defaultAdd?.area?.longitude,
                            //     address: defaultAdd?.area?.address
                            // }
                            // await AsyncStorage.setItem("location", JSON.stringify(location))
                            // setTimeout(() => {
                            //     setInitialScreen('green');
                            // }, 200);
                        }
                        else {
                            cartContext.setDefaultAddress(response?.data?.data?.[0])
                            // await userContext.setLocation([response?.data?.data?.[0]?.area?.latitude, response?.data?.data?.[0]?.area?.longitude])
                            // await userContext?.setCurrentAddress(response?.data?.data?.[0]?.area?.address)
                            // let location = {
                            //     latitude: response?.data?.data?.[0]?.area?.latitude,
                            //     longitude: response?.data?.data?.[0]?.area?.longitude,
                            //     address: response?.data?.data?.[0]?.area?.address
                            // }
                            // await AsyncStorage.setItem("location", JSON.stringify(location))
                            // setTimeout(() => {
                            //     setInitialScreen('green');
                            // }, 200);
                        }
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


    useEffect(() => {
        return notifee.onForegroundEvent(({ type, detail }) => {
            reactotron.log({ detail })
            switch (type) {
                case EventType.DISMISSED:
                    console.log('User dismissed notification', detail.notification);
                    break;
                case EventType.PRESS:

                    if (detail?.notification?.data?.type === "admin" && detail?.notification?.data?.product_url) {
                        getProductDetails(detail?.notification?.data?.product_url)
                    }
                    else if(detail?.notification?.data?.mode === "order"){
                        const jumpToAction = TabActions.jumpTo('order');
                        navigation.dispatch(jumpToAction);
                        //RootNavigation.navigate("green", { screen: 'order' })
                    }
                    reactotron.log('User pressed notification', detail.notification);
                    break;
            }
        });
    }, []);


    const getProductDetails = async (id) => {
        let products = await customAxios.get(`customer/product/${id}`);
        let product = getProduct(products?.data?.data);

        //reactotron.log({product})
        RootNavigation.navigate("green", { screen: 'TabNavigator', params: { screen: 'home', params: { screen: 'SingleItemScreen', params: { item: product } } } })
    }






    if (!initialScreen) {
        SplashScreen.hide()
        return (
            <>
                <SplashScreenF />
            </>

        )
    }



    return (
        <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>

            {/* <Stack.Screen name="SplashScreen" component={SplashScreenF} /> */}
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="manual" component={ManualLocation} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="LocationScreen" component={LocationScreen} options={{ title: 'home' }} />
            <Stack.Screen name="AddNewLocation" component={AddNewLocation} />
            {/* <Stack.Screen name="OrderPlaced" component={OrderPlaced}/> */}
            {/* <Stack.Screen name="panda" component={Panda} />
            <Stack.Screen name="fashion" component={Fashion} /> */}
            <Stack.Screen name="green" component={Green} />
            <Stack.Screen name="AddDeliveryAddress" component={AddDeliveryAddress} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="MyAddresses" component={MyAddresses} />
            <Stack.Screen name="version" component={VersionUpgrade} />
        </Stack.Navigator>
    )
}

export default RouteTest

const styles = StyleSheet.create({})
