import { Alert, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import CommonTexts from '../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomButton from '../../Components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import ItemsCard from './ItemsCard'
import PandaContext from '../../contexts/Panda'
import moment from 'moment'
import customAxios from '../../CustomeAxios'
import AllInOneSDKManager from 'paytm_allinone_react-native';
import CartContext from '../../contexts/Cart'
import LoaderContext from '../../contexts/Loader'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import reactotron from 'reactotron-react-native'
import { has } from 'lodash'
import { NativeModules } from "react-native"
import CommonStatusCard from '../../Components/CommonStatusCard'


const { env, mode } = NativeModules.RNENVConfig

const OrderCard = memo(({ item, refreshOrder }) => {

    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const loadingg = useContext(LoaderContext)
    let active = contextPanda.active
    const [showItems, setShowItems] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [qty, setQty] = useState('')
    const [totalRate, setTotalRate] = useState('')
    const navigation = useNavigation()

    const { width, height } = useWindowDimensions()




    useEffect(() => {
        if (item?.myOrder) {
            setQty(item?.myOrder.reduce((total, currentValue) => total = total + parseInt(currentValue.quandity), 0))
            setTotalRate(item?.myOrder.reduce((total, currentValue) => total = total + parseInt(currentValue.rate), 0))
        }
    }, [item?.myOrder])

    const clickItem = useCallback(() => {
        setShowItems(!showItems)
    })

    const clickAddress = useCallback(() => {
        setShowAddress(!showAddress)
    })

    const clickDetails = useCallback(() => {
        navigation.navigate('ViewDetails', { item: item, qty: qty, totalRate: totalRate })
    }, [navigation])

    const clickRateOrder = useCallback(() => {
        navigation.navigate('RateOrder', { item: item })
    }, [navigation])

    const payWithPayTM = async (data) => {

        const { newpaymentDetails } = data
        let orderId = newpaymentDetails?.orderId
        let isStaging = env === "live" ? false : true


        const callbackUrl = {
            true: "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=",
            false: "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID="
        }

        await AllInOneSDKManager.startTransaction(

            newpaymentDetails?.orderId,//orderId
            newpaymentDetails?.mid,//mid
            newpaymentDetails?.txnToken,//txnToken
            parseFloat(newpaymentDetails?.amount)?.toFixed(),//amount
            `${callbackUrl[isStaging]}${newpaymentDetails?.orderId}`,//callbackUrl
            isStaging,//isStaging
            true,//appInvokeRestricted
            `paytm${newpaymentDetails?.mid}`
            //urlScheme

        ).then((result) => {


            if (has(result, "STATUS") && result?.STATUS == "TXN_SUCCESS") {
                updatepaymentdata(result)
                refreshOrder();
            }
            else {
                let data = {
                    STATUS: 'TXN_FAILURE',
                    RESPMSG: 'User Cancelled transaction',
                    ORDERID: newpaymentDetails?.orderId
                }
                //updatepaymentdata(data)
                refreshOrder();
            }
            // console.log("PAYTM =>", JSON.stringify(result));


        }).catch((err) => {
            // reactotron.log({err})
            // console.log("PAYTM Error =>", JSON.stringify(err));
            Toast.show({ type: 'error', text1: err || "Something went wrong !!!" });
            let data = {
                STATUS: 'TXN_FAILURE',
                RESPMSG: 'User Cancelled transaction',
                ORDERID: orderId
            }
            updatePaymentResponse(data)
            refreshOrder();
        });
        // reactotron.log({newpaymentDetails})

    }


    const payAmountBalance = useCallback(async () => {
        loadingg.setLoading(true)
        let data = {
            id: item?._id
        }
        await customAxios.post(`/customer/order/update-payment`, data)
            .then(async response => {
                const { data } = response


                if (data?.message === "Success") {
                    payWithPayTM(data?.data)
                    refreshOrder();
                } else {
                    Toast.show({ type: 'error', text1: data?.message || "Something went wrong !!!" });
                    refreshOrder();
                }
                loadingg.setLoading(false)
            })
            .catch(async error => {

                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingg.setLoading(false)
                refreshOrder();
            })
    }, [item?._id])



    const updatePaymentResponse = async (data) => {
        let details = data
        await customAxios.post(`customer/order/payment/status`, data)
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
                refreshOrder()
            })
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

    const payAmount = useCallback(async () => {
        await cartContext.updateCart()
        loadingg.setLoading(true)
        cartContext.setCart(null);
        let data = {
            id: item?._id
        }

        await customAxios.post(`customer/order/paynow`, data)
            .then(async response => {
                const { data } = response;
                cartContext.getCartDetails()
                //cartContext.setCart(data?.data)
                navigation.navigate('cart')
                //refreshOrder();
                // if (data?.status) {
                //     payWithPayTM(data?.data)
                // } else {
                //     Toast.show({ type: 'error', text1: data?.message || "Something went wrong !!!" });
                // }
                loadingg.setLoading(false)
            })
            .catch(async error => {

                Toast.show({
                    type: 'error',
                    text1: error
                });

                loadingg.setLoading(false)
                refreshOrder();
            })
    }, [item, cartContext?.cart?._id, cartContext?.cart])


    const OrderCancel = async () => {
        Alert.alert('Warning', 'Are you sure want to cancel order?', [
            {
                text: 'Cancel',
                //onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    try {
                        await customAxios.post(`customer/customer-order-cancelled`, { id: item?._id })
                        Toast.show({ type: 'success', text1: 'Order cancelled successfully' })
                        refreshOrder();
                    } catch (err) {
                        Toast.show({
                            type: 'error',
                            text1: err
                        });

                    }
                }
            },
        ]);

    }

    const renderStatusLabel = (status) => {

        switch (status) {
            case "created":
                return <CommonStatusCard label={status} bg='#BCE4FF' labelColor={'#0098FF'} />
            case "pending":
                return <CommonStatusCard label={status} bg='#FFF082' labelColor={'#A99500'} />
            case "completed":
                return <CommonStatusCard label={status} bg='#CCF1D3' labelColor={'#58D36E'} />
            case "cancelled":
                return <CommonStatusCard label={status} bg='#FFC9C9' labelColor={'#FF7B7B'} />
            default:
                return <CommonStatusCard label={status === "orderReturn" ? "Return" : status} bg='#FFF082' labelColor={'#A99500'} />
        }
    }


    const renderActions = () => {
        if (item?.payment_type === 'COD') {
            if (item?.status === "completed") {
                return (
                    <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <CustomButton
                            onPress={clickDetails}
                            label={'Details'}
                            bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                            // width={width / 3.5}
                            width={"49%"}
                        />
                        <CustomButton
                            onPress={clickRateOrder}
                            label={'Rate Order'}
                            bg='#58D36E'
                            //width={width / 3.5}
                            width={"49%"}
                        />
                    </View>
                )
            }
            else {
                return (
                    <CustomButton
                        onPress={clickDetails}
                        label={'View Details'}
                        bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                        mt={8}
                    />
                )
            }
        }
        else {
            if (item?.status === "completed") {
                return (
                    <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <CustomButton
                            onPress={clickDetails}
                            label={'Details'}
                            bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                            // width={width / 3.5}
                            width={"49%"}
                        />
                        <CustomButton
                            onPress={clickRateOrder}
                            label={'Rate Order'}
                            bg='#58D36E'
                            //width={width / 3.5}
                            width={"49%"}
                        />
                    </View>
                )
            }
            else if (item?.status !== 'cancelled') {
                if (item?.payment_status === 'cancelled') {
                    return (
                        <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomButton
                                onPress={payAmount}
                                label={'Pay Now'}
                                bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}

                                width={"49%"}
                            />
                            <CustomButton
                                onPress={clickDetails}
                                label={'Details'}
                                bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                                // width={width / 3.5}
                                width={"49%"}
                            />
                        </View>
                    )
                }
                else if (item?.payment_status !== 'cancelled') {
                    if (item?.pendingBalance && parseInt(item?.pendingBalance) > 0) {
                        return (
                            <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <CustomButton
                                    onPress={payAmountBalance}
                                    label={'Pay Balance'}
                                    bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                                    width={"49%"}
                                />
                                <CustomButton
                                    onPress={clickDetails}
                                    label={'Details'}
                                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                                    // width={width / 3.5}
                                    width={"49%"}
                                />
                            </View>
                        )
                    }
                    else {
                        return (
                            <CustomButton
                                onPress={clickDetails}
                                label={'View Details'}
                                bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                                mt={8}
                            />
                        )
                    }
                }
                else {
                    return (
                        <CustomButton
                            onPress={clickDetails}
                            label={'View Details'}
                            bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                            mt={8}
                        />
                    )
                }
            }
            else {
                return (
                    <CustomButton
                        onPress={clickDetails}
                        label={'View Details'}
                        bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                        mt={8}
                    />
                )
            }
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.textMedum}>{'Order ID '}</Text>
                    <CommonTexts label={item?.order_id} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.dateText}>{moment(item?.created_at).format("DD-MM-YYYY hh:mm A")}</Text>
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <View>
                    <Text style={styles.textRegular}>{'Total Items'}</Text>
                    <Text style={styles.textBold}>{item?.product_details?.length}</Text>
                </View>
                <View>
                    <Text style={styles.textRegular}>{'Total Payment'}</Text>
                    <Text style={styles.textBold}>{((has(item, "pendingBalance")) && item?.pendingBalance > 0) ? item?.pendingBalance : parseFloat(item?.grand_total).toFixed(2)}</Text>
                </View>
                <View>
                    <Text style={styles.textRegular}>{'Current Status'}</Text>
                    {/* <View
                        style={
                            item?.status === 'created' ? styles.pendingStatusBox : item?.status === 'completed' ? styles.completedStatusBox : null
                        }
                    >
                        <Text style={item?.status === 'created' ? styles.pendingStatusText : item?.status === 'completed' ? styles.completedStatusText : null} >{item?.status}</Text>
                    </View> */}
                    {renderStatusLabel(item?.status)}
                </View>
            </View>

            <View style={{ backgroundColor: '#fff', paddingBottom: 10, }}>
                <View style={styles.itemsRow}>
                    <Text style={styles.textBold}>{'Items'}</Text>
                    <TouchableOpacity onPress={clickItem}>
                        <Ionicons name={showItems ? 'chevron-up-circle' : 'chevron-down-circle'} size={22} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} />
                    </TouchableOpacity>
                </View>

                {showItems && <>
                    <View style={styles.itemsHeadingView}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={[styles.textBold, { textAlign: 'left' }]}>{'Product'}</Text>
                        </View>
                        <Text style={[styles.textBold, { textAlign: 'center' }]}>{'Qty'}</Text>
                        <Text style={[styles.textBold, { textAlign: 'center' }]}>{'Price'}</Text>
                    </View>

                    {item?.product_details.map((ite) =>
                        <ItemsCard item={ite} key={ite?.product_id} date={item?.created_at} />
                    )}
                </>}
            </View>

            <View
                style={{ backgroundColor: '#fff', paddingBottom: 10, borderTopWidth: showItems ? 0 : 1, borderColor: '#00000029', marginHorizontal: 7 }}
            >
                
                <View style={styles.shippingView}>
                    <Text style={styles.textBold}>{'Other Charges'}</Text>
                    <TouchableOpacity onPress={clickAddress}>
                        <Ionicons name={showAddress ? 'chevron-up-circle' : 'chevron-down-circle'} size={22} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} />
                    </TouchableOpacity>
                </View>

                {showAddress &&
                    <>
                        <View style={styles.chargesStyles}>
                            <View style={{ flex: 0.5 }}>
                                <Text style={[styles.textBold, { textAlign: 'left' }]}>{'Charge Name'}</Text>
                            </View>
                            <Text style={[styles.textBold, { textAlign: 'center' }]}>{'Amount'}</Text>
                        </View>
                        {item?.price_breakup?.map((pri, index) => (
                            <View key={`${pri?._id}${index}`} style={styles.delivery}>
                                <View style={{ flex: 0.5 }}>
                                    <Text style={[styles.text1, { textAlign: 'left' }]}>{pri?.charge_name}</Text>
                                </View>
                                <Text style={[styles.text1, { textAlign: 'center' }]}>₹ {pri?.price}</Text>
                            </View>
                        ))}
                    </>
                }

                {item?.refundAmount * 1 > 0 &&
                    <View
                        style={{ backgroundColor: '#fff', paddingBottom: 10, borderTopWidth: showItems ? 0 : 1, borderColor: '#00000029', height: 35, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginTop: 10}}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                            <Text style={styles.textBold}>{'Refund'}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'blue', fontFamily: 'Poppins-Medium' }}>{item?.refundAmount}</Text>
                        </View>
                    </View>}
                {item?.refund_completed_status === "completed" &&
                    <View
                        style={{ backgroundColor: '#fff', paddingBottom: 10, borderTopWidth: showItems ? 0 : 1, borderColor: '#00000029', height: 35, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000', fontFamily: 'Poppins-Medium' }}>{'Refund'}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'blue', fontFamily: 'Poppins-Medium' }}>{item?.refund_details?.refund_amount}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#8ED053', fontFamily: 'Poppins-Medium' }}>{'Completed'}</Text>
                        </View>
                    </View>}
                {renderActions()}

                {/* {item?.payment_type === 'COD' &&
                    <>

                        {item?.status === 'completed' ?
                            <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>

                                <CustomButton
                                    onPress={clickDetails}
                                    label={'Details'}
                                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                                    // width={width / 3.5}
                                    width={"49%"}
                                />
                                <CustomButton
                                    onPress={clickRateOrder}
                                    label={'Rate Order'}
                                    bg='#58D36E'
                                    //width={width / 3.5}
                                    width={"49%"}
                                />
                            </View> : null
                            //     <CustomButton
                            //     onPress={clickDetails}
                            //     label={'View Details'}
                            //     bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                            //     mt={8}
                            // />
                        }
                    </>

                } */}

                {/* {item?.payment_type === 'online' &&
                    <>

                        {item?.status === 'completed' ?
                            <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>

                                <CustomButton
                                    onPress={clickDetails}
                                    label={'Details'}
                                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                                    // width={width / 3.5}
                                    width={"49%"}
                                />
                                <CustomButton
                                    onPress={clickRateOrder}
                                    label={'Rate Order'}
                                    bg='#58D36E'
                                    //width={width / 3.5}
                                    width={"49%"}
                                />
                            </View> : null
                        }
                    </>

                } */}

                {/* {(item?.status !== 'cancelled' && item?.payment_status === 'cancelled') &&
                    <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <CustomButton
                            onPress={payAmount}
                            label={'Pay Now'}
                            bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}

                            width={"49%"}
                        />
                        <CustomButton
                            onPress={clickDetails}
                            label={'Details'}
                            bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                            // width={width / 3.5}
                            width={"49%"}
                        />
                    </View>
                } */}

                {/* {item?.pendingBalance * 1 > 0 && item?.payment_type === "online" && item?.payment_status !== 'cancelled' &&
                    <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <CustomButton
                            onPress={payAmountBalance}
                            label={'Pay Balance'}
                            bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                            width={"49%"}
                        />
                        <CustomButton
                            onPress={clickDetails}
                            label={'Details'}
                            bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                            // width={width / 3.5}
                            width={"49%"}
                        />
                    </View>} */}

                {/* {
                    (item?.status === "onLocation" && item?.customer_status !== "cancelled") &&
                    <View style={{ flex: 1, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <CustomButton
                            onPress={OrderCancel}
                            label={'Cancel Order'}
                            bg={'#FF7190'}
                            width={"49%"}
                        />
                        <CustomButton
                            onPress={clickDetails}
                            label={'Details'}
                            bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                            // width={width / 3.5}
                            width={"49%"}
                        />
                    </View>
                } */}
            </View>

            {/* {item?.customer_status === "cancelled" &&
                <View
                    style={{ backgroundColor: '#fff', paddingBottom: 10, borderTopWidth: showItems ? 0 : 1, borderColor: '#00000029', height: 35, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'red', fontFamily: 'Poppins-Medium' }}>{'Order Cancelled by you'}</Text>


                    </View>
                </View>} */}
            {/* {item?.refund_completed_status === "completed" &&
                <View
                    style={{ backgroundColor: '#fff', paddingBottom: 10, borderTopWidth: showItems ? 0 : 1, borderColor: '#00000029', height: 35, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000', fontFamily: 'Poppins-Medium' }}>{'Refund'}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'blue', fontFamily: 'Poppins-Medium' }}>{item?.refund_details?.refund_amount}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#8ED053', fontFamily: 'Poppins-Medium' }}>{'Completed'}</Text>
                    </View>
                </View>} */}

        </View>
    )
})

