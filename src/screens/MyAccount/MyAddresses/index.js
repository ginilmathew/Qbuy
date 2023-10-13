import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, Platform, PermissionsAndroid, Linking } from 'react-native'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../../Components/CustomButton'
import AddressCard from './AddressCard'
import Foundation from 'react-native-vector-icons/Foundation'
import PandaContext from '../../../contexts/Panda'
import customAxios from '../../../CustomeAxios'
import LoaderContext from '../../../contexts/Loader'
import { useFocusEffect } from '@react-navigation/native'
import CartContext from '../../../contexts/Cart'
import Toast from 'react-native-toast-message'
import AuthContext from '../../../contexts/Auth'
import axios from 'axios'
import AddressContext from '../../../contexts/Address'
import Geolocation from 'react-native-geolocation-service';
import reactotron from '../../../ReactotronConfig'

const MyAddresses = ({ route, navigation }) => {

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading


    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    const addressContext = useContext(AddressContext)

    let active = contextPanda.active


    const mode = route?.params?.mode

    const [selected, setSelected] = useState(null)
    const [addrList, setAddrList] = useState([])



    // useEffect(() => {
    //     if (userContext?.userData) {
    //         getAddressList()
    //     }
    // }, [userContext?.userData])


    useFocusEffect(
        React.useCallback(() => {
            if(userContext?.userData){
                getAddressList()
            }

        }, [userContext?.userData])
    );

    const getAddressList = async () => {
        loadingContex.setLoading(true)
        await customAxios.get(`customer/address/list`)
            .then(async response => {
                cartContext.setAddress(response?.data?.data)
                setAddrList(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContex.setLoading(false)
            })
    }


    const backAction = useCallback(() => {
        navigation.navigate('MyAccountNav')
    }, [])


    // async function fetchData() {

    //     if (Platform.OS === 'android') {
    //         await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         )
    //     }
    //     if (Platform.OS === 'ios') {
    //         const hasPermission = await hasPermissionIOS();
    //         return hasPermission;
    //     }
    // }



    // const hasPermissionIOS = async () => {
    //     reactotron.log('ANDROID')
    //     const openSetting = () => {
    //         Linking.openSettings().catch(() => {
    //             Alert.alert('Unable to open settings');
    //         });
    //     };
    //     const status = await Geolocation.requestAuthorization('whenInUse');

    //     reactotron.log({status})
    //     if (status === 'granted') {
    //         getPosition()
    //         return true;
    //     }
    //     if (status === 'denied') {
    //         //Alert.alert('Location permission denied');
    //     }
    //     if (status === 'disabled') {
    //         Alert.alert(
    //             `Turn on Location Services to allow  to determine your location.`,
    //             '',
    //             [
    //                 { text: 'Go to Settings', onPress: openSetting },
    //                 { text: "Don't Use Location", onPress: () => { } },
    //             ],
    //         );
    //     }
    //     return false;
    // };
    const getCurrentLocation = useCallback(async () => {
        if (Platform.OS === 'ios') {
            const status = await Geolocation.requestAuthorization('whenInUse');
            if (status === "granted") {
                getPosition()
            } else {
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

                Toast.show({
                    type: 'error',
                    text1: 'Location permission denied by user.'
                });
            }
            else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {

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



    function getAddressFromCoordinates(latitude, longitude) {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(response => {
            // userContext.setLocation([latitude, longitude])
            // addressContext?.setCurrentAddress(null)
            // addressContext?.setLocation(null)

            let locality = response?.data?.results?.[0]?.address_components?.find(add => add.types.includes('locality'));


            let value = {
                latitude: latitude,
                longitude: longitude,
                location: response?.data?.results[0]?.formatted_address,
                city: locality?.long_name

            }



            addressContext.setCurrentAddress(value)

            navigation.navigate('LocationScreen', { mode: 'currentlocation' })

        })
            .catch(err => {
            })

    }
    const chooseCrntLocation = () => {
        addressContext.setCurrentAddress(null)
        if (addrList?.length >= 1) {
            let result = addrList?.filter((res) => res?.default === true)
            const Value = {
                location: result[0]?.area?.address,
                city: result[0]?.area?.location,
                latitude: result[0]?.area?.latitude,
                longitude: result[0]?.area?.longitude
            }

            // userContext.setLocation([result[0]?.area?.latitude,result[0]?.area?.longitude])
            addressContext.setCurrentAddress(Value)
            if (addressContext?.CucurrentAddress) {
                navigation.navigate('AddNewLocation')
            }
        }
        navigation.navigate('AddNewLocation')
    }

    const deleteSelect = async (id) => {

        loadingContex.setLoading(true)
        await customAxios.delete(`customer/address/delete/${id}`).then((response) => {
            let result = addrList?.filter((res) => res?._id !== id)
            setAddrList(result)
            loadingContex.setLoading(false)

        }).catch((error) => {
            Toast.show({
                type: 'error',
                text1: error
            });
            loadingContex.setLoading(false)
        }
        )
    }

    const selectAddress = async (id) => {
        let address = addrList.find(addr => addr?._id === id);
        //  await customAxios.post(`customer/get-cart-product`,{cart_id:cartContext?.cart?._id,address_id:address})

        userContext.setLocation([address?.area?.latitude, address?.area?.longitude])
        userContext.setCurrentAddress(address?.area?.address)


        // if (!address?.default) {
        address.default_status = true;
        address.id = address?._id

        loadingContex.setLoading(true)
        await customAxios.post(`customer/address/update`, address).then((response) => {
            setAddrList(response?.data?.data)
            const find = addrList.find(addr => addr?._id === id)
            cartContext.setDefaultAddress(find);
            loadingContex.setLoading(false)
        }
        ).catch(async error => {
            Toast.show({
                type: 'error',
                text1: error
            });
            loadingContex.setLoading(false)
        })
        // }

        if (mode === "home") {
            navigation.goBack()
        }
        else if (mode === "checkout") {

            navigation.navigate("Checkout")
        }
    }

    return (
        <>

            <HeaderWithTitle
                title={mode === 'home' ? 'Select Address' : mode === 'MyAcc' ? 'My Addresses' : "My Addresses"}
                // goback={backAction}
                mode={mode}
            />

            <View style={{ backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', paddingHorizontal: 15, flex: 1 }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loadingg} onRefresh={getAddressList} />
                    }
                >
                    {((mode === 'home' || addrList?.length === 0) && userContext?.userData) && <CustomButton
                        onPress={getCurrentLocation}
                        bg={'#19B836'}
                        label='Choose Current Location'
                        mt={10}
                        leftIcon={<Foundation name={'target-two'} color='#fff' size={20} marginRight={10} />}
                    />}

                    {addrList?.map((item, index) =>
                        <AddressCard
                            item={item}
                            key={index}
                            selected={item?.default}
                            setSelected={selectAddress}
                            deleteSelect={deleteSelect}
                        />
                    )}
                </ScrollView>
                <CustomButton
                    onPress={chooseCrntLocation}
                    label={'Add Address'}
                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5871D3'}
                    width={'100%'}
                    alignSelf='center'
                    mb={100}
                />
            </View>
        </>

    )
}

export default MyAddresses

const styles = StyleSheet.create({})