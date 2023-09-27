import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
import CommonInput from '../../../Components/CommonInput';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';


const SellWithUs = () => {
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    
    const schema = yup.object({
		mobile: yup.string().min(8).required('Phone number is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});

    return (
        <>
            <HeaderWithTitle title={'Sell With Us'} noBack/>
            <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', 
                    paddingHorizontal:15 
                }}
            >
                <View style={styles.lottieView}>
                    <Lottie 
                        source={{uri: 'https://assets8.lottiefiles.com/packages/lf20_9aaqrsgf.json'}} 
                        autoPlay
                    />
                </View>
                <Text style={styles.mainText}>{'Register As A Seller & See Your Profit Grow!'}</Text>

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
                    backgroundColor={!active === 'green' &&'#F2F2F2'}
                    topLabel={'Store Name'}
                    mb={20}
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Contact Number'}
                    mb={20}
				/>

                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'location'}
                    mb={20}
                
				/>
                  <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'comments'}
                    mb={20}
                    placeholder='Tell us more about your store...'
                    placeholderTextColor='#0C256C21'
				/>

                <CustomButton
                    label={'Submit'}
                    bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={20}
                />

              
                
            </ScrollView>
        </>
    )
}

export default SellWithUs

const styles = StyleSheet.create({

    lottieView : {
        height:170, 
        alignItems:'center', 
        marginTop:20
    },
    mainText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign:'center',
        paddingHorizontal:40,
        marginTop:10,
        marginBottom:20
    }
})