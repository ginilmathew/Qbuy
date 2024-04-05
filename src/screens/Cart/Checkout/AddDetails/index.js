import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useCallback, useContext } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderWithTitle from '../../../../Components/HeaderWithTitle';
import CommonInput from '../../../../Components/CommonInput';
import CustomButton from '../../../../Components/CustomButton';
import PandaContext from '../../../../contexts/Panda';


const AddDetails = ({navigation}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const schema = yup.object({
		mobile: yup.string().min(8).required('Phone number is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});

    const backAction = useCallback(() => {
        navigation.navigate('checkout')
    })

    const onSave = useCallback(() => {
        navigation.navigate('checkout')
    })

    return (
        <>
            <HeaderWithTitle title={'Add Details'} goback={backAction}/>
            <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', 
                    paddingHorizontal:15 ,
                    paddingTop:20
                }}
            >
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Area'}
                    mb={20}
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Address'}
                    mb={20}
                    placeholder='Complete Address e.g. house number, street name, etc'
                    placeholderTextColor='#0C256C21'
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Comments (Optional)'}
                    mb={20}
                    placeholder='Delivery Instructions e.g. Opposite Gold Souk Mall'
                    placeholderTextColor='#0C256C21'
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Mobile (Optional)'}
                    mb={20}
                    placeholder='Delivery Mobile Number e.g. mobile of the owner'
                    placeholderTextColor='#0C256C21'
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Pincode'}
                    mb={20}
                    placeholder='Delivery Pincode e.g. 695111'
                    placeholderTextColor='#0C256C21'
				/>
                <CustomButton
                    onPress={onSave}
                    label={'Save'}
                    bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={20}
                />
            </ScrollView>
        </>
    )
}

export default AddDetails

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
    }
})