import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import CommonItemCard from './CommonItemCard'
import CommonTexts from './CommonTexts'



const CommonItemsList = ({datas, label, mt, mb,}) => {
    const {width, height} = useWindowDimensions()

    return (
        <View style={{marginTop:mt, marginBottom:mb}}>
            <CommonTexts label={label} fontSize={13} ml={ 15} mb={5}/>
        
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: 'row', paddingLeft: 7,  }}
            >
                {datas.map((item) =>
                    <CommonItemCard
                        key={item?._id}
                        item={item}
                        width={ width/2.5 }
                        marginHorizontal={5}
                    />
                )}
            </ScrollView>
        </View>
    )
}

export default CommonItemsList

const styles = StyleSheet.create({})