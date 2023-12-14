import React, { useState, useEffect, useCallback, useContext } from "react";
import Context from "./index";
import { Animated } from 'react-native'
import customAxios from "../../CustomeAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import LoaderContext from "../Loader";
import AuthContext from "../Auth";
import reactotron from "reactotron-react-native";
import PandaContext from "../Panda";

const CartProvider = (props) => {

    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState(null)
    const [address, setAddress] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [animation, setAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
    const loadingContext = useContext(LoaderContext)
    const authCOntext = useContext(AuthContext)
    const panda = useContext(PandaContext)

    const userData = authCOntext.userData



    useEffect(() => {
        getDefaultAddress()
    }, [address])


    const addToCart = async (item, selectedVariant, attributes) => {
        let cartItems, url;
        let productDetails;
        let minimumQty = item?.minQty ? item?.minQty : 1

        if (cart) {
            url = "customer/cart/update";
            let cartProducts = cart?.product_details;
            let existing;
            if (item?.variant) {
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === selectedVariant?.id)
            }
            else if(attributes){
                let filterProducts = cart?.product_details?.filter(prod => prod.product_id === item?._id)
                filterProducts && filterProducts?.map(prod => {
                    let att = [];
                    attributes?.map(attr => {
                        att.push(attr?.selected)
                    })

                    if(prod?.attributes?.every(v => att.includes(v))){
                        existing = prod;
                    }
                })
            }
            else {
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id)
            }
            if (existing) {
                existing.quantity = existing.quantity + 1;
                cartItems = {
                    cart_id: cart?._id,
                    product_details: cartProducts,
                    user_id: userData?._id
                }
            }
            else {
                reactotron.log("in", attributes)
                productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: item?.variant ? 'variant' : 'single',
                    attributes: attributes?.map(att => att.selected),
                    variants: item?.variant ? [
                        {
                            variant_id: selectedVariant?.id,
                            attributs: selectedVariant?.attributs
                        }
                    ] : null,
                    quantity: minimumQty
                };
                cartItems = {
                    cart_id: cart?._id,
                    product_details: [...cart?.product_details, productDetails],
                    user_id: userData?._id
                }
            }
        }
        else {
            url = "customer/cart/add";
            productDetails = {
                product_id: item?._id,
                name: item?.name,
                image: item?.product_image,
                type: item?.variant ? 'variant' : 'single',
                attributes: attributes?.map(att => att.selected),
                variants: item?.variant ? [
                    {
                        variant_id: selectedVariant?.id,
                        attributs: selectedVariant?.attributs
                    }
                ] : null,
                quantity: minimumQty
            };
            cartItems = {
                product_details: [productDetails],
                user_id: userData?._id,
                type: panda.active
            }


        }

        loadingContext.setLoading(true)
        await customAxios.post(url, cartItems)
            .then(async response => {
                setCart(response?.data?.data)
                //reactotron.log({cartUpdate: response?.data?.data})
                //user?.setCartId(response?.data?.data?._id)
                await AsyncStorage.setItem("cartId", response?.data?.data?._id)
                loadingContext.setLoading(false)
                Toast.show({
                    type: 'success',
                    text1: 'Product added to cart',
                    position: 'top',
                    visibilityTime: 1000
                })
                //navigation.navigate('cart')
            })
            .catch(async error => {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContext.setLoading(false)
            })
    }


    const addLocalCart = async (item, selectedVariant = null) => {
        //reactotron.log({item})
        let { _id, name, store, franchisee, stock, minQty, product_image, variant, price, available, stockValue, delivery } = item
        if (variant) {
            //Find Product
            let findPro = await products?.find(pro => pro?._id === _id && pro?.variant_id === selectedVariant?.id)
            if (findPro) {
                if (stock) {
                    if ((findPro?.quantity + 1) <= selectedVariant?.stockValue) {
                        findPro.quantity += 1;
                    }
                    else {
                        Toast.show({ type: 'info', text1: 'Required quantity not available' })
                    }
                }
                else {
                    findPro.quantity += 1;
                }
            }
            else {
                let product = {
                    _id,
                    name: `${name} (${selectedVariant?.title})`,
                    store,
                    franchisee,
                    product_image,
                    price: parseFloat(selectedVariant?.price),
                    quantity: selectedVariant?.minQty,
                    stockValue: selectedVariant?.stockValue,
                    variant_id: selectedVariant?.id
                }

                if (stock) {
                    if (selectedVariant?.minQty < selectedVariant?.stockValue) {
                        setProducts((prev) => prev ? [...prev, product] : [product])
                    }
                    else {
                        Toast.show({ type: 'info', text1: 'Required quantity not available' })
                    }
                }
                else {
                    setProducts((prev) => prev ? [...prev, product] : [product])
                }
            }
        }
        else {
            //Find Product
            let findPro = await products?.find(pro => pro?._id === _id)
            if (findPro) {
                if (stock) {
                    let quan = findPro.quantity
                    if ((quan + 1) <= stockValue) {
                        findPro.quantity += 1;
                    }
                    else {
                        Toast.show({ type: 'info', text1: 'Required quantity not available' })
                    }
                }
                else {
                    findPro.quantity += 1;
                }

            }
            else {
                let product = {
                    _id,
                    name,
                    store,
                    franchisee,
                    product_image,
                    price: parseFloat(price),
                    quantity: minQty,
                    stockValue: stockValue
                }
                if (stock) {
                    if (minQty < stockValue) {
                        setProducts((prev) => prev ? [...prev, product] : [product])
                    }
                    else {
                        Toast.show({ type: 'info', text1: 'Required quantity not available' })
                    }
                }
                else {
                    setProducts((prev) => prev ? [...prev, product] : [product])
                }

            }
        }
        //reactotron.log({item})
        //setProducts((prev) => prev ? [...prev, item] : [item])
    }


    const getDefaultAddress = useCallback(() => {
        if (address) {
            let defau = address?.find(add => add.default === true)

            if (defau) {
                setDefaultAddress(defau)
            }
            else {
                setDefaultAddress(address[0])
            }
        }

    }, [address])

    return (
        <Context.Provider
            value={{
                ...props,
                cart,
                address,
                defaultAddress,
                products,
                setCart,
                setAddress,
                getDefaultAddress,
                setDefaultAddress,
                setAnimation,
                addLocalCart,
                animation,
                addToCart

            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default CartProvider;

