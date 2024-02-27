import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CheckoutItemCard = ({ openStore, item }) => {

    const goToStore = () => {
        openStore(item)
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.42 }}>
                <Text style={styles.text1}>{ item?.attributes?.length > 0 ? `${item?.name} ${'('}${item?.attributes.join(', ')}${')'} ` : item?.name}</Text>
                <Text onPress={goToStore} style={styles.text2}>{item?.store_name}</Text>
            </View>
            <Text style={styles.unitPrice}>₹ {parseFloat(item?.price).toFixed(2)}</Text>
            <Text style={[styles.quantity]}>{item?.quantity}</Text>

            <Text style={[styles.total]}>₹ {parseFloat(item?.price * item?.quantity).toFixed(2)}</Text>
            {!item?.availability && <Text style={{ position: 'absolute', bottom: 0, right: 5, fontSize: 12, color: 'red', fontWeight: 'bold', paddingRight: 5 }}>Not Available in your location</Text>}
        {(!item?.available && item?.availability) && <Text style={{ position: 'absolute', bottom: 0, right: 5, fontSize: 12, color: 'red', fontWeight: 'bold', paddingRight: 5 }}>Not Available</Text>}
        </View>
    )
}

export default CheckoutItemCard

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#00000029',
        paddingHorizontal: 7,
        position:'relative'
    },
    total: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
        flex: 0.27,
        textAlign: 'center'
    },
    unitPrice: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
        flex: 0.2,
        textAlign: 'center'
    },
    quantity: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
        flex: 0.15,
        textAlign: 'center'
    },
    text1: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 10,

    },
    text2: {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop: 5
    }
})