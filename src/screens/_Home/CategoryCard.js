import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../config/constants'

const CategoryCard = ({item, onClick, width}) => {
    return (
        <TouchableOpacity
            onPress={onClick}
            style={{ width: width / 5, height: width / 5, alignItems: 'center', borderRadius: width / 10 }}
        >
            <FastImage
                    style={{ borderRadius: width / 4.8, width: '80%', height: '80%' }}
                    source={{ uri: `${IMG_URL}${item?.image}` }}

                />
            <Text style={styles.itemText} numberOfLines={1}>{item?.name}</Text>
        </TouchableOpacity>
    )
}

export default CategoryCard

const styles = StyleSheet.create({
    lottieView: {

        borderRadius: 25,
        backgroundColor: '#DFEFE2',
    },
    itemText: {
        textAlign: 'center',
        fontSize: 11,
        marginTop: 5,
        fontFamily: 'Poppins-Medium',
        color: '#23233C'
    }
})