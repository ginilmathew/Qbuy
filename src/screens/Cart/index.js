/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import CustomButton from '../../Components/CustomButton';
import HeaderWithTitle from '../../Components/HeaderWithTitle';
import CartItemCard from './CartItemCard';
import PandaContext from '../../contexts/Panda';
import LottieView from 'lottie-react-native';
import CommonTexts from '../../Components/CommonTexts';
import CommonItemCard from '../../Components/CommonItemCard';
import AuthContext from '../../contexts/Auth';
import customAxios from '../../CustomeAxios';
import CartContext from '../../contexts/Cart';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LoaderContext from '../../contexts/Loader';
import moment from 'moment';
import reactotron from 'reactotron-react-native';
import { getProducts } from '../../helper/homeProductsHelper';

const Cart = ({ navigation }) => {
    const contextPanda = useContext(PandaContext);

    const { height } = useWindowDimensions();

    let active = contextPanda.active;
    const loadingg = useContext(LoaderContext);
    const loader = loadingg?.loading;

    const user = useContext(AuthContext);
    const cartContext = useContext(CartContext);

    //let cartId = user?.cartId

    const [cartItemsList, setCartItemsList] = useState([]);

    const getCartItems = async () => {
        loadingg.setLoading(true);
        await customAxios.get(`customer/cart/show/${active}`)
        .then(async response => {
            let products = response?.data?.data?.product_details;
            let datas = products?.map(prod => prod?.productdata)

            let allProds = await getProducts(datas)


            // cartContext?.setCart(response?.data?.data)

            //let finalProducts = [];
            //let quantity = pro?.quantity ? parseFloat(pro?.quantity) : 0
            // products?.map(pro => {
            //     let quantity = pro?.quantity ? parseFloat(pro?.quantity) : 0;
            //     let type = pro?.type;
            //     let offer,
            //         regular,
            //         comm,
            //         seller,
            //         delivery,
            //         minQty,
            //         stock,
            //         fromDate,
            //         toDate,
            //         stock_value,
            //         product;
            //     if (type === 'single') {
            //         offer = pro?.productdata?.offer_price
            //             ? parseFloat(pro?.productdata?.offer_price)
            //             : 0;
            //         regular = pro?.productdata?.regular_price
            //             ? parseFloat(pro?.productdata?.regular_price)
            //             : 0;
            //         comm = pro?.productdata?.commission
            //             ? pro?.productdata?.commission
            //             : pro?.productdata?.vendors?.additional_details?.commission
            //                 ? pro?.productdata?.vendors?.additional_details?.commission
            //                 : 0;
            //         seller = pro?.productdata?.seller_price
            //             ? parseFloat(pro?.productdata?.seller_price)
            //             : 0;
            //         delivery = pro?.productdata?.fixed_delivery_price
            //             ? parseFloat(pro?.productdata?.fixed_delivery_price)
            //             : 0;
            //         minQty = pro?.productdata?.minimum_qty
            //             ? parseFloat(pro?.productdata?.minimum_qty)
            //             : 0;
            //         stock = pro?.productdata?.stock;
            //         fromDate = moment(pro?.productdata?.offer_date_from).isValid()
            //             ? moment(pro?.productdata?.offer_date_from, 'YYYY-MM-DD')
            //             : null;
            //         toDate = moment(pro?.productdata?.offer_date_to).isValid()
            //             ? moment(pro?.productdata?.offer_date_to, 'YYYY-MM-DD')
            //             : null;
            //         stock_value = pro?.productdata?.stock_value
            //             ? parseFloat(pro?.productdata?.stock_value)
            //             : 0;
            //         product = {
            //             store_address: pro?.productdata?.vendors.store_address,
            //             product_id: pro?.product_id,
            //             name: pro?.name,
            //             image: pro?.image,
            //             type: pro?.type,
            //             // quantity: quantity >= minQty ? quantity : minQty,
            //             quantity: quantity,
            //             stock: stock,
            //             delivery,
            //             commission: comm,
            //             minimum_qty: minQty,
            //             stock_value,
            //             store: pro?.productdata?.store,
            //             status: pro?.productdata?.status,
            //             availability: pro?.availability,
            //             attributes: pro?.attributes
            //         };
            //     } else {
            //         (store_address = pro?.productdata?.vendors.store_address),
            //             (offer = pro?.variants?.offer_price
            //                 ? parseFloat(pro?.variants?.offer_price)
            //                 : 0);
            //         regular = pro?.variants?.regular_price
            //             ? parseFloat(pro?.variants?.regular_price)
            //             : 0;
            //         comm = pro?.variants?.commission
            //             ? pro?.variants?.commission
            //             : pro?.productdata?.vendors?.additional_details?.commission
            //                 ? pro?.productdata?.vendors?.additional_details?.commission
            //                 : 0;
            //         seller = pro?.variants?.seller_price
            //             ? parseFloat(pro?.variants?.seller_price)
            //             : 0;
            //         delivery = pro?.variants?.fixed_delivery_price
            //             ? parseFloat(pro?.variants?.fixed_delivery_price)
            //             : 0;
            //         minQty = pro?.productdata?.minimum_qty
            //             ? parseFloat(pro?.productdata?.minimum_qty)
            //             : 0;
            //         stock = pro?.productdata?.stock;
            //         fromDate = moment(pro?.variants?.offer_date_from).isValid()
            //             ? moment(pro?.variants?.offer_date_from, 'YYYY-MM-DD')
            //             : null;
            //         toDate = moment(pro?.variants?.offer_date_to).isValid()
            //             ? moment(pro?.variants?.offer_date_to, 'YYYY-MM-DD')
            //             : null;
            //         stock_value = pro?.variants?.stock_value
            //             ? parseFloat(pro?.variants?.stock_value)
            //             : 0;
            //         product = {
            //             store_address: pro?.productdata?.vendors.store_address,
            //             product_id: pro?.product_id,
            //             variant_id: pro?.variants?._id,
            //             attributs: pro?.variants?.attributs,
            //             name: pro?.name,
            //             image: pro?.image,
            //             type: type,
            //             // quantity: quantity >= minQty ? quantity : minQty,
            //             quantity: quantity,
            //             stock: stock,
            //             delivery,
            //             commission: comm,
            //             minimum_qty: minQty,
            //             attributes: pro?.attributes,
            //             stock_value,
            //             store: pro?.productdata?.store,
            //             status: pro?.productdata?.status,
            //             availability: pro?.availability,
            //         };
            //     }

            //     if (product?.status !== 'active') {
            //         product.available = false;
            //         finalProducts.push(product);
            //     }

            //     if (product?.status === 'active') {
            //         if (stock) {
            //             //products have stock
            //             if (quantity <= stock_value) {
            //                 //required quantity available
            //                 product.available = true;
            //                 if (offer > 0) {
            //                     if (
            //                         moment(fromDate, 'YYYY-MM-DD') <=
            //                         moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') &&
            //                         moment(toDate, 'YYYY-MM-DD') >=
            //                         moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
            //                     ) {
            //                         let finalPrice = offer * quantity;
            //                         product.price = finalPrice;
            //                         finalProducts.push(product);
            //                     } else if (fromDate && !toDate) {
            //                         if (
            //                             moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') >=
            //                             fromDate
            //                         ) {
            //                             let finalPrice = offer * quantity;
            //                             product.price = finalPrice;
            //                             finalProducts.push(product);
            //                         } else if (regular > 0) {
            //                             let finalPrice = regular * quantity;
            //                             product.price = finalPrice;
            //                             finalProducts.push(product);
            //                         } else {
            //                             let commission = (seller / 100) * comm;
            //                             let amount = (seller + commission) * quantity;
            //                             product.price = amount;
            //                             finalProducts.push(product);
            //                         }
            //                     } else if (!fromDate && !toDate) {
            //                         let finalPrice = offer * quantity;
            //                         product.price = finalPrice;
            //                         finalProducts.push(product);
            //                     } else {
            //                         if (regular > 0) {
            //                             let finalPrice = regular * quantity;
            //                             product.price = finalPrice;
            //                             finalProducts.push(product);
            //                         } else {
            //                             let commission = (seller / 100) * comm;
            //                             let amount = (seller + commission) * quantity;
            //                             product.price = amount;
            //                             finalProducts.push(product);
            //                         }
            //                     }
            //                 } else if (regular > 0) {
            //                     let finalPrice = regular * quantity;
            //                     product.price = finalPrice;
            //                     finalProducts.push(product);
            //                 } else {
            //                     let commission = (seller / 100) * comm;
            //                     let amount = (seller + commission) * quantity;
            //                     product.price = amount;
            //                     finalProducts.push(product);
            //                 }
            //             } else {
            //                 product.available = false;
            //                 finalProducts.push(product);
            //             }
            //         } else {
            //             product.available = true;
            //             if (offer > 0) {
            //                 if (
            //                     moment(fromDate, 'YYYY-MM-DD') <=
            //                     moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') &&
            //                     moment(toDate, 'YYYY-MM-DD') >=
            //                     moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
            //                 ) {
            //                     let finalPrice = offer * quantity;
            //                     product.price = finalPrice;
            //                     finalProducts.push(product);
            //                 } else if (fromDate && !toDate) {
            //                     if (
            //                         moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') >=
            //                         fromDate
            //                     ) {
            //                         let finalPrice = offer * quantity;
            //                         product.price = finalPrice;
            //                         finalProducts.push(product);
            //                     } else if (regular > 0) {
            //                         let finalPrice = regular * quantity;
            //                         product.price = finalPrice;
            //                         finalProducts.push(product);
            //                     } else {
            //                         let commission = (seller / 100) * comm;
            //                         let amount = (seller + commission) * quantity;
            //                         product.price = amount;
            //                         finalProducts.push(product);
            //                     }
            //                 } else if (!fromDate && !toDate) {
            //                     let finalPrice = offer * quantity;
            //                     product.price = finalPrice;
            //                     finalProducts.push(product);
            //                 } else {
            //                     if (regular > 0) {
            //                         let finalPrice = regular * quantity;
            //                         product.price = finalPrice;
            //                         finalProducts.push(product);
            //                     } else {
            //                         let commission = (seller / 100) * comm;
            //                         let amount = (seller + commission) * quantity;
            //                         product.price = amount;
            //                         finalProducts.push(product);
            //                     }
            //                 }
            //             } else if (regular > 0) {
            //                 let finalPrice = regular * quantity;
            //                 product.price = finalPrice;
            //                 finalProducts.push(product);
            //             } else {
            //                 let commission = (seller / 100) * comm;
            //                 let amount = (seller + commission) * quantity;
            //                 product.price = amount;
            //                 finalProducts.push(product);
            //             }
            //         }
            //     }
            // });
            setCartItemsList(allProds);
            // loadingg.setLoading(false)

            // setSingleProduct(response?.data?.data)
            loadingg.setLoading(false);
        })
        .catch(async error => {
            loadingg.setLoading(false);
            Toast.show({
                type: 'error',
                text1: error,
            });
        });
    };

    useFocusEffect(
        React.useCallback(() => {
            getCartItems();
        }, []),
    );

    useEffect(() => {
        return () => {
            setCartItemsList([]);
        };
    }, []);

    const gotoCheckout = useCallback(async () => {
        let cancel = false;

        // reactotron.log({ cartItemsList })
        // let quantity = cartItemsList?.find(cart => cart?.stock && cart?.quantity > cart?.stock_value);
        //   let quantity =  cartItemsList?.some((cart) => {
        //         if (cart?.available) {
        //             if (cart?.stock) {
        //                 cart?.quantity < cart?.stock_value

        //             }
        //         } else {
        //             Toast.show({
        //                 type: 'info',
        //                 text1: 'Please remove out of stocks products and continue'
        //             })
        //             return false;
        //         }
        //     })

        //     reactotron.log({quantity})

        //     if(quantity){
        //         navigation.navigate('Checkout')
        //     }

        // if (quantity) {
        //     Toast.show({
        //         type: 'info',
        //         text1: 'Please remove out of stocks products and continue'
        //     })
        //     return false;
        // }
        // else {
        //     navigation.navigate('Checkout')
        // }
        const satisfiesConditions = cartItemsList.every(item => {
            return (
                item.available === true &&
                item.availability === true &&
                item?.quantity >= item?.minimum_qty &&
                (item.stock !== true ||
                    (item.stock === true &&
                        parseInt(item.minimum_qty) <= parseInt(item.stock_value)))
            );
        });

        if (!satisfiesConditions) {
            Toast.show({
                type: 'info',
                text1: 'Please remove products with warnings',
            });
            return false;
        } else {
            navigation.navigate('checkout');
            setCartItemsList([]);
        }
        // reactotron.log("Conditions are satisfied:", satisfiesConditions);
    }, [cartItemsList, navigation]);

    const goHome = useCallback(() => {
        navigation.navigate('home');
    }, [navigation]);

    const refreshCart = useCallback(() => {
        getCartItems();
    }, [cartContext?.cart]);

    return (
        <View
            style={ {
                height: height - 50,
                paddingBottom: 50,
                backgroundColor:
                    active === 'green'
                        ? '#F4FFE9'
                        : active === 'fashion'
                            ? '#FFF5F7'
                            : '#fff',
            }}>
            <HeaderWithTitle title={ 'Cart' } />

            {/* {!loadingg?.loading && */ }
            <ScrollView
                // refreshControl={
                //     <RefreshControl refreshing={loader} onRefresh={getCartItems} />

                // }
                style={ {
                    flex: 1,
                    backgroundColor:
                        active === 'green'
                            ? '#F4FFE9'
                            : active === 'fashion'
                                ? '#FFF5F7'
                                : '#fff',
                } }>
                { cartItemsList?.length <= 0 ? (
                    <View
                        style={ {
                            backgroundColor:
                                active === 'green'
                                    ? '#F4FFE9'
                                    : active === 'fashion'
                                        ? '#FFF5F7'
                                        : '#fff',
                            borderBottomWidth: 2,
                            borderColor: '#0C256C21',
                        } }>
                        <View style={ { height: active === 'green' ? 250 : 170 } }>
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
                            label={ 'Your cart is empty!' }
                            color="#A9A9A9"
                            textAlign={ 'center' }
                            mt={ active === 'green' ? -70 : 10 }
                        />
                        <CustomButton
                            onPress={ goHome }
                            bg={ active === 'green' ? '#FF9C0C' : '#5871D3' }
                            label="Add Products"
                            width={ 150 }
                            alignSelf="center"
                            mt={ 20 }
                            mb={ 20 }
                        />
                    </View>
                ) : (
                    <>
                        { cartItemsList?.map((item, index) => (
                            <CartItemCard
                                item={ item }
                                key={ index }
                                index={ index }
                                refreshCart={ refreshCart }
                            />
                        )) }
                    </>
                ) }
                <View>
                    { cartItemsList?.length > 0 && (
                        <CustomButton
                            onPress={ gotoCheckout }
                            label={ 'Proceed To Checkout' }
                            bg={
                                active === 'green'
                                    ? '#8ED053'
                                    : active === 'fashion'
                                        ? '#FF7190'
                                        : '#58D36E'
                            }
                            mt={ 20 }
                            mx={ 10 }
                        />
                    ) }
                </View>

                {/* <CommonTexts label={'Panda Suggestions'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {pandaSuggestion?.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}
                {/* <CommonTexts label={'Trending Sales'} fontSize={13} ml={ 15} mb={5} mt={15}/>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: 'row', paddingLeft: 7,  }}
            >
                {trend.map((item) =>
                    <CommonItemCard
                        key={item?._id}
                        item={item}
                        width={ width/2.5 }
                        marginHorizontal={5}
                    />
                )}
            </ScrollView> */}
            </ScrollView>
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({});
