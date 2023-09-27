import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import FastImage from 'react-native-fast-image'
import CommonCounter from '../../Components/CommonCounter'
import { useNavigation } from '@react-navigation/native'

const CartCard = ({item}) => {

    const navigation = useNavigation()

    const gotoStore = useCallback(() => {
        navigation.navigate('home', {screen: 'store', params : {name : item?.store?.name, mode : 'cartItem', storeId: item?.store?._id }})
    })

  return (
    <View style={{borderBottomWidth:0.2, borderColor:'#A9A9A9', padding:10, }} >

            <View style={styles.container}>
                <FastImage
                    style={{width:70, height:70, borderRadius:10}}
                    source={{ uri: `${IMG_URL}${item?.image}` }}
                />
                <View style={{marginLeft:5, flex:0.95}}>
                    <Text style={styles.nameText}>{item?.name}</Text>
                    <TouchableOpacity onPress={gotoStore}>
                        <Text style={styles.shopText}>{item?.store?.name}</Text>
                    </TouchableOpacity>
                </View>
                {/* {renderPricing()} */}
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={styles.rateText}>{`₹ ${parseFloat(item?.price).toFixed(2)}`}</Text>
                    <CommonCounter 
                        count={item?.quantity}
                        addItem={addItem}
                        removeItem={removeItem}
                        disabled={!item?.available || item?.status !== 'active'}
                    />
                </View>
                
            </View>
            {(!item?.available || item?.status !== 'active') && <Text style={styles.outofStock}>{"Out off Stock"}</Text>}
        </View>
  )
}

export default CartCard

const styles = StyleSheet.create({
    container : {
        flexDirection:'row', 
        alignItems:'center', 
        
        
    },
    nameText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    shopText : {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop:8
    },
    rateText : {
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