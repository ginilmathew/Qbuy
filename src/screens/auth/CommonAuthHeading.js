import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CommonAuthHeading = ({label, mt, textAlign}) => {
    return (
        <Text 
            style={{
                fontFamily: 'Quicksand-SemiBold',
                color: '#23233C',
                fontSize: 35,
                marginTop: mt,
                textAlign: textAlign
            }}
        >{label}</Text>
    )
}

export default CommonAuthHeading

const styles = StyleSheet.create({})