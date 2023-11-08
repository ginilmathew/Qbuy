import { Alert, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import HeaderWithTitle from '../../../../../Components/HeaderWithTitle'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AddressContext from '../../../../../contexts/Address';
import SplashScreen from 'react-native-splash-screen'
import reactotron from 'reactotron-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AuthContext from '../../../../../contexts/Auth';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderContext from '../../../../../contexts/Loader';
import { getAddressfromLocation } from '../../../../../helper/addressHelper';
import LoadingModal from '../../../../../Components/LoadingModal';

const AddNewLocation = ({ route, navigation }) => {

    const backArrowhide = navigation.getState();
    const googlePlacesRef = React.createRef();
    const addressContext = useContext(AddressContext)
    const userContext = useContext(AuthContext)
    const loadingg = useContext(LoaderContext);

    const { width, height } = useWindowDimensions()



    // function getAddressFromCoordinates (lat, lon) {
    //     axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lon}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(response => {
    //         userContext.setUserLocation(response?.data?.results[0]?.formatted_address)

    //         let locality = response?.data?.results?.[0]?.address_components?.find(add => add.types.includes('locality'));
    //         userContext.setCity(locality?.long_name)
    //         let value = {
    //             area: {
    //                 location: locality?.long_name,
    //                 address: response?.data?.results[0]?.formatted_address
    //             }
    //         }
    //         //cartContext.setDefaultAddress(value)

    //         // reactotron.log({ response: response?.data?.results[0]?.formatted_address }, 'LOCATION RESPONSE')

    //     })
    //         .catch(err => {
    //         })
    // }

    useEffect(() => {
        SplashScreen.hide()
    })

    const getAddressFromCoordinates = async (lat, lng) => {
        loadingg?.setLoading(true)
        try {
            let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`);


            let Value = {
                location: response?.data?.results[0]?.formatted_address,
                city: response?.data?.results[0]?.address_components?.filter(st =>
                    st.types?.includes('locality')
                )[0]?.long_name,
                latitude: lat,
                longitude: lng,
            };


            addressContext.setCurrentAddress(Value);

            let location = {
                latitude: lat,
                longitude: lng,
                address: Value?.location
            }


            AsyncStorage.setItem("location", JSON.stringify(location))
            userContext.setLocation([lat, lng]);
            userContext.setCurrentAddress(Value?.location)
            navigation.navigate('LocationScreen', { mode: '' });

        } catch (error) {
            
        }
        finally{
            loadingg?.setLoading(false)
        }
        // axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(async response => {

        //     reactotron.log({ response })
        //     //userContext.setCurrentAddress(response?.data?.results[0]?.formatted_address);


            

        // })
        // .catch(err => {

        // });
       

    }


    const getLocation = async () => {
        await Geolocation.getCurrentPosition(
            async position => {
                if (position) {
                    getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude)



                    //navigation.navigate('LocationScreen', { mode: '' });
                }
            },
            async error => {
                Alert.alert('Warning', error?.message, [
                    {
                        text: 'Ok',
                        style: 'cancel',
                    }
                ]);
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


    const displayLocationWarning = () => {
        Alert.alert('Warning', 'Unable to get location permission', [
            {
                text: 'Ok',
                style: 'cancel',
            }
        ]);
    }


    const getCureentPosition = async () => {
        loadingg?.setLoading(true)
        try {
            if (Platform.OS === 'ios') {
                const status = await Geolocation.requestAuthorization('whenInUse');
                if (status === "granted") {
                    getLocation()
                }
                else {
                    //warning
                    displayLocationWarning()
                }
            }
            else {
                const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if ((Platform.OS === 'android' && Platform.Version < 23) || hasPermission) {
                    getLocation()
                }
                else {
                    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                    if (status === PermissionsAndroid.RESULTS.GRANTED) {
                        getLocation()
                    }
                    else {
                        //warning
                        displayLocationWarning()
                    }
                }
            }
        } catch (error) {
            console.log({ error })
        }
        finally {
            //loadingg?.setLoading(false)
        }

    }


    return (

        <>
            <HeaderWithTitle title={'Enter your area or apartment'} backarrow={backArrowhide.index} noBack={false} />
            <ScrollView style={{ padding: 15, marginBottom: height / 6 }} keyboardShouldPersistTaps='handled'>
                <GooglePlacesAutocomplete
                    autoFocus={false}
                    styles={{
                        container: {
                            // Custom container styles
                            backgroundColor: 'white',
                            borderBottomWidth: 1,
                            borderColor: 'lightgray',
                            borderRadius: 5,
                            marginTop: 10,
                        },
                        textInputContainer: {
                            // Custom styles for the container containing the input field
                            backgroundColor: 'white',
                            borderTopWidth: 0, // Remove top border
                            borderBottomWidth: 0, // Remove bottom border
                            paddingLeft: 10, // Add left padding
                        },
                        textInput: {
                            // Custom input field styles
                            height: 40,
                            fontSize: 16,
                        },
                        listView: {
                            // Custom styles for the suggestion list
                            backgroundColor: 'white', // Background color of the suggestion list
                        },
                    }}
                    returnKeyType={'default'}
                    fetchDetails={true}
                    placeholder='Try Ramachandranagar, Kazhakootam,...'
                    keyboardAppearance={'light'}
                    textInputProps={{
                        placeholderTextColor: 'gray',
                        returnKeyType: 'search',
                    }}
                    keyboardShouldPersistTaps='always'
                    onPress={async (data, details = null) => {
                        // 'details' is provided when fetchDetails = true

                        let Value = {
                            location: data?.description,
                            city: details?.address_components?.filter(st =>
                                st.types?.includes('locality')
                            )[0]?.long_name,
                            latitude: details?.geometry?.location?.lat,
                            longitude: details?.geometry?.location?.lng,
                        };

                        addressContext.setCurrentAddress(Value);



                        userContext.setLocation([
                            details?.geometry?.location?.lat,
                            details?.geometry?.location?.lng,
                        ]);
                        userContext?.setCurrentAddress(data?.description);

                        let location = {
                            latitude: details?.geometry?.location?.lat,
                            longitude: details?.geometry?.location?.lng,
                            address: data?.description
                        }

                        await AsyncStorage.setItem("location", JSON.stringify(location))

                        navigation.navigate('LocationScreen', { mode: '' });
                    }}
                    query={{
                        key: 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY',
                        language: 'en',
                        components: 'country:in'

                    }}
                    renderRow={(rowData) => {
                        const title = rowData.structured_formatting.main_text;
                        const address = rowData.structured_formatting.secondary_text;

                        return (
                            <View>
                                <Text style={{ fontSize: 14 }}>{title}</Text>
                                <Text style={{ fontSize: 14 }}>{address}</Text>
                            </View>
                        );
                    }}
                />
                <TouchableOpacity onPress={getCureentPosition} style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="location" size={20} color={"blue"} />
                    <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 15 }}> Use Current Location? </Text>
                </TouchableOpacity>
                <LoadingModal isVisible={loadingg?.loading} />
            </ScrollView>
        </>


    )
}

export default AddNewLocation

// const styles = StyleSheet.create({
//     selectedLocationView: {
//         backgroundColor: '#fff',
//         height: 200,
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: 20
//     },
//     address: {
//         fontFamily: 'Poppins-Regular',
//         color: '#23233C',
//         fontSize: 11,
//         marginTop: 5
//     }
// })

const styles = StyleSheet.create({
    textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        zIndex: 999,

        width: '100%',
        justifyContent: 'center'


    },
    textInput: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        marginLeft: 0,
        marginRight: 0,
        height: 45,
        color: '#5d5d5d',
        fontSize: 16,
        zIndex: 999,
        borderColor: '#888888',
        borderWidth: 0,

    },
    predefinedPlacesDescription: {
        color: '#1faadb'
    },
    listView: {
        top: 45.5,
        zIndex: 10,
        position: 'absolute',
        color: 'black',
        backgroundColor: "white",
        width: '100%',

        marginRight: 0,
        borderRadius: 10,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f5f5f5',
    },
    description: {
        flexDirection: "row",
        flexWrap: "wrap",
        fontSize: 14,
        maxWidth: '100%',
    },

});