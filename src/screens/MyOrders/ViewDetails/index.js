import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import OrderTimeCard from './OrderTimeCard'
import ContactCard from './ContactCard'
import ItemsCard from '../ItemsCard'
import PandaContext from '../../../contexts/Panda'


const ViewDetails = ({route}) => {

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda

    let item = route?.params?.item

    let qty = route?.params?.qty

    let totalRate = route?.params?.totalRate

    return (
        <>
            <HeaderWithTitle title={'Orde ID ' + item?._id}/>
            <ScrollView 
                style={{ 
                    flex: 1, 
                    backgroundColor: grocery ? '#F4FFE9' : '#fff', 
                    paddingHorizontal: 10 
                }}
            >
                <View style={styles.itemView}>
                    <View style={styles.itemHeader}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={styles.orderIdText}>{'Order ID '}</Text>
                            <CommonTexts label={item?._id} />
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={styles.dateText}>{item?.date}</Text>
                        </View>
                    </View>
                    <View style={styles.itemHeaderView}>
                        <View>
                            <Text style={styles.headerTexts}>{'Total Items'}</Text>
                            <Text style={styles.boldText}>{qty}</Text>
                        </View>
                        <View>
                            <Text style={styles.headerTexts}>{'Total Payment'}</Text>
                            <Text style={styles.boldText}>{totalRate}</Text>
                        </View>
                        <View>
                            <Text style={styles.headerTexts}>{'Current Status'}</Text>
                            <View style={styles.statusBox}>
                                <Text style={styles.statusText}>{'Pending'}</Text>
                            </View>
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
                        {item?.myOrder.map((item) => 
                            <ItemsCard
                                item={item}
                                key={item?._id}
                            />
                        )}
                    </View>
                </View>

                <OrderTimeCard
                    picked={'04:43:45 pm'}
                    eta='04:43:45 pm'
                    expected={'05:17:45 pm'}
                />

                <ContactCard
                    heading={'Call Delivery Agent'}
                    content='You can call your assigned delivery agent 1234567890'
                    iconColor={ grocery ? '#FF9C0C' : '#576FD0'}
                    iconName='ios-call-sharp'
                />

                <ContactCard
                    heading={'Any Issues?'}
                    content='Still having issues, we are here to hear you'
                    iconColor={'#21AD37'}
                    iconName='ios-logo-whatsapp'
                />



               
            </ScrollView>
        </>
        
    )
}

export default ViewDetails

const styles = StyleSheet.create({

    itemView : { 
        borderRadius: 10, 
        shadowOpacity: 0.1, 
        shadowRadius: 2, 
        marginVertical: 15, 
        backgroundColor: '#fff', 
        shadowOffset: { height: 5, width: 1 }
    },
    itemHeader : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F8F8F8', 
        borderTopRightRadius: 15, 
        borderTopLeftRadius: 15, 
        padding: 6, 
        justifyContent:'space-between' 
    },
    orderIdText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    dateText :{
        fontFamily: 'Poppins-Regular',
        color: '#555555A3',
        fontSize: 10,
    },
    itemHeaderView : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        justifyContent: 'space-between', 
        margin: 7, 
        borderBottomWidth: 0.5, 
        paddingBottom: 10, 
        borderColor: '#00000029' 
    },
    headerTexts : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
    },
    boldText : {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 11,
    },
    statusBox : { 
        backgroundColor: '#FFF297', 
        borderRadius: 5, 
        alignItems: 'center' 
    },
    statusText : {
        fontFamily: 'Poppins-Regular',
        color: '#B7A000',
        fontSize: 10,
        marginVertical: 4
    },
    productHeader : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        justifyContent: 'space-between', 
        marginTop: 10, 
        marginHorizontal: 7, 
        marginBottom: 10 
    },
    itemUnderProduct : {
        paddingHorizontal:10, 
        backgroundColor: '#F3F3F3', 
        borderBottomRightRadius:10, 
        borderBottomLeftRadius:10
    }

})