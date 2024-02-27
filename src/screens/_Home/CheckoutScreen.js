import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import customAxios from '../../CustomeAxios';
import PandaContext from '../../contexts/Panda';
import { useFocusNotifyOnChangeProps } from '../../hooks/useFocusNotifyOnChangeProps';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import reactotron from 'reactotron-react-native';
import HeaderWithTitle from '../../Components/Home/HeaderWithTitle';
import CheckoutItemCard from '../../Components/Home/CheckoutItemCard';
import PaymentMethod from '../Cart/Checkout/PaymentMethod';
import DeliveryCharge from '../../Components/Home/DeliveryCharge';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonInput from '../../Components/CommonInput';
import CustomButton from '../../Components/CustomButton';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import FastImage from 'react-native-fast-image';
import CheckoutBottomView from '../../Components/Home/CheckoutBottomView';
import LoadingModal from '../../Components/LoadingModal';
import moment from 'moment';
import AuthContext from '../../contexts/Auth';
import Toast from 'react-native-toast-message';



const getCheckout = async (datas) => {
    const checkoutData = await customAxios.post('customer/checkout', datas);

    return checkoutData?.data?.data;
}



const CheckoutScreen = () => {

    const firstTimeRef = React.useRef(true)
    const { active } = useContext(PandaContext)
    const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    const navigation = useNavigation()
    const [showList, setShowList] = useState(false)
    const [paymentDetails, setPaymentDetails] = useState([])
    const userContext = useContext(AuthContext)
    const [loading, setLoading] = useState(false)



    const schema = yup.object({
        coupon: yup.string().min(8).required('Coupon Code is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema)
    });







    let datass = {
        type: active
    }


    const { data, isLoading, refetch } = useQuery({
        queryKey: ['checkout', datass],
        queryFn: () => getCheckout(datass),
        notifyOnChangeProps,
        retry: false
    })


    useEffect(() => {
        if (data?.coupon_details?.coupon_code) {
            reactotron.log("in")
            let data = {
                coupon: data?.coupon_details?.coupon_code
            }

            reset(data)
            setValue("coupon", data?.coupon_details?.coupon_code)
        }

        if (data?.payment_type_details) {
            setPaymentDetails(data?.payment_type_details)
        }


    }, [data])





    useFocusEffect(
        React.useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            refetch()
        }, [refetch])
    )


    const backToCart = () => {
        navigation.goBack()
    }

    const goToStore = (item) => {
        let items = {
            _id: item?.store_id
        }

        //reactotron.log({data})
        navigation.navigate('store', { name: item?.store_name, mode: 'store', storeId: item?.store_id, item: items })
    }


    const setDelivery = async (item) => {
        //reactotron.log({item})
        try {
            setLoading(true)
            let data = {
                type: active,
                slot_details: item
            }
            let response = await customAxios.post(`customer/checkout/set-delivery-slot`, data)
            if (response?.data?.message === "Success") {
                refetch()
            }
        } catch (error) {

        }
        finally{
            setLoading(false)
        }
    }


    const gotoCoupons = async () => {
        try {
            let datas = {
                type: active,
                coordinates: [data?.address?.area?.latitude, data?.address?.area?.longitude]
            }
            navigation.navigate('Coupons', { data: datas })
            // let response = await customAxios.post(`customer/coupons/list`, datas)
            // reactotron.log({ response })
            // if (response?.data?.message === "Coupon list") {
            //     navigation.navigate('Coupons', { data: datas })
            //     //refetch()
            // }
        } catch (error) {

        }
    }


    const placeOrder = async () => {
        try {
            let available = data?.cart?.filter(prod => !prod?.available || !prod?.availability)
            if (data?.selected_delivery_charge && available?.length === 0) {
                
                let paymentType = paymentDetails?.find(pay => pay?.selected === true)
                let stores = data?.cart?.map(pr => pr?.store_id)
                let datas = {
                    product_details: data?.cart,
                    user_id: userContext?.userData?._id,
                    billing_address: data?.address?._id,
                    shipping_address: data?.address?._id,
                    payment_status: "created",
                    payment_type: paymentType?._id,
                    type: active,
                    total_amount: data?.total_price,
                    delivery_charge: data?.selected_delivery_charge?.charge_value,
                    delivery_charge_details: data?.selected_delivery_charge,
                    franchise: data?.franchise_id,
                    store: stores,
                    delivery_date: moment().format("YYYY-MM-DD HH:mm"),
                    panda_coins_applied: data?.applied_panda_coins,
                    other_charges: data?.other_charges,
                    grand_total: data?.grand_total,
                    common_tax_charge: data?.common_tax_charge,
                    category_tax_charge: data?.category_tax_charge,
                    price_breakup: data?.price_breakup,
                    offer_id: data?.offer_id,
                    coupon_details: data?.coupon_details,
                    coupon_amount: data?.coupon_amount ? data?.coupon_amount : null
                }

                navigation.navigate("order", { datas })

                // let order = await customAxios.post(`customer/order/new-test-create`, datas);

                // if(order?.data?.message === "Success"){

                // }
            }
            else {
                if(available?.length > 0){
                    Toast.show({
                        text1: 'Warning',
                        text2: 'Some products are not available. Please remove from cart before continue',
                        type: 'error'
                    })
                }
                else{
                    Toast.show({
                        text1: 'Warning',
                        text2: 'Please Choose delivery slot to continue',
                        type: 'error'
                    })
                }
            }
        } catch (error) {

        }
    }

    const navigateToAddress = () => {
        navigation.navigate("MyAddresses", { mode: 'checkout' })
    }


    const clickBillDetails = () => {
        setShowList(prev => !prev)
    }


    const setPaymentMethod = (id, index) => {
        let details = paymentDetails?.map(pay => {
            if (pay?._id === id) {
                return {
                    ...pay,
                    selected: true
                }
            }
            else {
                return {
                    ...pay,
                    selected: false
                }
            }
        })

        setPaymentDetails(details)
    }


    const applyCoupon = async() => {
        let values = getValues()
        if(values?.coupon){
            setLoading(true)
        
            try {
                let data = {
                    coupon_code: values?.coupon,
                    type: active
                }
                let response = await customAxios.post(`customer/coupons-code/check`, data)
                if(response?.data?.message === "Store offerd"){
                    let datas = {
                        coupon_id: response?.data?.data,
                        type: active
                    }
                    Alert.alert('Warning', 'Some products already have an offer. If you choose to use this offer, any applied offer in the cart will be removed. Do you want to continue?', [
                        {
                          text: 'Cancel',
                          onPress: null,
                          style: 'cancel',
                        },
                        {text: 'OK', onPress: () =>  removeOffers(datas)},
                    ]);
                }
                else if(response?.data?.message === "Customer group offer"){
                    Toast.show({
                        text1:'Warning',
                        text2: 'You are not allowed to use any other offers',
                        type:'error'
                    })
                }
                else if(response?.data?.message === "Coupon Applied"){
                    Toast.show({
                        text1:'Success',
                        text2: 'Coupon Applied successfully',
                        type:'success'
                    })
                    refetch()
                }
            } catch (error) {
                Toast.show({
                    text1: 'Error',
                    text2: error,
                    type: 'error'
                })
            }
            finally{
                setLoading(false)
            }
        }
        
    }

    const removeOffers = async(data) => {
        try {
            setLoading(true)
            let response = await customAxios.post(`customer/cart/remove-offer`, data);
            if(response?.data?.message === "Success"){
                refetch()
                Toast.show({
                    text1: "Success",
                    text2: 'Coupon Applied successfully'
                })
            }


        } catch (error) {
            
        }
        finally{
            setLoading(false)
        }
    }


    const cancelCoupon = async() => {
        try {
            setLoading(true)
            let data = {
                type: active
            }
            let response = await customAxios.post(`customer/cart/remove-coupon`, data)
            if(response?.data?.message === "Success"){
                Toast.show({
                    text1: 'Success',
                    text2: 'Coupon Removed successfully',
                    type: 'success'
                })
                refetch()
            }
        } catch (error) {
            Toast.show({
                text1: 'Error',
                text2: error,
                type: 'error'
            })
        }
        finally{
            setLoading(false)
        }
    }


    const applyCoins = async() => {
        try {
            setLoading(true)
            let datas = {
                panda_coin: data?.panda_coins?.total,
                type: active
            }
            let response = await customAxios.post(`customer/checkout/apply-pandacoin`, datas)
            if(response?.data?.message === "Success"){
                Toast.show({
                    text1: 'Success',
                    text2: 'Panda Coin applied successfully',
                    type: 'success'
                })

                refetch()
            }
            // if(response?.data?.message === "Store offerd"){
            //     Alert.alert('Warning', 'Some products already have an offer. If you choose to use this offer, any applied offer in the cart will be removed. Do you want to continue?', [
            //         {
            //           text: 'Cancel',
            //           onPress: null,
            //           style: 'cancel',
            //         },
            //         {text: 'OK', onPress: () =>  applyCoins()},
            //     ]);
            // }
        } catch (error) {
            
        }
        finally{
            setLoading(false)
        }
    }


    const applyPandaCoins =async() => {
        try {
            setLoading(true)
            let datas = {
                panda_coin: data?.panda_coins?.total,
                type: active
            }
            let response = await customAxios.post(`customer/panda-coin/check`, datas)
            if(response?.data?.message === "Store offerd"){
                Alert.alert('Warning', 'Some products already have an offer. If you choose to use this offer, any applied offer in the cart will be removed. Do you want to continue?', [
                    {
                      text: 'Cancel',
                      onPress: null,
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () =>  applyCoins()},
                ]);
            }
            else if(response?.data?.message === "Customer group offer"){
                Toast.show({
                    text1: 'Another Offer already applied for you.',
                    text2: "You can't able to apply two offer at a time",
                    type: 'error'
                })
            }
        } catch (error) {
            
        }
        finally{
            setLoading(false)
        }
    }



    return (
        <>
            <HeaderWithTitle title={'Checkout'} onPressBack={backToCart} />
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }>
                <View style={styles.productBox}>
                    <View style={styles.productHeader}>
                        <View style={{ flex: 0.42 }}>
                            <Text style={styles.boldText}>{'Product'}</Text>
                        </View>
                        <Text style={styles.unitPrice}>{'Price'}</Text>
                        <Text style={styles.quantity}>{'Qty'}</Text>
                        <Text style={styles.total}>{'Total'}</Text>
                    </View>
                    <View style={styles.itemUnderProduct}>
                        {data?.cart?.map((item, index) =>
                            <CheckoutItemCard
                                item={item}
                                key={index}
                                index={index}
                                openStore={goToStore}
                            />
                        )}
                    </View>
                </View>
                {data?.address && <>
                    <View style={styles.productBox}>
                        <View style={styles.commonContainer}>
                            <Text style={styles.boldText}>{'Delivery Speed'}</Text>
                            {data?.delivery_charge?.map((item, index) =>
                                <DeliveryCharge
                                    item={item}
                                    key={index}
                                    onClick={() => setDelivery(item)}
                                    active={active}
                                    selected={item?._id === data?.selected_delivery_charge?._id ? true : false}
                                />
                            )}
                        </View>
                    </View>
                    <View style={styles.productBox}>
                        <View style={styles.commonContainer}>
                            <Text style={styles.boldText}>{'Payment Mode'}</Text>
                            {paymentDetails?.map((item, index) =>
                                <PaymentMethod
                                    item={item}
                                    key={index}
                                    setSelected={(id) => setPaymentMethod(id, index)}
                                />
                            )}
                        </View>
                    </View>
                    <View style={styles.productBox}>
                        <View style={styles.commonContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={styles.boldText}>{'Add Coupon'}</Text>
                                <TouchableOpacity
                                    onPress={gotoCoupons}
                                    style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text style={{
                                        fontFamily: 'Poppins-Medium',
                                        color: '#23233C',
                                        fontSize: 10,

                                    }}>{'View All'}</Text>
                                    <Ionicons name='chevron-forward-circle' size={18} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} marginLeft={3} />
                                </TouchableOpacity>

                            </View>
                            <Text style={styles.mediumGrayText}>{'Do you have any coupon with you? You can use it here to get additional discounts'}</Text>
                            <View style={styles.enterCouponBox}>
                                <CommonInput
                                    width={'75%'}
                                    control={control}
                                    error={errors.coupon}
                                    fieldName="coupon"
                                    inputMode={'text'}
                                    backgroundColor='#F2F2F2'
                                    maxHeight={40}
                                    placeholder='Enter Coupon'
                                    placeholderTextColor={'#A5A5A5'}
                                    values={data?.coupon_details?.coupon_code}
                                    editable={data?.coupon_details?.coupon_code ? false : true}
                                />
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <CustomButton
                                        bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                                        label={data?.coupon_details?.coupon_code ? 'Cancel' : 'Apply'}
                                        width={'90%'}
                                        onPress={data?.coupon_details?.coupon_code ? cancelCoupon : applyCoupon}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    {data?.panda_coins && <View
                        style={{
                            backgroundColor: active === 'green' ? '#fae8d4' : '#cae2fa',
                            height: 80,
                            marginTop: 10,
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingHorizontal: 20,
                            justifyContent: 'space-between'
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FastImage source={active === 'green' ? require('../../Images/Orangepanda.png') : require('../../Images/panda.png')} style={styles.logo} />
                            <Text style={styles.boldText}>{data?.panda_coins?.total}</Text>
                            <Text style={styles.textRegular}>{' Panda coins can be used'}</Text>
                        </View>
                        <CustomButton onPress={!data?.applied_panda_coins ? applyPandaCoins : null} label={data?.applied_panda_coins ? 'Applied' : 'Apply'} bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#586DD3'} width={100} />
                    </View>}
                    <View style={styles.grandTotalBox}>
                        <View style={styles.grandTotalMid}>
                            <Text style={styles.textMedium}>{'Govt Taxes & Other Charges'}</Text>
                            <Text style={styles.textMedium}>₹ {parseFloat(data?.other_charges) + parseFloat(data?.selected_delivery_charge?.charge_value)}</Text>
                        </View>

                        <View style={styles.grandTotalBottom}>
                            <Text style={styles.boldText}>{'Grand Total'}</Text>
                            <Text style={styles.boldText}>₹ {data?.grand_total}</Text>
                        </View>
                    </View>
                </>}





            </ScrollView>
            <CheckoutBottomView
                data={data}
                active={active}
                clickBillDetails={clickBillDetails}
                placeOrder={placeOrder}
                navigateToAddress={navigateToAddress}
                showList={showList}
            />
            <LoadingModal isVisible={isLoading || loading} />
        </>
    )
}

