import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import PandaContext from '../contexts/Panda'
import * as RootNavigation from '../Navigations/RootNavigation'
import reactotron from 'reactotron-react-native'
import { useNavigation } from '@react-navigation/native'


const CommonItemSelect = memo(({ item, setSelected, selected, screen, key }) => {
    const navigation = useNavigation()

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda


    const onClick = useCallback(() => {

        if (contextPanda.active === 'panda' && screen === 'home') {
            navigation.navigate("tagScreen", { item })
        } else {
            setSelected(item?._id)
        }
    }, [item])

    return (

        <TouchableOpacity
            key={key}
            onPress={onClick}
            style={{ backgroundColor: selected === item?._id ? grocery ? '#8ED053' : fashion ? '#FF7190' : '#58D36E' : '#fff', borderRadius: 10, elevation: 10, alignItems: 'center', justifyContent: "center", marginLeft: 10, marginVertical: 10, shadowOpacity: 0.1, shadowRadius: 1, }}
        >
            <Text
                numberOfLines={1}
                style={{
                    fontFamily: 'Poppins-Regular',
                    color: selected === item?.name ? '#fff' : '#23233C',
                    fontSize: 11,
                    paddingVertical: 8,
                    paddingHorizontal: 5
                }}
            >{item?.name}</Text>

        </TouchableOpacity>

    )
})

export default CommonItemSelect

const styles = StyleSheet.create({
    foodTypeText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        paddingVertical: 8
    },
    foodTypeView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 5
    },
})