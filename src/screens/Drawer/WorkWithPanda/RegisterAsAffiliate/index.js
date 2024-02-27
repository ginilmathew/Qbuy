import { Image, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import HeaderWithTitle from '../../../../Components/HeaderWithTitle';
import CommonInput from '../../../../Components/CommonInput';
import CustomButton from '../../../../Components/CustomButton';
import PandaContext from '../../../../contexts/Panda';
import CommonSelectDropdown from '../../../../Components/CommonSelectDropdown';
import customAxios from '../../../../CustomeAxios';
import Toast from 'react-native-toast-message';
import reactotron from 'reactotron-react-native';



const RegisterAsAffiliate = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const bankData = [
        'State Bank of India',
        'HDFC Bank',
        'ICICI Bank',
        'Federal Bank',
        'Indian Overseas Bank',
        'Standard Chartered Bank',
        'Yes Bank',
        'Axis Bank',
        'Kerala Gramin Bank',
        'South Indian Bank',
        'Bank of Baroda',
        'Canara Bank',
        'Central Bank of India',
        'IDBI Bank',
        'Syndicate Bank',
    ];


    
    



    const schema = yup.object({
        name: yup.string().required('Name is required'),
        phone: yup.number("Phone type must be number").required('Phone number is required'),
        email: yup.string().email("Input value must be Email.").required('Email is required'),
        bankname: yup.string().required('Bank Name is required'),
        ifsc_code: yup.string().required('IFSC Code is required').min(5, 'IFSC Code should be atleast 5 characters.').max(15, 'IFSC Code is limited to 15 characters.'),
        accountnumber: yup.string().required('Account Number is required').min(5, 'Account Number should be atleast 5 characters.').max(15, 'Account Number is limited to 15 characters.'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue, setError, reset } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        return () => {
          reset()
        }
      }, [])


    const onSubmit = useCallback((value) => {
        setLoading(true);
        customAxios.post('customer/affiliate/register', value)
            .then(res => {
                navigation.navigate('WorkWithPanda', { mode: 'success' })
            })
            .catch(err => {
                Toast.show({
                    type: 'error',
                    text1: err
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])



    return (
        <>
            <HeaderWithTitle title={'Register As Affiliate'} />
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal: 15,
                    paddingTop: 40
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
                    error={errors.phone}
                    fieldName="phone"
                    top={20}
                    topLabel={'Phone Number'}
                    inputMode={'numeric'}
                />
                <CommonInput
                    control={control}
                    error={errors.email}
                    fieldName="email"
                    topLabel={'Email Id'}
                    top={15}
                />

                <CommonSelectDropdown
                    data={bankData}
                    topLabel={'Bank Name'}
                    mt={15}
                    control={control}
                    setValue={setValue}
                    setError={setError}
                    error={errors.bankname}
                    fieldName='bankname'
                    placeholder='Bank Name'
                    height={60}
                />

                <CommonInput
                    control={control}
                    top={15}
                    error={errors.ifsc_code}
                    topLabel={'IFSC'}
                    fieldName="ifsc_code"
                    placeholder='IFSC Code'
                    inputMode={'text'}
                />

                <CommonInput
                    control={control}
                    topLabel={'Account Number'}
                    top={15}
                    error={errors.accountnumber}
                    fieldName="accountnumber"
                    placeholder='Account Number'
                    inputMode={'numeric'}
                />

                <CustomButton
                    onPress={loading ? null : handleSubmit(onSubmit)}
                    loading={loading}
                    label={'Submit'}
                    bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={30}
                />

            </ScrollView>
        </>
    )
}

export default RegisterAsAffiliate

const styles = StyleSheet.create({


})