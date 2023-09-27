import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OfferText = () => {
    return (
        <View style={{flexDirection:'row', marginTop:3}}>
            <Text 
                style={styles.text1}
            >{"By any items from"}</Text>
            <Text 
                style={styles.text2}
            >{" Jeff Biriyani"}</Text>
            <Text 
                style={styles.text1}
            >{" and get upto 50% off"}</Text>
        </View>
    )
}

export default OfferText

const styles = StyleSheet.create({
    text1 : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 10,
    },
    text2 : {
        fontFamily: 'Poppins-BoldItalic',
        color: '#30B948',
        fontSize: 10,
    }
})