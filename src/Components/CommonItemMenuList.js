import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import CommonTexts from './CommonTexts'
import CommonItemCard from './CommonItemCard'


const CommonItemMenuList = ({list, label, mb, wishlistIcon}) => {

    const {width} = useWindowDimensions()

    return (
        <View style={{marginBottom:mb}}>
            {label&&<View
                style={{ marginBottom: 10, paddingHorizontal: 15 }}
            >
                <CommonTexts label={label} fontSize={13} />
            </View>}
            <View style={styles.container}>
                {list?.map((item) => (
                    <CommonItemCard
                        item={item}
                        key={item?._id}
                        width={width/2.2}
                        height={250}
                        wishlistIcon={wishlistIcon}

                    />
                ))}
            </View>
        </View>
    )
}

export default CommonItemMenuList

const styles = StyleSheet.create({
    container : {
        flexDirection:'row', 
        flexWrap:'wrap', 
        gap:10, 
        paddingHorizontal:'3%'
    }
})