import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { memo, useCallback, useContext } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CommonTexts from '../../../../Components/CommonTexts'
import PandaContext from '../../../../contexts/Panda'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'


const CouponCard = memo(({ item, active, width, onApply }) => {

    const applyCoupon = useCallback(() => {
        onApply(item)
    }, [item?._id])


    return (
        <View style={{ padding: 10 }}>
            <View
                style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, width: width / 1.15, alignSelf: 'center', marginBottom: 20 }}
            >
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View >
                        <CommonTexts label={item?.coupon_title} fontSize={18} />
                        <Text style={styles.mediumText}>{item?.coupon_code}</Text>
                    </View>
                    <TouchableOpacity onPress={applyCoupon}>
                        <CommonTexts label={'APPLY'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} fontSize={13} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 5, marginVertical: 10, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#F3F3F3', }}>
                    <Text style={{ fontFamily: 'Poppins-LightItalic', color: '#23233C', fontSize: 13 }}>Minimum Cart Value {item?.minimum_cart_value}</Text>
                    <Text style={{ fontFamily: 'Poppins-LightItalic', color: '#23233C', fontSize: 13 }}>Valid till {moment(item?.expiry_date, "YYYY-MM-DD").format('DD-MM-YYYY')}</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins-LightItalic', color: '#23233C', fontSize: 13 }}>{item?.coupon_description}</Text>

            </View>
            <View
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', alignItems: 'center', justifyContent: 'center', zIndex: 100, position: 'absolute', left: 10 }}
                >
                    <MaterialCommunityIcons name='tag' size={16} color='#fff' />
                </View>
        </View>

    )
})

export default CouponCard

const styles = StyleSheet.create({})