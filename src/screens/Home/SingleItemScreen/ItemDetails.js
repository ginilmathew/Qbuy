/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState, useEffect } from 'react'

import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonTexts from '../../../Components/CommonTexts'
import Tooltip from 'react-native-walkthrough-tooltip';
import reactotron from '../../../ReactotronConfig';


const ItemDetails = ({ itemName, hotelName, views, sold, minQty, price, onPress, available, regularPrice }) => {


    const [tooltip, setTooltip] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setTooltip(false)
        }, 1000);
    }, [])


    const { width } = useWindowDimensions()

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.4, }}>
                <Text style={{
                    fontSize: 10,
                    color: '#0000',
                    fontWeight: '800'
                }}>
                    {itemName}
                </Text>

                <Text
                    style={{
                        fontFamily: 'Poppins-LightItalic',
                        color: '#23233C',
                        fontSize: 10,
                        marginVertical: 3
                    }}
                >{'Sold by : '}</Text>

                <Tooltip
                    isVisible={tooltip}
                    content={<CommonTexts label='Click Here to view store' color={'#fff'} fontSize={9} />}
                    placement="bottom"
                    onClose={() => setTooltip(false)}
                    backgroundColor='transparent'
                    contentStyle={{ backgroundColor: '#000', width: width / 3, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 12, flexWrap: 'wrap' }}
                >
                    <TouchableOpacity
                        onPress={onPress}
                        style={{ flexDirection: 'row', alignItems: 'center', flexWrap: "wrap" }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Poppins-BoldItalic',
                                color: '#1185E0',
                                fontSize: 11,
                                flexWrap: 'wrap'
                            }}
                            numberOfLines={2}
                        >{hotelName}</Text>
                    </TouchableOpacity>
                </Tooltip>

            </View >
            <View style={styles.numbersBox}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../../Images/view.png')}
                        style={{ width: 10, height: 10 }}
                        resizeMode='contain'
                    />
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#23233C',
                            fontSize: 9,

                        }}
                    >{'Views'}</Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Bold',
                            color: '#23233C',
                            fontSize: 12,

                        }}
                    >{views}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../../Images/analytics.png')}
                        style={{ width: 10, height: 10 }}
                        resizeMode='contain'
                    />
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#23233C',
                            fontSize: 9,

                        }}
                    >{'Sold'}</Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Bold',
                            color: '#23233C',
                            fontSize: 12,

                        }}
                    >{sold}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../../Images/box.png')}
                        style={{ width: 10, height: 10 }}
                        resizeMode='contain'
                    />
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#23233C',
                            fontSize: 9,

                        }}
                    >{'Minimum Qty'}</Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Bold',
                            color: '#23233C',
                            fontSize: 12,

                        }}
                    >{minQty}</Text>
                </View>
            </View>
            {
                available && <View style={{ flex: 0.20 }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#23233C',
                            fontSize: 11,

                        }}
                    >{'Price'}</Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-ExtraBold',
                            color: '#089321',
                            fontSize: 14,

                        }}
                    >₹{price}</Text>
                    {(regularPrice != price) && <Text
                        style={{
                            fontFamily: 'Poppins-ExtraBold',
                            color: '#089321',
                            fontSize: 10,
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid'
                        }}
                    >₹{regularPrice}</Text>}
                </View>
            }
        </View >
    )
}

export default ItemDetails

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    },
    numbersBox: {
        borderWidth: 0.5,
        borderColor: '#00000029',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        padding: 5,
        flex: 0.38,
        marginRight: 5
    },

})