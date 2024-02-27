import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OrderTimeCard = ({ picked, eta, expected, status, delivered, complete }) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.textMedium}>{'Picked At '}</Text>
                <Text style={styles.textBold}>{picked}</Text>
            </View>
{status && ( 
            <>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical:10}}>
                <Text style={styles.textMedium}>{'ETA '}</Text>
                <Text style={styles.textBold}>{eta}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.textMedium}>{'Expected By '}</Text>
                <Text style={styles.textBold}>{expected}</Text> 
            </View>
</>)}
            {complete && (<View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.textMedium}>{'Delivered At '}</Text>
                <Text style={styles.textBold}>{delivered}</Text> 
            </View>)}
        </View>
    )
}

export default OrderTimeCard

const styles = StyleSheet.create({
    container: {
        borderRadius: 10, 
        backgroundColor: '#DBFFDB', 
        padding: 10
    },
    textMedium: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    textBold: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 12,
    }
})