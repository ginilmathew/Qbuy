import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FastImage from 'react-native-fast-image'
import CommonCounter from './CommonCounter'
import CommonAddButton from './CommonAddButton'


const FoodSuggestionCard = ({item, onPress}) => {


    const {width} = useWindowDimensions()
    const [count, setCount] = useState(item?.count)

    const addItem = () => {
        setCount(count + 1)
    }

    // const removeItem = () => {
    //     if(count !== 0){
    //         setCount(count - 1)
    //     }
    // }
    
    return (
        <View style={styles.container}>
            {/* <FastImage
                style={{width:80, height:80, borderRadius:10}}
                source={require('../Images/biriyani.jpeg')}
            /> */}
            <View style={{marginLeft:8, flex:0.98}}>
                <Text
                    style={styles.nameText}
                >{item?.name}</Text>
                <Text style={styles.rateText}>₹ {item?.rate}</Text>
                <Text style={styles.shopText}>{'Jeff Biriyani Shop'}</Text>
            </View>
            <CommonAddButton onPress={onPress}/>
        </View>
    )
}

export default FoodSuggestionCard

const styles = StyleSheet.create({
    container : {
        flexDirection:'row', 
        alignItems:'center', 
        padding:10, 
    },
    nameText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    rateText : {
        fontFamily: 'Poppins-ExtraBold',
        color: '#23233C',
        fontSize: 15,
    },
    shopText : {
        fontFamily: 'Poppins-Regular',
        color: '#A9A9A9',
        fontSize: 9,
    }

})