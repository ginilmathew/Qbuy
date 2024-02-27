import { Image, StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
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

    const { control, handleSubmit, formState: { errors }, setValue, setError } = useForm({
        resolver: yupResolver(schema)
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
        navigation?.goBack()
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
                        source={{ uri: 'https://assets3.lottiefiles.com/packages/lf20_fzq71t74.json' }}
                        autoPlay
                    />

                    <Text style={styles.mainText}>{'Connect with your ineterested franchisee!'}</Text>
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
                    topLabel={'Contact Number'}
                    top={20}
                />

                {/* <CommonSelectDropdown
                    topLabel={'Store Category'}
                    mb={20}
                    data={data}
                    value={values}
                    setValue={setValues}

                /> */}
                {/* 
                <CommonSelectDropdown
                    topLabel={'Franchisee'}
                    mb={20}
                    data={franchise}
                    setValue={setValue}
                    setError={setError}
                    fieldName={'franchise'}
                />  */}

                {/* <CommonInput
                        control={control}
                        error={errors.location}
                        fieldName="mobile"
                        topLabel={'Location'}
                        top={20}
                    /> */}
                <GooglePlaces
                    control={control}
                    fieldName={'pickup'}
                    topLabel={'Pick Up Location'}
                    setValue={setValue}
                    // setDistance={setDistance}
                    setError={setError}
                />

                <CommonInput
                    control={control}
                    error={errors.comments}
                    fieldName="comments"
                    topLabel={'Comments'}
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