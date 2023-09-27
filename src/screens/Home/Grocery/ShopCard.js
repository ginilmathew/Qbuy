import React, { useState, useEffect, memo, useCallback } from 'react'
import { View, ImageBackground, StyleSheet, TouchableOpacity, useWindowDimensions, Text } from "react-native";
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../../config/constants';
import reactotron from 'reactotron-react-native';



const ShopCard = memo(({ item }) => {

  

    const { width, height, fontScale } = useWindowDimensions()
    const navigation = useNavigation();
    const styles = makeStyles(height);

    const onClick = useCallback(() => {
        navigation.navigate('store', { name: item?.name, mode: 'store', item: item, storeId: item?._id })
    }, [item])

    return (
        <TouchableOpacity
            key={item?._id}
            onPress={onClick}
            style={{ width: width / 4.2, height: width / 4.2, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 5 }}
        >
            <FastImage
                style={{ width: '90%', height: '85%', borderRadius: 10 }}
                source={{ uri: `${IMG_URL}${item?.store_logo}` }}
                borderRadius={10}
            />
            <Text
                numberOfLines={1}
                style={styles.itemText}
            >{item?.store_name}</Text>
        </TouchableOpacity>
    )
})

export default ShopCard

const makeStyles = height => StyleSheet.create({

    itemText: {
        textAlign: 'center',
        fontSize: 0.012 * height,
        //fontSize: '2x',
        marginTop: 5,
        fontFamily: 'Poppins-SemiBold',
        color: '#23233C',
        fontWeight: 'bold'
    }
})