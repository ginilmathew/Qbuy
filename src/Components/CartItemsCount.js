import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonTexts from './CommonTexts'

const CartItemsCount = ({count}) => {
    return (
        <View style={styles.container}>
            <CommonTexts label={count} color='#fff' fontSize={7} />
        </View>
    )
}

export default CartItemsCount

const styles = StyleSheet.create({
    container:{
        width:10, 
        height:10, 
        backgroundColor:'#FF0000', 
        alignItems:'center', 
        justifyContent:'center', 
        position:'absolute',
        borderRadius:10, 
        zIndex:1, 
        right:-2
    }
})