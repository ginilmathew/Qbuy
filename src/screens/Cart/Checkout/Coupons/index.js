import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
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


const Coupons = ({navigation}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    let datas = [
        {
            _id: '1',
            name: 'Biriyani'
        },
        {
            _id: '2',
            name: 'Fresh Meat'
        },
        {
            _id: '3',
            name: 'Lunch Box'
        },
        {
            _id: '4',
            name: 'Veggies'
        },
        {
            _id: '5',
            name: 'Farm Pick'
        },

    ]

    const backAction = useCallback(() => {
        navigation.navigate('Checkout')
    })


    return (
        <>
            <HeaderWithTitle title={'Coupons'} goback={backAction}/>
            <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#F3F3F3', 
                    paddingTop:20
                }}
            >
                {datas?.map((item, index)=>( <CouponCard item={item} key={index}/> ))}
                

            </ScrollView>
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