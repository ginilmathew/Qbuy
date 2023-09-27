import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonTexts from '../../../Components/CommonTexts'

const Title = ({width, label}) => {
    return (
        <View style={{ marginTop:15, }}>
            <CommonTexts label={label} />
            <View style={{height:2, width: width, backgroundColor:'#8ED053', borderRadius:10, marginTop: Platform.OS === 'android' ? -1.5 : 1.5 }}>
            </View>
        </View>
    )
}

export default Title

const styles = StyleSheet.create({})