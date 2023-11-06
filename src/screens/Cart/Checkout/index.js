/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import React, { useRef, useState, useEffect, useContext, useCallback } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import ItemsCard from '../../MyOrders/ItemsCard'
import CheckoutItemCard from './CheckoutItemCard'
import AddMoreItem from './AddMoreItem'
import CustomButton from '../../../Components/CustomButton'
import ChooseDeliverySpeed from './ChooseDeliverySpeed'
import CommonInput from '../../../Components/CommonInput'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { uniq } from 'lodash'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import AllInOneSDKManager from 'paytm_allinone_react-native';

import FastImage from 'react-native-fast-image'
import ChooseTip from './ChooseTip'
import ChooseDeliveryType from './ChooseDeliveryType'
import CommonTexts from '../../../Components/CommonTexts'
import PandaContext from '../../../contexts/Panda'
import customAxios from '../../../CustomeAxios'
import AuthContext from '../../../contexts/Auth'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/core'
import CartContext from '../../../contexts/Cart'
import Toast from 'react-native-toast-message'
import PaymentMethod from './PaymentMethod'
import { RefreshControl } from 'react-native-gesture-handler'
import LoaderContext from '../../../contexts/Loader'
import { max } from 'lodash'
import reactotron from 'reactotron-react-native'
import { NativeModules } from "react-native"


const { env, mode } = NativeModules.RNENVConfig


