import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Foundation from 'react-native-vector-icons/Foundation'
import CommonTexts from '../CommonTexts'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Animated, { FadeInDown } from 'react-native-reanimated'




const CheckoutBottomView = ({navigateToAddress, active, clickBillDetails, isLoading, showList, placeOrder, data}) => {


    if(data?.address){
        return(
            <Animated.View style={styles.addressContainer} entering={FadeInDown.duration(3000).springify()}>
                <Pressable style={styles.addrHeader} onPress={navigateToAddress}>
                    <View >
                        <Foundation name={'target-two'} color='#FF0000' size={20} marginTop={5} />
                    </View>
                    <View style={{ flex: 0.8, marginLeft: 10 }}>
                        {data?.address?.area?.location ? <CommonTexts label={data?.address?.area?.location} fontSize={16} /> : <CommonTexts label={'Please Add Address !!!'} fontSize={14} color={'#FF5757'} />}
                        <Text
                            style={styles.address}
                        >{data?.address?.area?.address && data?.address?.area?.address}</Text>
                    </View>

                    <TouchableOpacity style={{ position: 'absolute', right: 20, top: 10 }} onPress={navigateToAddress}>
                        <MaterialCommunityIcons name={'lead-pencil'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#5871D3'} size={18} marginTop={5} />
                    </TouchableOpacity>
                </Pressable>
                <View style={{ flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 5 }}>
                    <Text
                        style={styles.textMedium}
                    >{'Grand Total  '}</Text>
                    <Text
                        style={styles.boldText}
                    >₹ {data?.grand_total}</Text>
                </View>

                {showList && <>
                    <View style={styles.totalBill}>
                        <Text
                            style={styles.boldText}
                        >Total Bill</Text>
                    </View>
                    <View style={styles.charges}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={styles.textMedium}
                            >{"Sub Total"}</Text>
                        </View>
                        <Text
                            style={styles.textMedium}
                        >₹ {data?.total_price}</Text>

                    </View>
                    {/* <View style={styles.charges}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={styles.textMedium}
                            >{"Delivery Charge"}</Text>
                        </View>
                        <Text
                            style={styles.textMedium}
                        >₹ {data?.selected_delivery_charge?.charge_value}</Text>

                    </View> */}
                    {data?.price_breakup?.map((pri, index) => (<View key={`${pri?._id}${index}`} style={styles.charges}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={styles.textMedium}
                            >{pri?.charge_name}</Text>
                        </View>
                        <Text
                            style={styles.textMedium}
                        >₹ {pri?.price}</Text>

                    </View>))}
                    {data?.coupon_amount && data?.coupon_amount > 0 && <View  style={styles.charges}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={styles.textMedium}
                            >{"Coupon Discount"}</Text>
                        </View>
                        <Text
                            style={styles.textMedium}
                        >₹ {data?.coupon_amount}</Text>

                    </View>}
                    <View style={styles.grandTotal}>
                        <Text
                            style={styles.textMedium}
                        >{'Grand Total  '}</Text>
                        <Text
                            style={styles.boldText}
                        >₹ {data?.grand_total}</Text>
                    </View>
                </>}

                <View
                    style={{
                        backgroundColor:  active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E',
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        position: 'absolute',
                        width: '100%',
                        bottom: 0
                    }}
                >
                    <TouchableOpacity
                        onPress={clickBillDetails}
                        style={styles.viewDetails}
                    >
                        <CommonTexts label={'View Detailed Bill'} color='#fff' fontSize={12} />
                        <Ionicons name={showList ? 'chevron-down' : 'chevron-up'} size={20} color='#fff' marginLeft={2} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={isLoading}
                        style={{ alignItems: 'flex-end', flex: 0.5 }}
                        onPress={isLoading ? null : placeOrder}
                    >
                        <CommonTexts label={isLoading ? "Loading..." : 'Place Order'} color='#fff' fontSize={17} />
                    </TouchableOpacity>
                </View>

            </Animated.View>
        )
    }

    
        return(
            <Animated.View style={styles.addressContainer} entering={FadeInDown.duration(3000).springify()}>
                
                <View
                    style={{
                        backgroundColor:  active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E',
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        position: 'absolute',
                        width: '100%',
                        bottom: 0
                    }}
                >
                    
                    <TouchableOpacity
                        disabled={isLoading}
                        style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}
                        onPress={navigateToAddress}
                    >
                        <CommonTexts fullLabel={true} label={"Choose Delivery Address"} color='#fff' fontSize={17} />
                    </TouchableOpacity>
                </View>

            </Animated.View>
        )

  
}

export default CheckoutBottomView

const styles = StyleSheet.create({
    addressContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 50,
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
    viewDetails: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
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