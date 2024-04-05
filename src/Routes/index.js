import { AppState, NativeModules, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import customAxios from '../CustomeAxios';
import AuthContext from '../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reactotron from 'reactotron-react-native';
import Login from '../screens/auth/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Otp from '../screens/auth/Otp';
import Green from '../Route/green';
import LocationScreen from '../screens/MyAccount/MyAddresses/LocationScreen';
import AddNewLocation from '../screens/MyAccount/MyAddresses/LocationScreen/AddNewLocation';
import SplashScreenF from '../screens/SplashScreen';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
import Location from '../screens/Location';
import { BASE_URL, MAPS_KEY } from '../config/constants';
import axios from 'axios';
import VersionUpgrade from '../screens/auth/VersionUpgrade';
import DeviceInfo from 'react-native-device-info';
import CartContext from '../contexts/Cart';

const Stack = createNativeStackNavigator();

const index = () => {

    const userContext = useContext(AuthContext)
    const [initialScreen, setInitialScreen] = useState(null);
    const { env, mode } = NativeModules.RNENVConfig

    const { updateCart, cart, getCartDetails } = useContext(CartContext)


    useEffect(() => {
        async function checkVersion(){
            let data = {
                os: Platform.OS,
                type: mode
            }
            let versions = await axios.post(`${BASE_URL}common/versionnew`, data)

            if (versions?.data?.message === "Success") {
                const versionInfo = versions?.data?.data

                const DeviceVersion = await DeviceInfo.getVersion();

                //reactotron.log(DeviceVersion, versionInfo?.current_version)

                if (versionInfo?.update === true) {
                    if (parseFloat(DeviceVersion) < parseFloat(versionInfo?.current_version)) {
                        setInitialScreen("version")
                    }
                    else {
                        checkUser()
                    }
                }
                else {
                    checkUser()
                }

               

            }
            else {
                setInitialScreen("version")
            }
        }

        checkVersion()

    }, [])

    
    const onAppStateChange = useCallback(async nextAppState => {
        const token = await AsyncStorage.getItem('token');
        
        if (nextAppState === 'active') {
            if (token) {
                await getCartDetails()
                await customAxios.post('customer/login-status-update', { login_status: true })
            }
        } else {
            if (token) {
                await updateCart()
                await customAxios.post('customer/login-status-update', { login_status: false })
            }
        }
    }, [cart])

    useEffect(async () => {
        const subscription = AppState.addEventListener('change', onAppStateChange);
        return () => {
            subscription.remove();
        };
        
    }, []);


    const checkUser = async() => {
        let user = await AsyncStorage.getItem("user");
        if (user) {
            let userData = JSON.parse(user)
            //check user profile
            getuserProfile(userData?._id)

        }
        else {
            //reactotron.log("login")
            setInitialScreen('Login')
        }
    }


    async function getAddressFromCoordinates(latitude, longitude) {
        let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${MAPS_KEY}`);

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
        setInitialScreen('home');

    }


    const getuserProfile = async (id) => {
        try {
            let profile = await customAxios.get(`auth/profile/${id}`);
            await getCartDetails()
            await userContext.setUserData(profile?.data?.data);
            await AsyncStorage.setItem("user", JSON.stringify(profile?.data?.data))

            await Geolocation.getCurrentPosition(
                position => {

                    getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude)

                },
                error => {
                    Toast.show({
                        text1: error?.message,
                        type: 'error'
                    })
                    setInitialScreen('Location')
                    //reactotron.log({error})
                    //checkUserAddress()

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
        } catch (error) {
            await userContext?.setUserData(null);
            await AsyncStorage.clear();
            setInitialScreen('Login')
        }
        

    }

    if (!initialScreen) {
        return (
            <SplashScreenF />
        )
    }


    return (
        <>
        <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="home" component={Green} />
            <Stack.Screen name="LocationScreen" component={LocationScreen} options={{ title: 'home' }} />
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="version" component={VersionUpgrade} />
            <Stack.Screen name="AddNewLocation" component={AddNewLocation} />
        </Stack.Navigator>
        </>
    )
}

export default index

const styles = StyleSheet.create({})