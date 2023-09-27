import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useCallback, useContext } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import HeaderWithTitle from '../../../../Components/HeaderWithTitle';
import CommonInput from '../../../../Components/CommonInput';
import CustomButton from '../../../../Components/CustomButton';
import PandaContext from '../../../../contexts/Panda';



const RegisterAsAffiliate = ({navigation}) => {
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    const schema = yup.object({
		mobile: yup.string().min(8).required('Phone number is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});


    const onSubmit = useCallback(() => {
        navigation.navigate('WorkWithPanda', {mode : 'success'})
    }, [])
    return (
        <>
            <HeaderWithTitle title={'Register As Affiliate'} />
            <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', 
                    paddingHorizontal:15, 
                    paddingTop:40 
                }}
            >
              
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
             
                    topLabel={'Name'}
                    mb={20}
                    
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                   
                    topLabel={'Phone Number'}
                    mb={20}
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                   
                    topLabel={'Email Id'}
                    mb={20}
				/>
                <CustomButton
                    onPress={onSubmit}
                    label={'Submit'}
                    bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={20}
                />
            </ScrollView>
        </>
    )
}

export default RegisterAsAffiliate

const styles = StyleSheet.create({


})