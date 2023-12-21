/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions,  ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import PickDropAndReferCard from '../PickDropAndReferCard';
import Header from '../../../Components/Header';
import Carousel from 'react-native-reanimated-carousel';
import CommonTexts from '../../../Components/CommonTexts';
import CommonItemCard from '../../../Components/CommonItemCard';
import NameText from '../NameText';
import Offer from './Offer';
import LoaderContext from '../../../contexts/Loader';
import customAxios from '../../../CustomeAxios';
import SearchBox from '../../../Components/SearchBox';
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../../contexts/Auth';
import { IMG_URL } from '../../../config/constants';
import CategoryCard from './CategoryCard';
import AvailableStores from './AvailableStores';
import RecentlyViewed from './RecentlyViewed';
import PandaSuggestions from './PandaSuggestions';
import { getProduct } from '../../../helper/productHelper';
import FastImage from 'react-native-fast-image';
import reactotron from 'reactotron-react-native';
import CommonWhatsappButton from '../../../Components/CommonWhatsappButton';
import Ionicons from 'react-native-vector-icons/Ionicons'

import Animated, { useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
//import messaging from '@react-native-firebase/messaging';
import {
    useQuery,
    useInfiniteQuery
} from '@tanstack/react-query';
import TypeSkelton from '../Grocery/TypeSkelton';
import ShopCardSkeltion from '../Grocery/ShopCardSkeltion';
import ProductCard from '../../../Components/Home/ProductCard';
import CartContext from '../../../contexts/Cart';
import Toast from 'react-native-toast-message';



const QbuyGreenHome = async (datas) => {
    const homeData = await customAxios.post('customer/home', datas);
    let recents = await homeData?.data?.data?.find((item, index) => item?.type === 'recentlyviewed').data?.map(recent => getProduct(recent))
    let suggestions = await homeData?.data?.data?.find((item, index) => item?.type === 'suggested_products').data?.map(recent => getProduct(recent))

    let available = homeData?.data?.data?.find((item, index) => item?.type === 'available_products').data?.slice(0, 25).map(avail => getProduct(avail))
    //reactotron.log({recents })
    return {
        home: homeData?.data?.data,
        recents: recents,
        suggestions,
        //availablePdt: available,
        availablePdt: homeData?.data?.data?.find((item, index) => item?.type === 'available_products'),
        slider: homeData?.data?.data?.find((item, index) => item?.type === 'sliders'),

    }
}

const QbuyGreenProducts = async (items, pageparam) => {
    const homeDataProduct = await customAxios.post(`customer/new-product-list?page=` + pageparam, { ...items, page: pageparam });

    let products = homeDataProduct?.data?.data?.available_product?.map(prod => getProduct(prod))
    return {
        //data: products,
        data: homeDataProduct?.data?.data?.available_product,
        lastPage:homeDataProduct?.data?.data
    
    }

}


const QBuyGreen = ({ navigation }) => {



    const { width, height } = useWindowDimensions();
    const userContext = useContext(AuthContext);
    const cartContext = useContext(CartContext);
    
    const styles1 = makeStyles(height);




    let datas = {
        type: 'green',
        // coordinates: env === "dev" ? location : userContext?.location
        coordinates: userContext?.location,
    }


    
    





    const {
        data,
        error,
        fetchNextPage,
        refetch: infiniteQueryRefetch,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        isLoading,
        remove: infiniteQueryRemove
    } = useInfiniteQuery({
        queryKey: ['greenHomeProducts'],
        queryFn: ({ pageParam = 1 }) => QbuyGreenProducts(datas, pageParam),
        getNextPageParam: (lastPage, pages) => {
            return pages?.length + 1
        },
        enabled: false

    })


    const Homeapi = useQuery({ 
        queryKey: ['greenHome'], 
        queryFn: () => QbuyGreenHome(datas),
        enabled: false
    });


   



    const opacity = useSharedValue(1);


    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withDelay(1000, withTiming(0.5, { duration: 1000 })),
                withDelay(1000, withTiming(1, { duration: 1000 })),
            ),
            -1,
            false
        )
    }, [])

    


    const RefetchMore = () => {
        Homeapi?.refetch();
        infiniteQueryRefetch();
    }


    const RefetchMoreFlat = () => {
        infiniteQueryRemove()
        Homeapi?.refetch();
        infiniteQueryRefetch();
    }



    useFocusEffect(
        React.useCallback(() => {

            RefetchMore()

        }, [userContext?.location])
    );






    const ourFarm = useCallback(() => {
        navigation.navigate('OurFarms')
    }, [navigation])

    const referRestClick = useCallback(() => {
        navigation.navigate('RefferRestaurant')
    }, [navigation])

    const gotoChat = useCallback(() => {
        navigation.navigate('Chat')
    }, [navigation])

    const onClickDrawer = useCallback(() => {
        navigation.openDrawer()
    }, [navigation])

    let offer = {
        hotel: 'Farm N Fresh',
    }

    const goToShop = useCallback(() => {
        navigation.navigate('SingleHotel', { item: offer, mode: 'offers' })
    }, [navigation])




    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen', { mode: 'fashion' })
    }, [navigation])



    const CarouselSelect = (item) => {
        switch (item?.screentype) {
            case 'product':
                let data = getProduct(item?.product)
                navigation.navigate('SingleItemScreen', { item: data })
                break;
            case 'store':
                navigation.navigate('store', { name: item?.vendor?.store_name, mode: 'store', item: item?.vendor, storeId: item?.vendor?._id })
                break;
            default:
                return false;
        }
    }



    const CarouselCardItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => CarouselSelect(item)} style={{ alignItems: 'center', marginTop: 20, width: '100%', height: '85%' }} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.original_image}` }}
                    style={{ height: '100%', width: '95%', borderRadius: 20 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        )
    }




    const renderItems = (item) => {
        if (item?.type === 'categories') {
            return (
                <>
                    <CategoryCard data={item?.data} />
                    <SearchBox onPress={onSearch} />
                    {Homeapi?.data?.slider?.data?.length > 0 &&
                        <View>
                            <Carousel
                                key={item?._id}
                                loop
                                width={width}
                                height={height / 5}
                                autoPlay={true}
                                data={Homeapi?.data?.slider?.data}
                                scrollAnimationDuration={1000}
                                renderItem={CarouselCardItem}
                            />
                        </View>}

                    {/* {slider?.length > 0 && <ImageSlider datas={slider} mt={20} />} */}
                </>
            )
        }

        if (item?.type === 'stores') {
            return (
                <>
                    {item?.data?.length > 0 &&
                        <AvailableStores key={item?._id} data={item?.data} />
                    }

                    <View style={styles.pickupReferContainer}>
                        <PickDropAndReferCard
                            onPress={ourFarm}
                            lotties={require('../../../Lottie/farmer.json')}
                            label={'Our Farms'}
                            lottieFlex={1}
                        />
                        <PickDropAndReferCard
                            onPress={referRestClick}
                            lotties={require('../../../Lottie/farm.json')}
                            label={"Let's Farm Together"}
                            lottieFlex={0.4}
                        />
                    </View>
                    {/* <View style={styles.offerView}>
                        <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text>
                         <Offer onPress={goToShop} shopName={offer?.hotel} />
                        <CountDownComponent />
                        <Text style={styles.offerValText}>{'Offer valid till period!'}</Text>
                    </View> */}
                </>
            )
        }
        if (item?.type === 'offer_array') {
            return (
                <>
                    {item?.data?.length > 0 && <View style={styles.offerView}>
                        <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text>
                        <Offer onPress={goToShop} shopName={offer?.hotel} />
                        {/* <CountDownComponent /> */}
                        <Text style={styles.offerValText}>{'Offer valid till period!'}</Text>
                    </View>}
                </>
            )
        }
        if (item?.type === 'recentlyviewed' && Homeapi?.data?.recents) {
            //reactotron.log({recentData: Homeapi?.data?.recents})
            return (
                <>
                    <RecentlyViewed 
                        key={item?._id} 
                        //data={Homeapi?.data?.recents}
                        data={item?.data}
                        loggedIn={userContext?.userData ? true : false} 
                        styles={styles1}
                    />
                </>
            )
        }
        if (item?.type === 'suggested_products') {
            return (
                <>
                    <PandaSuggestions 
                        key={item?._id} 
                        //data={Homeapi?.data?.suggestions} 
                        data={item?.data}
                        loggedIn={userContext?.userData ? true : false} 
                        styles={styles1}
                    />
                </>
            )
        }
        // if (item?.type === 'available_products') {
        //     return (
        //         <>
        //             <AvailableProducts data={item?.data}  />
        //         </>
        //     )
        // }


    }


    const RenderMainComponets = () => {
        return (
            <View style={styles.container}>
                {Homeapi?.data?.home?.map(home => renderItems(home))}
                {data?.pages?.[0].data.length > 0 && <CommonTexts label={'Available Products'} ml={15} mb={10} mt={20} />}
            </View>
        )
    }

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



    const renderProducts = ({ item, index }) => {
        return (
            <View key={index} style={{ flex: 0.5, justifyContent: 'center'}}>
                {/* <ProductCard
                        data={item}
                        loggedIn={userContext?.userData ? true : false}
                        addToCart={()=> addToCart(item)}
                        // wishlistIcon={wishlistIcon}
                        // removeWishList={removeWishList}
                        // addWishList={addWishList}
                        viewProduct={() => viewProduct(item)}
                        width={width / 2.2}
                        styles={styles1}
                        height={height / 3.6}
                    /> */}
                <CommonItemCard
                    refetch={Homeapi?.refetch}
                    item={item}
                    key={item?._id}
                    width={width / 2.2}
                    height={height / 3.6}
                    mr={5}
                    ml={8}
                    mb={15}
                />
            </View>
        )
    }

    if (Homeapi.isLoading && isLoading) {
        return (
            <View>
                <Header onPress={onClickDrawer} />
                <ScrollView showsVerticalScrollIndicator={false} style={{ width: width, height: height }}>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', margin: 5, justifyContent: 'center', paddingTop: 4 }}>
                            {[1, 2, 3, 4]?.map(arr => {
                                return (
                                    <TypeSkelton key={arr} />
                                )
                            })}
                        </View>
                        <Animated.View style={{ height: height / 5, alignItems: 'center', marginTop: 10, shadowOpacity: 0.1, shadowRadius: 1, opacity, width: width }} >
                            <Animated.View
                                style={{ width: '100%', height: '100%', width: '90%', backgroundColor: '#fff', margin: 5, borderRadius: 20, opacity }}
                            />
                        </Animated.View>
                        <View style={{ width: width }}>
                            <SearchBox onPress={null} />
                        </View>
                        <CommonTexts label={'Available Stores'} ml={15} fontSize={13} mt={20} />
                        <View style={{ marginHorizontal: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
                                <ShopCardSkeltion key={item} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    const keyExtractorGreen = (item) => item?._id;

    const addMore = () => {
        // setInitialPage((pre) => pre + 1);
        fetchNextPage()

    }


    const ListFooterComponents = () => {
        if (data?.pages?.[0]?.lastPage?.last_page * 1 <= data?.pageParams?.length * 1) {
            return null
        }
        return (
            <TouchableOpacity onPress={addMore} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                {isFetching ?
                    <ActivityIndicator size="large" color="#00ff00" />
                    : <View
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 2
                        }}>
                        <Text style={{ fontFamily: 'Poppins', letterSpacing: 1, fontSize: 18 }}>Load More</Text>
                        <Ionicons name={'reload'} size={20} color={"#00ff00"} /></View>}
            </TouchableOpacity>
        )
    }

    return (
        <>
            <Header onPress={onClickDrawer} />
            <View style={styles.container} >
                <NameText userName={userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile} mt={8} />
                <FlatList
                    disableVirtualization={true}
                    ListHeaderComponent={RenderMainComponets}
                    data={data?.pages?.map(page => page?.data)?.flat()}
                    //data={Homeapi?.data?.availablePdt}
                    keyExtractor={keyExtractorGreen}
                    renderItem={renderProducts}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    removeClippedSubviews={true}
                    windowSize={10}
                    maxToRenderPerBatch={10}
                    refreshing={isLoading || Homeapi?.isLoading}
                    onRefresh={RefetchMoreFlat}
                    numColumns={2}
                    style={{ marginLeft: 5 }}
                    contentContainerStyle={{ justifyContent: 'center', gap: 10 }}
                    ListFooterComponent={ListFooterComponents}
                />
            </View>
            <CommonWhatsappButton
                position="absolute"
                bottom={10}
                right={10}
            />
        </>
    )
}

export default QBuyGreen

const makeStyles = fontScale => StyleSheet.create({


    bottomCountText: {
        fontFamily: 'Poppins-medium',
        color: '#fff',
        fontSize: 0.01 * fontScale,
    },
    bottomRateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#fff',
        fontSize: 0.012 * fontScale,
    },
    textSemi: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 0.014 * fontScale,
        paddingBottom: 2
    },
    textSemiError: {
        fontFamily: 'Poppins-SemiBold',
        color: 'red',
        fontSize: 10 / fontScale,
        paddingBottom: 2
    },
    lightText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 0.011 * fontScale,
        marginBottom: 3
    },
    addContainer: {
        position: 'absolute',
        right: 5,
        bottom: 10
    },
    tagText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 12 / fontScale,
        padding: 5
    },
    hearIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'

    },
    RBsheetHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10
    },
    totalCount: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    outofstock: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    viewCartBox: {
        alignItems: 'flex-end',
        flex: 0.5
    }
})

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F4FFE9',
    },
    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        marginLeft: 20,
        marginRight: 10,
    },
    pickupReferContainer: {
        flexDirection: 'row',
        backgroundColor: '#F4FFE9',
        marginTop: 20,
        justifyContent: 'space-evenly',
    },
    offerView: {
        alignItems: 'center',
        backgroundColor: '#DDFFCB',
        marginBottom: 20,
        paddingVertical: 15,
    },
    discountText: {
        fontFamily: 'Poppins-Bold',
        color: '#464CFF',
        fontSize: 18,
    },
    offerValText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 10,
        marginTop: 5,
    },
    productContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 17,
        paddingHorizontal: '3%',
    },

})
