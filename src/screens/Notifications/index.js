import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import PandaContext from '../../contexts/Panda'

const Notifications = () => {

    const { width } = useWindowDimensions()

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    return (
        <>

            <HeaderWithTitle title={'Notifications'}  />
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff',
                    paddingHorizontal: 10,
                }}
            >
                

            </ScrollView>
        </>

    )
}

export default Notifications

const styles = StyleSheet.create({})