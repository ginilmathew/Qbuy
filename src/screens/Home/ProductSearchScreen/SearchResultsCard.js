/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useState, useEffect, useContext, memo } from 'react'
import { IMG_URL } from '../../../config/constants'

import reactotron from '../../../ReactotronConfig'
import { getProduct } from '../../../helper/productHelper'
import { CommonActions, useNavigation } from '@react-navigation/native';
import PandaContext from '../../../contexts/Panda'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import customAxios from '../../../CustomeAxios'

const SearchResultsCard = memo(({ item, setValue }) => {



    const pandaContext = useContext(PandaContext)

    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    const [data, setData] = useState([])


    // useEffect(() => {
    //     if (item) {
    //         let data = getProduct(item);
    //         // reactotron.log({ data })
    //         setData(data)
    //     }
    //     else {
    //         setData(null)
    //     }
    // }, [])




    const navigation = useNavigation()

    const handleswitch = async (type) => {
        let value = {
            type: type,
            user_id: userContext?.userData?._id
        }
        let result = await customAxios.post('customer/cart/newshow-cart', value);
        cartContext.setCart(result?.data?.data);

    };


    const handleClick = async() => {
        pandaContext.setActive(item?.type)
        handleswitch(item?.type)
        let data = await getProduct(item);
        navigation.navigate('SingleItemScreen', { item: data })
        setValue('name', '')
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
                <Text style={ { fontSize: 10, color: 'gray', fontFamily: 'Poppins-Regular' } }>{ item?.store?.name }</Text>
            </View>
        </TouchableOpacity>
    )
})

export default SearchResultsCard

const styles = StyleSheet.create({})