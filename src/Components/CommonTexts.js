import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'

const CommonTexts = ({ label, mt, textAlign, color, fontSize, my, ml, mb, textTransform = "none", numberOfLines, fullLabel }) => {

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
        >{fullLabel ? label : label?.length > 30 ? label?.substring(0, 30) + '...' : label}</Text>
    )
}

export default CommonTexts

const styles = StyleSheet.create({})