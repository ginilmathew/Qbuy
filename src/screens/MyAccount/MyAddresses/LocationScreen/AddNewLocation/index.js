import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import HeaderWithTitle from '../../../../../Components/HeaderWithTitle'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AddressContext from '../../../../../contexts/Address';
import SplashScreen from 'react-native-splash-screen'
import reactotron from 'reactotron-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
const AddNewLocation = ({ route, navigation }) => {

    const backArrowhide = navigation.getState();

    const addressContext = useContext(AddressContext)


    const { width, height } = useWindowDimensions()

    const location = useRef()



    useEffect(() => {
        SplashScreen.hide()
    })
    return (

        <>
            <HeaderWithTitle title={'Location'} noBack={backArrowhide.index === 0 ? true : false} />
            <View style={{ padding: 15 }}>
                <GooglePlacesAutocomplete
                    autoFocus={false}
                    returnKeyType={'default'}
                    fetchDetails={true}
                    placeholder='Search'
                    keyboardAppearance={'light'}
                    textInputProps={{
                        placeholderTextColor: 'gray',
                        returnKeyType: "search"
                    }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true

                        let Value = {
                            location: data?.description,
                            city: details?.address_components?.filter(st => st.types?.includes('locality'))[0]?.long_name,
                            latitude: details?.geometry?.location?.lat,
                            longitude: details?.geometry?.location?.lng
                        }


                        addressContext.setCurrentAddress(Value)
                        // addressContext.setLocation(details)
                        navigation.navigate('LocationScreen', { mode: '' })

                    }}
                    query={{
                        key: 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY',
                        language: 'en',
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
                    styles={styles}
                />
            </View>


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