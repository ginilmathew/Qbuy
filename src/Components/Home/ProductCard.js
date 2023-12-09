import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../config/constants'
import LinearGradient from 'react-native-linear-gradient'
import CommonAddButton from '../CommonAddButton'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Animated from 'react-native-reanimated'

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)


const ProductCard = ({data, loggedIn, addToCart, wishlistIcon, removeWishList, addWishList, viewProduct, width, styles, height}) => {
    return (
        <TouchableOpacity
            onPress={viewProduct}
        >
            <AnimatedFastImage
                source={{ uri: `${IMG_URL}${data?.product_image}` }}
                sharedTransitionTag={`images${data?._id}`}
                style={{ height: height ? height : 110, width: width, justifyContent: 'flex-end', borderRadius: 16 }}
                progressiveRenderingEnabled={true}
            >
                <LinearGradient colors={data?.available ? ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)'] : ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.9)']} style={{ height: '100%', justifyContent: 'flex-end', padding: 10 }}>
                    <Text style={styles.textSemi}>{data?.name}</Text>
                    {data?.available && <Text style={!data?.available ? styles.textSemiError : styles.bottomRateText}>{`₹ ${data?.price}`}</Text>}
                    <Text style={styles.lightText}>{data?.store?.name}</Text>
                </LinearGradient>
                {!data?.available && <View style={{ position: 'absolute', top: '32%', width: '100%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ padding: 5, borderWidth: 1, borderColor: '#fff', margin: 8, borderRadius: 8 }}>
                            <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>Out of stock</Text>
                        </View>
                    </View>

                </View>}
                {data?.status === "inactive" && <View style={{ position: 'absolute', top: '32%', width: '100%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ padding: 5, borderWidth: 1, borderColor: '#fff', margin: 8, borderRadius: 8 }}>
                            <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>Product Not Available</Text>
                        </View>
                    </View>

                </View>}

                {(data?.available && data?.status === "active" && loggedIn) && <View style={styles.addContainer}>
                    <CommonAddButton
                        onPress={addToCart}
                    />
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