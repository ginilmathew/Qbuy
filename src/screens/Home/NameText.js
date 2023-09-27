import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NameText = ({userName, mb, mt}) => {
    return (
        <View 
            style={{
                flexDirection:'row', 
                marginTop: mt ? mt : 20, 
                marginLeft:20,
                marginBottom:mb
            }}
        >
            <Text 
                style={styles.text1}
            >{"Hai "}</Text>
            <Text 
                style={styles.text2}
            >{userName},</Text>
            <Text 
                style={styles.text1}
            >{" What are you looking for?"}</Text>
        </View>
            
    )
}

export default NameText

const styles = StyleSheet.create({

    text1 : {
        fontFamily: 'Poppins-SemiBold',
        color: '#23233C',
        fontSize: 12,
    },
    text2 : {
        fontFamily: 'Poppins-Bold',
        color: '#FF4646',
        fontSize: 12,
    }
})