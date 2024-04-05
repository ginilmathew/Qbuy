import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Swipeable } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'
import CommonCounter from '../CommonCounter'
import { IMG_URL } from '../../config/constants'
import Animated, { FadeInDown, Transition } from 'react-native-reanimated'

const AnimatedStyle = FadeInDown.easing().delay(300);

const CartCard = ({gotoStore, addItem, removeItem, item, width, active, deleteItem, availability}) => {

    const deleteconfirmation = () => {
        Alert.alert('Warning', 'Are you sure want to delete this item', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => deleteItem(item)},
          ]);
    }

    const renderRightActions = () => {
        return(
            <View style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <TouchableOpacity onPress={deleteconfirmation} >
                    <MaterialCommunityIcons name={"delete-forever"} size={25} color={'red'} />
                </TouchableOpacity>
            </View>
        )
    }

    


    return (
        <Animated.View style={{ borderBottomWidth: 0.2, borderColor: '#A9A9A9', padding: 10, }} entering={AnimatedStyle} >

            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.container}>
                    <FastImage
                        style={{ width: 70, height: 70, borderRadius: 10 }}
                        source={{ uri: `${IMG_URL}${item?.product_image}` }}
                    />
                    <View style={{ marginLeft: 5, flex: 0.95 }}>
                        {item?.attributes?.length > 0 ? <Text style={styles.nameText}>{`${item?.name}(${item?.attributes?.join(', ')})`}</Text> : <Text style={styles.nameText}>{item?.name}</Text>}
                        <TouchableOpacity onPress={gotoStore}>
                            <Text style={styles.shopText}>{item?.store_name}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* {renderPricing()} */}
                    {item?.available && <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={styles.rateText}>{(!item?.stock || (item?.stock && parseInt(item?.stock_value) >= parseInt(item?.quantity ))) ? `₹ ${parseInt(item?.price)?.toFixed(2)}` : ""}</Text>
                        <CommonCounter
                            count={item?.quantity}
                            addItem={addItem}
                            removeItem={removeItem}
                            disabled={!item?.available}
                            width={width}
                            active={active}
                        />
                    </View>}
                </View>

            </Swipeable>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {item?.minimum_qty > item?.quantity && <Text style={styles.outofStock}>{`Min. quantity:${item?.minimum_qty}`}</Text>}
                {(item?.stock && (parseInt(item?.stock_value) < parseInt(item?.quantity))) && <Text style={styles.outofStock}>{"Out of Stock"}</Text>}
                {(!item?.available && item?.stock && (parseInt(item?.stock_value) > parseInt(item?.quantity))) && <Text style={styles.outofStock}>{"Not Available"}</Text>}
            </View>

        </Animated.View>
    )
}

export default CartCard

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',


    },
    nameText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    shopText: {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop: 8
    },
    rateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#089321',
        fontSize: 16,
    },
    outofStock: {
        position: 'absolute',
        right: 15,
        bottom: 5,
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold'
    }
})