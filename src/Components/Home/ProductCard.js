import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback } from 'react'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../config/constants'
import LinearGradient from 'react-native-linear-gradient'
import CommonAddButton from '../CommonAddButton'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Animated from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import reactotron from 'reactotron-react-native'

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)


const ProductCard = ({ data, loggedIn, addToCart, viewProduct, width, styles, height, ...props }) => {


    const navigation = useNavigation()


    const openProduct = () => {
        viewProduct(data)
    }


    const addCart = () => {
        if(loggedIn){
            addToCart(data)
        }
        else{
            navigation.navigate("guestModal")
        }
    }

    return (
        <TouchableOpacity
            onPress={openProduct}
            style={{ marginRight: 2 }}
        >
            <AnimatedFastImage
                source={{ uri: `${IMG_URL}${data?.product_image}` }}
                //sharedTransitionTag={`images${data?._id}`}
                style={{ height: height ? height : 110, width: width, justifyContent: 'flex-end', borderRadius: 16 }}
                progressiveRenderingEnabled={true}
            //{...props}
            >
                <LinearGradient colors={data?.available ? ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)'] : ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.9)']} style={{ height: '100%', justifyContent: 'flex-end', padding: 10 }}>
                    <Text style={styles.textSemi}>{data?.attributes && data?.attributes?.length > 0 ? `${data?.name}  (${data?.attributes?.join(', ')})` : data?.name}</Text>
                    {data?.available && <Text style={styles.bottomRateText}>{`₹ ${data?.price}`}
                        {parseInt(data?.discount_percentage) > 0 && <Text style={{ color: '#fff', textDecorationLine: 'line-through', textDecorationStyle: 'solid', fontSize: 10, textDecorationColor: '#000' }}>{` ₹ ${data?.regular_price}`}</Text>}</Text>}
                    <Text numberOfLines={1} style={[styles.lightText, { width: '80%' }]}>{data?.store_name}</Text>
                </LinearGradient>
                {!data?.available && <View style={{ width: '100%' }}>
                    {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ padding: 5, borderWidth: 1, borderColor: '#fff', margin: 8, borderRadius: 8 }}>
                            <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>Out of stock</Text>
                        </View>
                    </View> */}
                    <View style={{ backgroundColor: 'red', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', color: '#fff', fontSize: 12, padding: 5, textAlign: "center" }}>{'Out Of Stock'}</Text>
                    </View>

                </View>}

                {(data?.available) && <View style={styles.addContainer}>
                    <CommonAddButton
                        onPress={addCart}
                    />
                </View>}
                {parseFloat(data?.discount_percentage) > 0 && <View style={styles.discountViewer}>
                    <View style={[styles?.priceTag, { width: 40 }]}>
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', alignSelf: 'center', fontSize: 8 }}>{`${parseFloat(data?.discount_percentage).toFixed(1)}%`}</Text>
                    </View>

                </View>}

                {/* {loggedIn &&
                    <TouchableOpacity
                        onPress={(data?.is_wishlist || wishlistIcon) ? removeWishList : addWishList}
                        style={styles.hearIcon}
                    >

                        <Fontisto name={"heart"} color={(data?.is_wishlist || wishlistIcon) ? "#FF6464" : '#EDEDED'} size={12} />
                    </TouchableOpacity>} */}

            </AnimatedFastImage>

        </TouchableOpacity>
    )
}

export default memo(ProductCard) 