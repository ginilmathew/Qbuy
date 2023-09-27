import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import CommonTexts from './CommonTexts'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PandaContext from '../contexts/Panda'

const CommonRating = ({rating, fontSize, alignSelf, position, left, bottom, starSize }) => {

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda
    return (
        <View 
            style={{backgroundColor: '#56D06D', borderRadius:5, paddingHorizontal:5, flexDirection:'row', alignItems:'center', position:position, left:left, bottom:bottom, alignSelf:alignSelf
            }}
        >
            <FontAwesome name='star' color='#fff' size={starSize ? starSize : 8}/>
            <CommonTexts label={`${rating} (2k+)`} ml={1} mt={1} color='#fff' fontSize={fontSize ? fontSize : 12}/>
        </View>
    )
}

export default CommonRating

const styles = StyleSheet.create({})