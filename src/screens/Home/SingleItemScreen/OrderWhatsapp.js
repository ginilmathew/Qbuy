import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import Ionicons from 'react-native-vector-icons/Ionicons'


const OrderWhatsapp = ({mt}) => {

    const {width, height} = useWindowDimensions()

    return (
        <TouchableOpacity style={{width:width-100, flexDirection:'row', alignItems:'center', backgroundColor:'#0C256C0D', justifyContent:'space-between', borderRadius:10, alignSelf:'center', marginTop:mt}}>

            <Text
                style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#23233C',
                    fontSize:10,
                    marginLeft:10
                }}
            >{'You can also order through whatsapp'}</Text>

            <View style={{width:35,height:35, borderRadius:10, alignItems:'center',justifyContent:'center', backgroundColor:'#089321'}}>
                <Ionicons name='md-logo-whatsapp' color='#fff' size={18} />
            </View>

        </TouchableOpacity>
    )
}

export default OrderWhatsapp

const styles = StyleSheet.create({})