import React, { useState, useEffect, useCallback, useContext } from "react";
import Context from "./index";
import { Alert, Animated } from 'react-native'
import customAxios from "../../CustomeAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import LoaderContext from "../Loader";
import AuthContext from "../Auth";
import reactotron from "reactotron-react-native";
import PandaContext from "../Panda";
import { getProducts } from "../../helper/homeProductsHelper";

const CartProvider = (props) => {

    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState(null)
    const [address, setAddress] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [animation, setAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
    const loadingContext = useContext(LoaderContext)
    const authCOntext = useContext(AuthContext)
    const panda = useContext(PandaContext)
    const [cartProducts, setCartProducts] = useState([])

    const userData = authCOntext.userData

    // useEffect(() => {
    //     getCartDetails()
    // }, [])


    const getCartDetails = useCallback(async () => {
        //let cartId = await AsyncStorage.getItem("cartId");
        //reactotron.log({cartId})
        //if (cartId) {
            loadingContext.setLoading(true);
            await customAxios.get(`customer/cart/show/${panda?.active}`)
                .then(async response => {
                    setCart(response?.data?.data)
                    

                    loadingContext.setLoading(false);

                })
                .catch(async error => {
                    Toast.show({
                        type: 'error',
                        text1: error
                    });
                    loadingContext.setLoading(false);
                })
        //}

    }, [])


    // useEffect(() => {
    //     getDefaultAddress()
    // }, [address])


    const modifyQuantity = (index, mode) => {
        //reactotron.log({cart, index, mode})
        if(mode === "add"){
            cart.product_details[index].quantity = cart.product_details[index].quantity + 1
        }
        else if(mode === "delete"){
            let remain = cart.product_details?.filter((prod, i)  => i != index)
            //delete cart.product_details[index]

            //reactotron.log({remain})
            cart['product_details'] = remain

            //reactotron.log({cart})
            //updateCart()
        }
        else{
            cart.product_details[index].quantity = cart.product_details[index].quantity - 1
        }

        

        setCart({...cart})
    }


    const variantAddToCart = async (item, price) => {
        let cartItems, url;
        let productDetails;
        let minimumQty = item?.minQty ? item?.minQty : 1


        //reactotron.log({item, selectedVariant})

        if (cart?.product_details?.length > 0) {
            url = "customer/cart/update";
            let cartProducts = cart?.product_details;
            let existing;

            if(price?._id){
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === price?._id)
            }
            else if(price?.attributs?.length > 0){
                let filterProducts = cart?.product_details?.filter(prod => prod.product_id === item?._id)
                filterProducts && filterProducts?.map(prod => {
                    // let att = [];
                    // attributes?.map(attr => {
                    //     att.push(attr?.selected)
                    // })

                    if(prod?.attributes?.every(v => price?.attributs?.includes(v))){
                        existing = prod;
                    }
                })
            }
            else {
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id)
            }

            if (existing) {

                //reactotron.log({existing})

                if(price?.stock){
                    if((parseInt(existing?.quantity) + 1) <= parseInt(price?.stock_value)){
                        existing.quantity = existing.quantity + 1;
                        setCart({...cart})
                        return false;
                    }
                    else{
                        Toast.show({
                            text1: 'Out off stock'
                        })
                        return false;
                    }
                }
                else{
                    existing.quantity = existing.quantity + 1;
                    setCart({...cart})
                    return false;
                }

                // existing.quantity = existing.quantity + 1;
                // cartItems = {
                //     product_details: cartProducts,
                //     user_id: userData?._id,
                //     type: panda.active
                // }
            }
            else{
                productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: price?._id ? 'variant' : 'single',
                    attributes: price?.attributs,
                    variants: price?._id ? [
                        {
                            variant_id: price?._id,
                            attributs: price?.attributs
                        }
                    ] : null,
                    quantity: minimumQty
                };
                cartItems = {
                    product_details: [...cart?.product_details, productDetails],
                    user_id: userData?._id,
                    type: panda.active
                }
            }
        }
        else {
            url = "customer/cart/add";
            productDetails = {
                product_id: item?._id,
                name: item?.name,
                image: item?.product_image,
                type: price?._id ? 'variant' : 'single',
                attributes: price?.attributs,
                variants: price?._id ? [
                    {
                        variant_id: price?._id,
                        attributs: price?.attributs
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
            if(response?.data?.data){
                setCart(response?.data?.data)
                await AsyncStorage.setItem("cartId", response?.data?.data?._id)
                loadingContext.setLoading(false)
                Toast.show({
                    type: 'success',
                    text1: 'Product added to cart',
                    position: 'top',
                    visibilityTime: 1000
                })
            }
            else if(response?.data?.message){
                Alert.alert('Warning', `${response?.data?.message}. Click OK to proceed without offer`, [
                    {
                        text: 'Cancel',
                        onPress: () => loadingContext?.setLoading(false),
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => updateCartWithoutOffer(cartItems)},
                    ]);
            }
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


    const addToCart = async (item) => {
        //reactotron.log({item, cart})
        let productDetails;
        let cartItems, url;
        let minimumQty = item?.minQty ? item?.minQty : 1
        
        if(cart?._id){
            let existing;
            if(item?.variant_id){
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === item?.variant_id)
            }
            else if(item?.attributes?.length > 0){
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

            //reactotron.log({item, existing})

            if(existing){
                if(item.stock){
                    if((parseInt(existing?.quantity) + 1) <= parseInt(item?.stockValue)){
                        existing.quantity = existing.quantity + 1;
                        setCart({...cart})
                        //reactotron.log({cart})
                        return false;
                    }
                    else{
                        Toast.show({
                            text1: 'Out off stock'
                        })
                        return false;
                    }
                }
                else{
                    existing.quantity = existing.quantity + 1;
                    setCart({...cart})
                    return false;
                }
                
            }
            else{
                url = "customer/cart/update";
                productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: item?.variant_id ? 'variant' : 'single',
                    attributes: item?.attributes,
                    variants: item?.variant_id ? [
                        {
                            variant_id: item?.variant_id,
                            attributs: item?.attributes
                        }
                    ] : null,
                    quantity: minimumQty
                };
                cartItems = {
                    product_details: [...cart?.product_details, productDetails],
                    user_id: userData?._id,
                    type: panda.active
                }
            }

            //reactotron.log({cart})
        }
        else{
            url = "customer/cart/add";
            productDetails = {
                product_id: item?._id,
                name: item?.name,
                image: item?.product_image,
                type: item?.variant_id ? 'variant' : 'single',
                attributes: item?.attributes,
                variants: item?.variant_id ? [
                    {
                        variant_id: item?.variant_id,
                        attributs: item?.attributes
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

        
        // let cartItems, url;
        // let productDetails;
        // let minimumQty = item?.minQty ? item?.minQty : 1

        // if (cart) {
        //     url = "customer/cart/update";
        //     let cartProducts = cart?.product_details;
        //     let existing;

        //     if(item?.variant_id){
        //         existing = cart?.product_details?.find(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === item?.variant_id)
        //     }
        //     else if(item?.attributes?.length > 0){
        //         let filterProducts = cart?.product_details?.filter(prod => prod.product_id === item?._id)
        //         filterProducts && filterProducts?.map(prod => {
        //             let att = [];
        //             attributes?.map(attr => {
        //                 att.push(attr?.selected)
        //             })

        //             if(prod?.attributes?.every(v => att.includes(v))){
        //                 existing = prod;
        //             }
        //         })
        //     }
        //     else {
        //         existing = cart?.product_details?.find(prod => prod.product_id === item?._id)
        //     }

        //     if (existing) {
        //         existing.quantity = existing.quantity + 1;
        //         cartItems = {
        //             product_details: cartProducts,
        //             user_id: userData?._id,
        //             type: panda.active
        //         }
        //     }
        //     else{
        //         productDetails = {
        //             product_id: item?._id,
        //             name: item?.name,
        //             image: item?.product_image,
        //             type: item?.variant_id ? 'variant' : 'single',
        //             attributes: item?.attributes,
        //             variants: item?.variant_id ? [
        //                 {
        //                     variant_id: item?.variant_id,
        //                     attributs: item?.attributes
        //                 }
        //             ] : null,
        //             quantity: minimumQty
        //         };
        //         cartItems = {
        //             product_details: [...cart?.product_details, productDetails],
        //             user_id: userData?._id,
        //             type: panda.active
        //         }
        //     }
        // }
        // else {
        //     url = "customer/cart/add";
        //     productDetails = {
        //         product_id: item?._id,
        //         name: item?.name,
        //         image: item?.product_image,
        //         type: item?.variant_id ? 'variant' : 'single',
        //         attributes: item?.attributes,
        //         variants: item?.variant_id ? [
        //             {
        //                 variant_id: item?.variant_id,
        //                 attributs: item?.attributes
        //             }
        //         ] : null,
        //         quantity: minimumQty
        //     };
        //     cartItems = {
        //         product_details: [productDetails],
        //         user_id: userData?._id,
        //         type: panda.active
        //     }


        // }

        loadingContext.setLoading(true)
        await customAxios.post(url, cartItems)
        .then(async response => {
            if(response?.data?.data){
                setCart(response?.data?.data)
                await AsyncStorage.setItem("cartId", response?.data?.data?._id)
                loadingContext.setLoading(false)
                Toast.show({
                    type: 'success',
                    text1: 'Product added to cart',
                    position: 'top',
                    visibilityTime: 1000
                })
            }
            else if(response?.data?.message){
                Alert.alert('Warning', `${response?.data?.message}. Click OK to proceed without offer`, [
                    {
                        text: 'Cancel',
                        onPress: () => loadingContext?.setLoading(false),
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => updateCartWithoutOffer(cartItems)},
                    ]);
            }
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


    const updateCartWithoutOffer = async(cartItems) => {
        if(cartItems){
            loadingContext?.setLoading(true)
            try {
                let carts = await customAxios.post("customer/cart/update-without-offer", cartItems);

                setCart(carts?.data?.data)
            } catch (error) {
                
            }
            finally{
                loadingContext?.setLoading(false)
            }
        }
    }

    const updateCart = async() => {

        // reactotron.log({cart})
        // return false;

        if(cart){
            loadingContext?.setLoading(true)
            try {
                let carts = await customAxios.post("customer/cart/update", cart);

                if(carts?.data?.data){
                    setCart(carts?.data?.data)
                }
                else if(response?.data?.message){
                    Alert.alert('Warning', `${response?.data?.message}. Click OK to proceed without offer`, [
                        {
                          text: 'Cancel',
                          onPress: () => loadingContext?.setLoading(false),
                          style: 'cancel',
                        },
                        {text: 'OK', onPress: () => updateCartWithoutOffer(cart)},
                      ]);
                }
                
            } catch (error) {
                
            }
            finally{
                loadingContext?.setLoading(false)
            }
        }
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
                addToCart,
                modifyQuantity,
                updateCart,
                variantAddToCart,
                getCartDetails
            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default CartProvider;

