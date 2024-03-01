/* eslint-disable prettier/prettier */
import { Image, StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import CommonInput from '../../../Components/CommonInput';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';
import customAxios from '../../../CustomeAxios';
import Toast from 'react-native-toast-message';
import SuccessPage from '../../../Components/SuccessPage';


const SellWithUs = ({ navigation }) => {

    const { height } = useWindowDimensions();
    const contextPanda = useContext(PandaContext)
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    let active = contextPanda.active

    const schema = yup.object({
        name: yup.string().required('Name is required'),
        restaurant_name: yup.string().required('Restaurant name is required'),
        mobile: yup.string().required('Contact number is required'),
        city: yup.string().required('City is required'),
        location: yup.string().required('Location is required'),
        comments: yup.string().required('Comments is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        resolver: yupResolver(schema)
    });


    const onSubmit = useCallback((data) => {
        setLoading(true)

        customAxios.post('customer/referral-restaurant', data)
            .then(res => {
                setShowSuccess(true);
            })
            .catch(err => {
                console.log(err);
                Toast.show({
                    type: 'error',
                });
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])


    const goHome = useCallback(() => {
        reset()
        navigation?.navigate('dashboard')
        setShowSuccess(false)
    }, [])

    if (showSuccess) {
        return <SuccessPage source={require('../../../Lottie/successTick.json')} text={'Registered successfully.'} goHome={goHome} />
    }

    return (
        <>
            <HeaderWithTitle title={'Sell With Us'} />

            <View style={[styles.lottieView, {
                backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
            }]}>
                <Lottie
                    style={{
                        height: 150,
                        width: 150,
                    }}
                    source={{ uri: 'https://assets8.lottiefiles.com/packages/lf20_9aaqrsgf.json' }}
                    autoPlay
                />

                <Text style={styles.mainText}>{'Register As A Seller & See Your Profit Grow!'}</Text>

            </View>

            <ScrollView
                style={{
                    height,
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal: 15
                }}
            >

                <CommonInput
                    control={control}
                    error={errors.name}
                    fieldName="name"
                    topLabel={'Name'}
                />

                <CommonInput
                    control={control}
                    error={errors.restaurant_name}
                    fieldName="restaurant_name"
                    backgroundColor={!active === 'green' && '#F2F2F2'}
                    topLabel={'Store Name'}
                    top={20}
                />
                <CommonInput
                    control={control}
                    error={errors.mobile}
                    inputMode={'numeric'}
                    fieldName="mobile"
                    topLabel={'Contact Number'}
                    top={20}
                />


                <CommonInput
                    control={control}
                    error={errors.city}
                    fieldName="city"
                    topLabel={'City'}
                    top={20}
                />

                <CommonInput
                    control={control}
                    error={errors.location}
                    fieldName="location"
                    topLabel={'Location'}
                    top={20}
                />
                <CommonInput
                    control={control}
                    error={errors.comments}
                    fieldName="comments"
                    topLabel={'Comments'}
                    top={20}
                    placeholder='Tell us more about your store...'
                    multi
                    placeholderTextColor='#0C256C21'
                />

                <CustomButton
                    label={'Submit'}
                    loading={loading}
                    onPress={loading ? null : handleSubmit(onSubmit)}
                    bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={40}
                />


            </ScrollView>
        </>
    )
}

export default SellWithUs

const styles = StyleSheet.create({

    lottieView: {
        alignItems: 'center',
    },
    mainText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 10,
        marginBottom: 20
    }
})