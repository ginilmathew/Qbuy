/* eslint-disable prettier/prettier */
import { ScrollView, StyleSheet, Text, Button, View, Alert, PermissionsAndroid, Platform, useWindowDimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Foundation from 'react-native-vector-icons/Foundation'
import HeaderWithTitle from '../../../../Components/HeaderWithTitle'
import CommonTexts from '../../../../Components/CommonTexts'
import CustomButton from '../../../../Components/CustomButton'
import MapView, { Marker } from 'react-native-maps';
import PandaContext from '../../../../contexts/Panda'
import Geolocation, { getCurrentPosition } from 'react-native-geolocation-service';
import axios from 'axios'
import AddressContext from '../../../../contexts/Address'
import reactotron from 'reactotron-react-native'
import CartContext from '../../../../contexts/Cart'
import AuthContext from '../../../../contexts/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native'

const LocationScreen = ({ route, navigation }) => {

    const { mode } = route.params



    const homeNavigationbasedIndex = navigation.getState()


    const cartContext = useContext(CartContext);
    const contextPanda = useContext(PandaContext);
    // const loadingContex = useContext(LoaderContext);
    const userContext = useContext(AuthContext);
    const addressContext = useContext(AddressContext);


    let active = contextPanda.active;
    const { editAddress = {} } = route?.params || {};
    const { width, height } = useWindowDimensions();
    const mapRef = useRef()
    const [location, setLocation] = useState({ latitude: editAddress?.area?.latitude || 0, longitude: editAddress?.area?.longitude || 0 })
    const [address, setAddress] = useState(editAddress?.area?.address || '');
    const [city, setCity] = useState('');

    async function fetchData() {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
        }
        if (Platform.OS === 'ios') {
            const hasPermission = await hasPermissionIOS();
            return hasPermission;
        }
    }

    const hasPermissionIOS = async () => {
        const openSetting = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings');
            });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status === 'granted') {
            return true;
        }
        if (status === 'denied') {
            //Alert.alert('Location permission denied');
        }
        if (status === 'disabled') {
            Alert.alert(
                `Turn on Location Services to allow  to determine your location.`,
                '',
                [
                    { text: 'Go to Settings', onPress: openSetting },
                    { text: "Don't Use Location", onPress: () => { } },
                ],
            );
        }
        return false;
    };

    useEffect(() => {

        if (homeNavigationbasedIndex?.index !== 1) {
            fetchData().then(() => {
                Geolocation.getCurrentPosition(
                    position => {
                        getAddressFromCoordinates(addressContext?.currentAddress?.latitude ? addressContext?.currentAddress?.latitude : position?.coords?.latitude, addressContext?.currentAddress?.longitude ? addressContext?.currentAddress?.longitude : position?.coords?.longitude);
                        setLocation({ latitude: addressContext?.currentAddress?.latitude ? addressContext?.currentAddress?.latitude : position.coords.latitude, longitude: addressContext?.currentAddress?.longitude ? addressContext?.currentAddress?.longitude : position.coords.longitude })
                    },
                    error => {
                        console.log(error.code, error.message)
                    },
                    {
                        showLocationDialog: true,
                        enableHighAccuracy: true,
                        timeout: 20000,
                        maximumAge: 0
                    }
                )
            })
        }

    }, [homeNavigationbasedIndex?.index])

    const onConfirm = useCallback(async () => {

        if (!userContext?.userData) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'green' },
                    ],
                })
            )
            return false;
        }
        //below code for checking the location is denied condition
        if (homeNavigationbasedIndex?.index === 1 && mode !== "currentlocation") {
            let value = {
                area: {
                    location: addressContext?.currentAddress?.location,
                    address: addressContext?.currentAddress?.city
                }
            }
            //cartContext.setDefaultAddress(value);
            userContext.setLocation([addressContext?.currentAddress?.latitude, addressContext?.currentAddress?.longitude]);
            const token = await AsyncStorage.getItem("token");
            if (token) {
                navigation.navigate('green')
            } else {
                navigation.navigate('Login')
            }

        } else {

            let locationData = {
                location: addressContext?.currentAddress?.location ? addressContext?.currentAddress?.location : address,
                city: addressContext?.currentAddress?.city ? addressContext?.currentAddress?.city : city,
                latitude: addressContext?.currentAddress?.latitude ? addressContext?.currentAddress?.latitude : location?.latitude,
                longitude: addressContext?.currentAddress?.longitude ? addressContext?.currentAddress?.longitude : location?.longitude,
            }


            navigation.navigate('AddDeliveryAddress', { item: { ...editAddress, ...locationData } })
        }




    }, [location, address, city, addressContext?.currentAddress, addressContext?.location, navigation])

    const addNewAddress = useCallback(() => {
        navigation.navigate('AddNewLocation')
    }, [])

    const myApiKey = "Key Received from Google map"

    function getAddressFromCoordinates(latitude, longitude) {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(response => {
            setAddress(response?.data?.results[0]?.formatted_address)
            let locality = response?.data?.results?.[0]?.address_components?.find(add => add.types.includes('locality'));
            setCity(locality?.long_name)
            // addressContext?.setCurrentAddress(null)
            // addressContext?.setLocation(null)
            let value = {
                latitude: latitude,
                longitude: longitude,
                location: locality?.long_name,
                address: response?.data?.results[0]?.formatted_address

            }
            // addressContext.setCurrentAddress(value)

        })
            .catch(err => {
            })

    }


    const RegionChange = (e) => {
        let coordinates = e.nativeEvent.coordinate;

        getAddressFromCoordinates(coordinates?.latitude, coordinates?.longitude)
        setLocation({ latitude: coordinates?.latitude, longitude: coordinates?.longitude })
        addressContext.setCurrentAddress({ latitude: coordinates?.latitude, longitude: coordinates?.longitude })
        //setLocation(region)

    }

    return (
        <>
            <HeaderWithTitle
                title={'Select Address'}
            // onPress={mode === 'header' ?}
            />
            <MapView
                style={{ flex: 1 }}
                region={{
                    latitude: addressContext?.currentAddress ? addressContext?.currentAddress?.latitude : location?.latitude,
                    longitude: addressContext?.currentAddress ? addressContext?.currentAddress?.longitude : location?.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                onPress={RegionChange}
                ref={mapRef}
                //onRegionChangeComplete={RegionChange}
                showsUserLocation={true}
            // onUserLocationChange={(e)=>{
            //     console.log("onUserLocationChange", e.nativeEvent)
            // }}
            >
                {location && <Marker
                    coordinate={{
                        latitude: addressContext?.currentAddress ? addressContext?.currentAddress?.latitude : location?.latitude,
                        longitude: addressContext?.currentAddress ? addressContext?.currentAddress?.longitude : location?.longitude,
                    }}
                />}
            </MapView>
            <View style={styles.selectedLocationView}>
                <View style={{ flexDirection: 'row', }}>
                    <Foundation name={'target-two'} color='#FF0000' size={23} marginTop={7} />
                    <View style={{ flex: 0.9, marginLeft: 7, }}>
                        <CommonTexts label={addressContext?.currentAddress?.city ? addressContext?.currentAddress?.city : city} fontSize={22} />
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                color: '#23233C',
                                fontSize: 11,
                                marginTop: -5
                            }}
                        >{addressContext?.currentAddress?.location ? addressContext?.currentAddress?.location : address}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={addNewAddress}
                        style={{ position: 'absolute', right: 10 }}
                    >
                        <MaterialCommunityIcons name={'lead-pencil'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#5871D3'} size={18} marginTop={5} />
                    </TouchableOpacity>
                </View>
                <CustomButton
                    onPress={onConfirm}
                    label={'Confirm'}
                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5871D3'}
                    mt={10}
                />
            </View>
        </>
    )
}

export default LocationScreen

const styles = StyleSheet.create({
    selectedLocationView: {
        backgroundColor: '#fff',
        height: 200,
        position: 'absolute',
        bottom: 70,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },
    address: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5,


    }
})