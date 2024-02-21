/* eslint-disable prettier/prettier */
import { StyleSheet, Text, TouchableOpacity, View, Platform, useWindowDimensions } from 'react-native'
import React, { memo } from 'react'

import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../config/constants'


const PandaShopCard = memo(({ item, name, onClick }) => {




    const { width, fontScale, height } = useWindowDimensions()

    let imageWidth = width / 4

    const styles = makeStyles(fontScale, height);
    
    return (
        <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10, padding: 0 } }>
            <TouchableOpacity
                onPress={ onClick }
                key={ item?._id }
                style={ { alignItems: 'center', width: imageWidth, height:  imageWidth } }
            >
                <FastImage
                    style={ { width: '100%', height: '100%', borderRadius: Platform.OS === 'android' ? imageWidth / 2 : 0 } }
                    source={ { uri: `${IMG_URL}${item?.store_logo}` } }
                    borderRadius={ imageWidth / 2 }
                    resizeMode='cover'
                />

            </TouchableOpacity>
            <Text
                numberOfLines={ 2 }
                style={ styles.shopName }
            >{ item?.store_name }</Text>
        </View>
    )
})

export default PandaShopCard

const makeStyles = (fontScale, width) => StyleSheet.create({
    shopName: {
        fontFamily: 'Poppins-SemiBold',
        color: '#23233C',
        fontSize: 0.013 * width,
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
})