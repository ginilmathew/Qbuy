/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions, SafeAreaView, RefreshControl, PermissionsAndroid, Pressable, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import ImageSlider from '../../../Components/ImageSlider';
import CustomSearch from '../../../Components/CustomSearch';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import OfferText from '../OfferText';
import PickDropAndReferCard from '../PickDropAndReferCard';
import Header from '../../../Components/Header';
import Carousel from 'react-native-reanimated-carousel';
import CommonSquareButton from '../../../Components/CommonSquareButton';
import CommonTexts from '../../../Components/CommonTexts';
import TypeCard from '../Grocery/TypeCard';
import CommonItemCard from '../../../Components/CommonItemCard';
import NameText from '../NameText';
import ShopCard from '../Grocery/ShopCard';
import CountDownComponent from '../../../Components/CountDown';
import Offer from './Offer';
import LoaderContext from '../../../contexts/Loader';
import customAxios from '../../../CustomeAxios';
import SearchBox from '../../../Components/SearchBox';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AuthContext from '../../../contexts/Auth';
import { IMG_URL, env, location } from '../../../config/constants';
import CartContext from '../../../contexts/Cart';
import CategoryCard from './CategoryCard';
import AvailableStores from './AvailableStores';
import RecentlyViewed from './RecentlyViewed';
import AvailableProducts from './AvailableProducts';
import PandaSuggestions from './PandaSuggestions';
import { isEmpty } from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProduct } from '../../../helper/productHelper';
import FastImage from 'react-native-fast-image';
import reactotron from 'reactotron-react-native';
import SplashScreen from 'react-native-splash-screen'
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

const QbuyGreenHome = async (datas) => {
    const homeData = await customAxios.post('customer/home', datas);

    return {
        home: homeData?.data?.data,
        availablePdt: homeData?.data?.data?.find((item, index) => item?.type === 'available_products'),
        slider: homeData?.data?.data?.find((item, index) => item?.type === 'sliders'),

    }
}


const QbuyGreenProducts = async (items, pageparam) => {
    const homeDataProduct = await customAxios.post(`customer/new-product-list?page=` + pageparam, items);
    return {
        data: homeDataProduct?.data?.data?.data,
        lastpage: homeDataProduct?.data?.data?.last_page
    }

}

