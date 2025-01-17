import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext } from 'react'
import Header from '../../Components/Home/Header'
import AuthContext from '../../contexts/Auth'
import PandaContext from '../../contexts/Panda'
import { useQuery } from '@tanstack/react-query'
import { useFocusNotifyOnChangeProps } from '../../hooks/useFocusNotifyOnChangeProps'
import customAxios from '../../CustomeAxios'
import { getProducts } from '../../helper/homeProductsHelper'
import reactotron from 'reactotron-react-native'
import NameText from '../Home/NameText'
import CategoriesCard from '../../Components/Home/CategoriesCard'
import SearchBox from '../../Components/SearchBox'
import Carousel from 'react-native-reanimated-carousel'
import FastImage from 'react-native-fast-image'
import { getProduct } from '../../helper/productHelper'
import { IMG_URL } from '../../config/constants'
import PandaShopCard from '../../Components/Home/PandaShopCard'
import StoreCard from '../../Components/Home/StoreCard'
import PickDropAndReferCard from '../Home/PickDropAndReferCard'
import CommonTexts from '../../Components/CommonTexts'
import ProductCard from '../../Components/Home/ProductCard'
import AvailableProducts from './AvailableProducts'
import { useFocusEffect } from '@react-navigation/native'
import CartContext from '../../contexts/Cart'
import CartButton from '../../Components/Home/CartButton'


const greenHome = async (datas) => {
    const homeData = await customAxios.post('customer/home', datas);
    let sliders = homeData?.data?.data?.find(({ type }) => type === 'sliders');
    let recent = await getProducts(homeData?.data?.data?.[2]?.data)
    let recents = {
        type: 'recentlyviewed',
        data: recent
    }

    let sugges = await getProducts(homeData?.data?.data?.find(({ type }) => type === 'suggested_products')?.data)
    
    let suggestions = {
        type: 'suggested_products',
        data: sugges
    }
    let messagesBanner = homeData?.data?.data?.find(({ type }) => type === "message_banner_array")?.data || []

    let newArray = [homeData?.data?.data?.[0], recents, suggestions]
    return {
        items: newArray,
        sliders,
        stores: homeData?.data?.data?.[1],
        count: homeData?.data?.data?.[homeData?.data?.data?.length - 1]?.data,
        messagesBanner
    }
}

