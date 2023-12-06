import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Location from '../screens/Location';
import ManualLocation from '../screens/Location/ManualLocation';
import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import LocationScreen from '../screens/MyAccount/MyAddresses/LocationScreen';
import AddNewLocation from '../screens/MyAccount/MyAddresses/LocationScreen/AddNewLocation';
import VersionUpgrade from '../screens/auth/VersionUpgrade';
import PandaHome from '../screens/PandaHome';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/Auth';
import { BASE_URL } from '../config/constants';
import reactotron from 'reactotron-react-native';

const Stack = createNativeStackNavigator();



const Routes = () => {

    const userContext = useContext(AuthContext);
    const [initialScreen, setInitialScreen] = useState(null);



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
                        checkUserAddress()
                    }
                }
                else {
                    checkUserAddress()
                }

                reactotron.log({ DeviceVersion, versionInfo })

            }
            else {
                checkUserAddress()
            }



            reactotron.log({ versions })
        }

        checkVersion()
        //checkUserAddress()

    }, []);


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
            setInitialScreen('home');
            //getProfile()
            // if (!location) {
            //     getAddressList()
            // }
        }
        else {
            let location = await AsyncStorage.getItem("location")
            reactotron.log({ location })
            if (location) {
                setInitialScreen('home');
            }
            else {
                //reactotron.log("get current user location")
                setInitialScreen("Login")
            }
        }


    }



    return (
        <Stack.Navigator initialRouteName={"home"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="manual" component={ManualLocation} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="LocationScreen" component={LocationScreen} options={{ title: 'home' }} />
            <Stack.Screen name="AddNewLocation" component={AddNewLocation} />
            <Stack.Screen name="home" component={PandaHome} />
            <Stack.Screen name="version" component={VersionUpgrade} />
        </Stack.Navigator>
    )
}

export default Routes

const styles = StyleSheet.create({})