export default CheckoutScreen

const styles = StyleSheet.create({
    loaderStyle: {
        width: 45,
        height: 45,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowOffset: 2,
    },
    productBox: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 10,
    },

    commonContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 10,
        padding: 10
    },
    unitPrice: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 12,
        flex: 0.2,
        textAlign: 'center'
    },
    quantity: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 12,
        flex: 0.15,
        textAlign: 'center'
    },
    total: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 12,
        flex: 0.27,
        textAlign: 'center'
    },
    boldText: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 13,
        fontWeight: '900'
    },
    mediumGrayText: {
        fontFamily: 'Poppins-Medium',
        color: '#A5A5A5',
        fontSize: 11,
        marginTop: 3
    },
    regularText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        marginLeft: 10,
        marginTop: 10
    },
    italicText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 12,
    },

    saveBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginVertical: 10
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 5,
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        borderColor: '#707070',

    },
    itemUnderProduct: {
        paddingHorizontal: 10,
    },
    logo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10
    },
    grandTotalBox: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 10,
        marginBottom: 200
    },

    enterCouponBox: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center'
    },
    textRegular: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11
    },
    textMedium: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        color: '#23233C'
    },

    grandTotalTop: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10
    },
    grandTotalMid: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        borderBottomColor: '#EDEDED',
    },
    grandTotalBottom: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5
    },

    addressContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 63,
        shadowOpacity: 0.08,
        elevation: 1
    },
    addrHeader: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F3F3'
    },

    address: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    },
    totalBill: {
        paddingHorizontal: 40,
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F3F3'
    },
    charges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 5
    },
    grandTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 5,
        borderTopWidth: 0.5,
        borderTopColor: '#F3F3F3'
    },
    viewDetails: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'flex-start'
    }



})