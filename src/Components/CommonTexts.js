import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'

const CommonTexts = ({ label, mt, textAlign, color, fontSize, my, ml, mb, textTransform = "none", numberOfLines }) => {

    const {width, height, fontScale} = useWindowDimensions()

    return (
        <Text
            style={{
                fontFamily: 'Poppins-SemiBold',
                color: color ? color : '#23233C',
                fontSize: fontSize ? fontSize : 0.015*height,
                marginTop: mt,
                textAlign: textAlign,
                marginVertical: my,
                marginLeft: ml,
                marginBottom: mb,
                textTransform,
                
            
            }}
            numberOfLines={numberOfLines}
        >{label?.length > 20 ? label?.substring(0, 20) + '...' : label}</Text>
    )
}

export default CommonTexts

const styles = StyleSheet.create({})