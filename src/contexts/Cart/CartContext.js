import React, { useState, useEffect, useCallback, useContext } from "react";
import Context from "./index";
import { Alert, Animated } from 'react-native'
import customAxios from "../../CustomeAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import LoaderContext from "../Loader";
import AuthContext from "../Auth";
import PandaContext from "../Panda";
import { getProducts } from "../../helper/homeProductsHelper";
import reactotron from "reactotron-react-native";

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

    }, [panda?.active])


    // useEffect(() => {
    //     getDefaultAddress()
    // }, [address])


    const modifyQuantity = (index, mode, product) => {
        reactotron.log({product, cart: cart?.product_details })
        let findIndex;
        if(product?.variant_id){
            findIndex = cart?.product_details?.findIndex(pr => pr?.product_id === product?._id && pr?.variants?.[0]?.variant_id === product?.selectedVariant)
            reactotron.log({findIndex})
        }
        else{
            findIndex = cart?.product_details?.findIndex(pr => pr?.product_id === product?._id)
        }
        if(mode === "add"){
            cart.product_details[findIndex].quantity = cart.product_details[index].quantity + 1
        }
        else if(mode === "delete"){
            let remain = cart.product_details?.filter((prod, i)  => i != findIndex)
            cart['product_details'] = remain
            updateCart()
        }
        else{
            cart.product_details[findIndex].quantity = cart.product_details[findIndex].quantity - 1
        }

        

        setCart({...cart})
    }


    const variantAddToCart = async (item, price) => {
        let cartItems, url;
        let productDetails;
        let minimumQty = item?.minQty ? item?.minQty : 1



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
                if(price?.stock){
                    if(parseInt(price?.stock_value) >= minimumQty){
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
                    else{
                        Toast.show({
                            text1: 'Out off stock'
                        })
                        return false;
                    }
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
        }
        else {
            if(price?.stock){
                if(parseInt(price?.stock_value) >= minimumQty){
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
                else{
                    Toast.show({
                        text1: 'Out off stock'
                    })
                    return false;
                }
            }
            else{
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

        reactotron.log({item})

        //return false
        let productDetails;
        let cartItems, url;
        let minimumQty = item?.minimum_qty ? item?.minimum_qty : 1
        
        if(cart?._id){
            let existing;
            if(item?.variant_id){
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === item?.variant_id)
            }
            else if(item?.attributes?.length > 0){
                let filterProducts = cart?.product_details?.filter(prod => prod.product_id === item?._id)
                filterProducts && filterProducts?.map(prod => {
                    let att = [];
                    if(item?.selected_attribute){
                        att = item?.selected_attribute
                    }
                    else{
                        att = item?.attributes
                    }
                    

                    if(prod?.attributes?.every(v => att.includes(v))){
                        existing = prod;
                    }
                })
            }
            else {
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id)
            }


            if(existing){
                if(item.stock){
                    if((parseInt(existing?.quantity) + 1) <= parseInt(item?.stock_value)){
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
                
            }
            else{
                if((item.stock && parseInt(item?.stock_value) >= minimumQty) || !item.stock){
                    url = "customer/cart/update";
                    productDetails = {
                        product_id: item?._id,
                        name: item?.name,
                        image: item?.product_image,
                        type: item?.variant_id ? 'variant' : 'single',
                        attributes: item?.selected_attribute ? item?.selected_attribute : item?.attributes,
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
                else{
                    Toast.show({
                        text1: 'Out off stock'
                    })
                    return false;
                }
            }

        }
        else{
            if((item.stock && parseInt(item?.stock_value) >= minimumQty) || !item.stock){
                url = "customer/cart/add";
                productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: item?.variant_id ? 'variant' : 'single',
                    attributes: item?.selected_attribute ? item?.selected_attribute : item?.attributes,
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
            else{
                Toast.show({
                    text1: 'Out off stock'
                })
                return false;
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

    const updateCart = useCallback(async() => {


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
    },[cart])


    const addLocalCart = async (item, selectedVariant = null) => {
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

