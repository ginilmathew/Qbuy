/* eslint-disable prettier/prettier */
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import React, { memo, useCallback, useContext } from "react";
import CommonItemCard from "../../../Components/CommonItemCard";
import CommonTexts from "../../../Components/CommonTexts";
import CartContext from "../../../contexts/Cart";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "../../../Components/Home/ProductCard";

const PandaSuggestions = memo(({ data, loggedIn, wishlistIcon, removeWishList, addWishList, styles }) => {
    const {width, height} = useWindowDimensions()
    const cartContext = useContext(CartContext);
    const navigation = useNavigation()


    const addToCart = useCallback((item) => {
        if (parseInt(item?.price) < 1) {
            Toast.show({
                type: 'info',
                text1: 'Price should be more than 1'
            });
            return false
        }


        if (!item?.variant && item?.attributes?.length === 0) {
            cartContext?.addToCart(item)
        }
        else {
            navigation.navigate('SingleItemScreen', { item })
        }
    })

    const viewProduct = useCallback((item) => {
        navigation.navigate('SingleItemScreen', { item })
    })

    return (
        <>
            { data?.length > 0 && (
                <CommonTexts label={ "Panda Suggestions" } ml={ 15 } mb={ 5 } mt={ 15 } />
            ) }
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={ { flexDirection: 'row', padding: 5, gap: 5, overflow: 'scroll' } }
            >
                { data.map(item => (
                    // <ProductCard
                    //     data={item}
                    //     loggedIn={loggedIn}
                    //     addToCart={()=> addToCart(item)}
                    //     wishlistIcon={wishlistIcon}
                    //     removeWishList={removeWishList}
                    //     addWishList={addWishList}
                    //     viewProduct={() => viewProduct(item)}
                    //     width={width / 2.5}
                    //     styles={styles}
                    //     //height={height}
                    // />
                    <CommonItemCard
                        key={ item?._id }
                        item={ item }
                        width={ width / 2.5 }
                        height={ height / 7 }
                        marginHorizontal={ 5 }
                    />
                )) }
            </ScrollView>
        </>
    );
});

export default PandaSuggestions;

const styles = StyleSheet.create({});
