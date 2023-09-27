import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import PandaContext from '../../../contexts/Panda'

const MyCoinsText = ({ coins }) => {


    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    return (
        <View style={{ flexDirection: 'row', marginTop: -15, alignSelf: 'center' }}>
            <CommonTexts fontSize={25} label='You have ' />
            <Text
                style={{
                    fontFamily: 'Poppins-Bold',
                    color: fashion ? '#2D8FFF' : '#F39E2B',
                    fontSize: 25,
                }}
            >{coins}</Text>
            <CommonTexts fontSize={25} label=" Coins" />
        </View>
    )
}

export default MyCoinsText

const styles = StyleSheet.create({
    text2: {

    },
})