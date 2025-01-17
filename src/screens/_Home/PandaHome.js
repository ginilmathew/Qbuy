import { NativeModules, RefreshControl, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import AuthContext from '../../contexts/Auth'
import customAxios from '../../CustomeAxios'
import reactotron from 'reactotron-react-native'
import Header from '../../Components/Home/Header'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import { useFocusNotifyOnChangeProps } from '../../hooks/useFocusNotifyOnChangeProps'
import CategoriesCard from '../../Components/Home/CategoriesCard'
import ProductCard from '../../Components/Home/ProductCard'
import Carousel from 'react-native-reanimated-carousel'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../config/constants'
import SearchBox from '../../Components/SearchBox'
import NameText from '../Home/NameText'
import CommonTexts from '../../Components/CommonTexts'
import CommonFiltration from '../../Components/CommonFiltration'
import AvailableProducts from './AvailableProducts'
import { getProducts } from '../../helper/homeProductsHelper'
import PickDropAndReferCard from '../Home/PickDropAndReferCard'
import PandaContext from '../../contexts/Panda'
import CartContext from '../../contexts/Cart'
import CartButton from '../../Components/Home/CartButton'

const pandHome = async (datas) => {
    const homeData = await customAxios.post('customer/home', datas);
    let sliders = homeData?.data?.data?.[5];
    let recent = [];

    //recent = await getProducts(homeData?.data?.data?.[2]?.data)

    
    let messagesBanner = homeData?.data?.data?.[7]?.data
    let sugges = [];
    //sugges = await getProducts(homeData?.data?.data?.[4]?.data)

    //reactotron.log({sugges})
    return {
        //items: newArray,
        sliders,
        recent: homeData?.data?.data?.[2]?.data,
        category: homeData?.data?.data?.[0]?.data,
        suggestions: homeData?.data?.data?.[4]?.data,
        count: homeData?.data?.data?.[homeData?.data?.data?.length - 1]?.data,
        messagesBanner
    }
}



const PandaHome = ({ navigation }) => {

    const userContext = useContext(AuthContext)
    const { active } = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const firstTimeRef = React.useRef(true)
    const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    const { width, height } = useWindowDimensions()
    const styles1 = makeStyles(height);

    //const { env, mode } = NativeModules.RNENVConfig

    let datas = {
        type: active,
        coordinates: userContext?.location,
    }

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['pandaHome', active],
        queryFn: () => pandHome(datas),
        notifyOnChangeProps
    })



    useFocusEffect(
        React.useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            refetch()
            //infiniteQueryRefetch()
        }, [refetch])
    )

    const onClickDrawer = useCallback(() => {
        navigation.openDrawer()
    }, [])

    const changeAddress = useCallback(() => {
        navigation?.push("AddNewLocation", { mode: 'home', enableBack: true })
    }, []);


    const onClickNotificatn = useCallback(() => {
        navigation.navigate('Notifications');
    }, []);


    const onCategoryClick = useCallback((item) => {
        navigation.navigate(item?.name?.toUpperCase() === "RESTAURANTS" ? "restaurant" : "Category", { name: active === 'panda' ? item?.store_name : item?.name, active, item: item })
    }, []);

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
            <TouchableOpacity key={`${index}${item?._id}`} onPress={() => CarouselSelect(item)} style={styles.caurasal} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.original_image}` }}
                    style={{ height: '100%', width: '95%', borderRadius: 20 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        )
    }

    const openStore = (item) => {
        //reactotron.log({item});
        //return false;
        navigation.navigate('store', { name: item?.stores?.store_name, mode: 'store', item: item?.stores, storeId: item?.stores?._id })
    }

    const MessageBanner = ({ item, index }) => {
        return (
            <TouchableOpacity key={`${index}${item?._id}`} onPress={() => openStore(item)} style={styles.bannerButton} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.image}` }}
                    style={{ height: '100%', width: '95%', borderRadius: 12 }}
                    resizeMode="cover"
                />
                <View style={styles.bannerContent}>
                    <Text style={styles.offerText}>{item?.offer_title}</Text>
                    <Text style={styles.offerDescription}>{item?.offer_description}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    const onSearch = () => {
        navigation.navigate('ProductSearchScreen', { mode: 'panda' })
    }


   

    const viewProduct = (item) => {
        navigation.navigate("SingleItemScreen", { item })
    }


    


    

    const pickupDropClick = useCallback(() => {
        navigation.navigate('PickupAndDropoff')
    }, [])

    const referRestClick = useCallback(() => {
        navigation.navigate('RefferRestaurant')
    }, [])

    


    //Get Products Pagination wise




    const addToCart = (item) => {
        // reactotron.log({item});
        // return false
        cartContext.addToCart(item)
    }


    const onClickWishlist = useCallback(() => {
        navigation.navigate('Wishlist');
    }, []);


    return (
        <>
            <Header
                userData={userContext?.userData}
                changeAddress={changeAddress}
                opendrawer={onClickDrawer}
                currentAddress={userContext?.currentAddress}
                active={active}
                //onClickFashionCat={onClickFashionCat}
                onClickWishlist={onClickWishlist}
                onClickNotificatn={onClickNotificatn}
                count={data?.count}
            />

            <AvailableProducts
                styles={styles1}
                width={width}
                loggedIn={userContext?.userData ? true : false}
                height={height / 4}
                datas={datas}
                viewProduct={viewProduct}
                addToCart={addToCart}
            //cart={cartContext?.cart}
            >
                <ScrollView style={styles.bgWhite} refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }>
                    <View style={styles.bgWhite}>
                        {data?.sliders?.data?.length > 0 && <Carousel
                            loop
                            width={width}
                            height={height / 5}
                            autoPlay={true}
                            data={data?.sliders?.data}
                            scrollAnimationDuration={1000}
                            renderItem={CarouselCardItem}

                        />}
                        <SearchBox onPress={onSearch} />
                        <View style={{ marginHorizontal: 2, marginVertical: 15 }}>
                            <NameText userName={userContext?.userData ? userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile : "Guest"} mt={8} />
                        </View>
                    </View>
                    <View
                        style={styles.categoryCard}
                    >
                        {data?.category?.map((cat, index) => (
                            <CategoriesCard item={cat} key={`${index}${cat?._id}`} onCategoryClick={onCategoryClick} width={width} />
                        ))}
                    </View>
                    <View style={styles.pickup}>
                        <PickDropAndReferCard
                            onPress={pickupDropClick}
                            lotties={require('../../Lottie/deliveryBike.json')}
                            label={'Pick Up & Drop Off'}
                            lottieFlex={0.5}
                        />
                        
                        <PickDropAndReferCard
                            onPress={referRestClick}
                            lotties={require('../../Lottie/rating.json')}
                            label={'Refer a Restaurant'}
                            lottieFlex={0.5}
                        />
                    </View>
                    {data?.messagesBanner?.length > 0 && <View style={styles.messagesBanner}>
                        <Carousel
                            loop
                            width={width}
                            //height={height / 5}
                            autoPlay={true}
                            data={data?.messagesBanner}
                            scrollAnimationDuration={5000}
                            renderItem={MessageBanner}

                        />
                    </View>}
                    {data?.recent?.length > 0 &&
                        <View style={styles.typeContainser}>
                            <View
                                style={styles.headerBox}
                            >
                                <CommonTexts label={'Recently Viewed'} fontSize={13} />
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.recents}
                            >
                                {data?.recent?.map(item => {
                                    return (
                                        <ProductCard
                                            key={`${item?._id}`}
                                            data={item}
                                            styles={styles1}
                                            width={width / 2.5}
                                            loggedIn={userContext?.userData ? true : false}
                                            viewProduct={viewProduct}
                                            addToCart={addToCart}
                                        />
                                    )
                                })}
                            </ScrollView>
                        </View>}
                    {data?.suggestions?.length > 0 && 
                    <View style={styles.typeContainser}>
                        <View
                            style={styles.headerBox}
                        >
                            <CommonTexts label={'Panda Suggestions'} fontSize={13} />
                        </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.recents}
                    >
                        {data?.suggestions?.map(item => {
                            return (
                                <ProductCard
                                    key={`${item?._id}`}
                                    data={item}
                                    styles={styles1}
                                    width={width / 2.5}
                                    loggedIn={userContext?.userData ? true : false}
                                    viewProduct={viewProduct}
                                    addToCart={addToCart}

                                />
                            )
                        })}
                    </ScrollView>
                    
                    </View>}
                </ScrollView>
            </AvailableProducts>
            <CartButton bottom={0} />
        </>
    )
}

