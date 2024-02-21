import { AppState, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import customAxios from '../../CustomeAxios';
import Toast from 'react-native-toast-message';
import { getProducts } from '../../helper/homeProductsHelper';
import HeaderWithTitle from '../../Components/Home/HeaderWithTitle';
import PandaContext from '../../contexts/Panda';
import CartCard from '../../Components/Home/CartCard';
import reactotron from 'reactotron-react-native';
import CartContext from '../../contexts/Cart';
import CustomButton from '../../Components/CustomButton';
import LottieView from 'lottie-react-native';
import CommonTexts from '../../Components/CommonTexts';

const CartScreen = ({ navigation }) => {
    const [cartItemsList, setCartItemsList] = useState([]);
    //const { cart } = useContext(CartContext) 
    const [loading, setLoading] = useState(false)
    const { active } = useContext(PandaContext)
    const { modifyQuantity, cart, updateCart, setCart } = useContext(CartContext)
    const { width, height } = useWindowDimensions()

    useFocusEffect(
        React.useCallback(() => {
            getCartItems();
        }, []),
    );


    const getCartItems = async () => {


        let products = cart?.product_details;
            let datas = products?.map(prod => {
                return {
                    ...prod?.productdata,
                    quantity: prod?.quantity,
                    availability: prod?.availability,
                    selectedVariant: prod?.variants?.[0]?.variant_id
                }
            })

            let allProds = await getProducts(datas, cart?.offer_status)

            //reactotron.log({allProds, cart})
            setCartItemsList(allProds);

        // setLoading(true);

        // await customAxios.get(`customer/cart/show/${active}`)
        // .then(async response => {
        //     let products = response?.data?.data?.product_details;
        //     setCart(response?.data?.data)
        //     let datas = products?.map(prod => {
        //         return {
        //             ...prod?.productdata,
        //             quantity: prod?.quantity,
        //             availability: prod?.availability,
        //             selectedVariant: prod?.variants?.[0]?.variant_id
        //         }
        //     })

        //     let allProds = await getProducts(datas, response?.data?.data?.offer_status)

        //     reactotron.log({allProds})
        //     setCartItemsList(allProds);
        // })
        // .catch(async error => {
        //     Toast.show({
        //         type: 'error',
        //         text1: error,
        //     });
        // })
        // .finally(() => {
        //     setLoading(false)
        // });
    };


    const goBack = () => {
        navigation.goBack()
    }

    const onClickFashionCat = useCallback(() => {
        navigation.navigate('FashionCategory');
    }, []);

    const onClickWishlist = useCallback(() => {
        navigation.navigate('Wishlist');
    }, []);

    const storeScreen = (stores) => {
        navigation.navigate("store", { item: stores })
    }

    const modifyCart = (product, mode, index) => {
        //reactotron.log({ product, cart })
        if (product?.available) {
            if (mode === "add") {
                if (product?.stock) { //need to check with stock
                    if (product?.quantity >= product?.stockValue) { //product have stock
                        Toast.show({
                            text1: 'Stock not available',
                            type: 'error'
                        })
                        return false;
                    }
                }

                modifyQuantity(index, mode)
                cartItemsList[index].quantity = cartItemsList[index].quantity + 1
            }
            else {

                if (product?.quantity === product?.minQty) { //product have stock
                    //reactotron.log("delete")
                    cartItemsList.splice(index, 1)
                    modifyQuantity(index, 'delete')
                    // setTimeout(() => {
                    //     getCartItems()
                    // }, 1000);
                }
                else if (product?.quantity === 1) {
                    //reactotron.log("delete")
                    cartItemsList.splice(index, 1)
                    modifyQuantity(index, 'delete')
                    // setTimeout(() => {
                    //     getCartItems()
                    // }, 1000);

                }
                else {
                    cartItemsList[index].quantity = cartItemsList[index].quantity - 1
                    modifyQuantity(index, 'minus')
                }

            }

            setCartItemsList([...cartItemsList])

        }




    }


    
    


    const deleteItem = async (index) => {
        await cartItemsList.splice(index, 1)
        await modifyQuantity(index, 'delete')
        //await updateCart()
        // setTimeout(() => {
        //     getCartItems()
        // }, 1000);
    }



    const renderCartItem = ({ item, index }) => {
        return (
            <CartCard
                item={item}
                gotoStore={() => storeScreen(item?.stores)}
                addItem={() => modifyCart(item, 'add', index)}
                removeItem={() => modifyCart(item, 'remove', index)}
                width={width}
                active={active}
                deleteItem={() => deleteItem(index)}
                availability={item?.availability}
            />
        )
    }

    const gotoCheckout = async () => {
        let cartItems = cartItemsList?.filter(cart =>( cart?.available === false || cart?.availability === false))

        //reactotron.log({ cartItems, cartItemsList })

        if (cartItems?.length > 0) {
            Toast.show({
                type: 'info',
                text1: 'Please remove products with warnings',
            });
            return false;
        }
        else {
            await updateCart()
            navigation.navigate('checkout');
        }

    }

    const goHome = () => {
        navigation.navigate("home")
    }

    const emptyComponent = () => {
        if(!loading){
            return (
                <View
                    style={{
                        backgroundColor:
                            active === 'green'
                                ? '#F4FFE9'
                                : active === 'fashion'
                                    ? '#FFF5F7'
                                    : '#fff',
                        borderBottomWidth: 2,
                        borderColor: '#0C256C21',
                        flexGrow: 1,
                        height: height
                    }}>
                    <View style={{ height: active === 'green' ? 250 : 170 }}>
                        <LottieView
                            style={{ height: '100%', width: '100%' }}
                            source={
                                active === 'green'
                                    ? require('../../Lottie/emptyGrocery.json')
                                    : active === 'fashion'
                                        ? require('../../Lottie/shirtss.json')
                                        : require('../../Lottie/empty.json')
                            }
                            autoPlay
                        />
                    </View>
                    <CommonTexts
                        label={'Your cart is empty!'}
                        color="#A9A9A9"
                        textAlign={'center'}
                        mt={active === 'green' ? -70 : 10}
                    />
                    <CustomButton
                        onPress={goHome}
                        bg={active === 'green' ? '#FF9C0C' : '#5871D3'}
                        label="Add Products"
                        width={150}
                        alignSelf="center"
                        mt={20}
                        mb={20}
                    />
                </View>
            )
        }
        
    }




    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: cartItemsList?.length > 0 ? 0.88 : 1 }}>
                <HeaderWithTitle
                    title={'Cart'}
                    onPressBack={goBack}
                    active={active}
                    onClickFashionCat={onClickFashionCat}
                    onClickWishlist={onClickWishlist}
                />
                <FlatList
                    ListEmptyComponent={emptyComponent}
                    data={cartItemsList}
                    keyExtractor={(item, index) => `${item?._id}-${index}`}
                    renderItem={renderCartItem}
                    style={{ height: height - 200 }}
                    refreshing={loading}
                    onRefresh={getCartItems}
                //stickyHeaderIndices={[0]}

                />
            </View>
            {cartItemsList?.length > 0 && <CustomButton
                onPress={gotoCheckout}
                label={'Proceed To Checkout'}
                bg={
                    active === 'green'
                        ? '#8ED053'
                        : active === 'fashion'
                            ? '#FF7190'
                            : '#58D36E'
                }
                mt={20}
                mx={10}
            />}
        </View>

    )
}

export default CartScreen

const styles = StyleSheet.create({})