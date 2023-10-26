import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import CommonItemMenuList from '../../Components/CommonItemMenuList'
import CommonItemCard from '../../Components/CommonItemCard'
import LoaderContext from '../../contexts/Loader'
import customAxios from '../../CustomeAxios'
import PandaContext from '../../contexts/Panda'
import Toast from 'react-native-toast-message';
import CartContext from '../../contexts/Cart'
import AuthContext from '../../contexts/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { isEmpty, isArray } from 'lodash'
import reactotron from 'reactotron-react-native'

const Wishlist = ({ navigation }) => {

    const { width, height } = useWindowDimensions()

    const loadingContex = useContext(LoaderContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    const contextPanda = useContext(PandaContext)

    let userData = userContext?.userData


    let loadingg = loadingContex?.loading
    let active = contextPanda.active

    const [wishlist, setWishlist] = useState([])


    useEffect(() => {
        getWishlist()
    }, [])

    const getWishlist = async () => {
        loadingContex.setLoading(true)
        let data = {
            type: active,
            coordinates: userContext?.location
        }
        await customAxios.post(`customer/wishlist/list`, data)

            .then(async response => {
                let datas = response?.data?.data?.product_details;
                //setWishlist(datas)
                if (isArray(datas)) {
                    setWishlist(datas)
                }
                else {
                    setWishlist([])
                }
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContex.setLoading(false)
            })
    }





    return (
        <>
            <HeaderWithTitle title={ 'Wishlist' } />
            <ScrollView
                style={ { flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', paddingTop: 10 } }
            >
                { wishlist?.length > 0 && <View style={ styles.container }>
                    { wishlist?.map((item, index) => (
                        <CommonItemCard
                            item={ item }
                            key={ index }
                            width={ width / 2.2 }
                            height={ 250 }
                            wishlistIcon
                            getWishlist={ getWishlist }
                        />
                    )) }

                </View> }
                { wishlist?.length <= 0 && <View style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: height / 1.3 } }>
                    <Text style={ { color: '#000' } }>Wishlist is empty!</Text>
                </View> }

            </ScrollView>
        </>


    )
}

export default Wishlist

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%',
    }
})