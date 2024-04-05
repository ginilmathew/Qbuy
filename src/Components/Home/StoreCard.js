import { Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../config/constants'

const StoreCard = ({onClick, item}) => {

    const { width, fontScale, height } = useWindowDimensions()

    const styles = makeStyles(fontScale, height);
    

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 5, padding: 0 }}>
            <TouchableOpacity
                onPress={onClick}
                key={item?._id}
                style={{ alignItems: 'center', width:  width / 7, height: 50 }}
            >
                <FastImage
                    style={{ width: '100%', height: '100%', borderRadius: Platform.OS === 'android' ? 8 : 0 }}
                    source={{ uri: `${IMG_URL}${item?.store_logo}` }}
                    borderRadius={8}
                    resizeMode='cover'
                />

            </TouchableOpacity>
            <Text
                numberOfLines={1}
                style={styles.shopName}
            >{item?.store_name}</Text>
        </View>
    )
}

export default StoreCard

const makeStyles = (fontScale, width) => StyleSheet.create({
    shopName: {
        fontFamily: 'Poppins-SemiBold',
        color: '#23233C',
        fontSize: 0.013 * width,
        width: width/10,
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 5,
        fontWeight: 'bold',
        flexWrap:'wrap'
    },
})