const GreenHome = ({ navigation }) => {

    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    const { active } = useContext(PandaContext)
    const { width, height } = useWindowDimensions()
    const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    const styles1 = makeStyles(height);

    const firstTimeRef = React.useRef(true)

    useFocusEffect(
        React.useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            refetch()
        }, [refetch])
    )


    let datas = {
        type: active,
        coordinates: userContext?.location,
    }


    const { data, isLoading, refetch } = useQuery({
        queryKey: ['greenHome', active],
        queryFn: () => greenHome(datas),
        notifyOnChangeProps
    })



    const changeAddress = useCallback(() => {
        navigation?.push("AddNewLocation", { mode: 'home' })
    });

    const onClickDrawer = useCallback(() => {
        navigation.openDrawer()
    })

    const onClickNotificatn = useCallback(() => {
        navigation.navigate('Notifications');
    });

    const onCategoryClick = useCallback((item) => {
        navigation.navigate("Category", { name: item?.name, mode: active, item: item })
    });


    const renderCategory = ({ item }) => {
        return (
            <CategoriesCard
                item={item}
                key={item?._id}
                onCategoryClick={onCategoryClick}
                width={width}

            />
        )
    }

    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen', { mode: 'green' })
    })

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
            <TouchableOpacity key={index} onPress={() => CarouselSelect(item)} style={styles.caurasalCard} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.original_image}` }}
                    style={styles.caurasalImage}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        )
    }


    const renderSlider = () => {
        if (data?.sliders?.data?.length > 0) {
            return (
                <Carousel
                    loop
                    width={width}
                    height={height / 5}
                    autoPlay={true}
                    data={data?.sliders?.data}
                    scrollAnimationDuration={1000}
                    renderItem={CarouselCardItem}
                />
            )
        }

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
                    style={styles.bannerImage}
                    resizeMode="cover"
                />
                <View style={styles.bannerContent}>
                    <Text style={styles.offerText}>{item?.offer_title}</Text>
                    <Text style={styles.offerDescription}>{item?.offer_description}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    //render messageBanner
    const rendermessageBanner = () => {
        if(data?.messagesBanner?.length > 0){
            return(
                <View style={styles.messagesBanner}>
                    <Carousel
                        loop
                        width={width}
                        height={height / 5}
                        autoPlay={true}
                        data={data?.messagesBanner}
                        scrollAnimationDuration={5000}
                        renderItem={MessageBanner}
                    />
                </View>
            )
        }
        
    }

    const viewStore = (item) => {
        navigation.navigate("store", { item })
    }


    const renderStore = ({ item }) => {
        return (
            <StoreCard
                onClick={() => viewStore(item)}
                name={item?.name?.toLowerCase()}
                item={item}
            />
        )
    }

    const renderStores = () => {
        return (
            <>
                <View style={styles.storeTitle}>
                    <CommonTexts label={'Available Stores'} fontSize={13} />
                </View>

                <FlatList
                    data={data?.stores?.data}
                    keyExtractor={(item) => item?._id}
                    renderItem={renderStore}
                    style={{ paddingTop: 10 }}
                    showsHorizontalScrollIndicator={false}
                    numColumns={4}
                />
            </>
        )
    }

    const ourFarm = useCallback(() => {
        navigation.navigate('OurFarms')
    }, [])

    const referRestClick = useCallback(() => {
        navigation.navigate('RefferRestaurant')
    }, [])

    const viewProduct = (item) => {
        navigation.navigate("SingleItemScreen", { item })
    }

    const addToCart = (item) => {
        cartContext.addToCart(item)
    }

    const renderProducts = ({ item }) => {
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
    }

    const renderRecents = () => {
        let recents = data?.items?.[1]?.data
       
        if(recents?.length > 0){
            return (
                <>
                    <View style={styles.storeTitle}>
                        <CommonTexts label={'Recently Viewed'} fontSize={13} />
                    </View>
                    <FlatList
                        data={recents}
                        keyExtractor={(item) => item?._id}
                        renderItem={renderProducts}
                        style={{ paddingVertical: 20 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </>
            )
        }
        
    }

    const renderSuggestions = () => {
        let suggestions = data?.items[2]?.data
        // .log(data?.items);

        if(suggestions?.length > 0){
            return (
                <>
                    <View style={styles.storeTitle}>
                        <CommonTexts label={'Panda Suggestions'} fontSize={13} />
                    </View>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item?._id}
                        renderItem={renderProducts}
                        style={{ paddingVertical: 20 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </>
            )
        }
        else return null
        
    }


    const HeaderList = () => {
        let category = data?.items?.[0]?.data
        return (
            <>
                <FlatList
                    data={category}
                    keyExtractor={(item) => item?._id}
                    renderItem={renderCategory}
                    style={{ paddingVertical: 20 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                <SearchBox onPress={onSearch} />
                {renderSlider()}
                {renderStores()}
                <View style={styles.pickupReferContainer}>
                    <PickDropAndReferCard
                        onPress={ourFarm}
                        lotties={require('../../Lottie/farmer.json')}
                        label={'Our Farms'}
                        lottieFlex={1}
                    />
                    <PickDropAndReferCard
                        onPress={referRestClick}
                        lotties={require('../../Lottie/farm.json')}
                        label={"Let's Farm Together"}
                        lottieFlex={0.4}
                    />
                </View>
                {rendermessageBanner()}
                {renderRecents()}
                {renderSuggestions()}
            </>
        )
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
            <View style={styles.container}>
                <NameText userName={userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile} mt={8} />
                <AvailableProducts
                        styles={styles1}
                        width={width}
                        loggedIn={userContext?.userData ? true : false}
                        height={height / 4}
                        datas={datas}
                        viewProduct={viewProduct}
                        addToCart={addToCart}
                >
                    {HeaderList()}
                </AvailableProducts>
            </View>
            <CartButton bottom={0} />
        </>
    )
}

export default GreenHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FFE9',
    },
    pickupReferContainer: {
        flexDirection: 'row',
        backgroundColor: '#F4FFE9',
        marginTop: 20,
        justifyContent: 'space-evenly',
    },
    messagesBanner: {
        height: 200
    },
    caurasalCard: { 
        alignItems: 'center', 
        marginTop: 20, 
        width: '100%', 
        height: '85%' 
    },
    caurasalImage: { 
        height: '100%', 
        width: '95%', 
        borderRadius: 20 
    },
    storeTitle: { 
        marginLeft: 10, 
        marginTop: 10 
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
        width: '95%'
    },
})

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
        width: 30,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        height: 20,
        margin: 1,
    }
})