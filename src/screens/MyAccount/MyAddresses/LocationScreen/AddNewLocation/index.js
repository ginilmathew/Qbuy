import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import HeaderWithTitle from '../../../../../Components/HeaderWithTitle'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AddressContext from '../../../../../contexts/Address';
import SplashScreen from 'react-native-splash-screen'
import reactotron from 'reactotron-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AuthContext from '../../../../../contexts/Auth';
import axios from 'axios';
const AddNewLocation = ({ route, navigation }) => {

    const backArrowhide = navigation.getState();
    const googlePlacesRef = React.createRef();
    const addressContext = useContext(AddressContext)
    const userContext = useContext(AuthContext)

    const { width, height } = useWindowDimensions()



    function getAddressFromCoordinates (lat, lon) {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lon}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(response => {

            reactotron.log({ response }, 'RESPONSE IN ADDRESS')
            userContext.setUserLocation(response?.data?.results[0]?.formatted_address)

            let locality = response?.data?.results?.[0]?.address_components?.find(add => add.types.includes('locality'));
            userContext.setCity(locality?.long_name)
            let value = {
                area: {
                    location: locality?.long_name,
                    address: response?.data?.results[0]?.formatted_address
                }
            }
            //cartContext.setDefaultAddress(value)

            // reactotron.log({ response: response?.data?.results[0]?.formatted_address }, 'LOCATION RESPONSE')

        })
            .catch(err => {
            })
    }

    useEffect(() => {
        SplashScreen.hide()
    })
    return (

        <>
            <HeaderWithTitle title={ 'Location' } noBack={ backArrowhide.index === 0 ? true : false } />
            {/* <ScrollView style={ { padding: 15, } } >
                <GooglePlacesAutocomplete

                    autoFocus={ false }
                    styles={ {
                        container: {
                            // Custom container styles
                            backgroundColor: 'white',
                            borderBottomWidth: 1,
                            borderColor: 'lightgray',
                            borderRadius: 5,
                            marginTop: 10,

                        },
                    } }
                    returnKeyType={ 'default' }
                    fetchDetails={ true }
                    placeholder='Search'
                    keyboardAppearance={ 'light' }
                    textInputProps={ {
                        placeholderTextColor: 'gray',
                        returnKeyType: "search",

                    } }
                    keyboardShouldPersistTaps='always'
                    onPress={ (data, details = null) => {
                        // 'details' is provided when fetchDetails = true

                        let Value = {
                            location: data?.description,
                            city: details?.address_components?.filter(st => st.types?.includes('locality'))[0]?.long_name,
                            latitude: details?.geometry?.location?.lat,
                            longitude: details?.geometry?.location?.lng
                        }

                        if (!useContext?.userData) {
                            userContext?.setCurrentAddress(null)
                            userContext.setLocation([details?.geometry?.location?.lat, details?.geometry?.location?.lng])
                            getAddressFromCoordinates(details?.geometry?.location?.lat, details?.geometry?.location?.lng);
                            addressContext.setCurrentAddress(Value)
                        } else {
                            addressContext.setCurrentAddress(Value)
                            // addressContext.setLocation(details)

                        }


                        navigation.navigate('LocationScreen', { mode: '' })

                    } }
                    query={ {
                        key: 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY',
                        language: 'en',
                    } }
                    renderRow={ (rowData) => {
                        const title = rowData.structured_formatting.main_text;
                        const address = rowData.structured_formatting.secondary_text;

                        return (
                            <View>
                                <Text style={ { fontSize: 14 } }>{ title }</Text>
                                <Text style={ { fontSize: 14 } }>{ address }</Text>
                            </View>
                        );
                    } }


                />
            </ScrollView> */}
            <ScrollView style={ { padding: 15, marginBottom: height / 6 } } keyboardShouldPersistTaps='handled'>
                <GooglePlacesAutocomplete
                    autoFocus={ false }
                    styles={ {
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
                    } }
                    returnKeyType={ 'default' }
                    fetchDetails={ true }
                    placeholder='Search'
                    keyboardAppearance={ 'light' }
                    textInputProps={ {
                        placeholderTextColor: 'gray',
                        returnKeyType: 'search',
                    } }
                    keyboardShouldPersistTaps='always'
                    onPress={ (data, details = null) => {
                        // 'details' is provided when fetchDetails = true

                        let Value = {
                            location: data?.description,
                            city: details?.address_components?.filter(st =>
                                st.types?.includes('locality')
                            )[0]?.long_name,
                            latitude: details?.geometry?.location?.lat,
                            longitude: details?.geometry?.location?.lng,
                        };

                        if (!useContext?.userData) {
                            userContext?.setCurrentAddress(null);
                            userContext.setLocation([
                                details?.geometry?.location?.lat,
                                details?.geometry?.location?.lng,
                            ]);
                            getAddressFromCoordinates(
                                details?.geometry?.location?.lat,
                                details?.geometry?.location?.lng
                            );
                            addressContext.setCurrentAddress(Value);
                        } else {
                            addressContext.setCurrentAddress(Value);
                            // addressContext.setLocation(details)
                        }

                        navigation.navigate('LocationScreen', { mode: '' });
                    } }
                    query={ {
                        key: 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY',
                        language: 'en',
                    } }
                    renderRow={ (rowData) => {
                        const title = rowData.structured_formatting.main_text;
                        const address = rowData.structured_formatting.secondary_text;

                        return (
                            <View>
                                <Text style={ { fontSize: 14 } }>{ title }</Text>
                                <Text style={ { fontSize: 14 } }>{ address }</Text>
                            </View>
                        );
                    } }
                />
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