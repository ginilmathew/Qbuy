import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CommonStatusCard = ({ label, bg, labelColor }) => {
    return (
        <View
            style={{ width: 70, backgroundColor: bg, alignItems: 'center', borderRadius: 5, paddingVertical: 3 }}
        >
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 10, color: labelColor, textTransform: "capitalize" }}>{label}</Text>
        </View>
    )
}

export default CommonStatusCard

const styles = StyleSheet.create({})