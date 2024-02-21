import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

    const schema = yup.object({
        mobile: yup.string().min(8).required('Phone number is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });



    

    

    let datass = {
        type: active
    }


    const { data, isLoading, refetch } = useQuery({
        queryKey: ['checkout', datass],
        queryFn: () => getCheckout(datass),
        notifyOnChangeProps
    })


    

    


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


    const setDelivery = async(item) => {
        //reactotron.log({item})
        try {
            let data = {
                type: active,
                slot_details: item
            }
            let response = await customAxios.post(`customer/checkout/set-delivery-slot`, data)
            if(response?.data?.message === "Success"){
                refetch()
            }
        } catch (error) {
            
        }
    }


    const gotoCoupons = async() => {
        try {
            let datas = {
                type: active,
                coordinates: [data?.address?.area?.latitude, data?.address?.area?.longitude]
            }
            let response = await customAxios.post(`customer/coupons/list`, datas)
            reactotron.log({response})
            if(response?.data?.message === "Coupon list"){
                navigation.navigate('Coupons', { data: response?.data?.data })
                //refetch()
            }
        } catch (error) {
            
        }
    }


    const placeOrder = () => {
        if(defaultAddress){

        }
        else{
            Alert.alert('Warning', 'Please Add default address to proceed', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: navigateToAddress},
            ]);
        }
    }

    const navigateToAddress = () => {
        navigation.navigate("MyAddresses", { mode: 'checkout' })
    }


    const clickBillDetails = () => {
        setShowList(prev => !prev)
    }



    return (
        <>
            <HeaderWithTitle title={'Checkout'} onPressBack={backToCart} />
            <ScrollView showsVerticalScrollIndicator={false}>
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
            <View style={styles.productBox}>
                <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Delivery Speed'}</Text>
                    {data?.delivery_charge?.map((item, index) =>
                        <DeliveryCharge
                            item={item}
                            key={index}
                            onClick={() => setDelivery(item)}
                            active={active}
                            selected={item?._id === data?.selected_delivery_charge?._id ? true :  false}
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
                </View>
            </View>
            <View
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
                    <Text style={styles.boldText}>{'30'}</Text>
                    <Text style={styles.textRegular}>{' Panda coins can be used'}</Text>
                </View>
                <CustomButton label={'Apply'} bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#586DD3'} width={100} />
            </View>
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
            </ScrollView>
            <CheckoutBottomView 
                data={data} 
                active={active} 
                clickBillDetails={clickBillDetails}
                placeOrder={placeOrder} 
                navigateToAddress={navigateToAddress}
                showList={showList}
            />
            <LoadingModal isVisible={isLoading} />
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