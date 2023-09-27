import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonTexts from '../../../Components/CommonTexts'
import PandaContext from '../../../contexts/Panda'

const ChooseDeliverySpeed = memo(({ selected, item, setSelected}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const onClick = useCallback(() => {
        setSelected(item?._id)
    },[])

    return (
        <TouchableOpacity
            onPress={onClick}
            style={styles.container}
        >
            <Ionicons name={selected === item?._id ? 'checkmark-circle' : 'ellipse-outline'} color = { active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} size={20}/>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text   
                    style={{
                        color: item?.name === 'Express Delivery' ? '#FF6600' : '#23233C',
                        fontFamily: 'Poppins-Medium',
                        fontSize:12,
                        marginLeft:5
                    }}
                >{item?.name}</Text>
                <Text style={{
                    color: item?.name === 'Express Delivery' ? '#FF6600' : '#23233C',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize:12,
                    marginHorizontal:2
                }}>({item?.timing})</Text>
                <Text style={styles.textExtra}>₹ {item?.rate}</Text>

            </View>
        </TouchableOpacity>
    )
})

export default ChooseDeliverySpeed

const styles = StyleSheet.create({
    container : {  
        flexDirection:'row', 
        alignItems:'center', 
        marginRight:10,
        marginTop:10
    },
    textSemi: {
        
    },
    textExtra: {
        fontFamily: 'Poppins-ExtraBold',
        fontSize:13,
        color:'#089321',
        marginHorizontal:2
    }
})