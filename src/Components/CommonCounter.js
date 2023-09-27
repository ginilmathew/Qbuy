import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { memo, useContext, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PandaContext from '../contexts/Panda'

const CommonCounter = memo(({count, addItem, removeItem, disabled}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    const {width} = useWindowDimensions()

    return (
        <View 
            style={{flexDirection:'row', alignItems:'center', backgroundColor:'#EDEDED', borderRadius:8, marginLeft:5, justifyContent:'space-between', width: width/5.5 }}
        >
            <TouchableOpacity 
                onPress={removeItem}
                style={{
                    width:22, 
                    height:22, 
                    borderRadius:8, 
                    backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', 
                    alignItems:'center', 
                    justifyContent:'center'
                }}
            >
                <FontAwesome name='minus' size={13} color='#fff' />
            </TouchableOpacity>
            <Text
                style={{
                    fontFamily: 'Poppins-ExtraBold',
                    color: '#23233C',
                    fontSize: 12,
                }}
            >{count}</Text> 
            
            <TouchableOpacity 
                onPress={disabled ? null : addItem}
                style={{
                    width:22, 
                    height:22, 
                    borderRadius:8, 
                    backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', 
                    alignItems:'center', 
                    justifyContent:'center'
                }}
            >
                <FontAwesome name='plus' size={13} color='#fff' />
            </TouchableOpacity>
        </View>
    )
})

export default CommonCounter

const styles = StyleSheet.create({

})