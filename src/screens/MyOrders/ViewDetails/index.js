import { Alert, Linking, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import OrderTimeCard from './OrderTimeCard'
import ContactCard from './ContactCard'
import ItemsCard from '../ItemsCard'
import PandaContext from '../../../contexts/Panda'
import reactotron from 'reactotron-react-native'
import moment from 'moment'
import CommonStatusCard from '../../../Components/CommonStatusCard'
import customAxios from '../../../CustomeAxios'
import Toast from 'react-native-toast-message'


const ViewDetails = ({ route }) => {

    const contextPanda = useContext(PandaContext)
    const [item, setItem] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    let grocery = contextPanda.greenPanda


    useEffect(() => {
        setIsLoading(true)
        customAxios.get(`customer/order/show/` + route?.params?.item?._id)
            .then(async response => {
                setItem(response.data.data);

            }).catch(error => {

                Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
            }).finally(error => {
                setIsLoading(false)
            })

    }, [route?.params?.item?._id])

    let qty = route?.params?.qty

    let totalRate = route?.params?.totalRate

    let active = contextPanda.active


    reactotron.log(item, "VIEWDETAILS")

    const gotTowhtsapp = useCallback(() => {
        let msg = "Hi, I am having problems with the order ID: " + item?.order_id;
        let phoneWithCountryCode = "+918137009905";

        let mobile =
            Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
        if (mobile) {
            if (msg) {
                let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
                Linking.openURL(url)
                    .then(data => {
                        console.log("WhatsApp Opened");
                    })
                    .catch(() => {
                        Alert("Make sure WhatsApp installed on your device");
                    });
            } else {
                Alert("Please insert message to send");
            }
        } else {
            Alert("Please insert mobile no");
        }

    }, [])

    const dialCall = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${item?.riders?.mobile}`; }
        else { phoneNumber = `telprompt:${item?.riders?.mobile}`; }
        Linking.openURL(phoneNumber);
    };

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



    return (
        <>
            <HeaderWithTitle title={'Order ID ' + item?.order_id} />
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: grocery ? '#F4FFE9' : '#fff',
                    paddingHorizontal: 10
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                    />
                }
            >
                <View style={styles.itemView}>
                    <View style={styles.itemHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.orderIdText}>{'Order ID '}</Text>
                            <CommonTexts label={item?.order_id} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.dateText}>{moment(item?.created_at).format("DD-MM-YYYY hh:mm A")}</Text>
                        </View>
                    </View>
                    <View style={styles.itemHeaderView}>
                        <View>
                            <Text style={styles.headerTexts}>{'Total Items'}</Text>
                            <Text style={styles.boldText}>{item?.product_details?.length}</Text>
                        </View>
                        <View>
                            <Text style={styles.headerTexts}>{'Total Payment'}</Text>
                            <Text style={styles.boldText}>{item?.grand_total}</Text>
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

                    <View style={styles.productHeader}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={styles.boldText}>{'Product'}</Text>
                        </View>
                        <Text style={styles.boldText}>{'Qty'}</Text>
                        <Text style={styles.boldText}>{'Price'}</Text>
                    </View>

                    <View style={styles.itemUnderProduct}>
                        {item?.product_details?.map((item) =>
                            <ItemsCard
                                item={item}
                                key={item?._id}
                            />
                        )}
                        {item?.price_breakup?.map((pri, index) => (

                            <View key={`${pri?._id}${index}`} style={styles.delivery}>
                                <View style={{ flex: 0.5 }}>
                                    <Text style={[styles.text1, { textAlign: 'left' }]}>{pri?.charge_name}</Text>
                                </View>
                                <Text style={[styles.text1, { textAlign: 'center' }]}>₹ {pri?.price}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* <OrderTimeCard
                    picked={'04:43:45 pm'}
                    eta='04:43:45 pm'
                    expected={'05:17:45 pm'}
                    status={item?.status === "completed" ? false : true}
                    delivered={moment(item?.delivered_date).format("hh:mm:ss A")}
                    complete={item?.status === "completed" ? true : false}
                /> */}

                {item?.rider_each_order_settlement?.rider_status === "onTheWay" ? (<ContactCard
                    heading={'Call Delivery Agent'}
                    content={'You can call your assigned delivery agent ' + `${item?.riders.mobile}`}
                    iconColor={grocery ? '#FF9C0C' : '#576FD0'}
                    iconName='call-sharp'
                    onpress={dialCall}
                />) : null}

                <ContactCard
                    heading={'Any Issues?'}
                    content='Still having issues, we are here to hear you'
                    iconColor={'#21AD37'}
                    iconName='logo-whatsapp'
                    onpress={gotTowhtsapp}
                />




            </ScrollView>
        </>

    )
}

export default ViewDetails

const styles = StyleSheet.create({

    itemView: {
        borderRadius: 15,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginVertical: 15,
        backgroundColor: '#fff',
        shadowOffset: { height: 5, width: 1 },
        borderWidth: 0.5,
        borderColor: "#f2f2f2"
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 6,
        justifyContent: 'space-between'
    },
    orderIdText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    dateText: {
        fontFamily: 'Poppins-Regular',
        color: '#555555A3',
        fontSize: 10,
    },
    itemHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        margin: 7,
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        borderColor: '#00000029'
    },
    headerTexts: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
    },
    boldText: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 11,
    },
    statusBox: {
        backgroundColor: '#FFF297',
        borderRadius: 5,
        alignItems: 'center'
    },
    statusText: {
        fontFamily: 'Poppins-Regular',
        color: '#B7A000',
        fontSize: 10,
        marginVertical: 4
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 7
    },
    itemUnderProduct: {

        backgroundColor: '#F3F3F3',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        paddingBottom: 5
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
    delivery: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        justifyContent: 'space-between',
        paddingVertical: 5,
        // borderBottomWidth: 1,
        // borderColor: '#00000029',
        paddingHorizontal: 7

    },
    text1: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },

})