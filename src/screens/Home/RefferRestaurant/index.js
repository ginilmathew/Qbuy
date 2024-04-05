import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import Lottie from 'lottie-react-native';
import CommonInput from '../../../Components/CommonInput';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';
import Ionicons from 'react-native-vector-icons/Ionicons'
import customAxios from '../../../CustomeAxios';
import SuccessPage from '../../../Components/SuccessPage';


const RefferRestaurant = ({ navigation }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    const [values, setValues] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [sub, setSub] = useState(false)


    let status = 'approved'

    const schema = yup.object((active === 'green' || active === 'fashion') ? {
        name: yup.string().required('Name is required'),
        mobile: yup.string().min(10).required('Mobile is required'),
        email: yup.string().email().required('Email is required'),
        location: yup.string().required('Location is required')
    } : {
        restaurant_name: yup.string().required('Restaurant name is required'),
        city: yup.string().required('City is required'),
        address: yup.string().required('Address is required'),
        mobile: yup.string().min(10).required('Mobile is required'),
        location: yup.string().required('Location is required'),
        comments: yup.string().required('Comments is required'),
    }).required();

    const onSubmit = useCallback((data) => {
        setLoading(true)

        customAxios.post('customer/referral-restaurant', data)
            .then(res => {
                setShowSuccess(true);
            })
            .catch(err => {
                Toast.show({
                    type: 'error',
                    text1: err
                });
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const goHome = useCallback(() => {
        setShowSuccess(false)
        navigation?.goBack()
    }, [])

    if (showSuccess) {
        return <SuccessPage source={require('../../../Lottie/successTick.json')} text={'Your request has been submitted.'} goHome={goHome} />
    }

    return (
        <>
            <HeaderWithTitle title={active === 'green' ? 'Lets Farm Together' : active === 'fashion' ? "Sell Your Item" : 'Refer A Restaurant'} />
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal: 15
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ height: 170, alignItems: 'center' }}>
                    <Lottie
                        style={{
                            height: 170,
                            width: 170
                        }}
                        source={active === 'green' ? require('../../../Lottie/farm.json') : require('../../../Lottie/rating.json')}
                        autoPlay
                    />
                </View>

                <Text style={styles.mainText}>{active === 'green' ? 'Join Qbuy Panda Farming Community!' : active === 'fashion' ? 'Sell Your Items on Qbuy Panda!' : 'Refer your favourite restaurants so that they can join the Qbuy Panda family too!'}</Text>

                {active === 'green' || active === 'fashion' ?
                    <>
                        <CommonInput
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            topLabel={'Name'}
                        />
                        <CommonInput
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            inputMode={'numeric'}
                            top={20}
                            maxLength
                            topLabel={'Phone Number'}
                        />
                        <CommonInput
                            control={control}
                            error={errors.email}
                            fieldName="email"
                            topLabel={'Email ID'}
                            top={20}
                        />
                        <CommonInput
                            control={control}
                            error={errors.location}
                            fieldName="location"
                            topLabel={'Location'}
                            top={20}
                            multi
                        />
                    </>
                    :
                    <>
                        <CommonInput
                            control={control}
                            error={errors.restaurant_name}
                            fieldName="restaurant_name"
                            topLabel={'Name'}
                            placeholder={'Restaurant Name'}
                            placeholderTextColor='#0C256C21'
                        />

                        <CommonInput
                            control={control}
                            error={errors.city}
                            fieldName="city"
                            top={20}
                            topLabel={'City'}
                            placeholder='Type city ...'
                            placeholderTextColor='#0C256C21'
                        />

                        <CommonInput
                            control={control}
                            error={errors.address}
                            fieldName="address"
                            topLabel={'Store Address'}
                            multi
                            top={20}
                            placeholder='Complete Address e.g. store number, street name, etc'
                            placeholderTextColor='#0C256C21'
                        />

                        <CommonInput
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            inputMode={'numeric'}
                            maxLength
                            topLabel={'Store Contact Number'}
                            placeholder='Mobile Number e.g. Mobile of the owner'
                            placeholderTextColor='#0C256C21'
                            top={20}
                        />

                        <CommonInput
                            control={control}
                            error={errors.location}
                            fieldName="location"
                            topLabel={'Location'}
                            top={20}
                            multi
                        />
                        
                        <CommonInput
                            control={control}
                            error={errors.comments}
                            fieldName="comments"
                            topLabel={'Comments'}
                            top={20}
                            multi
                        />
                    </>}



                <CustomButton
                    onPress={loading ? null : handleSubmit(onSubmit)}
                    label={'Submit'}
                    loading={loading}
                    mt={40}
                    bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                />

                {/* <View style={{ alignItems: 'center' }}>
                    {status !== 'approved' && <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            color: '#1A9730',
                            fontSize: 13,
                            paddingHorizontal: 20,
                            textAlign: 'center'
                        }}
                    >{'Your Application Has Been Submitted Successfully'}</Text>}
                    <Ionicons name={status === 'approved' ? 'ios-checkmark-circle' : 'alert-circle'} color={status === 'approved' ? '#1A9730' : '#B29211'} size={30} marginTop={10} />
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            color: status === 'approved' ? '#1A9730' : '#B29211',
                            fontSize: 13,
                            marginTop: 5
                        }}
                    >{status === 'approved' ? 'Your Application Has Been Approved' : 'Awaiting Approval'}</Text>


                </View> */}



            </ScrollView>
        </>
    )
}

export default RefferRestaurant

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 5,
        marginBottom: 20
    }
})