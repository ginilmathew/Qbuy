import { View, Text } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import PandaContext from '../contexts/Panda'

const SuccessPage = ({ goHome, source, text }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    useEffect(() => {
        setTimeout(goHome, 3000)
    }, [])
    


    

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff'
        }}>
            <LottieView
                style={{ height: 150, width: 150 }}
                source={source}
                autoPlay
            />
            <Text style={{
                textAlign: 'center',
                marginTop: 20,
                color: 'black',
                width: '90%',
                fontWeight: '700'
            }}>{text || 'Thank you for expressing interest in joining our system! We will contact you soon'}</Text>
        </View>
    )
}

export default SuccessPage