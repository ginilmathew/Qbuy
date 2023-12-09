import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

const ItemsCard = memo(({item, date}) => {

    const navigation = useNavigation()

    const goToShop = useCallback(() => {
        navigation.navigate('SingleHotel',{item : item, mode:'orderItem'})
    }, [])

    

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.5 }}>
                <Text style={[styles.text1, { textAlign: 'left' }]}>{`${item?.name} ${item?.attributes ? `(${item?.attributes?.join(', ')})` : ''}`}</Text>
                {/* <TouchableOpacity 
                //onPress={goToShop}
                >
                    <Text style={styles.text2}>{item?.hotel}</Text>
                </TouchableOpacity> */}
            </View>
            <Text style={[styles.text1, { textAlign: 'center' }]}>{item?.quantity}</Text>
            <Text style={[styles.text1, { textAlign: 'center' }]}>₹{item?.price}</Text>
        </View>
    )
})

export default ItemsCard

const styles = StyleSheet.create({
    container : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F3F3F3', 
        justifyContent: 'space-between', 
        paddingVertical: 10, 
        borderBottomWidth: 1, 
        borderColor: '#00000029', 
        paddingHorizontal: 7 
    },
    text1 : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    text2 : {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop: 5
    }
})