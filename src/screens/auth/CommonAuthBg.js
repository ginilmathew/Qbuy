import { ImageBackground, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { NativeModules } from "react-native"


const { env, mode } = NativeModules.RNENVConfig

const CommonAuthBg = ({children}) => {
    return (
        <>
        <StatusBar backgroundColor={'#000'} />
        <ImageBackground 
            style={styles.container} 
            source={ mode === "fashion" ? require('../../Images/FashionBg.png') : require('../../Images/authBg.png')}
        >
            {children}
        </ImageBackground>
        </>
    )
}

export default CommonAuthBg

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    }
})