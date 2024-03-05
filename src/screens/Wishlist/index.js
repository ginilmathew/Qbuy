import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
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
import ProductCard from '../../Components/Home/ProductCard'
import CartButton from '../../Components/Home/CartButton'

const Wishlist = ({ navigation }) => {

    const { width, height } = useWindowDimensions()

    const loadingContex = useContext(LoaderContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    const contextPanda = useContext(PandaContext)

    let userData = userContext?.userData


    let loadingg = loadingContex?.loading
    let active = contextPanda.active

    const styles1 = makeStyles(height)

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


    const viewProduct = (item) => {
        navigation.navigate("SingleItemScreen", { item })
    }

    const addToCart = (item) => {
        // reactotron.log({item});
        // return false
        cartContext.addToCart(item)
    }

    const renderProduct = ({ item }) => {
        return (
            <View style={{ width: width / 2, padding: 5 }}>
                <ProductCard
                    key={`${item?._id}product`}
                    data={item}
                    styles={styles1}
                    loggedIn={userContext?.userData ? true : false}
                    height={height/4}
                    viewProduct={viewProduct}
                    //sharedTransitionTag={`images${item?._id}`}
                    addToCart={addToCart}
                />
            </View>
        )
    }


    return (
        <>
            <HeaderWithTitle title={ 'Wishlist' } />
                <FlatList
                
                data={ wishlist}
                refreshing={loadingg}
                renderItem={renderProduct}
                style={{ flexGrow: 1, paddingBottom: 70, backgroundColor: active === "panda" ? '#fff' :  active === "green" ? '#F4FFE9' : '#FFF5F7' }}
                numColumns={2}
                onRefresh={getWishlist}
                ListEmptyComponent={() => (
                    <View style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: height / 1.3 } }>
                        <Text style={ { color: '#000' } }>Wishlist is empty!</Text>
                    </View>
                )}
            />
                {/* { wishlist?.length > 0 && <View style={ styles.container }>
                    { wishlist?.map((item, index) => (
                        <ProductCard
                            key={`${item?._id}product`}
                            data={item}
                            styles={styles}
                            loggedIn={userContext?.userData ? true : false}
                            height={height}
                            viewProduct={viewProduct}
                            //sharedTransitionTag={`images${item?._id}`}
                            addToCart={addToCart}
                        />
                    )) }

                </View> }
                { wishlist?.length <= 0 && <View style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: height / 1.3 } }>
                    <Text style={ { color: '#000' } }>Wishlist is empty!</Text>
                </View> } */}
                <CartButton bottom={20} />
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

const makeStyles = fontScale => StyleSheet.create({


    bottomCountText: {
        fontFamily: 'Poppins-medium',
        color: '#fff',
        fontSize: 0.01 * fontScale,
    },
    bottomRateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#fff',
        fontSize: 0.015 * fontScale,
    },
    textSemi: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 0.014 * fontScale,
        paddingBottom: 2
    },
    textSemiError: {
        fontFamily: 'Poppins-SemiBold',
        color: 'red',
        fontSize: 10 / fontScale,
        paddingBottom: 2
    },
    lightText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 0.011 * fontScale,
        marginBottom: 3,
        
    },
    addContainer: {
        position: 'absolute',
        right: 5,
        bottom: 10
    },
    tagText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 12 / fontScale,
        padding: 5
    },
    hearIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'

    },
    RBsheetHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10
    },
    totalCount: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    outofstock: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    viewCartBox: {
        alignItems: 'flex-end',
        flex: 0.5
    },
    discountViewer: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    priceTag: {
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        height: 20,
        margin: 1,
    }
})