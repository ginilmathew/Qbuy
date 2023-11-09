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
import LoadingModal from '../../../../Components/LoadingModal'
import LoaderContext from '../../../../contexts/Loader'

const LocationScreen = ({ route, navigation }) => {

    const { mode } = route.params



    const homeNavigationbasedIndex = navigation.getState()


    const cartContext = useContext(CartContext);
    const contextPanda = useContext(PandaContext);
  const loadingContex = useContext(LoaderContext);
    const userContext = useContext(AuthContext);
    const addressContext = useContext(AddressContext);


    let active = contextPanda.active;
    const { editAddress = {} } = route?.params || {};
    const { width, height } = useWindowDimensions();
    const mapRef = useRef()
    const [location, setLocation] = useState({ latitude: editAddress?.area?.latitude || 0, longitude: editAddress?.area?.longitude || 0 })
    const [address, setAddress] = useState(editAddress?.area?.address || '');
    const [city, setCity] = useState('');

    

    const onConfirm = useCallback(async () => {

        if(mode === "newAddress"){
            let locationData = {
                location: addressContext?.currentAddress?.location,
                city: addressContext?.currentAddress?.city,
                latitude: addressContext?.currentAddress?.latitude,
                longitude: addressContext?.currentAddress?.longitude,
            }


            navigation.navigate('AddDeliveryAddress', { item: { ...editAddress, ...locationData } })
        }
        else{
            navigation.navigate('green', { screen: 'TabNavigator', params: { screen: 'home' } })
        }

        




    }, [addressContext?.currentAddress, editAddress])

    const addNewAddress = useCallback(() => {
        navigation.navigate('AddNewLocation', { mode: route?.params?.mode })
    }, [])

    const myApiKey = "Key Received from Google map"

    // function getAddressFromCoordinates(latitude, longitude) {
    //     axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(response => {
    //         setAddress(response?.data?.results[0]?.formatted_address)
    //         let locality = response?.data?.results?.[0]?.address_components?.find(add => add.types.includes('locality'));
    //         setCity(locality?.long_name)
    //         // addressContext?.setCurrentAddress(null)
    //         // addressContext?.setLocation(null)
    //         let value = {
    //             latitude: latitude,
    //             longitude: longitude,
    //             location: locality?.long_name,
    //             address: response?.data?.results[0]?.formatted_address

    //         }
    //         // addressContext.setCurrentAddress(value)

    //     })
    //         .catch(err => {
    //         })

    // }


    const RegionChange = async(e) => {
        let coordinates = e.nativeEvent.coordinate;

        // getAddressFromCoordinates(coordinates?.latitude, coordinates?.longitude)
        // setLocation({ latitude: coordinates?.latitude, longitude: coordinates?.longitude })
        // addressContext.setCurrentAddress({ latitude: coordinates?.latitude, longitude: coordinates?.longitude })
        //setLocation(region)

        loadingContex?.setLoading(true)
        try {
            let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordinates?.latitude},${coordinates?.longitude}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`);


            let Value = {
                location: response?.data?.results[0]?.formatted_address,
                city: response?.data?.results[0]?.address_components?.filter(st =>
                    st.types?.includes('locality')
                )[0]?.long_name,
                latitude: coordinates?.latitude,
                longitude: coordinates?.longitude,
            };


            addressContext.setCurrentAddress(Value);

            let location = {
                latitude: coordinates?.latitude,
                longitude: coordinates?.longitude,
                address: Value?.location
            }


            AsyncStorage.setItem("location", JSON.stringify(location))
            userContext.setLocation([coordinates?.latitude, coordinates?.longitude]);
            userContext.setCurrentAddress(Value?.location)
            //navigation.navigate('LocationScreen', { mode: mode });

        } catch (error) {
            
        }
        finally{
            loadingContex?.setLoading(false)
        }

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
                    latitude: addressContext?.currentAddress?.latitude,
                    longitude: addressContext?.currentAddress?.longitude,
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
                        latitude: addressContext?.currentAddress?.latitude,
                        longitude: addressContext?.currentAddress?.longitude,
                    }}
                />}
            </MapView>
            <View style={styles.selectedLocationView}>
                <View style={{ flexDirection: 'row', }}>
                    <Foundation name={'target-two'} color='#FF0000' size={23} marginTop={7} />
                    <View style={{ flex: 0.9, marginLeft: 7, }}>
                        <CommonTexts label={ addressContext?.currentAddress?.city} fontSize={22} />
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                color: '#23233C',
                                fontSize: 11,
                                marginTop: -5
                            }}
                        >{addressContext?.currentAddress?.location}</Text>
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
            <LoadingModal isVisible={loadingContex?.loading} />
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