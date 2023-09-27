import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext } from 'react'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { IMG_URL } from '../../config/constants'
import PandaContext from '../../contexts/Panda'


const FashionCatCard = ({item}) => {

    const contextPanda = useContext(PandaContext)

    const {width} = useWindowDimensions()

    const navigation = useNavigation()

    const onClick = useCallback(() => {
        navigation.navigate('Category', {name : item?.name, mode: contextPanda.active, item : item, })
    }, [])

    return (
        <TouchableOpacity
            onPress={onClick}
        >
            <FastImage
                style={{ width: width / 3.38, height: 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}
                source={{ uri: `${IMG_URL}${item?.image}` }}
                borderRadius={15}
            />
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: '#23233C', marginTop: 3, marginLeft:3 }}>{item?.name}</Text>
        </TouchableOpacity>
    )
}

export default FashionCatCard

const styles = StyleSheet.create({})