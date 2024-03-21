import { Image, StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import CommonInput from '../../../Components/CommonInput';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';
import GooglePlaces from '../../../Components/GooglePlaces';
import customAxios from '../../../CustomeAxios';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import SuccessPage from '../../../Components/SuccessPage';


const ApplyFranchisee = ({ navigation }) => {
    const contextPanda = useContext(PandaContext)
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { height } = useWindowDimensions()
    let active = contextPanda.active


    const schema = yup.object({
        name: yup.string().required('Name is required'),
        mobile: yup.string().required('Mobile is required').typeError('Mobile type must be number'),
        location: yup.string().required('Location is required'),
        comments: yup.string().required('Comments is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue, setError, reset, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
        name: '',
        mobile: '',
        location: '',
        comments: '',
    }
    });

    const onSubmit = useCallback((data) => {

        setLoading(true);

        customAxios.post('customer/franchise-enquiry', data)
            .then(res => {
                setShowSuccess(true);
            })
            .catch(err => {
                Toast.show({
                    type: 'error',
                    text1: err
                })
            })
            .finally(e => {
                setLoading(false)
            })
    }, [])


    const goHome = useCallback(() => {
        reset({
            name: '',
            mobile: '',
            location: '',
            comments: '',
        })
        navigation?.goBack()
        setShowSuccess(false)
    }, [])


    if (showSuccess) {
        return <SuccessPage source={require('../../../Lottie/send.json')} goHome={goHome} />
    }

    return (
        <>
            <HeaderWithTitle title={'Apply for a franchisee'} />

            <ScrollView
                keyboardShouldPersistTaps='always'
                style={{
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal: 15
                }}
            >

                <View style={{
                    // backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    marginBottom: 30
                }}>
                    <Lottie
                        style={{
                            height: 270
                        }}
                        source={require('../../../Lottie/applyfranchise.json')}
                        autoPlay
                    />

                    <Text style={styles.mainText}>{'Connect with your interested franchisee!'}</Text>
                </View>


                <CommonInput
                    control={control}
                    error={errors.name}
                    fieldName="name"
                    topLabel={'Name'}
                />

                <CommonInput
                    control={control}
                    error={errors.mobile}
                    inputMode={'numeric'}
                    fieldName="mobile"
                    maxLength
                    topLabel={'Contact Number'}
                    top={20}
                />


                {/* <CommonInput
                        control={control}
                        error={errors.location}
                        fieldName="mobile"
                        topLabel={'Location'}
                        top={20}
                    /> */}
                <GooglePlaces
                    control={control}
                    fieldName={'location'}
                    topLabel={'Location'}
                    setValue={setValue}
                    // setDistance={setDistance}
                    setError={setError}
                />

                <CommonInput
                    control={control}
                    error={errors.comments}
                    fieldName="comments"
                    topLabel={'Comments'}
                    top={15}
                    multi
                />

                <CustomButton
                    loading={loading}
                    onPress={!loading ? handleSubmit(onSubmit) : null}
                    label={'Apply'}
                    bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={30}
                />

            </ScrollView>
        </>
    )
}

export default ApplyFranchisee

const styles = StyleSheet.create({

    mainText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: -65,
    }
})