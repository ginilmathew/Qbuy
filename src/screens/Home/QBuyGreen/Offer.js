import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Offer = ({onPress, shopName}) => {
    return (
        <View style={{flexDirection:'row', marginTop:10}}>
            <Text 
                style={styles.text1}
            >{"By any items from "}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text 
                    style={styles.text2}
                >{shopName}</Text>
            </TouchableOpacity>
            
            <Text 
                style={styles.text1}
            >{" and get upto 50% off"}</Text>
        </View>
    )
}

export default Offer

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