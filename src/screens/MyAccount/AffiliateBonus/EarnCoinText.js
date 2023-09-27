import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonTexts from '../../../Components/CommonTexts'

const EarnCoinText = ({coins}) => {
    return (
        <View style={{flexDirection:'row', marginTop:-15, alignSelf:'center'}}>
            <CommonTexts fontSize={20} label='You have earned '/>
            <Text style={styles.text2} >{coins}</Text>
            <CommonTexts fontSize={20} label=" Coins"/>
        </View>
    )
}

export default EarnCoinText

const styles = StyleSheet.create({
    text2: {
        fontFamily: 'Poppins-Bold',
        color: '#F39E2B',
        fontSize: 20,
    },
})