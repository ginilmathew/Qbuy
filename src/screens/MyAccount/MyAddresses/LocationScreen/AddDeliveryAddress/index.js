/* eslint-disable prettier/prettier */
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Foundation from 'react-native-vector-icons/Foundation'
import HeaderWithTitle from '../../../../../Components/HeaderWithTitle'
import AddressCard from '../../AddressCard'
import ChooseAddressType from './ChooseAddressType'
import CommonTexts from '../../../../../Components/CommonTexts'
import CommonInput from '../../../../../Components/CommonInput'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CustomButton from '../../../../../Components/CustomButton'
import PandaContext from '../../../../../contexts/Panda'
import customAxios from '../../../../../CustomeAxios'
import LoaderContext from '../../../../../contexts/Loader'
import CommonSwitch from '../../../../../Components/CommonSwitch'
import Toast from 'react-native-toast-message';
import has from "lodash"
import AddressContext from '../../../../../contexts/Address'
import CartContext from '../../../../../contexts/Cart'
import reactotron from 'reactotron-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthContext from '../../../../../contexts/Auth'


const AddDeliveryAddress = ({ route, navigation }) => {

    let locationData = route?.params?.item;


    const addressContext = useContext(AddressContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)





    const loadingContext = useContext(LoaderContext)


    const [addr, setAddr] = useState([])

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const [selected, setSelected] = useState(locationData?.address_type || 'home')


    const [isEnabled, setIsEnabled] = useState(locationData?.default_status || false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


    const schema = yup.object({
        location: yup.string().required('Area is required'),
        address: yup.string().required('Address is required'),
        pincode: yup.number(),
        name: yup.string().max(30, "Name must be less than 30 characters").matches(
            /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
            'Name can only contain Alphabets letters.'
        )
            // .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.')
            .required('Name is Required'),
        mobile: yup.string().required().matches(phoneRegExp, '10 digit phone number is required').min(10).max(10)
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: locationData?.name,
            location: locationData?.city,
            address: locationData?.location,
            comments: locationData?.comments,
            default_status: locationData?.default,
            pincode: locationData?.pincode?.toString()
        }
    });


    datas = [
        {
            _id: '1',
            name: 'home',
        },
        {
            _id: '2',
            name: 'work',
        },
        {
            _id: '3',
            name: 'other',
        },
    ]

    const onSave = useCallback(async (data) => {

        loadingContext.setLoading(true)
        let datas = {
            address_type: selected.toLocaleLowerCase(),
            area: {
                latitude: locationData?.latitude,
                longitude: locationData?.longitude,
                address: data?.address,
                location: locationData?.city,
            },
            default_status: !cartContext?.address ? true : isEnabled,
            comments: data?.comments,
            mobile: data?.mobile,
            pincode: data?.pincode,
            name: data?.name
        }
        if (has(locationData, "_id")) {
            datas.id = locationData._id
        }


        await customAxios.post(`customer/address/${datas.id ? "update" : "create"}`, datas)
            .then(async response => {
                setAddr(response?.data)
                loadingContext.setLoading(false)
                if(route?.params?.mode === "checkout"){
                    cartContext.setDefaultAddress(response?.data?.data)
                    let location = {
                        latitude: response?.data?.data?.area?.latitude,
                        longitude: response?.data?.data?.area?.longitude,
                        address: response?.data?.data?.area?.address
                    }
        
        
                    AsyncStorage.setItem("location", JSON.stringify(location))
                    userContext.setLocation([response?.data?.data?.area?.latitude, response?.data?.data?.area?.longitude]);
                    userContext.setCurrentAddress(response?.data?.data?.area?.address)
                    navigation.navigate("Checkout")
                }
                else{
                    navigation.navigate("green", { screen: 'TabNavigator', params: { screen: 'account', params: { screen: 'MyAddresses', params: { mode: 'MyAcc' } } } })
                    //navigation.navigate('MyAddresses', { mode: 'MyAcc' })
                }
                
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContext.setLoading(false)
            })
    })


    return (
        <>
            <HeaderWithTitle title={ 'Add Delivery Address' } />
            <ScrollView
                style={ {
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    flex: 1,
                    paddingHorizontal: 15,
                    marginBottom: 30
                } }
            >
                <KeyboardAvoidingView>
                    <View style={ styles.headerView }>
                        <View style={ { flexDirection: 'row', } }>
                            { datas?.map((item, index) =>
                                <ChooseAddressType
                                    item={ item }
                                    key={ index }
                                    selected={ selected }
                                    setSelected={ setSelected }
                                />
                            ) }
                        </View>

                        <View style={ { paddingTop: 10 } } >
                            <CommonTexts label={ 'Default' } fontSize={ 12 } />
                            <CommonSwitch toggleSwitch={ toggleSwitch } isEnabled={ isEnabled } />
                        </View>
                    </View>
                    <CommonInput
                        control={ control }
                        error={ errors.name }
                        fieldName="name"
                        topLabel={ 'Name' }
                    />
                    <CommonInput
                        control={ control }
                        error={ errors.location }
                        fieldName="location"
                        topLabel={ 'Area' }
                    />
                    <CommonInput
                        control={ control }
                        error={ errors.address }
                        fieldName="address"
                        topLabel={ 'Address' }
                        placeholder='Complete Address e.g. house number, street name, etc'
                        placeholderTextColor='#0C256C21'
                        top={ 10 }
                    />
                    <CommonInput
                        control={ control }
                        error={ errors.mobile }
                        fieldName="mobile"
                        topLabel={ 'Mobile' }
                        placeholder='Delivery Mobile Number e.g. mobile of the owner'
                        placeholderTextColor='#0C256C21'
                        top={ 10 }
                    />
                    <CommonInput
                        control={ control }
                        error={ errors.pincode }
                        fieldName="pincode"
                        topLabel={ 'Pincode' }
                        placeholder='Delivery Pincode e.g. 695111'
                        placeholderTextColor='#0C256C21'
                        top={ 10 }
                    />
                    <CommonInput
                        control={ control }
                        error={ errors.comments }
                        fieldName="comments"
                        topLabel={ 'Comments (Optional)' }
                        placeholder='Delivery Instructions e.g. Opposite Gold Souk Mall'
                        placeholderTextColor='#0C256C21'
                        top={ 10 }
                    />
                    <CustomButton
                        onPress={ handleSubmit(onSave) }
                        bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' }
                        label='Save'
                        mt={ 20 }
                        loading={ loadingContext?.loading }
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </>

    )
}

export default AddDeliveryAddress

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10
    }
})