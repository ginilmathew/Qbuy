import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import CommonCheckbox from '../../../Components/CommonCheckbox'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CommonItemCard from '../../../Components/CommonItemCard'

const RecommentedProducts = () => {

    const {width} = useWindowDimensions()

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    datas = [
        {
            _id: '1',
            name: 'Biriyani',
            rate: 250
        },
        {
            _id: '2',
            name: 'Masal Dosha',
            rate: 90

        },
        {
            _id: '3',
            name: 'Veg Biriyani',
            rate: 150

        },
        {
            _id: '4',
            name: 'Fried Rice',
            rate: 180

        },
        {
            _id: '5',
            name: 'Egg Biriyani',
            rate: 130

        },

    ]
    return (
        <>
            <View 
                style={{marginBottom:10, marginTop:20, }}
            >
                <CommonTexts label={'Recommented Products'} fontSize={13} ml={10}/>
            </View>
        
            <ScrollView  
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.container} 
            >
            
                {datas.map((item)=> 
                    <CommonItemCard
                        key={item?._id}
                        item={item}
                        width={ width/2.5 }
                        marginHorizontal={5}
                    />
                )}
            </ScrollView>
        </>
    )
}

export default RecommentedProducts

const styles = StyleSheet.create({
    container : { 
        flexDirection: 'row', 
        backgroundColor:'#5555550D', 
        paddingVertical:10,  
        marginBottom:50 
    }
})