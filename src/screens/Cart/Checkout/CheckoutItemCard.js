import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useContext, useState, useEffect } from 'react'
import CommonCounter from '../../../Components/CommonCounter'
import moment from 'moment'
import CartContext from '../../../contexts/Cart'
import customAxios from '../../../CustomeAxios'
import AuthContext from '../../../contexts/Auth'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useNavigation } from '@react-navigation/native'
import reactotron from '../../../ReactotronConfig'

const CheckoutItemCard = ({ item, index, refreshCart, view }) => {


    const navigation = useNavigation()

    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)

    const [data, setData] = useState(item)

    const [count, setCount] = useState(item?.count)

    // const addItem = useCallback(async () => {
    //     data.quantity = data?.quantity + 1
    //     let allProducts = cartContext?.cart?.product_details;
    //     allProducts[index].quantity = allProducts[index].quantity + 1;
    //     //setCount(count + 1)

    //     let cartItems = {
    //         cart_id : cartContext?.cart?._id,
    //         product_details: allProducts,
    //         user_id: userContext?.userData?._id
    //     }


    //     await customAxios.post(`customer/cart/update`, cartItems)
    //         .then(async response => {
    //             cartContext.setCart(response?.data?.data)
    //             refreshCart()
    //             //data.quantity = data?.quantity + 1
    //             //navigation.navigate('CartNav',{screen: 'Cart'})
    //         })
    //         .catch(async error => {
    //             console.log(error)
    //             Toast.show({
    //                 type: 'error',
    //                 text1: error
    //             });
    //         })
    // }, [])

    useEffect(() => {
        if (item) {
            setData(item)
        }
    }, [item])


    const addItem = async () => {
        if (data?.stock) {
            if (parseFloat(data?.stock_value) < data?.quantity + 1) {
                Toast.show({
                    type: 'error',
                    text1: 'Required quantity not available'
                });
                return false;
            }
        }

        let allProducts = cartContext?.cart?.product_details;
        allProducts[index].quantity = allProducts[index].quantity + 1;

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

    // const removeItem = useCallback(async() => {
    //     if(data?.quantity > 1){
    //         data.quantity = data?.quantity - 1
    //         let allProducts = cartContext?.cart?.product_details;
    //         allProducts[index].quantity = allProducts[index].quantity - 1;
    //         //setCount(count + 1)

    //         let cartItems = {
    //             cart_id : cartContext?.cart?._id,
    //             product_details: allProducts,
    //             user_id: userContext?.userData?._id
    //         }

    //         await customAxios.post(`customer/cart/update`, cartItems)
    //             .then(async response => {
    //                 cartContext.setCart(response?.data?.data)
    //                 refreshCart()
    //                 //data.quantity = data?.quantity - 1
    //                 //navigation.navigate('CartNav',{screen: 'Cart'})
    //             })
    //             .catch(async error => {
    //                 console.log(error)
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: error
    //                 });
    //             })
    //     }
    //     else{
    //         let allProducts = cartContext?.cart?.product_details?.filter((prod, i) => i !== index );
    //         let cartItems = {
    //             cart_id : cartContext?.cart?._id,
    //             product_details: allProducts,
    //             user_id: userContext?.userData?._id
    //         }

    //         await customAxios.post(`customer/cart/update`, cartItems)
    //             .then(async response => {
    //                 cartContext.setCart(response?.data?.data)
    //                 refreshCart()
    //                 //data.quantity = data?.quantity - 1
    //                 //navigation.navigate('CartNav',{screen: 'Cart'})
    //             })
    //             .catch(async error => {
    //                 console.log(error)
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: error
    //                 });
    //             })
    //     }
    // }, [])

    const removeItem = async () => {
        let allProducts = cartContext?.cart?.product_details;
        let cartItems;
        if (data?.quantity > 1) {
            let quantity = data?.quantity

            if (quantity - 1 >= data?.minimum_qty) {
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
                    if (allProducts?.length === 0) {
                        navigation.goBack()
                    }
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
                if (allProducts?.length === 0) {
                    navigation.goBack()
                }
            })
            .catch(async error => {
             
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })
    }




    // const gotoStore = useCallback(() => {
    //     navigation.navigate('home', { screen: 'store', params: { name: item?.store?.name, mode: 'checkoutItem', storeId: item?.store?._id } })
    // })



    const gotoStore = useCallback(() => {
        navigation.push("green", { screen: "TabNavigator", params: { screen: 'home', params: { screen: 'store', params: { name: item?.store?.name, mode: 'checkoutItem', storeId: item?.store?._id, item: { store_address: item?.store_address } } } } })
        //navigation.push('home', { screen: 'store', params: { name: item?.store?.name, mode: 'checkoutItem', storeId: item?.store?._id, item: { store_address: item?.store_address } } })
        //navigation.push("store", { name: item?.store?.name, mode: 'checkoutItem', storeId: item?.store?._id, item: { store_address: item?.store_address } })
    }, [navigation])




 
    return (
        <View style={styles.container}>
            <View style={{ flex: 0.42 }}>
                {item?.attributes?.length > 0 ? <Text style={styles.text1}>{`${item?.name}${'('}${item?.attributes.join(', ')}${')'} `}</Text> : 
                <Text style={styles.text1}>{item?.name}</Text>}
                {!view &&
                    <Text onPress={gotoStore} style={styles.text2}>{item?.store?.name}</Text>
                }
            </View>
            <Text style={styles.unitPrice}>₹ {parseFloat(item?.unitPrice).toFixed(2)}</Text>
            <Text style={[styles.quantity]}>{item?.quantity}</Text>
            {/* {!view && <CommonCounter 
                count={item?.quantity}
                addItem={addItem}
                removeItem={removeItem}
            />} */}

            <Text style={[styles.total]}>₹ {parseFloat(item?.price).toFixed(2)}</Text>
        </View>
    )
}

export default CheckoutItemCard

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#00000029',
        paddingHorizontal: 7
    },
    total: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
        flex: 0.27,
        textAlign: 'center'
    },
    unitPrice: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
        flex: 0.2,
        textAlign: 'center'
    },
    quantity: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
        flex: 0.15,
        textAlign: 'center'
    },
    text1: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 10,

    },
    text2: {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop: 5
    }
})