const Checkout = ({ navigation }) => {


    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const authContext = useContext(AuthContext)

    let active = contextPanda.active

    let myLocation = authContext?.userLocation
    // let myCity = authContext?.city




    const loadingg = useContext(LoaderContext)
    const loader = loadingg?.loading

    const refRBSheet = useRef();


    const [cartItems, setCartItems] = useState(null)
    const [deliveryCharge, setDeliveryCharge] = useState(null)


    const [selected, setSelected] = useState('1')
    const [selectedTip, setSelectedTip] = useState('2')
    const [selectedDelivery, setSelectedDelivery] = useState('1')
    const [isLoading, setIsLoding] = useState(false)
    const [price, setPrice] = useState('')
    const [showList, setShowList] = useState(false)
    const [platformCharge, setPlatformCharge] = useState('')
    const [payment, setPayment] = useState([
        {
            _id: 'online',
            name: "Online",
            selected: true
        },
        {
            _id: 'COD',
            name: "COD",
            selected: false
        }
    ])







    const schema = yup.object({
        mobile: yup.string().min(8).required('Phone number is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });




    useFocusEffect(
        React.useCallback(() => {
            if (cartContext?.cart?._id) {
                getCartItems();
                getplatformCharge();
            }

        }, [cartContext?.cart?._id])

    );


    const getplatformCharge = async () => {
        try {
            const response = await customAxios.get('common/platformcharge');
            setPlatformCharge(response?.data?.data)

        } catch (err) {

        }
    }

    const getCartItems = async () => {
        await customAxios.get(`customer/cart/show/${cartContext?.cart?._id}`)
            .then(async response => {
                let products = response?.data?.data?.product_details;
                let finalProducts = [];
                //let quantity = pro?.quantity ? parseFloat(pro?.quantity) : 0
                products?.map((pro) => {
                    let quantity = pro?.quantity ? parseFloat(pro?.quantity) : 0
                    let type = pro?.type;
                    let offer, regular, comm, seller, delivery, minQty, stock, fromDate, toDate, stock_value, product;
                    if (type === "single") {
                        offer = pro?.productdata?.offer_price ? parseFloat(pro?.productdata?.offer_price) : 0
                        regular = pro?.productdata?.regular_price ? parseFloat(pro?.productdata?.regular_price) : 0
                        comm = pro?.productdata?.commission ? pro?.productdata?.commission : pro?.productdata?.vendors?.additional_details?.commission ? pro?.productdata?.vendors?.additional_details?.commission : 0
                        seller = pro?.productdata?.seller_price ? parseFloat(pro?.productdata?.seller_price) : 0
                        delivery = pro?.productdata?.fixed_delivery_price ? parseFloat(pro?.productdata?.fixed_delivery_price) : 0
                        minQty = pro?.productdata?.minimum_qty ? parseFloat(pro?.productdata?.minimum_qty) : 0
                        stock = pro?.productdata?.stock
                        fromDate = moment(pro?.productdata?.offer_date_from).isValid() ? moment(pro?.productdata?.offer_date_from, "YYYY-MM-DD") : null
                        toDate = moment(pro?.productdata?.offer_date_to).isValid() ? moment(pro?.productdata?.offer_date_to, "YYYY-MM-DD") : null
                        stock_value = pro?.productdata?.stock_value ? parseFloat(pro?.productdata?.stock_value) : 0
                        product = {
                            store_address: pro?.productdata?.vendors.store_address,
                            product_id: pro?.product_id,
                            name: pro?.name,
                            image: pro?.image,
                            type: pro?.type,
                            quantity: quantity,
                            stock: stock,
                            delivery,
                            commission: comm,
                            minimum_qty: minQty,
                            stock_value,
                            store: pro?.productdata?.store,
                            variant_id: null,
                            franchisee: pro?.productdata?.franchisee,
                            cartId: response?.data?.data?._id
                        }
                    }
                    else {
                        offer = pro?.variants?.offer_price ? parseFloat(pro?.variants?.offer_price) : 0
                        regular = pro?.variants?.regular_price ? parseFloat(pro?.variants?.regular_price) : 0
                        comm = pro?.variants?.commission ? pro?.variants?.commission : pro?.productdata?.vendors?.additional_details?.commission ? pro?.productdata?.vendors?.additional_details?.commission : 0
                        seller = pro?.variants?.seller_price ? parseFloat(pro?.variants?.seller_price) : 0
                        delivery = pro?.variants?.fixed_delivery_price ? parseFloat(pro?.variants?.fixed_delivery_price) : 0
                        minQty = pro?.productdata?.minimum_qty ? parseFloat(pro?.productdata?.minimum_qty) : 0
                        stock = pro?.productdata?.stock;
                        fromDate = moment(pro?.variants?.offer_date_from).isValid() ? moment(pro?.variants?.offer_date_from, "YYYY-MM-DD") : null
                        toDate = moment(pro?.variants?.offer_date_to).isValid() ? moment(pro?.variants?.offer_date_to, "YYYY-MM-DD") : null
                        stock_value = pro?.variants?.stock_value ? parseFloat(pro?.variants?.stock_value) : 0
                        product = {
                            store_address: pro?.productdata?.vendors.store_address,
                            product_id: pro?.product_id,
                            name: pro?.name,
                            image: pro?.image,
                            type: pro?.type,
                            quantity: quantity,
                            stock: stock,
                            delivery,
                            commission: comm,
                            minimum_qty: minQty,
                            attributes: pro?.variants?.attributs,
                            stock_value,
                            store: pro?.productdata?.store,
                            variant_id: pro?.variants?._id,
                            franchisee: pro?.productdata?.franchisee,
                            cartId: response?.data?.data?._id
                        }
                    }

                    if (stock) {
                        //products have stock
                        if (quantity <= stock_value) {
                            //required quantity available
                            product['available'] = true
                            if (offer > 0) {
                                if (moment(fromDate, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") && moment(toDate, "YYYY-MM-DD") >= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")) {
                                    let finalPrice = offer * quantity;
                                    product['price'] = finalPrice;
                                    product['unitPrice'] = offer;
                                    finalProducts.push(product)
                                }
                                else if (fromDate && !toDate) {
                                    if (moment(fromDate, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")) {
                                        let finalPrice = offer * quantity;
                                        product['price'] = finalPrice;
                                        product['unitPrice'] = offer;
                                        finalProducts.push(product)
                                    }
                                    else if (regular > 0) {
                                        let finalPrice = regular * quantity;
                                        product['price'] = finalPrice;
                                        product['unitPrice'] = regular;
                                        finalProducts.push(product)
                                    }
                                    else {
                                        let commission = (seller / 100) * comm
                                        let amount = (seller + commission) * quantity;
                                        product['unitPrice'] = seller + commission;
                                        product['price'] = amount;
                                        finalProducts.push(product)
                                    }
                                }
                                else if (!fromDate && !toDate) {
                                    let finalPrice = offer * quantity;
                                    product['price'] = finalPrice;
                                    product['unitPrice'] = offer;
                                    finalProducts.push(product)
                                }
                                else {
                                    if (regular > 0) {
                                        let finalPrice = regular * quantity;
                                        product['price'] = finalPrice;
                                        product['unitPrice'] = regular;
                                        finalProducts.push(product)
                                    }
                                    else {
                                        let commission = (seller / 100) * comm
                                        let amount = (seller + commission) * quantity;
                                        product['unitPrice'] = seller + commission;
                                        product['price'] = amount;
                                        finalProducts.push(product)
                                    }
                                }
                            }
                            else if (regular > 0) {
                                let finalPrice = regular * quantity;
                                product['price'] = finalPrice;
                                product['unitPrice'] = regular;
                                finalProducts.push(product)
                            }
                            else {
                                let commission = (seller / 100) * comm
                                let amount = (seller + commission) * quantity;
                                product['unitPrice'] = seller + commission;
                                product['price'] = amount;
                                finalProducts.push(product)
                            }
                        }
                        else {
                            product['available'] = false;
                            finalProducts.push(product)
                        }
                    }
                    else {
                        product['available'] = true
                        if (offer > 0) {
                            if (moment(fromDate, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") && moment(toDate, "YYYY-MM-DD") >= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")) {
                                let finalPrice = offer * quantity;
                                product['price'] = finalPrice;
                                product['unitPrice'] = offer;
                                finalProducts.push(product)
                            }
                            else if (fromDate && !toDate) {
                                if (moment(fromDate, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")) {
                                    let finalPrice = offer * quantity;
                                    product['price'] = finalPrice;
                                    product['unitPrice'] = offer;
                                    finalProducts.push(product)
                                }
                                else if (regular > 0) {
                                    let finalPrice = regular * quantity;
                                    product['price'] = finalPrice;
                                    product['unitPrice'] = regular;
                                    finalProducts.push(product)
                                }
                                else {
                                    let commission = (seller / 100) * comm
                                    let amount = (seller + commission) * quantity;
                                    product['unitPrice'] = seller + commission;
                                    product['price'] = amount;
                                    finalProducts.push(product)
                                }
                            }
                            else if (!fromDate && !toDate) {
                                let finalPrice = offer * quantity;
                                product['price'] = finalPrice;
                                product['unitPrice'] = offer;
                                finalProducts.push(product)
                            }
                            else {
                                if (regular > 0) {
                                    let finalPrice = regular * quantity;
                                    product['price'] = finalPrice;
                                    product['unitPrice'] = regular;
                                    finalProducts.push(product)
                                }
                                else {
                                    let commission = (seller / 100) * comm
                                    let amount = (seller + commission) * quantity;
                                    product['unitPrice'] = seller + commission;
                                    product['price'] = amount;
                                    finalProducts.push(product)
                                }
                            }
                        }
                        else if (regular > 0) {
                            let finalPrice = regular * quantity;
                            product['price'] = finalPrice;
                            product['unitPrice'] = regular;
                            finalProducts.push(product)
                        }
                        else {
                            let commission = (seller / 100) * comm
                            let amount = (seller + commission) * quantity;
                            product['price'] = amount;
                            product['unitPrice'] = seller + commission;
                            finalProducts.push(product)
                        }
                    }
                })
                setCartItems(finalProducts)
                //getTotalAmount()
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })

    }













    datas = [
        {
            _id: '1',
            name: 'Slot Based',
            timing: '60 - 90 min',
            rate: 56
        },
        {
            _id: '2',
            name: 'Express Delivery',
            timing: '45 - 60 min',
            rate: 93
        },
        {
            _id: '3',
            name: 'Economic',
            timing: 'within 24 hrs',
            rate: 28
        },

    ]

    tips = [
        {
            _id: '1',
            rate: '₹ 10'
        },
        {
            _id: '2',
            most: 'Most Tipped',
            rate: '₹ 20'
        },
        {
            _id: '3',
            rate: '₹ 30'
        },
        {
            _id: '4',
            rate: 'other'
        },
    ]

    delivery = [
        {
            _id: '1',
            name: 'Leave at the door',
            iconName: 'door-closed'
        },
        {
            _id: '2',
            name: 'Avoid ringing the bell',
            iconName: 'bell'
        },
        {
            _id: '3',
            name: 'Avoid calling',
            iconName: 'mobile'
        },
        {
            _id: '4',
            name: 'Leave with the security',
            iconName: 'user-alt'

        },
    ]

    let charges = [
        {
            _id: '1',
            name: 'Sub-Total',
            rate: '460',
            flashIcon: false
        },
        {
            _id: '2',
            name: 'Platform & Other Charges',
            rate: '10',
            flashIcon: false
        },
        {
            _id: '3',
            name: 'Surge Charge',
            rate: '20',
            flashIcon: true
        },
        {
            _id: '4',
            name: 'Delivery Charge (Slot Based)',
            rate: '60',
            flashIcon: false

        },
    ]

    useEffect(() => {
        if (charges) {
            setPrice(charges.reduce((total, currentValue) => total = total + parseInt(currentValue.rate), 0))
        }
    }, [charges])

    const clickAddtails = useCallback(() => {
        navigation.navigate('AddDetails')
    }, [])

    const gotoCoupons = useCallback(() => {
        navigation.navigate('Coupons')
    }, [])

    const clickBillDetails = useCallback(() => {
        setShowList(!showList)
    })


    //const checkProductAvailability = () => {}

    const placeOrder = async () => {
        setIsLoding(true);
        let franchise = await customAxios.post('customer/get-franchise', { coordinates: authContext.location })

        if (!franchise) {
            setIsLoding(false);
            return false;
        }

        if (!cartContext?.defaultAddress) {
            Toast.show({
                type: 'error',
                text1: 'Please add Delivery  Address to continue'
            });
            setIsLoding(false);
            return false;
        }

        let data = {
            cart_id: cartContext?.cart?._id,
            address_id: cartContext?.defaultAddress?._id
        }

        await customAxios.post('customer/get-cart-product', data).then(async response => {
            let products = [];
            let amount = 0;
            let stores = []

            cartItems?.map(cart => {
                stores.push(cart?.store?._id)
                products.push({
                    product_id: cart?.product_id,
                    name: cart?.name,
                    image: cart?.image,
                    type: cart?.type,
                    variant_id: cart?.variant_id,
                    quantity: cart?.quantity,
                    price: cart?.price,
                    unitPrice: cart?.unitPrice,
                    deliveryPrice: cart?.delivery
                })
            })

            if (!cartContext.defaultAddress?.area?.location) {
                Toast.show({
                    type: 'error',
                    text1: 'Please add Delivery  Address to continue'
                });
                return false;
            }

            let uniqueStore = uniq(stores)
            let pay = payment.find(pay => pay.selected === true)

            const orderDetails = {
                product_details: products,
                user_id: authContext?.userData?._id,
                billing_address: cartContext?.defaultAddress?._id,
                shipping_address: cartContext?.defaultAddress?._id,
                payment_status: pay._id === "online" ? "pending" : "created",
                payment_type: pay._id,
                type: active,
                total_amount:cartItems.reduce(function (previousVal, currentVal) {
                    return previousVal + currentVal?.price;
                }, 0)?.toFixed(2),
                delivery_charge: cartItems?.reduce((a, b) => a.delivery > b.delivery ? a : b).delivery?.toFixed(2),
                delivery_type: "Slot based",
                franchise: cartItems?.[0]?.franchisee?._id,
                cart_id: cartItems?.[0]?.cartId,
                store: uniqueStore,
                delivery_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                platform_charge: platformCharge?.platformCharge

            }

            if (products?.length > 0) {
                await customAxios.post(`customer/order/test-create`, orderDetails)
                    .then(async response => {
                        // console.log("response ==>", JSON.stringify(response.data), response.status)
                        const { data } = response;
                        if (data?.type === 'cart') {
                            navigation.navigate('Cart');
                        }
                        if (data?.status) {
                            if (data?.data?.payment_type == "online" && has(data?.data, "paymentDetails") && !isEmpty(data?.data?.paymentDetails)) {
                                payWithPayTM(data?.data)
                            } else {
                                cartContext?.setCart(null)
                                setCartItems(null)
                                await AsyncStorage.removeItem("cartId");
                                navigation.navigate('OrderPlaced', { item: response.data?.data })
                                setIsLoding(false);
                            }
                        } else {
                            cartContext?.setCart(null)
                            setCartItems(null)
                            navigation.goBack()
                            Toast.show({ type: 'error', text1: data?.message || "Something went wrong !!!" });
                            setIsLoding(false);
                        }
                    }).catch(error => {

                        Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
                        setIsLoding(false);
                    });
            }
            else {
                Toast.show({
                    type: 'info',
                    text1: 'Please add some products to cart to proceed'
                })
                setIsLoding(false);
            }
        }).catch((err) => {
            Toast.show({
                type: 'info',
                text1: JSON.parse(err)
            })
            setIsLoding(false);
        })
    }


    const updatePaymentResponse = async (data) => {
        let details = data
        let orderID = details.ORDERID?.replace(/^ORDER_/, "")

        await customAxios.post(`customer/order/payment/status`, data)
            .then(async response => {
                cartContext?.setCart(null)
                setCartItems(null)
                await AsyncStorage.removeItem("cartId");
                if (details?.STATUS == "TXN_SUCCESS") {
                    navigation.navigate('OrderPlaced', { item: { created_at: details?.TXNDATE, order_id: orderID } })
                    cartContext?.setCart(null)
                } else {
                    navigation.navigate("order")
                    Toast.show({ type: 'error', text1: details?.RESPMSG || "Something went wrong !!!" })

                }

            }).catch(async error => {
                cartContext?.setCart(null)
                setCartItems(null)
                Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
                cartContext?.setCart(null)
                setCartItems(null)
                await AsyncStorage.removeItem("cartId");
                navigation.navigate("order")
            })
    }



    const payWithPayTM = async (data) => {
        const { paymentDetails } = data
        let orderId = paymentDetails?.orderId
        let isStaging = env === "live" ? false : true
        const callbackUrl = {
            true: "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=",
            false: "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID="
        }

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
                updatePaymentResponse(result)
                setIsLoding(false);
            }
            else {
                let data = {
                    STATUS: 'TXN_FAILURE',
                    RESPMSG: 'User Cancelled transaction',
                    ORDERID: orderId
                }
                reactotron.log('CANCEL PAYMENT')
                updatePaymentResponse(data)
                setIsLoding(false);
            }
            // console.log("PAYTM =>", JSON.stringify(result));


        }).catch((err) => {

            let data = {
                STATUS: 'TXN_FAILURE',
                RESPMSG: 'User Cancelled transaction',
                ORDERID: orderId
            }

            reactotron.log('CANCEL PAYMENT 2')
            updatePaymentResponse(data)
            setIsLoding(false);
        });

    }


    const refreshCart = () => {
        getCartItems()
    }


    const navigateToAddress = () => {
        navigation.navigate("account", { screen: "MyAddresses", params: { mode: 'checkout' } })
    }


    const setPaymentMethod = useCallback((id) => {
        let pays = payment?.map(pay => {
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

        setPayment(pays)
    }, [])

    const backToCart = useCallback(() => {
        navigation.navigate('Cart')
    }, [navigation])


    return (
        <>
            <HeaderWithTitle title={ 'Checkout' } onPressBack={ backToCart } />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={ loader } onRefresh={ getCartItems } />
                }
                style={ { flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#F3F3F3', } }>

                {/* products */ }
                <View style={ styles.productBox }>
                    <View style={ styles.productHeader }>
                        <View style={ { flex: 0.42 } }>
                            <Text style={ styles.boldText }>{ 'Product' }</Text>
                        </View>
                        <Text style={ styles.unitPrice }>{ 'Price' }</Text>
                        <Text style={ styles.quantity }>{ 'Qty' }</Text>
                        <Text style={ styles.total }>{ 'Total' }</Text>
                    </View>
                    <View style={ styles.itemUnderProduct }>
                        { cartItems?.map((item, index) =>
                            <CheckoutItemCard
                                item={ item }
                                key={ index }
                                index={ index }
                                refreshCart={ refreshCart }
                            />
                        ) }
                    </View>
                    {/* <AddMoreItem />
                    <Text style={styles.regularText}>{'Add Cooking Instructions'}</Text>
                    <View style={styles.saveBox}>
                        <Text style={styles.italicText}>{'Need to be well cooked...'}</Text>
                        <TouchableOpacity>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-ExtraBold',
                                    color: active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#FF7190' : '#5897D3',
                                    fontSize: 12,
                                }}
                            >{'Save'}</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                {/* Order for Others */ }
                {/* <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Order for Others'}</Text>
                    <Text style={styles.mediumGrayText}>{'Order food for your friends, family etc...'}</Text>
                    <CustomButton
                        onPress={clickAddtails}
                        label={'Add Details'}
                        bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5897D3'}
                        mt={10}
                    />
                </View> */}

                {/*Delivery Speed */ }
                <View style={ styles.commonContainer }>
                    <Text style={ styles.boldText }>{ 'Payment Methods' }</Text>
                    { payment.map((item, index) =>
                        <PaymentMethod
                            item={ item }
                            key={ index }
                            setSelected={ setPaymentMethod }
                        />
                    ) }
                </View>

                {/* Add Coupon */ }
                {/* <View style={styles.commonContainer}>
                    <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={styles.boldText}>{'Add Coupon'}</Text>
                        <TouchableOpacity 
                            onPress={gotoCoupons}                            
                            style={{flexDirection:'row', alignItems:'center',}}>
                            <Text style={{
                                fontFamily: 'Poppins-Medium',
                                color: '#23233C',
                                fontSize: 10,

                            }}>{'View All'}</Text>
                            <Ionicons name='chevron-forward-circle' size={18} color={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} marginLeft={3}/>
                        </TouchableOpacity>

                    </View>
                    <Text style={styles.mediumGrayText}>{'Do you have any coupon with you? You can use it here to get additional discounts'}</Text>
                    <View style={styles.enterCouponBox}>
                        <CommonInput
                            width={'75%'}
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            inputMode={'numeric'}
                            backgroundColor='#F2F2F2'
                            maxHeight={40}
                            placeholder='Enter Coupon'
                            placeholderTextColor={'#A5A5A5'}
                        />
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <CustomButton
                                bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                                label='Apply'
                                width={'90%'}
                            />
                        </View>
                    </View>
                </View> */}

                {/* Give a Tip */ }
                {/* <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Give a Tip!'}</Text>
                    <Text style={styles.mediumGrayText}>{'Leave your delivery partner with a tip so that you could show an appreciation for his efforts!'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {tips.map((item, index) =>
                            <ChooseTip
                                item={item}
                                key={index}
                                selected={selectedTip}
                                setSelected={setSelectedTip}
                            />
                        )}
                    </View>
                </View> */}

                {/* Add Delivery Instructions */ }
                {/* <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Add Delivery Instructions'}</Text>
                    <Text style={styles.mediumGrayText}>{'Add necessary instruction for your delivery partner'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {delivery.map((item, index) =>
                            <ChooseDeliveryType
                                item={item}
                                key={index}
                                selected={selectedDelivery}
                                setSelected={setSelectedDelivery}
                            />
                        )}
                    </View>
                </View> */}

                {/* panda coins */ }
                {/* <View 
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
                        <FastImage source={active === 'green' ? require('../../../Images/Orangepanda.png') : require('../../../Images/panda.png')} style={styles.logo} />
                        <Text style={styles.boldText}>{'30'}</Text>
                        <Text style={styles.textRegular}>{' Panda coins can be used'}</Text>
                    </View>
                    <CustomButton label={'Apply'} bg={ active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' :  '#586DD3'} width={100} />
                </View> */}

                {/* grand total */ }
                <View style={ styles.grandTotalBox }>
                    {/* <View style={styles.grandTotalTop}>
                        <Text style={styles.textMedium}>{'Delivery Tip'}</Text>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: 11,
                                color: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'
                            }}
                        >{'Add Tip'}</Text>
                    </View> */}
                    {/* <View style={styles.grandTotalMid}>
                        <Text style={styles.textMedium}>{'Govt Taxes & Other Charges'}</Text>
                        <Text style={styles.textMedium}>₹ {'10'}</Text>
                    </View> */}
                    { cartItems?.length > 0 && <View style={ styles.grandTotalMid }>
                        <Text style={ styles.textMedium }>{ 'Delivery Fee' }</Text>
                        <Text style={ styles.textMedium }>₹ { cartItems?.length > 0 ? parseFloat(cartItems?.reduce((a, b) => a.delivery > b.delivery ? a : b).delivery).toFixed(2) : null } </Text>
                    </View> }
                    { cartItems?.length > 0 && <View style={ styles.grandTotalMid }>
                        <Text style={ styles.textMedium }>{ 'Platform Charge' }</Text>
                        <Text style={ styles.textMedium }>₹ { cartItems?.length > 0 ? parseFloat(platformCharge?.platformCharge).toFixed(2) : null } </Text>
                    </View> }

                    { cartItems?.length > 0 && <View style={ styles.grandTotalBottom }>
                        <Text style={ styles.boldText }>{ 'Grand Total' }</Text>
                        <Text style={ styles.boldText }>₹ { parseFloat(cartItems?.reduce(function (previousVal, currentVal) {
                            return previousVal + currentVal?.price;
                        }, 0) + cartItems?.reduce((a, b) => a.delivery > b.delivery ? a : b).delivery + platformCharge?.platformCharge).toFixed(2) }</Text>
                    </View> }
                </View>

            </ScrollView>

            {/* Bottom View */ }
            <View style={ styles.addressContainer }>
                <Pressable style={ styles.addrHeader } onPress={ navigateToAddress }>
                    <View >
                        <Foundation name={ 'target-two' } color='#FF0000' size={ 20 } marginTop={ 5 } />
                    </View>
                    <View style={ { flex: 0.8, marginLeft: 10 } }>
                        { cartContext.defaultAddress?.area?.location ? <CommonTexts label={ cartContext.defaultAddress?.area?.location } fontSize={ 16 } /> : <CommonTexts label={ 'Please Add Address !!!' } fontSize={ 14 } color={ '#FF5757' } /> }
                        <Text
                            style={ styles.address }
                        >{ cartContext.defaultAddress?.area?.address && cartContext.defaultAddress?.area?.address }</Text>
                    </View>

                    <TouchableOpacity style={ { position: 'absolute', right: 20, top: 10 } } onPress={ navigateToAddress }>
                        <MaterialCommunityIcons name={ 'lead-pencil' } color={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#5871D3' } size={ 18 } marginTop={ 5 } />
                    </TouchableOpacity>
                </Pressable>
                { (!showList && cartItems?.length > 0) && <View style={ { flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 5 } }>
                    <Text
                        style={ styles.textMedium }
                    >{ 'Grand Total  ' }</Text>
                    <Text
                        style={ styles.boldText }
                    >₹ { parseFloat(cartItems?.reduce(function (previousVal, currentVal) {
                        return previousVal + currentVal?.price;
                    }, 0) + cartItems?.reduce((a, b) => a.delivery > b.delivery ? a : b).delivery + platformCharge?.platformCharge).toFixed(2) }</Text>
                </View> }

                { (showList && cartItems?.length > 0) && <>
                    <View style={ styles.totalBill }>
                        <Text
                            style={ styles.boldText }
                        >Total Bill</Text>
                    </View>
                    <View style={ styles.charges }>
                        <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                            {/* {item?.flashIcon && <Fontisto name={'flash'} color={'#FF0000'} size={12} marginRight={4}/>} */ }
                            <Text
                                style={ styles.textMedium }
                            >{ "Sub Total" }</Text>
                        </View>
                        <Text
                            style={ styles.textMedium }
                        >₹ { parseFloat(cartItems?.reduce(function (previousVal, currentVal) {
                            return previousVal + currentVal?.price;
                        }, 0)).toFixed(2) }</Text>

                    </View>
                    <View style={ styles.charges }>
                        <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                            {/* {item?.flashIcon && <Fontisto name={'flash'} color={'#FF0000'} size={12} marginRight={4}/>} */ }
                            <Text
                                style={ styles.textMedium }
                            >{ "Delivery Charge" }</Text>
                        </View>
                        <Text
                            style={ styles.textMedium }
                        >₹ { parseFloat(cartItems?.reduce((a, b) => a.delivery > b.delivery ? a : b).delivery).toFixed(2) }</Text>

                    </View>
                    <View style={ styles.charges }>
                        <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                            {/* {item?.flashIcon && <Fontisto name={'flash'} color={'#FF0000'} size={12} marginRight={4}/>} */ }
                            <Text
                                style={ styles.textMedium }
                            >{ "Platform Charge" }</Text>
                        </View>
                        <Text
                            style={ styles.textMedium }
                        >₹ { platformCharge?.platformCharge }</Text>

                    </View>
                    {/* {charges.map(item => 
                        (<View key={item?._id} style={styles.charges}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                {item?.flashIcon && <Fontisto name={'flash'} color={'#FF0000'} size={12} marginRight={4}/>}
                                <Text
                                    style={styles.textMedium}
                                >{item?.name}</Text>
                            </View>
                            <Text
                                style={styles.textMedium}
                            >₹{item?.rate}</Text>
                            
                        </View>)
                    )} */}
                    <View style={ styles.grandTotal }>
                        <Text
                            style={ styles.textMedium }
                        >{ 'Grand Total  ' }</Text>
                        <Text
                            style={ styles.boldText }
                        >₹ { parseFloat(cartItems?.reduce(function (previousVal, currentVal) {
                            return previousVal + currentVal?.price;
                        }, 0) + cartItems?.reduce((a, b) => a.delivery > b.delivery ? a : b).delivery + platformCharge?.platformCharge).toFixed(2) }</Text>
                    </View>
                </> }

                <View
                    style={ {
                        backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E',
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        position: 'absolute',
                        width: '100%',
                        bottom: 0
                    } }
                >
                    <TouchableOpacity
                        onPress={ clickBillDetails }
                        style={ styles.viewDetails }
                    >
                        <CommonTexts label={ 'View Detailed Bill' } color='#fff' fontSize={ 12 } />
                        <Ionicons name={ showList ? 'chevron-down' : 'chevron-up' } size={ 20 } color='#fff' marginLeft={ 2 } />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={ isLoading }
                        style={ { alignItems: 'flex-end', flex: 0.5 } }
                        onPress={ isLoading ? null : placeOrder }
                    >
                        <CommonTexts label={ isLoading ? "Loading..." : 'Place Order' } color='#fff' fontSize={ 17 } />
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default Checkout

const styles = StyleSheet.create({

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
        fontSize: 11,
    },
    mediumGrayText: {
        fontFamily: 'Poppins-Medium',
        color: '#A5A5A5',
        fontSize: 9,
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
        paddingVertical: 5,
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