import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import { NativeModules } from "react-native"
import DeviceInfo from 'react-native-device-info';


const About = () => {
    const DeviceVersion = DeviceInfo.getVersion()
    const { env, mode } = NativeModules.RNENVConfig

    return (
        <>
            <HeaderWithTitle title={'About Us'} />
            <View style={{ flex: .5, justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                <Text style={styles.title}>About</Text>
                <Text style={styles.text}>Name:{mode + env} </Text>
                <Text style={styles.text}>Version:{DeviceVersion} </Text>
                {/* Add more information about your app here */}
            </View>
        </>

    )
}

export default About

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
    },
});