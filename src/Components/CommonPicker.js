import { StyleSheet, TouchableOpacity, useWindowDimensions, Text, View } from 'react-native'
import React, { useContext } from 'react'
import CommonTexts from './CommonTexts'
import PandaContext from '../contexts/Panda'

const CommonPicker = ({onPress, label, mb, topLabel, icon, w, mt, top, backgroundColor, borderWidth, shadowOpacity, elevation}) => {

    const { width, height } = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active



  return (
    <View style={{marginTop:mt, marginHorizontal:1}}>
        <Text
            style={{
                fontFamily: 'Poppins-Regular',
                color: '#000',
                fontSize: 11,
                marginLeft:5
            }}
        >{topLabel}</Text>
    
        <TouchableOpacity 
            onPress={onPress}
            style={{
                width: w,
                flexDirection:'row', 
                minHeight:48, 
                alignItems:'center',
                backgroundColor: backgroundColor ? backgroundColor : active === 'green' || active === 'fashion' ?  '#fff' : '#F2F2F2', 
                justifyContent:'space-between', 
                paddingHorizontal:10, 
                borderRadius:7,  
                shadowOpacity: shadowOpacity,
                shadowRadius: 5,
                elevation: elevation,
                shadowOffset: { width: 1, height: 5 },
                marginBottom: mb,
                marginTop: top ? top : 3,
                borderWidth:borderWidth,
                borderColor:'#A9A9A9'
            }}
        >
            <CommonTexts label={label}/>
            {icon}
        </TouchableOpacity>
    </View>
  )
}

export default CommonPicker

const styles = StyleSheet.create({})