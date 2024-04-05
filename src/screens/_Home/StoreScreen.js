import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import customAxios from '../../CustomeAxios';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../contexts/Auth';
import HeaderWithTitle from '../../Components/HeaderWithTitle';
import { getProducts } from '../../helper/homeProductsHelper';
import ProductCard from '../../Components/Home/ProductCard';
import FastImage from 'react-native-fast-image';
import StoreAddressCard from '../Home/Category/StoreAddressCard';
import CommonTexts from '../../Components/CommonTexts';
import { IMG_URL } from '../../config/constants';
import moment from 'moment';
import TypeCard from '../Home/Grocery/TypeCard';
import CategoriesCard from '../../Components/Home/CategoriesCard';
import CartContext from '../../contexts/Cart';
import CartButton from '../../Components/Home/CartButton';

const StoreScreen = ({ route, navigation }) => {

    const [loading, setLoading] = useState(true)
    const [storeDetails, setStoreDetails] = useState(null)
    const userContext = useContext(AuthContext);
    const [products, setProducts] = useState([])
    const { width, height } = useWindowDimensions()
    const styles1 = makeStyles(height);
    const [item, setItem] = useState(route?.params?.item)
    const cartContext = useContext(CartContext)

    useFocusEffect(
        React.useCallback(() => {
            setStoreDetails(null)
            setProducts(null)
            if (route?.params?.item?._id) {
                getStoreDetails();
            }

        }, [route?.params?.item?._id])
    );


    


    useEffect(() => {
        if(route?.params?.item){
            setItem(route?.params?.item)
        }
        else{
            setStoreDetails(null)
            setProducts(null)
        }


    }, [route?.params?.item])
    

    const getStoreDetails = async () => {

        let data = {
            vendor_id: route?.params?.item?._id,
            // coordinates: env === "dev" ? location : userContext?.location
            coordinates: userContext?.location

        };

        await customAxios.post('customer/store', data)
            .then(async response => {
                //let prods = await getProducts(response?.data?.data?.products)
                setProducts(response?.data?.data?.products)
                setStoreDetails(response?.data?.data);
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error,
                });
            })
            .finally(() => {
                setLoading(false)
            });
    };

    const goBack = () => {
        navigation.goBack()
    }

    const addToCart = (item) => {
        //reactotron.log({item});
        // return false
        cartContext.addToCart(item)
    }

    const renderProduct = ({ item }) => {
        return (
            <View style={{ padding: 5, paddingBottom: 20 }}>
            <ProductCard
                key={`${item?._id}`}
                data={item}
                styles={styles1}
                width={width / 2.2}
                loggedIn={userContext?.userData ? true : false}
                height={height / 4}
                viewProduct={viewProduct}
                addToCart={addToCart}
            />
            </View>
        )
    }

    const viewProduct = (item) => {
        navigation.navigate("SingleItemScreen", { item })
    }

    const onCategoryClick = useCallback((item) => {
        navigation.navigate("Category", { name: item?.store_name, item: item })
    });

    const headerComponent = () => {
        return (
            <View style={{ paddingHorizontal: 5 }}>
                <FastImage
                    source={{ uri: `${IMG_URL}${storeDetails?.store_logo}` }}
                    style={styles1.mainImage}
                    borderRadius={15}
                >
                    {((storeDetails?.start_time && storeDetails?.start_time !== 'Invalid date' && storeDetails?.start_time !== "null") || (storeDetails?.end_time && storeDetails?.end_time !== "Invalid date" && storeDetails?.end_time !== "null")) && <View
                        style={{ backgroundColor: '#8ED053', width: 150, height: 20, borderBottomRightRadius: 10, borderTopLeftRadius: 10, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <CommonTexts label={`${moment(storeDetails?.start_time, "hh:mm a").format('hh:mm a')} - ${moment(storeDetails?.end_time, "hh:mm a").format('hh:mm a')}`} color={'#fff'} fontSize={11} />
                    </View>}
                </FastImage>
                <StoreAddressCard address={storeDetails?.store_address || storeDetails?.store_address !== "null" ? storeDetails?.store_address : storeDetails?.store_address} />
                <Text style={styles.description}>{storeDetails?.seo_description}</Text>
                <View style={ { backgroundColor: '#76867314', paddingBottom: 10 } }>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        style={ { flexDirection: 'row', marginTop: 15 } }
                    >
                        { storeDetails?.category_id?.filter(cat => cat?.name?.toUpperCase() !== "RESTAURANTS")?.map((cat, index) =>
                        (<CategoriesCard item={cat} key={`${index}${cat?._id}`} onCategoryClick={onCategoryClick} width={width} />)
                        ) }
                    </ScrollView>
                </View>
            </View>
        )
    }

    return (
        <>
            <HeaderWithTitle title={route?.params?.item?.store_name} onPressBack={goBack} />
            {storeDetails && <FlatList
                data={products}
                keyExtractor={(item) => item?._id}
                renderItem={renderProduct}
                contentContainerStyle={{ flexGrow: 1, margin: 5 }}
                ListHeaderComponent={headerComponent}
                numColumns={2}
                ListFooterComponent={ loading ? ()=> <View style={{ height: 200, justifyContent:'center', alignItems:'center' }}> 
                <ActivityIndicator color={"red"} size={"large"} />
                <Text>Loading...</Text>
            </View> : null}
            />}
            {loading && <View style={{ height: 200, justifyContent:'center', alignItems:'center' }}> 
                <ActivityIndicator color={"red"} size={"large"} />
                <Text>Loading...</Text>
            </View>}
            <CartButton bottom={20} />
        </>
    )
}

export default StoreScreen

const styles = StyleSheet.create({})

const makeStyles = fontScale => StyleSheet.create({
    mainImage: {
        width: '100%',
        height: fontScale * 0.25,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'flex-end',
    },
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