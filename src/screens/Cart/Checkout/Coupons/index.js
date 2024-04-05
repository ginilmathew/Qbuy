import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, FlatList, Alert, Dimensions } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
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
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';
import LoadingModal from '../../../../Components/LoadingModal';


const getCoupons = async (datas) => {
    const couponData = await customAxios.post('customer/coupons/list', datas);

    return couponData?.data?.data;
}

const Coupons = ({navigation, route}) => {

    const [loading, setLoading ] = useState(false)

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    const { width } = useWindowDimensions()


    const { data, isLoading, refetch } = useQuery({
        queryKey: ['coupons'],
        queryFn: () => getCoupons(route?.params?.data),
        enabled: !!route?.params?.data

    })

    //reactotron.log({params: route?.params})


    

    const backAction = () => {
        navigation.goBack()
    }

    const removeOffers = async(data) => {
        setLoading(true)
        try {
            let response = await customAxios.post(`customer/cart/remove-offer`, data);
            if(response?.data?.message === "Success"){
                Toast.show({
                    text1: "Success",
                    text2: 'Coupon Applied successfully'
                })
                navigation.goBack()
            }


        } catch (error) {
            Toast.show({
                text1: "Error",
                text2: error,
                type:'error'
            })
        }
        finally{
            setLoading(false)
        }
    }


    const applyCoupon = async(item) => {
        setLoading(true)
        try {
            let data = {
                coupon_id: item?._id,
                type: active
            }
            let response = await customAxios.post(`customer/coupons/check`, data);
            if(response?.data?.message === "Store offerd"){
                Alert.alert('Warning', 'Some products already have an offer. If you choose to use this offer, any applied offer in the cart will be removed. Do you want to continue?', [
                    {
                      text: 'Cancel',
                      onPress: null,
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () =>  removeOffers(data)},
                ]);
            }
            else if(response?.data?.message === "Customer group offer"){
                Toast.show({
                    text1:'Warning',
                    text2: 'You are not allowed to use any other offers',
                    type:'error'
                })
                navigation.goBack()
            }
            else if(response?.data?.message === "Coupon Applied"){
                Toast.show({
                    text1:'Success',
                    text2: 'Coupon Applied successfully',
                    type:'success'
                })
                navigation.goBack()
            }
            else if(response?.data?.message === "Panda Coins"){
                Alert.alert('Warning', 'Some products already have an offer. If you choose to use this offer, any applied offer in the cart will be removed. Do you want to continue?', [
                    {
                      text: 'Cancel',
                      onPress: null,
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () =>  removeOffers(data)},
                ]);
            }


            
        } catch (error) {
            reactotron.log({error})
            Toast.show({
                text1:'Error',
                text2: error,
                type:'error'
            })
        }
        finally{
            setLoading(false)
        }
    }

    const renderCoupon = ({item, index}) => {
        return(
            <CouponCard item={item} key={`${item?._id}${index}`} active={active} width={width} onApply={applyCoupon} />
        )
    }


    return (
        <>
            <HeaderWithTitle title={'Coupons'} goback={backAction} />
            <FlatList 
                data={data}
                keyExtractor={(item) => item?._id}
                renderItem={renderCoupon}
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#F3F3F3', 
                    paddingTop:20
                }}
                refreshing={isLoading}
                onRefresh={refetch}
                ListEmptyComponent={ListEmptyComponent}
            />
            <LoadingModal isVisible={loading} />
        </>
    )
}

export default Coupons



const ListEmptyComponent = () => (
    <View style={{
        alignItems: 'center',
        marginTop: Dimensions.get('screen').height / 3
    }}>
        <Image source={require('../../../../Images/coupon.png')} />
        <Text style={{ color: '#555' }}>No coupons are currently available</Text>
    </View>
)

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