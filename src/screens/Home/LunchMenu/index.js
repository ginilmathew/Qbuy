import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CommonItemCard from '../../../Components/CommonItemCard'

const LunchMenu = ({ list }) => {

    const [isEnabled, setIsEnabled] = useState(false);


    const { width } = useWindowDimensions()

    datas = [
        {
            _id: '1',
            name: 'Chicken Biriyani',
            rate: 260,
            openCloseTag: 'Closes Soon',
            hotel: 'MRA'
        },
        {
            _id: '2',
            name: 'Chicken Mandhi',
            rate: 380,
            hotel: 'Zam Zam'



        },
        {
            _id: '3',
            name: 'Chicken Fried Rice',
            rate: 200,
            hotel: 'Al-Saj'


        },
        {
            _id: '4',
            name: 'Mutton Biriyani',
            openCloseTag: 'Opens Soon',
            rate: 350,
            hotel: 'Le-Arabia'



        },
    ]


    return (
        <>
            <View
                style={ { marginBottom: 10, marginTop: 20, paddingHorizontal: 15 } }
            >
                <CommonTexts label={ 'Lunch Menu' } fontSize={ 13 } />
            </View>
            <View style={ styles.container }>
                { list?.map((item) => (
                    <CommonItemCard
                        item={ item }
                        key={ item?._id }
                        width={ width / 2.2 }
                        height={ 250 }

                    />
                )) }
            </View>


        </>
    )
}

export default LunchMenu

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    }
})