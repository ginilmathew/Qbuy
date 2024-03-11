import { ActivityIndicator, NativeModules, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import reactotron from 'reactotron-react-native'
import Toast from 'react-native-toast-message'
import { has, isEmpty } from 'lodash'
import CartContext from '../../contexts/Cart'
import AllInOneSDKManager from 'paytm_allinone_react-native';
import customAxios from '../../CustomeAxios'

const { env, mode } = NativeModules.RNENVConfig


const PayBalance = ({ route, navigation }) => {
    const { height } = useWindowDimensions()

    useEffect(() => {
        payWithPayTM(route?.params?.datas)
    }, [route?.params?.datas])

    

    const payWithPayTM = async (data) => {


        reactotron.log({data})

        const { newpaymentDetails:paymentDetails  } = data
        let orderId = paymentDetails?.orderId
        let isStaging = env === "live" ? false : true
        const callbackUrl = {
            true: "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=",
            false: "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID="
        }

        try {

            await AllInOneSDKManager.startTransaction(
                paymentDetails?.orderId,//orderId
                paymentDetails?.mid,//mid
                paymentDetails?.txnToken,//txnToken
                paymentDetails?.amount.toFixed(2),//amount
                `${callbackUrl[isStaging]}${paymentDetails?.orderId}`,//callbackUrl
                isStaging,//isStaging
                true,//appInvokeRestricted
                `paytm${paymentDetails?.mid}`//urlScheme
            ).then((result) => {
                if (has(result, "STATUS")) {
                    result.ORDERID=orderId
                    updatepaymentdata(result)
                    //setIsLoding(false);
                }
                else {
                    let data = {
                        STATUS: 'TXN_FAILURE',
                        RESPMSG: 'User Cancelled transaction',
                        ORDERID: orderId
                    }

                    updatepaymentdata(data)
                    //setIsLoding(false);
                }
                // console.log("PAYTM =>", JSON.stringify(result));


            }).catch((err) => {
                let data = {
                    STATUS: 'TXN_FAILURE',
                    RESPMSG: 'User Cancelled transaction',
                    ORDERID: orderId
                }

                updatepaymentdata(data)

            })
        } catch (error) {
            reactotron.log({ error })
        }

    }


    const updatepaymentdata = async (data) => {
        let details = data
        await customAxios.post(`customer/order/update-paymentdata`, data)
            .then(async response => {
                if (details?.STATUS == "TXN_SUCCESS") {
                    Toast.show({ type: 'success', text1: 'Payment Success' })
                    refreshOrder()
                } else {
                    Toast.show({ type: 'error', text1: details?.RESPMSG || "Something went wrong !!!" })
                    refreshOrder()
                }

            }).catch(async error => {

                Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
                refreshOrder();
            })
    }

    return (
        <SafeAreaView>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: height - 100 }}>
                <Text style={{ textAlign: 'center' }}>Your Order is in process. Do not Press back or cancel button.</Text>
                <ActivityIndicator size={"large"} color={"red"} />
            </View>

        </SafeAreaView>
    )
}

export default PayBalance

const styles = StyleSheet.create({})