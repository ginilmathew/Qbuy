import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonTexts from '../../../../../Components/CommonTexts'
import PandaContext from '../../../../../contexts/Panda'

const ChooseAddressType = memo(({ setSelected, selected, item, color }) => {
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const onClick = useCallback(() => {
        setSelected(item?.name)
    }, [])


    return (
        <TouchableOpacity
            onPress={onClick}
            style={styles.container}
        >
            <Ionicons name={selected === item?.name ? 'checkmark-circle' : 'ellipse-outline'} color={color ? color : active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} size={20} />
            <CommonTexts textTransform="capitalize" label={item?.name} fontSize={13} ml={5} />
        </TouchableOpacity>
    )
})

export default ChooseAddressType

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    }
})