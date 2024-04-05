import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FastImage from 'react-native-fast-image';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';



const Header = ({ userData, changeAddress, opendrawer, currentAddress, active, onClickFashionCat, onClickWishlist, onClickNotificatn, count }) => {


    return (
        <SafeAreaView
            style={{
                flexDirection: 'row',
                backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                paddingTop: 5,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {userData &&
                <TouchableOpacity onPress={opendrawer} style={{ flex: 0.13, marginLeft: 13 }} >
                    <EvilIcons name={'navicon'} color="#23233C" size={36} />
                </TouchableOpacity>
            }
            <TouchableOpacity
                onPress={changeAddress}
                style={{ flexDirection: 'row', flex: 0.84, justifyContent: 'center', alignItems: 'center' }}
            >
                {currentAddress && <FastImage
                    style={styles.logo}
                    source={active === 'green' ? require('../../Images/locationGrocery.png') : active === 'fashion' ? require('../../Images/fashionLocation.png') : require('../../Images/location.png')}
                />}
                <View style={{ marginLeft: 5, flex: 0.98, }}>
                    <Text numberOfLines={2} style={styles.textStyle}>{currentAddress}</Text>
                </View>
            </TouchableOpacity>
            {onClickFashionCat &&
                <>
                    <TouchableOpacity onPress={onClickFashionCat}>
                        <AntDesign name={'appstore1'} color="#FF7190" size={20} />
                    </TouchableOpacity>

                </>}

            {onClickWishlist && userData &&
                <TouchableOpacity onPress={onClickWishlist}>
                    <Fontisto name={'heart'} color="#FF6464" size={20} marginHorizontal={8} />
                </TouchableOpacity>}
                {
                    userData && (
                    <TouchableOpacity onPress={onClickNotificatn} style={{ marginRight: 8 }}>
                        {
                            count > 0 && (
                                <View style={[styles.notification, {
                                    backgroundColor: active === 'fashion' ? '#FF7190' : active === 'green' ? '#8ED053' : '#58D36E',
                                }]}>
                                    <Text style={styles.notCount}>{count}</Text>
                                </View>
                            )
                        }
                        <Ionicons name={'notifications'} color="#23233C" size={25} />
                    </TouchableOpacity>
                    )
                }

        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({

    logo: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    notification: {
        alignItems: 'center',
        position: 'absolute',
        zIndex: 999,
        left: 10,
        top: -5,
        paddingHorizontal: 2,
        paddingVertical: 1,
        borderRadius: 12
    },
    notCount: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700'
    },
    textStyle: {
        fontFamily: 'Poppins-Medium',
        color: '#0D0D0D',
        fontSize: 9,
    }
});