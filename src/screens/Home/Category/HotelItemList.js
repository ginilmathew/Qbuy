import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import FastImage from 'react-native-fast-image'


const HotelItemList = ({list}) => {

    const {width} = useWindowDimensions()

    return (
        <ScrollView  
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.restaurantView} 
        >
            {list.map((item)=> 
                <TouchableOpacity key={item?._id} style={{alignItems:'center', marginRight:5, width: width/4}}>
                    {/* <FastImage
                        style={{width:70, height:70, borderRadius:35 }}
                        source={require('../../../Images/biriyani.jpeg')}
                        borderRadius = {35}
                    /> */}
                    <Text style={styles.foodName}>{item?.name}</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    )
}

export default HotelItemList

const styles = StyleSheet.create({
    restaurantView : { 
        flexDirection: 'row', 
        marginTop: 10, 
        backgroundColor:'#F7F7F7', 
        paddingVertical:10 
    },
    foodName : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        textAlign:'center',
        marginTop:5
    },
})