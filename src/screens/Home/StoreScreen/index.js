import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl, BackHandler } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import PandaContext from '../../../contexts/Panda'
import CommonItemSelect from '../../../Components/CommonItemSelect'
import CommonItemCard from '../../../Components/CommonItemCard'
import TypeCard from '../Grocery/TypeCard'
import { IMG_URL, env, location } from '../../../config/constants'
import LoaderContext from '../../../contexts/Loader'
import customAxios from '../../../CustomeAxios'
import HotelCard from '../Category/HotelCard'
import StoreAddressCard from '../Category/StoreAddressCard'
import Toast from 'react-native-toast-message'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { isEmpty } from 'lodash'
import moment from 'moment'
import reactotron from 'reactotron-react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'


const StoreScreen = ({ route }) => {

    const navigation = useNavigation();

    const { width, height } = useWindowDimensions()

    const styles = makeStyles(height)


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingContex = useContext(LoaderContext)
    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    let loadingg = loadingContex?.loading

    let userData = userContext?.userData

    const name = route?.params?.name
    const mode = route?.params?.mode
    const item = route?.params?.item
    const storeId = route?.params?.storeId


   

    const [storeDetails, setStoreDetails] = useState([])
    const [categories, setCategories] = useState([])
    const [isSelectionModeEnabled, setIsSelectionModeEnabled] =
    React.useState(false);

    const [selected, setSelected] = useState(false)


    useFocusEffect(
        React.useCallback(() => {
            getStoreDetails()
        }, [])
    );

    const getStoreDetails = async () => {
        loadingContex.setLoading(true)

        let data = {
            vendor_id: item?._id ? item?._id : storeId,
            // coordinates: env === "dev" ? location : userContext?.location
            coordinates: userContext?.location

        }

        await customAxios.post(`customer/store`, data)
            .then(async response => {
                setStoreDetails(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContex.setLoading(false)
            })
    }

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            if (isSelectionModeEnabled) {
              setIsSelectionModeEnabled(false);
             
              return true;
            } else {
                if(mode === "cartItem"){
                    navigation.navigate('Cart')
                }
              return false;
            }
          };
    
          const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
          );
    
          return () => subscription.remove();
        }, [isSelectionModeEnabled])
      );


    const backToCart = useCallback(() => {
        navigation.navigate('Cart')
    }, [navigation])

    const backToCheckout = useCallback(() => {
        navigation.navigate('Checkout')
    }, [navigation])


    return (
        <>
            <HeaderWithTitle title={mode === 'store' ? item?.store_name : name} onPressBack={mode === 'cartItem' ? backToCart : mode === 'checkoutItem' ? backToCheckout : ''} />
            <ScrollView
                style={{ flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loadingContex.loading} onRefresh={getStoreDetails} />
                }>

                <View style={{ paddingHorizontal: 10 }}>
                    <FastImage
                        source={item?.store_logo ? { uri: `${IMG_URL}${item?.store_logo}` } : storeDetails?.store_logo ? { uri: `${IMG_URL}${storeDetails?.store_logo}` } : require('../../../Images/storeImage.jpg')}
                        // source={{ uri: `${IMG_URL}${item?.image}` }}
                        style={styles.mainImage}
                        borderRadius={15}
                    >
                        {((storeDetails?.start_time && storeDetails?.start_time !== 'Invalid date' && storeDetails?.start_time !== "null") || (storeDetails?.end_time && storeDetails?.end_time !== "Invalid date" && storeDetails?.end_time !== "null")) && <View
                            style={{ backgroundColor: '#8ED053', width: 150, height: 20, borderBottomRightRadius: 10, borderTopLeftRadius: 10, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <CommonTexts label={`${moment(storeDetails?.start_time, "hh:mm a").format('hh:mm a')} - ${moment(storeDetails?.end_time, "hh:mm a").format('hh:mm a')}`} color={'#fff'} fontSize={11} />
                        </View>}
                    </FastImage>
                    <StoreAddressCard address={item?.store_address || item?.store_address !== "null" ? item?.store_address : storeDetails?.store_address} />
                    <Text style={styles.description}>{item?.seo_description}</Text>
                </View>
                {/* {active !== 'panda' && */}
                <View style={{ backgroundColor: '#76867314', paddingBottom: 10, }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', marginTop: 15 }}
                    >
                        {storeDetails?.category_id?.map((cat, index) =>
                            (<TypeCard item={cat} key={index} storeId={storeId} mymode={'MYMODE'} />)
                        )}
                    </ScrollView>
                </View>


                <CommonTexts label={'Available Products'} my={15} ml={10} fontSize={13} />
                <View style={styles.itemContainer}>
                    {storeDetails?.products?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
                            width={width / 2.2}
                            height={250}
                        />
                    ))}
                </View>

            </ScrollView>
        </>
    )
}

export default StoreScreen

const makeStyles = height => StyleSheet.create({
    mainImage: {
        width: '100%',
        height: height / 4,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'flex-end'
    },
    description: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 13,
        marginTop: 10
    },

    hotelView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },
    recommPdtBox: {
        marginTop: 15,
        marginBottom: 60,
        backgroundColor: '#76867314',
        paddingVertical: 5
    },
    restaurantView: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: '#F7F7F7',
        paddingVertical: 10
    },
    foodName: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    },
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },


})