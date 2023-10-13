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

            <HeaderWithTitle title={'Notifications'} />

            <View style={{
                flex: 1, justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{ fontSize: 30 }}>coming Soon!...</Text>
            </View>



        </>

    )
}

export default Notifications

const styles = StyleSheet.create({})