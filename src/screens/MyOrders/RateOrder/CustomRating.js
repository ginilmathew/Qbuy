import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Rating, AirbnbRating } from 'react-native-ratings';
import PandaContext from '../../../contexts/Panda';


const CustomRating = ({onFinishRating}) => {
    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda
    return (
        <Rating
            type='custom'
            ratingCount={5}
            imageSize={25}
            onFinishRating={onFinishRating}
            style={{alignItems:'flex-start', marginTop:10}}
            ratingColor={ grocery ? '#8ED053' : fashion? '#FF7190' : '#58D36E'}
            tintColor={ grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff'}
            ratingBackgroundColor={'#0C256C21'}
        />
    )
}

export default CustomRating

const styles = StyleSheet.create({})