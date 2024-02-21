/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    FlatList,
    useWindowDimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import CommonTexts from '../../../Components/CommonTexts';
import HotelCard from './HotelCard';
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import FastImage from 'react-native-fast-image';
import PandaContext from '../../../contexts/Panda';
import CommonItemSelect from '../../../Components/CommonItemSelect';
import CommonItemCard from '../../../Components/CommonItemCard';
import StoreAddressCard from './StoreAddressCard';
import HotelItemList from './HotelItemList';
import TypeCard from '../Grocery/TypeCard';
import CommonRating from '../../../Components/CommonRating';
import { IMG_URL, env, location } from '../../../config/constants';
import LoaderContext from '../../../contexts/Loader';
import customAxios from '../../../CustomeAxios';
import Toast from 'react-native-toast-message';
import CartContext from '../../../contexts/Cart';
import AuthContext from '../../../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reactotron from 'reactotron-react-native';
import { useFocusEffect } from '@react-navigation/native';
import PandaShopCard from '../Grocery/PandaShopCard';
import SubcategoryCard from './subcategoryCard';
import { RefreshControl } from 'react-native-gesture-handler';
import { getProducts } from '../../../helper/homeProductsHelper';
import ProductCard from '../../../Components/Home/ProductCard';

const Category = ({ route }) => {
    const { name, mode, item } = route?.params;

    

    const { width, height } = useWindowDimensions();

    const styles1 = makeStyles(height);

    const contextPanda = useContext(PandaContext);
    const userContext = useContext(AuthContext);
    const cartContext = useContext(CartContext);
    let grocery = contextPanda.greenPanda;
    let fashion = contextPanda.pinkPanda;

    const loadingContex = useContext(LoaderContext);
    let loadingg = loadingContex?.loading;
    let userData = userContext?.userData;

    const [availablePdts, Current] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stores, setStore] = useState([]);
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [subcategorySelect, setSubCategorySelect] = useState(null);
    const [loading, setLoading] = useState(false);
    const [Filter, setFilter] = useState([]);

    const [selected, setSelected] = useState(false);

    // useEffect(() => {
    //     getProductBasedCat()
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            getProductBasedCat();
        }, []),
    );

    const getProductBasedCat = async () => {
        loadingContex.setLoading(true);
        setLoading(true);

        let datas = {
            category_id: item?._id,
            // coordinates :  env === "dev" ? location : userContext?.location
            coordinates: userContext?.location,
            type: contextPanda?.active,
        };

        await customAxios
            .post('customer/product/category-based', datas)
            .then(async response => {
                let categories = response?.data?.data?.find(
                    home => home?.type === 'categories',
                );
                let products = await getProducts(categories?.data)
                Current(products);
                let stores = response?.data?.data?.find(
                    home => home?.type === 'stores',
                );
                setStore(stores?.data);
                let filter = response?.data?.data?.find(
                    home => home?.type === 'stores',
                );
                setFilter(filter?.data);
                let related_product = response?.data?.data?.find(
                    home => home?.type === 'related_product',
                );
                setRelatedProduct(related_product?.data);
                let subcategory = response?.data?.data?.find(
                    home => home?.type === 'subcategories',
                );
                setSubCategory(subcategory?.data);
                setLoading(false);
                loadingContex.setLoading(false);
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error,
                });
                setLoading(false);
                loadingContex.setLoading(false);
            })
            .finally(() => {
                setLoading(false);
                loadingContex.setLoading(false);
            });
    };

    // useEffect(() => {
    //     getCategories();
    // }, []);

    // const getCategories = async () => {
    //     loadingContex.setLoading(true);

    //     let datas = {
    //         type: contextPanda?.active,
    //     };

    //     await customAxios
    //         .post('customer/categories', datas)
    //         .then(async response => {
    //             setCategories(response?.data?.data);
    //             loadingContex.setLoading(false);
    //         })
    //         .catch(async error => {
    //             Toast.show({
    //                 type: 'error',
    //                 text1: error,
    //             });
    //             loadingContex.setLoading(false);
    //         });
    // };

    let lowercse = item.name.toLowerCase();

    const mainComponents = ({ item, index }) => {
        return (
            <View
                style={ { width: lowercse === 'restaurants' ? '50%' : '33.33%' } }
                key={ index }
            >
                <PandaShopCard name={ lowercse } item={ item } key={ index } />
            </View>
        );
    };

    const HeaderComponents = () => {
        const selectSubcategorySwitch = value => {
            const selectedObject = Filter?.filter(item => {
                return item.subCategory_id?.some(
                    subcategory => subcategory?.id === value,
                );
            });
            setStore(selectedObject);
        };
        return (
            <View
                style={ {
                    backgroundColor: grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff',
                } }
            >
                <View style={ { paddingHorizontal: 10 } }>
                    <FastImage
                        source={ { uri: `${IMG_URL}${item?.image}` } }
                        style={ styles.mainImage }
                        borderRadius={ 15 }
                    />
                    { mode === 'store' && <StoreAddressCard /> }
                    <Text style={ styles.description }>{ item?.seo_description }</Text>
                </View>

                { name === 'Restaurant' && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        style={ styles.restaurantView }
                    >
                        { fooodItems.map(item => (
                            <TouchableOpacity
                                key={ item?._id }
                                style={ { alignItems: 'center', width: width / 4.5 } }
                            >
                                {/* <FastImage
                                    style={{ width: 60, height: 60, borderRadius: 30 }}
                                    source={require('../../../Images/biriyani.jpeg')}
                                    borderRadius={30}
                                /> */}
                                <Text style={ styles.foodName }>{ item?.name }</Text>
                            </TouchableOpacity>
                        )) }
                    </ScrollView>
                ) }
                { lowercse === 'restaurants' && (
                    <View style={ { backgroundColor: '#76867314', paddingBottom: 10 } }>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                            style={ { flexDirection: 'row', marginTop: 15 } }
                        >
                            { subCategory &&
                                subCategory?.map((sub, index) => (
                                    <SubcategoryCard
                                        item={ sub }
                                        key={ index }
                                        selectSubcategorySwitch={ selectSubcategorySwitch }
                                    />
                                )) }
                            {/* {storeDetails?.category_id?.map((cat, index) =>
                            (<TypeCard item={cat} key={index} storeId={storeId} mymode={'MYMODE'} />)
                        )} */}
                        </ScrollView>
                    </View>
                ) }

                { stores && stores?.length > 0 && (
                    <CommonTexts
                        label={ 'Available Shops' }
                        mt={ 15 }
                        mb={ 5 }
                        ml={ 10 }
                        fontSize={ 13 }
                    />
                ) }
            </View>
        );
    };

    const FooterComonents = () => {
        return (
            <View
                style={ {
                    paddingBottom: 80,
                    backgroundColor: grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff',
                } }
            >
                { name !== 'Restaurant' && mode !== 'grocery' && fashion && (
                    <View
                        style={ {
                            backgroundColor: '#76867314',
                            paddingBottom: 10,
                            marginTop: 5,
                        } }
                    >
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                            style={ { flexDirection: 'row', marginTop: 15 } }
                        >
                            { fashionType?.map((item, index) => (
                                <TypeCard item={ item } key={ index } />
                            )) }
                        </ScrollView>
                    </View>
                ) }

                { name === 'Restaurant' && (
                    <View style={ styles.hotelView }>
                        { hotels?.map(item => (
                            <HotelCard item={ item } key={ item?._id } />
                        )) }
                    </View>
                ) }

                {/* {mode === 'store' && <CommonTexts label={'Available Stores'} my={15} ml={10} fontSize={13} />}

                {mode === 'store' && <View style={styles.hotelView}>
                    {stores?.map((item) => (
                        <HotelCard
                            item={item}
                            key={item?._id}
                        />
                    ))}
                </View>} */}

                {/* fashion categories */ }

                {/* {mode === 'grocery' &&
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ backgroundColor: '#76867314', marginTop: 5 }}
                    >
                        {categories.map((item, index) =>
                        (<CommonItemSelect
                            item={item} key={index}
                            selected={selected}
                            setSelected={setSelected}
                        />)
                        )}
                    </ScrollView>} */}

                {/* fashion available products */ }

                <>
                    { availablePdts?.length > 0 && (
                        <CommonTexts
                            label={ 'Available Products' }
                            mt={ 15 }
                            ml={ 10 }
                            fontSize={ 13 }
                            mb={ 5 }
                        />
                    ) }
                    <View style={ styles.itemContainer }>
                        <FlatList 
                            data={availablePdts}
                            keyExtractor={(item) => item?._id}
                            renderItem={({item}) => 
                            <View style={{ marginRight: 5, marginVertical: 5 }}>
                            <ProductCard
                            key={`${item?._id}`}
                            data={item}
                            styles={styles1}
                            width={width / 2.2}
                            loggedIn={userContext?.userData ? true : false}
                            height={height/4}
                        />
                        </View>}
                        numColumns={2}
                        />
                        {/* { availablePdts?.map(item => (
                            <ProductCard
                                key={`${item?._id}`}
                                data={item}
                                styles={styles1}
                                width={width / 2.5}
                                loggedIn={userContext?.userData ? true : false}
                                height={height/4}
                            />
                        )) } */}
                    </View>
                </>
                {/*
                    {mode !== 'store' && mode !== 'grocery' && <View style={{ marginTop: 20, backgroundColor: '#F7F7F7', paddingVertical: 10, marginBottom: 100, paddingLeft: 5 }}>
                    <CommonTexts label={'Recommented Products'} fontSize={13} ml={10} mb={5} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    > */}
                {/* {recomment.map((item) =>
                            <CommonItemCard
                                key={item?._id}
                                item={item}
                                width={width / 2.5}
                                marginHorizontal={5}
                            />
                        )} */}
                {/* </ScrollView>
                </View>} */}

                { mode === 'grocery' && (
                    <View style={ styles.recommPdtBox }>
                        <CommonTexts
                            label={ 'Recommanded Products' }
                            fontSize={ 13 }
                            ml={ 15 }
                            mb={ 5 }
                        />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                            style={ { flexDirection: 'row', paddingLeft: 7 } }
                        >
                            { recentView.map(item => (
                                <View style={{ marginRight: 5 }}>
                                    <ProductCard
                                        key={`${item?._id}`}
                                        data={item}
                                        styles={styles1}
                                        width={width / 2.2}
                                        loggedIn={userContext?.userData ? true : false}
                                        height={height/4}
                                    />
                                </View>
                                // <CommonItemCard
                                //     key={ item?._id }
                                //     item={ item }
                                //     width={ width / 2.5 }
                                //     marginHorizontal={ 5 }
                                // />
                            )) }
                        </ScrollView>
                    </View>
                ) }
            </View>
        );
    };

    return (
        <>
            <HeaderWithTitle title={ item?.name } />

            <View style={ { paddingBottom: 10, marginTop: 5 } }>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={ loading }
                            onRefresh={ getProductBasedCat }
                        // colors={[Colors.GreenLight]} // for android
                        // tintColor={Colors.GreenLight} // for ios
                        />
                    }
                    ListHeaderComponent={ HeaderComponents }
                    data={ stores }
                    showsVerticalScrollIndicator={ false }
                    initialNumToRender={ 8 }
                    // removeClippedSubviews={true}
                    refreshing={ false }
                    onRefresh={ getProductBasedCat }
                    keyExtractor={ item => item._id }
                    numColumns={ lowercse === 'restaurants' ? 2 : 3 }
                    contentContainerStyle={ { justifyContent: 'center', gap: 2 } }
                    renderItem={ mainComponents }
                    ListFooterComponent={ FooterComonents }
                />
            </View>
        </>
    );
};

export default Category;

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
        backgroundColor:"red",
        alignItems:"center",
        justifyContent:"center",
        width:30,
        borderTopLeftRadius:10,
        borderBottomRightRadius:10,
        height:20,
        margin: 1,
    }
})

const styles = StyleSheet.create({
    mainImage: {
        width: '100%',
        height: 200,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 15,
    },
    description: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 13,
        marginTop: 10,
    },

    hotelView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%',
    },
    recommPdtBox: {
        marginTop: 15,
        marginBottom: 60,
        backgroundColor: '#76867314',
        paddingVertical: 5,
    },
    restaurantView: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: '#F7F7F7',
        paddingVertical: 10,
    },
    foodName: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%',
    },
    categoryView: {
        // justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // gap: 6,
        //justifyContent: 'center'
    },
});
