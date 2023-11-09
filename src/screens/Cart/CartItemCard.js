/* eslint-disable prettier/prettier */
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import CommonCounter from '../../Components/CommonCounter'
import { useNavigation } from '@react-navigation/native'
import PandaContext from '../../contexts/Panda'
import CommonSelectDropdown from '../../Components/CommonSelectDropdown'
import { IMG_URL } from '../../config/constants'
import customAxios from '../../CustomeAxios'
import CartContext from '../../contexts/Cart'
import AuthContext from '../../contexts/Auth'
import Toast from 'react-native-toast-message';
import reactotron from 'reactotron-react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Swipeable } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

const CartItemCard = ({ item, index, refreshCart }) => {


    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    const [data, setData] = useState(item)
    let fashion = contextPanda.pinkPanda

    useEffect(() => {
        setData(item)
    }, [item])




    const navigation = useNavigation()

    const { width } = useWindowDimensions()
    const [count, setCount] = useState(data?.quantity)


    const addItem = async () => {
        if (item?.type === "single") {
            if (item?.productdata?.stock) {
                if (parseFloat(item?.productdata?.stock_value) < data?.quantity * 1 + 1) {
                    Toast.show({
                        type: 'error',
                        text1: 'Required quantity not available'
                    });
                    return false;
                }
            }

        }
        else {
            if (item?.productdata?.stock) {
                if (parseFloat(item?.variants?.stock_value) < data?.quantity * 1 + 1) {
                    Toast.show({
                        type: 'error',
                        text1: 'Required quantity not available'
                    });
                    return false;
                }
            }
        }
        data.quantity = data?.quantity * 1 + 1

        let allProducts = cartContext?.cart?.product_details;
        allProducts[index].quantity = allProducts[index].quantity * 1 + 1;


        let cartItems = {
            cart_id: cartContext?.cart?._id,
            product_details: allProducts,
            user_id: userContext?.userData?._id
        }



        await customAxios.post(`customer/cart/update`, cartItems)
            .then(async response => {
                cartContext.setCart(response?.data?.data)
                refreshCart()
                //data.quantity = data?.quantity + 1
                //navigation.navigate('CartNav',{screen: 'Cart'})
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })
    }

    const removeItem = async () => {
        let minimumQty = data?.minimum_qty ? data?.minimum_qty * 1 : 1
        //return false
        let allProducts = cartContext?.cart?.product_details;
        let cartItems;
        if (data?.quantity > 1) {
            let quantity = data?.quantity * 1

            if (quantity - 1 >= minimumQty) {
                data.quantity = quantity - 1
                allProducts[index].quantity = allProducts[index].quantity - 1;
                cartItems = {
                    cart_id: cartContext?.cart?._id,
                    product_details: allProducts,
                    user_id: userContext?.userData?._id
                }

                await customAxios.post(`customer/cart/update`, cartItems)
                    .then(async response => {
                        cartContext.setCart(response?.data?.data)
                        refreshCart()
                        //data.quantity = data?.quantity - 1
                        //navigation.navigate('CartNav',{screen: 'Cart'})
                    })
                    .catch(async error => {
                        Toast.show({
                            type: 'error',
                            text1: error
                        });

                    })
            }
            else {
                Alert.alert(
                    'Warning',
                    'Are you sure want to remove this product',
                    [
                        {
                            text: 'Cancel',
                            //onPress: () => Alert.alert('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'Ok',
                            onPress: deleteItem,
                            style: 'cancel',
                        },
                    ],
                    {
                        cancelable: true
                    },
                );
            }
        }
        else {
            let allProducts = cartContext?.cart?.product_details?.filter((prod, i) => i !== index);
            let cartItems = {
                cart_id: cartContext?.cart?._id,
                product_details: allProducts,
                user_id: userContext?.userData?._id
            }

            await customAxios.post(`customer/cart/update`, cartItems)
                .then(async response => {
                    cartContext.setCart(response?.data?.data)
                    refreshCart()
                })
                .catch(async error => {
                    Toast.show({
                        type: 'error',
                        text1: error
                    });
                })
        }
    }



    const deleteconfirmation = () => {
        Alert.alert('Are you sure you want to delete?', '', [
            {
                text: 'Cancel',
                // onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteItem() },
        ]);
    }


    const deleteItem = async () => {


        let allProducts = cartContext?.cart?.product_details?.filter((prod, i) => i !== index);
        let cartItems = {
            cart_id: cartContext?.cart?._id,
            product_details: allProducts,
            user_id: userContext?.userData?._id
        }
        await customAxios.post(`customer/cart/update`, cartItems)
            .then(async response => {
                cartContext.setCart(response?.data?.data)
                refreshCart()
                //data.quantity = data?.quantity - 1
                //navigation.navigate('CartNav',{screen: 'Cart'})
            })
            .catch(async error => {

                Toast.show({
                    type: 'error',
                    text1: error
                });
            })
    }


    const gotoStore = useCallback(() => {
        navigation.navigate('home', { screen: 'store', params: { name: item?.store?.name, mode: 'cartItem', storeId: item?.store?._id, item: { store_address: item?.store_address } } })
    }, [navigation])



    const renderRightActions = () => {
        return (
            <View style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <TouchableOpacity onPress={deleteconfirmation} >
                    <MaterialCommunityIcons name={"delete-forever"} size={25} color={'red'} />
                </TouchableOpacity>
            </View>
        );
    };



    return (
        <View style={{ borderBottomWidth: 0.2, borderColor: '#A9A9A9', padding: 10, }} >

            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.container}>
                    <FastImage
                        style={{ width: 70, height: 70, borderRadius: 10 }}
                        source={{ uri: `${IMG_URL}${item?.image}` }}
                    />
                    <View style={{ marginLeft: 5, flex: 0.95 }}>
                        {item?.attributes?.length > 0 ? <Text style={styles.nameText}>{`${item?.name}${'('}${item?.attributes.join(', ')}${')'} `}</Text> : <Text style={styles.nameText}>{item?.name}</Text>}
                        <TouchableOpacity onPress={gotoStore}>
                            <Text style={styles.shopText}>{item?.store?.name}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* {renderPricing()} */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={styles.rateText}>{(item?.available && item?.status === 'active' && item?.availability) ? `₹ ${parseFloat(item?.price).toFixed(2)}` : ""}</Text>
                        <CommonCounter
                            count={data.quantity}
                            addItem={addItem}
                            removeItem={removeItem}
                            disabled={!item?.available || item?.status !== 'active' || !item.availability}
                        />
                    </View>
                </View>

            </Swipeable>

            {/* <TouchableOpacity
                onPress={ deleteconfirmation }
                style={ { marginLeft: 5, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 15, top: 2 } }>
                <MaterialCommunityIcons name={ "delete-forever" } size={ 20 } color={ 'red' } />
            </TouchableOpacity> */}
            <View style={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {item?.quantity < item?.minimum_qty && <Text style={styles.outofStock}>{`Min. quantity:${item?.minimum_qty}`}</Text>}
                {!item?.availability && <Text style={styles.outofStock}>{"Not Available"}</Text>}
                {(!item?.available || item?.status !== 'active') && <Text style={styles.outofStock}>{"Out of Stock"}</Text>}
            </View>

        </View>

    )
}

export default CartItemCard

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',


    },
    nameText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    shopText: {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop: 8
    },
    rateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#089321',
        fontSize: 16,
    },
    outofStock: {
        position: 'absolute',
        right: 15,
        bottom: 5,
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold'
    }
})