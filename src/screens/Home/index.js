import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions, ToastAndroid, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useState, useEffect } from 'react'

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import NameText from './NameText';
import CategoriesCard from './CategoriesCard';
import OfferText from './OfferText';
import PickDropAndReferCard from './PickDropAndReferCard';
import Header from '../../Components/Header';

import CommonItemSelect from '../../Components/CommonItemSelect';
import CommonTexts from '../../Components/CommonTexts';

import CommonItemCard from '../../Components/CommonItemCard';
import CommonFiltration from '../../Components/CommonFiltration';
import SearchBox from '../../Components/SearchBox';
import AuthContext from '../../contexts/Auth';
import LoaderContext from '../../contexts/Loader';
import SplashScreen from 'react-native-splash-screen';
import customAxios from '../../CustomeAxios';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import { IMG_URL } from '../../config/constants';
import reactotron from 'reactotron-react-native';

import { useFocusEffect } from '@react-navigation/native';
import CommonWhatsappButton from '../../Components/CommonWhatsappButton';
import { getProduct } from '../../helper/productHelper';

const QbuyPanda = ({ navigation }) => {

    // const contextPanda = useContext(PandaContext)
    // let grocery = contextPanda.greenPanda
    // let fashion = contextPanda.pinkPanda

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
    const userContext = useContext(AuthContext)
    const loadingg = useContext(LoaderContext)
    const [filter, setFilter] = useState('')





    //let loader = loadingg?.loading

    const { width, height } = useWindowDimensions()

    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });


    // useEffect(() => {
    //     getHomedata()
    // }, [])


    useEffect(() => {
        if (filter && userContext?.location) {
            let recents = homeData?.find(home => home?.type === "recentlyviewed")
            if (recents?.data?.length > 0) {
                if (filter === "all") {
                    setRecentLists(recents?.data)
                }
                else {
                    setRecentLists(recents?.data?.filter(prod => prod?.category_type === filter))
                }
            }


            let pandaSuggestions = homeData?.find(home => home?.type === "suggested_products")
            if (pandaSuggestions?.data?.length > 0) {
                if (filter === "all") {
                    setPandaSuggestions(pandaSuggestions?.data)
                }
                else {
                    setPandaSuggestions(pandaSuggestions?.data?.filter(prod => prod?.category_type === filter))
                }

            }

            let products = homeData?.find(home => home?.type === "available_products")
            if (products?.data?.length > 0) {
                if (filter === "all") {
                    setProducts(products?.data)
                }
                else {
                    setProducts(products?.data?.filter(prod => prod?.category_type === filter))
                }

            }
        }
    }, [filter, userContext?.location])







    // const images = [
    //     {
    //         id: "1",
    //         img: require('../../Images/ads.png')
    //     },
    //     {
    //         id: "2",
    //         img: require('../../Images/image1.jpeg')
    //     },
    //     {
    //         id: "3",
    //         img: require('../../Images/image2.jpeg')
    //     },
    //     {
    //         id: "4",
    //         img: require('../../Images/image3.jpeg')
    //     }
    // ]


    const getHomedata = useCallback(async () => {
        setisLoading(true)
        let datas = {
            type: "panda",
            // coordinates: env === "dev" ? location : userContext?.location
            coordinates: userContext?.location
        }
        await customAxios.post(`customer/home`, datas)
            .then(async response => {
                setisLoading(false)
                setHomeData(response?.data?.data)

                let tags = response?.data?.data?.find(home => home?.type === "tags")
                setTags(tags?.data)

                let categories = response?.data?.data?.find(home => home?.type === "categories")
                setCategory(categories?.data)


                let recents = response?.data?.data?.find(home => home?.type === "recentlyviewed")
                setRecentLists(recents?.data)

                let pandaSuggestions = response?.data?.data?.find(home => home?.type === "suggested_products")
                setPandaSuggestions(pandaSuggestions?.data)

                let products = response?.data?.data?.find(home => home?.type === "available_products")
                setProducts(products?.data)

                let sliders = response?.data?.data?.find(home => home?.type === "sliders")
                setSliders(sliders?.data)

                setisLoading(false)
                setTimeout(() => {
                    SplashScreen.hide()
                }, 500);

            })
            .catch(async error => {
                if (error.includes("Unauthenticated")) {
                    navigation.navigate("Login")
                }

                Toast.show({
                    type: 'error',
                    text1: error
                });
                setisLoading(false)
            })
    }, [isloading, tags, homeData, category, recentLists, pandaSuggestions, products, sliders, userContext?.location])



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

    const CarouselSelect = (item) => {
        switch (item?.screentype) {
            case "product":
                let data = getProduct(item?.product)
                navigation.navigate('SingleItemScreen', { item: data })
                break;
            case "store":
                navigation.navigate('store', { name: item?.vendor?.store_name, mode: 'store', item: item?.vendor, storeId: item?.vendor?._id })
                break;
            default:
                return false;
        }

    }


    const CarouselCardItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => CarouselSelect(item)} style={{ width: '100%', height: '85%', alignItems: 'center', marginTop: 20 }} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.original_image}` }}
                    style={{ height: '100%', width: '95%', borderRadius: 20 }}
                    resizeMode='cover'
                >
                </FastImage>
            </TouchableOpacity>
        )
    }


    const renderProducts = ({ item, index }) => {
        return (
            <View key={index} style={{ flex: 0.5, justifyContent: 'center' }}>
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

    const keyExtractorCategory = (item) => item._id;
    const renderCategory = ({ item, index }) => {
        return (
            <View style={styles.categoryView}>
                {/* {category?.map((item) => ( */}
                <CategoriesCard item={item} />
                {/* // ))} */}
            </View>
        )
    }


    useFocusEffect(
        React.useCallback(() => {
            getHomedata()
        }, [userContext?.location])
    );
    return (
        <>
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>Coming Soon!!!</Text>
            </View> */}

            <Header onPress={onClickDrawer} />
            <ScrollView
                style={{ flex: 1, backgroundColor: '#fff' }}
                refreshControl={
                    <RefreshControl colors={['transparent']} progressBackgroundColor='transparent' refreshing={isloading} onRefresh={getHomedata} />
                }
            >

                {sliders?.length > 0 && <View>
                    <Carousel
                        loop
                        width={width}
                        height={height / 5}
                        autoPlay={true}
                        data={sliders}
                        scrollAnimationDuration={1000}
                        renderItem={CarouselCardItem}
                    />
                </View>}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.foodTypeView}
                >
                    {tags?.map((item, index) =>
                    (<CommonItemSelect
                        item={item} key={index}
                        selected={selected}
                        setSelected={setSelected}
                        screen={'home'}
                    />)
                    )}
                </ScrollView>
                <SearchBox onPress={onSearch} />


                <NameText userName={userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile} mt={8} />

                <FlatList
                    data={category}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={6}
                    removeClippedSubviews={true}
                    windowSize={10}
                    maxToRenderPerBatch={6}
                    keyExtractorCategory={keyExtractorCategory}
                    // refreshing={loader}
                    // onRefresh={getHomedata}
                    numColumns={4}
                    // style={{ marginLeft: 5 }}
                    contentContainerStyle={{ justifyContent: 'center', gap: 2 }}
                    renderItem={renderCategory}

                />



                {/* <CategoryCard data={category} /> */}


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

                <View style={styles.offerView}>
                    <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text>
                    <OfferText />
                    {/* <CountDownComponent/> */}
                    <Text style={styles.offerValText}>{'Offer valid till period!'}</Text>
                </View>

                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5, justifyContent: 'space-between', marginRight: 5 }}
                >
                    <CommonTexts label={'Recently Viewed'} fontSize={13} />
                    <CommonFiltration onChange={setFilter} />
                </View>

                {recentLists?.length > 0 && <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {recentLists?.map((item, index) =>
                        <CommonItemCard
                            key={index}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView>}

                <CommonTexts label={'Panda Suggestions'} fontSize={13} ml={15} mb={5} mt={15} />
                {pandaSuggestions?.length > 0 && <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {pandaSuggestions.map((item, index) =>
                        <CommonItemCard
                            key={index}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView>}

                <CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={5} mt={15} />
                <View style={styles.menuContainer}>


                    <FlatList
                        data={products}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={6}
                        removeClippedSubviews={true}
                        windowSize={10}
                        maxToRenderPerBatch={6}
                        // refreshing={loader}
                        // onRefresh={getHomedata}
                        getItemLayout={getItemLayoutProduct}
                        keyExtractor={keyExtractorProduct}
                        numColumns={2}
                        // style={{ marginLeft: 5 }}
                        contentContainerStyle={{ justifyContent: 'center', gap: 2 }}
                        renderItem={renderProducts}

                    />
                </View>

                {/* <CommonTexts label={'Trending Sales'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, marginBottom: 80 }}
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
            </ScrollView>
            <CommonWhatsappButton
                position='absolute'
                bottom={10}
                right={10}
            />
        </>
    )
}

export default QbuyPanda

const styles = StyleSheet.create({

    foodTypeView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 10,
        paddingLeft: 8
    },
    foodTypeText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        paddingVertical: 8
    },
    categoryView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center'
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
        justifyContent: 'space-evenly'
    },
    offerView: {
        alignItems: 'center',
        backgroundColor: '#329D9C36',
        marginBottom: 10
    },
    discountText: {
        fontFamily: 'Poppins-Bold',
        color: '#464CFF',
        fontSize: 18,
        marginTop: 10
    },
    offerValText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 10,
        marginBottom: 5,
        marginTop: 3
    },
    shopName: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 10
    },
    menuContainer: {
        flexDirection: 'row',


        paddingHorizontal: '3%'
    }
})