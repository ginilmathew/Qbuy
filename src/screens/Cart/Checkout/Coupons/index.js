import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, FlatList } from 'react-native'
import React, { useCallback, useContext } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import HeaderWithTitle from '../../../../Components/HeaderWithTitle';
import CommonInput from '../../../../Components/CommonInput';
import CustomButton from '../../../../Components/CustomButton';
import PandaContext from '../../../../contexts/Panda';
import CommonTexts from '../../../../Components/CommonTexts';
import CouponCard from './CouponCard';
import customAxios from '../../../../CustomeAxios';
import reactotron from 'reactotron-react-native';


const Coupons = ({navigation, route}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    const { width } = useWindowDimensions()


    

    const backAction = () => {
        navigation.goBack()
    }


    const applyCoupon = async(item) => {
        try {
            let data = {
                coupon_id: item?._id,
                type: active
            }
            let response = await customAxios.post(`customer/coupons/check`, data);
            if(response?.data?.message === "Store offerd"){
                Alert.alert('Warning', 'Some Products already have offer. If you want to use this offer existing offer applied in cart will be removed. Do you want to continue?', [
                    {
                      text: 'Cancel',
                      onPress: null,
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ]);
            }

            reactotron.log({response})

            
        } catch (error) {
            
        }
    }

    const renderCoupon = ({item, index}) => {
        return(
            <CouponCard item={item} key={item?._id} active={active} width={width} onApply={applyCoupon} />
        )
    }


    return (
        <>
            <HeaderWithTitle title={'Coupons'} goback={backAction}/>
            <FlatList 
                data={route?.params?.data}
                keyExtractor={({item}) => item?._id}
                renderItem={renderCoupon}
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#F3F3F3', 
                    paddingTop:20
                }}
            />
            
        </>
    )
}

export default Coupons

const styles = StyleSheet.create({

    lottieView : {
        height:140, 
        alignItems:'center', 
        marginTop:30
    },
    mainText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign:'center',
        paddingHorizontal:40,
        marginTop:20,
        marginBottom:20
    },
    mediumText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 14,
    },
   
})