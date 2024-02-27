/* eslint-disable prettier/prettier */
import React, { memo, useCallback, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, Text } from "react-native";
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image';
import { IMG_URL } from '../../config/constants';
import PandaContext from '../../contexts/Panda';



const CategoriesCard = memo(({ item, onCategoryClick, width }) => {


    const categoryClick = useCallback(() => {
        onCategoryClick(item)
    })

    return (
        <TouchableOpacity
            onPress={categoryClick}
            style={ { width: width / 4.5, height: width / 4.5, alignItems: 'center', marginVertical: 5 } }
        >
            <View
                style={ [styles.lottieView, { width: '80%', height: '80%', padding: 3, borderRadius: width / 9, justifyContent:'center', alignItems: 'center' }] }
            >
                <FastImage
                    style={ { borderRadius: width / 10, width: '80%', height: '80%' } }
                    source={ { uri: `${IMG_URL}${item?.image}` } }

                />
            </View>
            <Text style={ styles.itemText } numberOfLines={ 1 }>{ item?.name }</Text>
        </TouchableOpacity>
    )
})

export default CategoriesCard

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