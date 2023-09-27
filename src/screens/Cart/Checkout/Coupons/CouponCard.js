import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { memo, useCallback, useContext } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CommonTexts from '../../../../Components/CommonTexts'
import PandaContext from '../../../../contexts/Panda'
import { useNavigation } from '@react-navigation/native'


const CouponCard = memo(() => {

    const{width} = useWindowDimensions()

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const navigation = useNavigation()


    const onApply = useCallback(() => {
        navigation.navigate('Checkout')
    })


    return (
        <View
            style={{ backgroundColor: '#fff', borderRadius: 10, padding: 15, width: width / 1.15, alignSelf: 'center', marginBottom: 20 }}
        >
            <View
                style={{ width: 30, height: 30, borderRadius: 15, backgroundColor:  active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' , marginTop: -28, alignItems: 'center', justifyContent: 'center', marginLeft: -28 }}
            >
                <MaterialCommunityIcons name='tag' size={16} color='#fff' />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View >
                    <CommonTexts label={'50% off for new users'} fontSize={18} />
                    <Text style={styles.mediumText}>{'QBUYNEW50'}</Text>
                </View>
                <TouchableOpacity onPress={onApply}>
                    <CommonTexts label={'APPLY'} color= {active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} fontSize={13} />
                </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 5, marginVertical: 10, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#F3F3F3', }}>
                <Text style={{ fontFamily: 'Poppins-LightItalic', color: '#23233C', fontSize: 13 }}>Minimum Cart Value 50</Text>
                <Text style={{ fontFamily: 'Poppins-LightItalic', color: '#23233C', fontSize: 13 }}>Valid till 20th March 2023</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins-LightItalic', color: '#23233C', fontSize: 13 }}>Get 50% off for new users for all store applicable in Qbuy panda.</Text>

        </View>
    )
})

export default CouponCard

const styles = StyleSheet.create({})