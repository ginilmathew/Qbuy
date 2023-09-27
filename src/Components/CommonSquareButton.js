import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PandaContext from '../contexts/Panda'

const CommonSquareButton = ({position, bottom, right, onPress, iconName}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    return (
        <TouchableOpacity
            style={{
                width: 50,
                height: 50,
                backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                position: position,
                bottom: bottom,
                right: right
            }}
            onPress={onPress}
        >
            <Ionicons name={iconName ? iconName : 'chatbubble-ellipses'} color='#fff' size={25} />

        </TouchableOpacity>
    )
}

export default CommonSquareButton

const styles = StyleSheet.create({})