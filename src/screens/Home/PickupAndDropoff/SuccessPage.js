import { View, Text } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import LottieView from 'lottie-react-native'
import PandaContext from '../../../contexts/Panda'
import { NativeModules } from "react-native"
import AllInOneSDKManager from 'paytm_allinone_react-native';
import has from 'lodash/has'
import LoadingModal from '../../../Components/LoadingModal'
import customAxios from '../../../CustomeAxios'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import reactotron from 'reactotron-react-native'



// const { env, mode } = NativeModules.RNENVConfig



const env = 'dev'


const SuccessPage = ({ navigation, route }) => {

    const contextPanda = useContext(PandaContext)
    const [success, setSuccess] = useState(false);
    let active = contextPanda.active


    const updatePaymentResponse = async (data) => {
        let details = data


        await customAxios.post(`customer/pickup-drop-charge/payment/status`, data)
            .then(async response => {

                if (details?.STATUS == "TXN_SUCCESS") {
                    setSuccess(true)
                } else {
                    // navigation.replace('PickupAndDropoff', { date: route?.params?.date, time: route?.params?.time });
                    navigation.goBack()
                    Toast.show({ type: 'error', text1: details?.RESPMSG || "Something went wrong !!!" })
                }

            }).catch(async error => {
                // navigation.replace('PickupAndDropoff', { date: route?.params?.date, time: route?.params?.time });
                navigation.goBack() 
                Toast.show({
                    type: 'error',
                    text1: error
                })
            }).finally(() => {

            })
    }


    const payWithPayTM = async () => {

        const { paymentDetails } = route?.params?.data

       // reactotron.log({paymentDetails}, "in", env)

        let orderId = paymentDetails?.orderId
        let isStaging = env === "live" ? false : true

        const callbackUrl = {
            dev: "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=",
            live: "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID="
        }

        // setIsLoding(false)

        //let paymentStarted = true;
        try {

            AllInOneSDKManager.startTransaction(
                paymentDetails?.orderId,//orderId
                paymentDetails?.mid,//mid
                paymentDetails?.txnToken,//txnToken
                paymentDetails?.amount,//amount
                `${callbackUrl[env]}${paymentDetails?.orderId}`,//callbackUrl
                isStaging,//isStaging
                true,//appInvokeRestricted
                `paytm${paymentDetails?.mid}`//urlScheme
            ).then((result) => {

                reactotron.log({result})
                //paymentStarted = false

                // setLoading(true)

                if (has(result, "STATUS")) {
                    updatePaymentResponse(result)
                    // setLoading(false);
                }
                else {
                    let data = {
                        STATUS: 'TXN_FAILURE',
                        RESPMSG: 'User Cancelled transaction',
                        ORDERID: orderId
                    }

                    updatePaymentResponse(data)
                    // setLoading(false);
                }
                // console.log("PAYTM =>", JSON.stringify(result));


            }).catch((err) => {
                reactotron.log({err})

                let data = {
                    STATUS: 'TXN_FAILURE',
                    RESPMSG: 'User Cancelled transaction',
                    ORDERID: orderId
                }

                // setLoading(true);
                updatePaymentResponse(data)

            })
                .finally(() => {
                    // setPaymentInitiated(false)
                });
        } catch (error) {
            console.log(error);
        }


    }

    useEffect(() => {
        payWithPayTM();
    }, [])


    const goHome = useCallback(() => {
        navigation.navigate('Home')
    }, [])


    if (success) {
        setTimeout(goHome, 3000)


        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff'
            }}>
                <LottieView
                    style={{ height: 150, width: 150 }}
                    source={require('../../../Lottie/successTick.json')}
                    autoPlay
                />
                <Text style={{
                    textAlign: 'center',
                    marginTop: 20,
                    color: 'black',
                    width: '90%',
                    fontWeight: '700'
                }}>{'Your pick-up and drop-off order has been successfully created.'}</Text>
            </View>
        )
    }

    return <LoadingModal isVisible />
}

export default SuccessPage