export default OrderCard

const styles = StyleSheet.create({
    delivery: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F3F3F3', 
        justifyContent: 'space-between', 
        paddingVertical: 10, 
        borderBottomWidth: 1, 
        borderColor: '#e8e8e8', 
        paddingHorizontal: 7, 
        marginHorizontal: -7
    },
    container: {
        borderRadius: 15,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 20,
        backgroundColor: '#fff',
        shadowOffset: { height: 5, width: 1 },
        elevation: 2,
        marginHorizontal: 2
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 6,
        justifyContent: 'space-between'
    },
    itemsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 7
    },
    itemsHeadingView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 7,
        marginBottom: 10
    },
    textMedum: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    dateText: {
        fontFamily: 'Poppins-Regular',
        color: '#555555A3',
        fontSize: 10,
    },
    itemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        margin: 7,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: '#00000029'
    },
    textRegular: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
    },
    pendingStatusBox: {
        backgroundColor: '#FFF297',
        borderRadius: 5,
        alignItems: 'center'
    },
    completedStatusBox: {
        backgroundColor: '#CEFF97',
        borderRadius: 5,
        alignItems: 'center'
    },
    pendingStatusText: {
        fontFamily: 'Poppins-Regular',
        color: '#B7A000',
        fontSize: 10,
        marginVertical: 4
    },
    completedStatusText: {
        fontFamily: 'Poppins-Regular',
        color: '#23B700',
        fontSize: 10,
        marginVertical: 4
    },

    textBold: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 11,
    },
    addressText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
    },
    shippingView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 5
    },
    addressBox: {
        backgroundColor: '#F3F3F3',
        borderRadius: 10
    },
    text1: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    cancelStyle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: 'red',
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
        marginTop: -5
    },
    chargesStyles: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
    },
})