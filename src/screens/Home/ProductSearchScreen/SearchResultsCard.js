/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useContext, memo, useEffect } from 'react'
import { IMG_URL } from '../../../config/constants'

import { useNavigation } from '@react-navigation/native';
import PandaContext from '../../../contexts/Panda'
import CartContext from '../../../contexts/Cart'
import AuthContext from '../../../contexts/Auth';

const SearchResultsCard = memo(({ item }) => {



    const pandaContext = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)


    




    const navigation = useNavigation()

    


    const handleClick = async() => {
        pandaContext.setActive(item?.type)
        
        //handleswitch(item?.type)
        //let data = await getProduct(item);
        //navigation.pop()
        navigation.push('SingleItemScreen', { item })
    };

    return (
        <TouchableOpacity
            onPress={ handleClick }
            style={ { flexDirection: 'row', alignItems: 'center', marginBottom: 10 } }>
            <Image
                style={ { width: 60, height: 60, borderRadius: 30 } }
                source={ { uri: `${IMG_URL}${item?.product_image}` } }
                borderRadius={ 30 }
            />
            <View style={ { marginLeft: 10, flex: 0.95 } }>
                <Text style={ { fontSize: 12, color: '#000', fontFamily: 'Poppins-Medium' } }>{ item?.name }</Text>
                <Text style={ { fontSize: 10, color: 'gray', fontFamily: 'Poppins-Regular' } }>{ item?.store_name }</Text>
            </View>
        </TouchableOpacity>
    )
})

export default SearchResultsCard

const styles = StyleSheet.create({})