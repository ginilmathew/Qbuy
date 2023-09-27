import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import CountDown from 'react-native-countdown-component';
import PandaContext from '../contexts/Panda';

const CountDownComponent = () => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active



    return (
        <CountDown
            size={20}
            until={1000}
            onFinish={() => alert('Finished')}
            digitStyle={{backgroundColor: 'transparent', }}
            digitTxtStyle={{color: active === 'fashion' ? '#FF4646' : '#464CFF', }}
            timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
            separatorStyle={{color: active === 'fashion' ? '#FF4646' : '#464CFF'}}
            timeToShow={['H', 'M', 'S']}
            timeLabels={{m: null, s: null}}
            showSeparator
        />
        
    )
}

export default CountDownComponent

const styles = StyleSheet.create({})