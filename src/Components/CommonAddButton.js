import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useContext } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PandaContext from '../contexts/Panda'

const CommonAddButton = ({onPress}) => {

    const contextPanda = useContext(PandaContext)
    const { height } = useWindowDimensions()
    let active = contextPanda.active


    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            <MaterialCommunityIcons name={"plus-circle"} size={0.04*height} color={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#56D06D'} />
        </TouchableOpacity>
    )
}

export default CommonAddButton

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff', 
        borderRadius: 50 
    }
})