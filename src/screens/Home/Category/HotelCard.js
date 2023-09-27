import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import CommonRating from '../../../Components/CommonRating'


const HotelCard = ({ heights, item }) => {

    const navigation = useNavigation();

    const { width, height } = useWindowDimensions()

    return (

        <TouchableOpacity 
            onPress={()=>navigation.navigate('SingleHotel',{item : item})} 
            style={{ width: width/2.2,height:200 }}
        >
            <View>
                {/* <FastImage
                    source={item?.image ? item?.image : require('../../../Images/hotel.jpeg')}
                    style={{ height: 170, width:width/2.2, justifyContent: 'flex-end', borderRadius:20 }}
                >
                    {/* <CommonRating rating={3.8} position={'absolute'} bottom={10} left={5} starSize={12}/> */}
                {/* </FastImage> */}
                <Text
                    style={styles.nameText}
                >{item?.hotel}</Text>
            </View>
            

        </TouchableOpacity>
    )
}

export default HotelCard

const styles = StyleSheet.create({
    nameText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        marginTop:5, 
        marginLeft:5
    }
})