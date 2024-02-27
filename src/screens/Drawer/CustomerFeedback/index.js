import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import LottieView from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
import CommonInput from '../../../Components/CommonInput';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';
import customAxios from '../../../CustomeAxios';
import Toast from 'react-native-toast-message';
import { navigationRef } from '../../../Navigations/RootNavigation';
import { useNavigation } from '@react-navigation/native';

const phoneRegExp = /^(0|[1-9]\d*)(\.\d+)?$/

const CustomerFeedback = () => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    const [loading, setLoading] = useState(false)

    const schema = yup.object({
        complaint: yup.string().required('Feedback is required to submit'),
        order_id: yup.number("Order ID should be a numeric value").nullable(true).typeError("Order ID should be a numeric value"),
    }).required();

    const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = useCallback(async (data) => {


        setLoading(true)

        await customAxios.post(`customer/complaints`, data)
            .then(async response => {
                //user.setUserData(response?.data?.data)
                Toast.show({
                    type: 'success',
                    text1: 'Feedback submitted successfully'
                })
                reset()
                //navigation.goBack()
                setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                })
                setLoading(false)
            });

    }, [])

    const feedbackRes = () => {
        navigationRef.navigate('FeedbackResp')
    }


    return (
        <>
            <HeaderWithTitle title={'Customer Feedbacks'} />
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal: 15
                }}
            >
                <View style={styles.lottieView}>
                    <LottieView
                        style={{ height: '100%', width: '100%' }}
                        source={require('../../../Lottie/feedback.json')}
                        autoPlay
                        loop
                    />
                </View>
                <Text style={styles.mainText}>{'Give us your valuable feedbacks so thatwe can improve in the future!'}</Text>

                <CommonInput
                    control={control}
                    error={errors.order_id}
                    placeholder="Eg: 01234"
                    placeholderTextColor="#989898"
                    fieldName="order_id"
                    topLabel={'Order ID (Optional)'}
                    inputMode={"numeric"}
                    mb={10}
                    shadowOpacity={0}
                />
                <View style={{ marginVertical: 5 }}></View>
                <CommonInput
                    control={control}
                    error={errors.complaint}
                    fieldName="complaint"
                    topLabel={'Comments'}
                    mb={10}
                    maxHeight={120}
                    //minHeight={100}
                    multi={true}
                />


                <CustomButton
                    label={'Submit'}
                    bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={20}
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                />

                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity style={styles.fdbtn} onPress={feedbackRes}>
                        <Text style={{ fontFamily: "Poppins-SemiBold", color: "#fff" }}>Feedback Responses</Text>
                        <Ionicons name={"arrow-forward"} size={25} color='#fff' />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: 20 }}></View>


            </ScrollView>
            {/* <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:18,letterSpacing:1}}>Coming Soon!...</Text>

            </View> */}
        </>
    )
}

export default CustomerFeedback

const styles = StyleSheet.create({

    lottieView: {
        height: 140,
        alignItems: 'center',
        marginTop: 30
    },
    mainText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 20,
        marginBottom: 20
    },
    fdbtn: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        backgroundColor: "#FF9090",
        padding: 12,
        borderRadius: 11,
        shadowColor: "#b1b1b1",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
    }
})