export default PandaHome


const makeStyles = fontScale => StyleSheet.create({


    bottomCountText: {
        fontFamily: 'Poppins-medium',
        color: '#fff',
        fontSize: 0.01 * fontScale,
    },
    bottomRateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#fff',
        fontSize: 0.015 * fontScale,
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
        marginBottom: 3,
        
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
    },
    discountViewer: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    priceTag: {
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        height: 20,
        margin: 1,
    }
})

const styles = StyleSheet.create({
    pickupReferContainer: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 20,
        marginBottom: 5,
        justifyContent: 'space-evenly',
    },
    offerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 20,
        marginTop: 45
    },
    offerDescription: {
        textAlign: 'center',
        //fontWeight: 'bold', 
        color: '#FFF',
        fontSize: 14,
        marginVertical: 10
    },
    bannerButton: {
        width: '100%',
        height: '85%',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 5
    },
    bannerImage: {
        height: '100%', 
        width: '95%', 
        borderRadius: 20
    },
    bannerContent: {
        position: 'absolute',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '95%',
        borderRadius: 12
    },
    caurasal: {
        width: '100%', 
        height: '85%', 
        alignItems: 'center', 
        marginTop: 20
    },
    bgWhite: {
        backgroundColor: '#fff'
    },
    categoryCard: {
        flexDirection: "row",
        justifyContent: "start",
        backgroundColor: '#fff',
        marginTop: 5,
        flex: 1,
        flexWrap: 'wrap',
        gap: 5,
        paddingHorizontal: 5
    },
    pickup: {
        //width: width, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 5, 
        marginTop: 5, 
        padding: 2, 
        backgroundColor: '#76867314'
    },
    messagesBanner: {
        height: 200
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        justifyContent: 'space-between',
        marginRight: 5,
        paddingTop: 5
    },
    recents: { 
        backgroundColor: '#fff', 
        paddingVertical: 10, 
        //marginRight: 10 
    },
    typeContainser: {
        paddingTop: 10,
        paddingHorizontal: 10
    }
})