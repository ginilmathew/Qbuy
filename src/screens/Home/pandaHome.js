/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { StyleSheet, Text, View, useWindowDimensions, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import AuthContext from '../../contexts/Auth';
import CommonItemCard from '../../Components/CommonItemCard';
import customAxios from '../../CustomeAxios';
import SplashScreen from 'react-native-splash-screen';
import reactotron from 'reactotron-react-native';
import Header from '../../Components/Header';
import LoaderContext from '../../contexts/Loader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-reanimated-carousel';
import CommonItemSelect from '../../Components/CommonItemSelect';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import SearchBox from '../../Components/SearchBox';
import NameText from './NameText';
import PickDropAndReferCard from './PickDropAndReferCard';
import CategoriesCard from './CategoriesCard';
import CommonFiltration from '../../Components/CommonFiltration';
import CommonTexts from '../../Components/CommonTexts';
import OfferText from './OfferText';
import { useFocusEffect } from '@react-navigation/native';
import { IMG_URL } from '../../config/constants';
// import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { getProduct } from '../../helper/productHelper';
import CommonWhatsappButton from '../../Components/CommonWhatsappButton';
import {
    useQuery,
} from '@tanstack/react-query'
import CommonItemSelectSkeltion from '../../Components/CommonItemSelectSkeltion';
import Animated, { useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import ShopCardSkeltion from './Grocery/ShopCardSkeltion';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProductCard from '../../Components/Home/ProductCard';
import CartContext from '../../contexts/Cart';
const pandHome = async (datas) => {
    const homeData = await customAxios.post('customer/home', datas);
    // let recents = homeData?.data?.data?.find(home => home?.type === 'recentlyviewed')?.data?.map(item => getProduct(item))
    // let suggestions = homeData?.data?.data?.find(home => home?.type === 'suggested_products')?.data?.map(item => getProduct(item))
    // let products = homeData?.data?.data?.find(home => home?.type === 'available_products')?.data?.map(item => getProduct(item))
    return {
        home: homeData?.data?.data,
        tags: homeData?.data?.data?.find(home => home?.type === 'tags'),
        categories: homeData?.data?.data?.find(home => home?.type === 'categories'),
        recents: homeData?.data?.data?.find(home => home?.type === 'recentlyviewed'),
        //recents,
        pandaSuggestions: homeData?.data?.data?.find(home => home?.type === 'suggested_products'),
        //pandaSuggestions: suggestions,
        products: homeData?.data?.data?.find(home => home?.type === 'available_products'),
        //products,
        sliders: homeData?.data?.data?.find(home => home?.type === 'sliders'),
    }
}


export default function PandaHome({ navigation }) {

    const firstTimeRef = React.useRef(true)

    const { height, width } = useWindowDimensions();
    const cartContext = useContext(CartContext);


    const [homeData, setHomeData] = useState([])
    const [tags, setTags] = useState([])
    const [category, setCategory] = useState([])
    const [recentLists, setRecentLists] = useState([])
    const [pandaSuggestions, setPandaSuggestions] = useState([])
    const [products, setProducts] = useState([])
    const [sliders, setSliders] = useState([])
    const [datalist, setDatalist] = useState();
    const [isloading, setisLoading] = useState(false);

    const [selected, setSelected] = useState('')
    const styles1 = makeStyles(height);

    const userContext = useContext(AuthContext)
    const loadingg = useContext(LoaderContext)
    const [filter, setFilter] = useState('all')

    let datas = {
        type: 'panda',
        coordinates: userContext?.location,
    }

    const { data, isLoading, refetch } = useQuery({ 
        queryKey: ['pandaHome'], 
        queryFn: () => pandHome(datas),
        enabled: false
    })





    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
    });



    const pickupDropClick = useCallback(() => {
        navigation.navigate('PickupAndDropoff')
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

    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen', { mode: 'panda' })
    }, [navigation])




    useFocusEffect(
        React.useCallback(() => {
            // if (firstTimeRef.current) {
            //     firstTimeRef.current = false;
            //     return;
            // }
            refetch()
        }, [userContext?.location])
    );

    useEffect(() => {
        if (filter && userContext?.location) {
            let recents = homeData?.find(home => home?.type === 'recentlyviewed')
            if (recents?.data?.length > 0) {
                if (filter === 'all') {
                    setRecentLists(recents?.data)
                }
                else {
                    setRecentLists(recents?.data?.filter(prod => prod?.category_type === filter))
                }
            }


            let pandaSuggestions = homeData?.find(home => home?.type === 'suggested_products')
            if (pandaSuggestions?.data?.length > 0) {
                if (filter === 'all') {
                    setPandaSuggestions(pandaSuggestions?.data)
                }
                else {
                    setPandaSuggestions(pandaSuggestions?.data?.filter(prod => prod?.category_type === filter))
                }

            }

            let products = homeData?.find(home => home?.type === 'available_products')
            if (products?.data?.length > 0) {
                if (filter === 'all') {
                    setProducts(products?.data)
                }
                else {
                    setProducts(products?.data?.filter(prod => prod?.category_type === filter))
                }

            }
        }
    }, [filter, userContext?.location])


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
            <TouchableOpacity key={index} onPress={() => CarouselSelect(item)} style={{ width: '100%', height: '85%', alignItems: 'center', marginTop: 20 }} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.original_image}` }}
                    style={{ height: '100%', width: '95%', borderRadius: 20 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        )
    }

    const keyExtractorCategory = (item) => item._id;
    const renderCategory = ({ item, index }) => {
        return (
            <View key={index} style={styles.categoryView}>
                <CategoriesCard item={item} />
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



    const renderRecentLists = () => {
        let datamy = (filter === 'all' ? data?.recents?.data : data?.recents?.data?.filter((res, index) => res?.category_type === filter))

        //let datamy = (filter === 'all' ? data?.recents : data?.recents?.filter((res, index) => res?.category_type === filter))

        return (
            datamy?.map((item, index) => (
                // <ProductCard
                //     data={item}
                //     loggedIn={userContext?.userData ? true : false}
                //     addToCart={()=> addToCart(item)}
                //     //wishlistIcon={wishlistIcon}
                //     //removeWishList={removeWishList}
                //     //addWishList={addWishList}
                //     viewProduct={() => viewProduct(item)}
                //     width={width / 2.5}
                //     styles={styles1}
                //     //height={height}
                // />
                <CommonItemCard
                    key={index}
                    item={item}
                    width={width / 2.5}
                    marginHorizontal={5}
                />
            ))


        )
    }


    const rendePandaSuggestion = () => {
        let datamy = (filter === 'all' ? data?.pandaSuggestions?.data : data?.pandaSuggestions?.data?.filter((res, index) => res?.category_type === filter))
        //let datamy = (filter === 'all' ? data?.pandaSuggestions : data?.pandaSuggestions?.filter((res, index) => res?.category_type === filter))
        return (
            datamy.map((item, index) => (
                // <ProductCard
                //     data={item}
                //     loggedIn={userContext?.userData ? true : false}
                //     addToCart={()=> addToCart(item)}
                //     //wishlistIcon={wishlistIcon}
                //     //removeWishList={removeWishList}
                //     //addWishList={addWishList}
                //     viewProduct={() => viewProduct(item)}
                //     width={width / 2.5}
                //     styles={styles1}
                //     //height={height}
                // />
                <CommonItemCard
                    key={index}
                    item={item}
                    width={width / 2.5}
                    marginHorizontal={5}
                />
            ))


        )
    }



    const ListMainHeader = () => {
        return (
            <View>
                {data?.sliders?.data?.length > 0 && <View>
                    <Carousel
                        loop
                        width={width}
                        height={height / 5}
                        autoPlay={true}
                        data={data?.sliders?.data}
                        scrollAnimationDuration={1000}
                        renderItem={CarouselCardItem}
                    />
                </View>}
                {/* <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.foodTypeView}
                >
                    {data?.tags?.data?.map((item, index) =>
                    (<CommonItemSelect

                        item={item} key={index}
                        selected={selected}
                        setSelected={setSelected}
                        screen={'home'}
                    />)
                    )}
                </ScrollView> */}
                <SearchBox onPress={onSearch} />
                <View style={{ marginHorizontal: 2 }}>
                    <NameText userName={userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile} mt={8} />
                </View>
            </View>
        )

    }

    const ListmainFooter = () => {
        return (
            <View>
                <View style={styles.pickupReferContainer}>
                    <PickDropAndReferCard
                        onPress={pickupDropClick}
                        lotties={require('../../Lottie/deliveryBike.json')}
                        label={'Pick Up & Drop Off'}
                        lottieFlex={0.5}
                    />
                    <PickDropAndReferCard
                        onPress={referRestClick}
                        lotties={require('../../Lottie/rating.json')}
                        label={'Refer A Restaurant'}
                        lottieFlex={0.5}
                    />
                </View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5, justifyContent: 'space-between', marginRight: 5 }}
                >
                    <CommonTexts label={'Recently Viewed'} fontSize={13} />
                    <CommonFiltration onChange={setFilter} />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'row', paddingLeft: 7, gap: 5 }}
                >
                    {renderRecentLists()}


                    {/* ({(filter === "all" ? data?.recents?.data : data?.recents?.data?.filter((item, index) => item?.category_type === filter)).map((item, index) =>
                        <CommonItemCard
                            key={index}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />


                    )}) */}

                </ScrollView>

                <CommonTexts label={'Panda Suggestions'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'row', paddingLeft: 7, gap: 5 }}
                >
                    {/* {filter === "all" ? data?.pandaSuggestions?.data?.map((item, index)) : pandaSuggestions.map((item, index) =>
                        <CommonItemCard
                            key={index}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )} */}
                    {rendePandaSuggestion()}
                </ScrollView>
                <CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={5} mt={15} />
            </View>
        )
    }

    const MainHeader = () => {
        return (
            <FlatList
                ListHeaderComponent={ListMainHeader}
                disableVirtualization={true}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refetch}
                    // colors={[Colors.GreenLight]} // for android
                    // tintColor={Colors.GreenLight} // for ios
                    />
                }
                data={filter === 'all' ? data?.categories?.data : data?.categories?.data?.filter((res) => res?.category_type === filter)}
                showsVerticalScrollIndicator={false}
                initialNumToRender={6}
                removeClippedSubviews={true}
                windowSize={10}
                maxToRenderPerBatch={6}
                keyExtractorCategory={keyExtractorCategory}
                refreshing={isLoading}
                onRefresh={refetch}
                numColumns={4}
                // style={{ marginLeft: 5 }}
                contentContainerStyle={{ justifyContent: 'center', gap: 2 }}
                renderItem={renderCategory}
                ListFooterComponent={ListmainFooter}

            />

            // {/* <View style={styles.offerView}> */}
            // {/* <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text> */}
            // {/* <OfferText /> */}
            // {/* <CountDownComponent/> */}
            // {/* <Text style={styles.offerValText}>{'Offer valid till period!'}</Text> */}
            // {/* </View> */}
        )
    }


    const ListEmptyComponents = () => {
        return (
            <View style={{ height: height / 3.6 }}>
                <Text>No Products Found!...</Text>
            </View>
        )

    }


    const FooterComponent = () => {
        return (
            <View style={{ height: 100 }} />
        )
    }




    const renderProducts = ({ item, index }) => {
        return (
            <View key={index} style={{ flex: 0.5, justifyContent: 'center' }}>
                {/* <ProductCard
                    data={item}
                    loggedIn={userContext?.userData ? true : false}
                    addToCart={()=> addToCart(item)}
                    //wishlistIcon={wishlistIcon}
                    //removeWishList={removeWishList}
                    //addWishList={addWishList}
                    viewProduct={() => viewProduct(item)}
                    width={width / 2.2}
                    styles={styles1}
                    height={height / 3.6}
                /> */}
                <CommonItemCard
                    item={item}
                    key={index}
                    width={width / 2.2}
                    height={height / 3.6}
                    mr={4}
                    ml={4}
                    mb={15}
                />

            </View>
        )
    }
    const keyExtractorProduct = (item) => item._id;

    const ITEM_HEIGHT = height / 3.6; // fixed height of item component
    const getItemLayoutProduct = (data, index) => {
        return {
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        };
    };



    // useFocusEffect(
    //     React.useCallback(() => {

    //         getHomedata()
    //     }, [userContext?.location])
    // );



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

    if (isLoading) {
        return (
            <View>
                <Header onPress={onClickDrawer} />
                <ScrollView

                    showsHorizontalScrollIndicator={false}
                    style={{ width: width, height: height }}
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Animated.View style={{ height: height / 5, alignItems: 'center', marginTop: 10, shadowOpacity: 0.1, shadowRadius: 1, opacity, width: width }} >
                            <Animated.View
                                style={{ height: '100%', width: '90%', backgroundColor: '#fff', margin: 5, borderRadius: 20, opacity }}
                            />
                        </Animated.View>
                        <View style={{ width: width }}>
                            <SearchBox onPress={null} />
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                            {[0, 1, 2, 3, 4, 5, 6, 7]?.map((item, index) =>

                            (<CommonItemSelectSkeltion

                                item={item} key={index}
                                selected={selected}
                                setSelected={setSelected}
                                screen={'home'}
                            />)
                            )}
                        </View>

                        <View style={{ width: width, flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 5 }}>
                            <PickDropAndReferCard
                                onPress={pickupDropClick}
                                lotties={require('../../Lottie/deliveryBike.json')}
                                label={'Pick Up & Drop Off'}
                                lottieFlex={0.5}
                            />
                            <PickDropAndReferCard
                                onPress={pickupDropClick}
                                lotties={require('../../Lottie/deliveryBike.json')}
                                label={'Pick Up & Drop Off'}
                                lottieFlex={0.5}
                            />
                        </View>

                        <View style={{ marginHorizontal: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[1, 2, 3, 4]?.map((item) => (
                                <ShopCardSkeltion />
                            ))}
                        </View>

                    </View>



                </ScrollView>
            </View>
        )
    }


    return (
        <View>
            <Header onPress={onClickDrawer} />


            <View style={styles.menuContainer}>
                <FlatList
                    disableVirtualization={true}
                    ListHeaderComponent={MainHeader}
                    data={filter === 'all' ? data?.products?.data : data?.products?.data?.filter((res) => res?.category_type === filter)}
                    //data={filter === 'all' ? data?.products : data?.products?.filter((res) => res?.category_type === filter)}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    //removeClippedSubviews={true}
                    windowSize={10}
                    // refreshControl={
                    //     <RefreshControl
                    //         isRefreshing={isloading}
                    //         onRefresh={getHomedata}
                    //     // colors={[Colors.GreenLight]} // for android
                    //     // tintColor={Colors.GreenLight} // for ios
                    //     />
                    // }
                    maxToRenderPerBatch={10}
                    refreshing={isLoading}
                    onRefresh={refetch}
                    // getItemLayout={getItemLayoutProduct}
                    keyExtractor={keyExtractorProduct}
                    numColumns={2}
                    ListEmptyComponents={ListEmptyComponents}
                    contentContainerStyle={{ justifyContent: 'center', gap: 5 }}
                    renderItem={renderProducts}
                    ListFooterComponent={FooterComponent}
                />


            </View>
            <CommonWhatsappButton
                position={'absolute'}
                bottom={85}
                right={10}

            />

        </View>
    )
}

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

    foodTypeView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 10,
        marginLeft: 10,
    },
    foodTypeText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        paddingVertical: 8,
    },
    categoryView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        flex: 1,
    },
    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
    },
    pickupReferContainer: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 20,
        marginBottom: 5,
        justifyContent: 'space-evenly',
    },
    offerView: {
        alignItems: 'center',
        backgroundColor: '#329D9C36',
        marginBottom: 10,
    },
    discountText: {
        fontFamily: 'Poppins-Bold',
        color: '#464CFF',
        fontSize: 18,
        marginTop: 10,
    },
    offerValText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 10,
        marginBottom: 5,
        marginTop: 3,
    },
    shopName: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 10,
    },
    menuContainer: {
        flexDirection: 'row',
        // flex:1,
        gap: 17,
        paddingHorizontal: '3%',
    },
})
