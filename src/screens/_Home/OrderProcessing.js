import { ActivityIndicator, NativeModules, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import reactotron from 'reactotron-react-native'
import Toast from 'react-native-toast-message'
import { has, isEmpty } from 'lodash'
import CartContext from '../../contexts/Cart'
import AllInOneSDKManager from 'paytm_allinone_react-native';
import customAxios from '../../CustomeAxios'

const { env, mode } = NativeModules.RNENVConfig


const OrderProcessing = ({ route, navigation }) => {
    const { height } = useWindowDimensions()
    const cartContext = useContext(CartContext)


    useEffect(() => {
        placeOrder()
        return () => {
            
        }
    }, [])

    const placeOrder = async() => {
        try {
            cartContext?.setCart(null)
            let order = await customAxios.post(`customer/order/new-test-create`, route?.params?.datas);
            if(order?.data?.message === "Success"){
                let data = order?.data?.data
                if (data?.payment_type == "online" && has(data, "paymentDetails") && !isEmpty(data?.paymentDetails)) {
                    payWithPayTM(data)
                } else {
                    navigation.navigate("OrderPlaced", { item: data })
                }
            }
            else{
                Toast.show({
                    text1: 'Error',
                    text2: 'Something went wrong',
                    type: 'error'
                })
            }
        } catch (error) {
            Toast.show({
                text1: 'Error',
                text2: error,
                type: 'error'
            })
            navigation.goBack()
        }
    }

    const payWithPayTM = async (data) => {

        const { paymentDetails } = data
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
                    updatePaymentResponse(result)
                    //setIsLoding(false);
                }
                else {
                    let data = {
                        STATUS: 'TXN_FAILURE',
                        RESPMSG: 'User Cancelled transaction',
                        ORDERID: orderId
                    }

                    updatePaymentResponse(data)
                    //setIsLoding(false);
                }
                // console.log("PAYTM =>", JSON.stringify(result));


            }).catch((err) => {
                let data = {
                    STATUS: 'TXN_FAILURE',
                    RESPMSG: 'User Cancelled transaction',
                    ORDERID: orderId
                }

                updatePaymentResponse(data)

            })
        } catch (error) {
            reactotron.log({ error })
        }

    }


    const updatePaymentResponse = async (data) => {
        let details = data
        let orderID = details.ORDERID?.replace(/^ORDER_/, "")

        await customAxios.post(`customer/order/payment/status`, data)
            .then(async response => {
                if (details?.STATUS == "TXN_SUCCESS") {
                    navigation.replace("OrderPlaced", { item: { created_at: details?.TXNDATE, order_id: orderID } })

                } else {
                    reactotron.log("in")
                    navigation.navigate("dashboard", { screen: "order" })
                    Toast.show({ type: 'error', text1: details?.RESPMSG || "Something went wrong !!!" })

                }

            }).catch(async error => {
                Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
                navigation.navigate("order")
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

export default OrderProcessing

const styles = StyleSheet.create({})