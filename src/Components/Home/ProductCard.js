import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../config/constants'
import LinearGradient from 'react-native-linear-gradient'
import CommonAddButton from '../CommonAddButton'
import Fontisto from 'react-native-vector-icons/Fontisto'


const ProductCard = ({onClick, data}) => {
    return (
        <TouchableOpacity
            onPress={onClick}
            //style={{ marginHorizontal: marginHorizontal, marginRight: mr, marginLeft: ml, marginBottom: mb }}
        >
            <FastImage
                source={{ uri: `${IMG_URL}${data?.product_image}` }}
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
                {item?.status === "inactive" && <View style={{ position: 'absolute', top: '32%', width: '100%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ padding: 5, borderWidth: 1, borderColor: '#fff', margin: 8, borderRadius: 8 }}>
                            <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>Product Not Available</Text>
                        </View>
                    </View>

                </View>}

                {(data?.available && item?.status === "active" && userContext?.userData) && <View style={styles.addContainer}>
                    <CommonAddButton
                        onPress={openBottomSheet}
                    />
                </View>}

                {/* {!fashion && item?.openCloseTag && <View
                        style={{ position: 'absolute', right: 7, top: 7, backgroundColor: item?.openCloseTag === 'Closes Soon' ? '#FF0000' : '#58D36E', borderRadius: 8 }}
                    >
                        <Text style={styles.tagText}>{item?.openCloseTag}</Text>
                    </View>} */}

                {userContext?.userData &&
                    <TouchableOpacity
                        onPress={(data?.is_wishlist || wishlistIcon) ? RemoveAction : AddAction}
                        style={styles.hearIcon}
                    >

                        <Fontisto name={"heart"} color={(data?.is_wishlist || wishlistIcon) ? "#FF6464" : '#EDEDED'} size={12 / fontScale} />
                    </TouchableOpacity>}

            </FastImage>

        </TouchableOpacity>
    )
}

export default ProductCard

const styles = StyleSheet.create({})