import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useRef, useState, useEffect, useContext } from 'react'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HeaderWithTitle from '../../../../Components/HeaderWithTitle'
import CommonTexts from '../../../../Components/CommonTexts'
import PandaContext from '../../../../contexts/Panda'

const Payment = ({ navigation }) => {


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    return (
        <>
            <HeaderWithTitle title={'Payment'} />
            <ScrollView style={{ flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#F3F3F3' }}>
            </ScrollView>
            <View
                style={{ backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 63, shadowOpacity: 0.08, elevation: 1 }}
            >
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <View >
                        <Foundation name={'target-two'} color='#FF0000' size={20} marginTop={5} />
                    </View>
                    <View style={{ flex: 0.8, marginLeft: 10 }}>
                        <CommonTexts label={'Trivandrum'} fontSize={21} />
                        <Text
                            style={styles.address}
                        >{'Lorem Ipsum, Lorem Street, Lorem,Trivandrum, Kerala, India 953741'}</Text>
                    </View>

                    <View style={{ position: 'absolute', right: 20, top: 10 }}>
                        <MaterialCommunityIcons name={'lead-pencil'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#5871D3'} size={18} marginTop={5} />
                    </View>
                </View>



                <View
                    style={{
                        backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E',
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 40,
                        position: 'absolute',
                        width: '100%',
                        bottom: 0
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('OrderPlaced')}
                        style={{ borderRightWidth: 3, borderColor: '#fff', flex: 0.5, flexDirection: 'row', alignItems: 'center' }}
                    >
                        <CommonTexts label={'Pay ₹ 240'} color='#fff' fontSize={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ alignItems: 'flex-end', flex: 0.5 }}
                        onPress={() => {
                            // navigation.navigate('CartNav')
                        }}
                    >
                        <CommonTexts label={'Est. Time 30 mins'} color='#fff' fontSize={10} />
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default Payment

const styles = StyleSheet.create({

    address: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    }


})