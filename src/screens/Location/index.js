import { NativeModules, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import Lottie from 'lottie-react-native';
import CustomButton from '../../Components/CustomButton';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../contexts/Auth';
import reactotron from 'reactotron-react-native';
import AddressContext from '../../contexts/Address';
import LoadingModal from '../../Components/LoadingModal';


const { mode } = NativeModules.RNENVConfig

const Location = ({navigation}) => {

    const userContext = useContext(AuthContext)
    const addressContext = useContext(AddressContext)
    const [loading, setLoading] = useState(false)



    const getCurrentLocation = useCallback(async () => {
        setLoading(true)
        if (Platform.OS === 'ios') {
            const status = await Geolocation.requestAuthorization('whenInUse');
            reactotron.log({status})
            if (status === "granted") {
                getPosition()
            } else {
                setLoading(false)
                Toast.show({
                    type: 'error',
                    text1: 'Location permission denied by user.'
                });

            }

        }
        else {
            if (Platform.OS === 'android' && Platform.Version < 23) {
                getPosition()
            }

            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

            );

            if (hasPermission) {
                getPosition()
            }

            const status = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

            );

            if (status === PermissionsAndroid.RESULTS.GRANTED) {
                getPosition()

            }

            if (status === PermissionsAndroid.RESULTS.DENIED) {
                setLoading(false)
                Toast.show({
                    type: 'error',
                    text1: 'Location permission denied by user.'
                });
            }
            else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                setLoading(false)
                Toast.show({
                    type: 'error',
                    text1: 'Location permission revoked by user.',
                });
            }
        }

    }, [])


    const getPosition = async () => {
        await Geolocation.getCurrentPosition(
            position => {

                //getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude)

                getAddressFromCoordinates(position?.coords?.latitude, position?.coords?.longitude);
                // userContext.setLocation([position?.coords?.latitude, position.coords?.longitude])
            },
            error => {
                setLoading(false)
                Toast.show({
                    type: 'error',
                    text1: error
                });

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


            addressContext.setCurrentAddress(Value);

            let location = {
                latitude: latitude,
                longitude: longitude,
                address: Value?.location
            }


            AsyncStorage.setItem("location", JSON.stringify(location))
            userContext.setLocation([latitude, longitude]);
            userContext.setCurrentAddress(Value?.location)
            setLoading(false)
            navigation.navigate('LocationScreen', { mode: 'home' });

    }


    const manualLocation = () => {
        navigation.navigate("AddNewLocation", { mode: 'home' })
    }




    return (
        <SafeAreaView>
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>What's your location?</Text>
                <Text style={{ fontSize: 16, fontWeight: '300', letterSpacing: 2 }}>We need your location to show available Stores/Restaurants and Products</Text>
                <Lottie
                    style={{ height: '70%' }}
                    source={require('../../Lottie/Building.json')}
                    autoPlay loop
                />
                <View style={{ alignItems: 'center' }}>
                    <CustomButton
                        width={"100%"}
                        onPress={getCurrentLocation}
                        bg={mode === 'fashion' ? '#FF7190' : '#58D36E'}
                        label={'Allow Location Access?'}
                        mt={5}
                        mb={20}
                    //loading={ loader }
                    />
                    <TouchableOpacity onPress={manualLocation}>
                        <View>
                            <Text style={{ color: mode === 'fashion' ? '#FF7190' : '#58D36E', fontWeight: 'bold' }}>Enter Location Manually</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
            <LoadingModal isVisible={loading} />
        </SafeAreaView>
    )
}

export default Location

const styles = StyleSheet.create({})