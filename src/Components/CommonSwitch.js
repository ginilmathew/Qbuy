import { StyleSheet, Text, Switch } from 'react-native'
import React, { useContext } from 'react'
import PandaContext from '../contexts/Panda'

const CommonSwitch = ({toggleSwitch, isEnabled, color}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    return (
        <Switch
            trackColor={{ false: '#F1F1F1', true: '#F1F1F1' }}
            thumbColor={isEnabled ? color ? color : active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' : '#8D8D8D'}
            ios_backgroundColor="#F1F1F1"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
        />
    )
}

export default CommonSwitch

const styles = StyleSheet.create({})