const QBuyGreen = ({ navigation }) => {



    const { width, height } = useWindowDimensions();
    const firstTimeRef = React.useRef(true);
    const loadingg = useContext(LoaderContext);
    const userContext = useContext(AuthContext);





    let datas = {
        type: 'green',
        // coordinates: env === "dev" ? location : userContext?.location
        coordinates: userContext?.location,
    }


    const Homeapi = useQuery({ queryKey: ['greenHome'], queryFn: () => QbuyGreenHome(datas) });

    // const {data,refetch} = useQuery({ queryKey: ['greenHomeProducts',intialPage], queryFn: () => QbuyGreenProducts(datas, intialPage) ,keepPreviousData:true});
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


    })





    let userData = userContext?.userData

    let loader = loadingg?.loading;


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

    const [homeData, setHomeData] = useState(null);
    const [availablePdt, setavailablePdt] = useState(null);
    const [slider, setSlider] = useState(null);


    // useEffect(() => {
    //     let availPdt = homeData?.find((item, index) => item?.type === 'available_products')
    //     setavailablePdt(availPdt?.data)
    //     let slider = homeData?.find((item, index) => item?.type === 'sliders')
    //     setSlider(slider?.data)

    // }, [homeData])

    // useEffect(() => {
    //     //requestUserPermission()
    // }, [])


    // async function requestUserPermission() {

    //     if(Platform.OS === 'android'){
    //         PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    //     }

    //     const authStatus = await messaging().requestPermission();
    //     const enabled =
    //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //     if (enabled) {
    //       console.log('Authorization status:', authStatus);
    //     }

    //getCurrentLocation()
    // }
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
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            RefetchMore()
            // infiniteQueryRefetch({ refetchPage: (page, index) => index === 0 })
        }, [infiniteQueryRefetch, Homeapi.refetch, userContext?.location])
    );

    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();





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



    // useFocusEffect(
    //     React.useCallback(() => {
    //         getHomedata()
    //     }, [userContext?.location])
    // );

    // useEffect(() => {

    // }, [])


    // const getHomedata = async () => {

    //     loadingg.setLoading(true)

    //     let datas = {
    //         type: 'green',
    //         // coordinates: env === "dev" ? location : userContext?.location
    //         coordinates: userContext?.location,
    //     }
    //     await customAxios.post('customer/home', datas)
    //         .then(async response => {
    //             setHomeData(response?.data?.data)
    //             loadingg.setLoading(false)
    //             // setTimeout(() => {
    //             //     SplashScreen.hide()
    //             // }, 500);
    //             loadingg.setLoading(false)
    //         })
    //         .catch(async error => {
    //             loadingg.setLoading(false)
    //             if (error.includes('Unauthenticated')) {
    //                 navigation.navigate('Login')
    //             }
    //             Toast.show({
    //                 type: 'error',
    //                 text1: error,
    //             });

    //         })
    // }

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
                    {slider?.length > 0 &&
                        <View>
                            <Carousel
                                key={item?._id}
                                loop
                                width={width}
                                height={height / 5}
                                autoPlay={true}
                                data={slider}
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
        if (item?.type === 'recentlyviewed') {
            return (
                <>
                    <RecentlyViewed key={item?._id} data={item?.data} />
                </>
            )
        }
        if (item?.type === 'suggested_products') {
            return (
                <>
                    <PandaSuggestions key={item?._id} data={item?.data} />
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
                {Homeapi?.data?.availablePdt?.data.length > 0 && <CommonTexts label={'Available Products'} ml={15} mb={10} mt={20} />}
            </View>
        )
    }



    const renderProducts = ({ item, index }) => {
        return (
            <View key={index} style={{ flex: 0.5, justifyContent: 'center' }}>
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

    if (Homeapi.isLoading) {
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

    const keyExtractorGreen = (item) => item._id;

    const addMore = () => {
        // setInitialPage((pre) => pre + 1);
        fetchNextPage()

    }

 
    const ListFooterComponents = () => {
        if (data?.pages?.[0]?.lastpage * 1 <= data?.pageParams?.length * 1) {
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
                    // refreshControl={
                    //     <RefreshControl
                    //         isRefreshing={loadingg?.loading}
                    //         onRefresh={getHomedata}
                    //     // colors={[Colors.GreenLight]} // for android
                    //     // tintColor={Colors.GreenLight} // for ios
                    //     />
                    // }
                    disableVirtualization={true}
                    ListHeaderComponent={RenderMainComponets}
                    data={data?.pages?.map(page => page?.data)?.flat()}
                    // data={[]}
                    keyExtractor={keyExtractorGreen}
                    renderItem={renderProducts}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    removeClippedSubviews={true}
                    windowSize={10}
                    maxToRenderPerBatch={10}
                    refreshing={isLoading}
                    onRefresh={RefetchMoreFlat}
                    numColumns={2}
                    style={{ marginLeft: 5 }}
                    contentContainerStyle={{ justifyContent: 'center' }}
                    ListFooterComponent={ListFooterComponents}
                />




                {/* <NameText userName={userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile} mt={8} /> */}

                {/* {categories?.length > 0 && <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10 }}
                >
                    {categories?.map((item, index) =>
                        (<TypeCard item={item} key={index} />)
                    )}
                </ScrollView>}
                <SearchBox onPress={onSearch}/>
                <ImageSlider datas={groceImg} mt={20} />
                {storeList?.length > 0 && <>
                    <CommonTexts label={'Available Stores'} ml={15} fontSize={13} mt={25} />
                    <View style={styles.grossCatView}>
                        {storeList?.map((item, index) => (
                            <ShopCard key={index} item={item} />
                        ))}
                    </View>
                </>} */}

                {/* <View style={styles.pickupReferContainer}>
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
                </View> */}

                {/* <View style={styles.offerView}>
                    <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text>
                    <Offer onPress={goToShop} shopName={offer?.hotel} />
                    <CountDownComponent/>
                    <Text style={styles.offerValText}>{'Offer valid till period!'}</Text>
                </View> */}

                {/* {recentViewList?.length > 0 && <>
                    <CommonTexts label={'Recently Viewed'} fontSize={13} mt={5} ml={15} mb={15} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', paddingLeft: 7, }}
                    >
                        {recentViewList.map((item) =>
                            <CommonItemCard
                                key={item?._id}
                                item={item}
                                width={width / 2.5}
                                marginHorizontal={5}
                            />
                        )}
                    </ScrollView>
                </>} */}

                {/* <CommonTexts label={'Trending Sales'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {trend.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}

                {/* <CommonItemMenuList
                    list={grozz}
                    label={'Available Products'}
                    mb={80}
                /> */}

                {/* {availablePdts?.length > 0 && <>
                    <CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={15} mt={15} />
                    <View style={styles.productContainer}>
                        {availablePdts?.map((item) => (
                            <CommonItemCard
                                item={item}
                                key={item?._id}
                                width={width / 2.25}
                                height={220}
                                wishlistIcon
                            />
                        ))}
                    </View>
                </>} */}

            </View>
            {/*
            <CommonSquareButton
                onPress={gotoChat}
                position='absolute'
                bottom={10}
                right={10}
            /> */}
            <CommonWhatsappButton
                position="absolute"
                bottom={10}
                right={10}
            />
        </>
    )
}

export default QBuyGreen

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
