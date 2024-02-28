import { ActivityIndicator, FlatList, NativeModules, SectionList, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useContext, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import LoaderContext from '../../contexts/Loader';
import AuthContext from '../../contexts/Auth';
import customAxios from '../../CustomeAxios';
import { getProducts } from '../../helper/homeProductsHelper';
import Toast from 'react-native-toast-message';
import reactotron from 'reactotron-react-native';
import PandaContext from '../../contexts/Panda';
import HeaderWithTitle from '../../Components/HeaderWithTitle';
import SubcategoryCard from '../Home/Category/subcategoryCard';
import { ScrollView } from 'react-native-gesture-handler';
import CategoryCard from './CategoryCard';
import StoreAddressCard from '../Home/Category/StoreAddressCard';
import FastImage from 'react-native-fast-image';
import { IMG_URL } from '../../config/constants';
import CommonTexts from '../../Components/CommonTexts';
import ProductCard from '../../Components/Home/ProductCard';
import PandaShopCard from '../../Components/Home/PandaShopCard';
import CartContext from '../../contexts/Cart';
import CartButton from '../../Components/Home/CartButton';

const CategoryScreen = ({route, navigation}) => {

    const [loading, setLoading] = useState(false);
    const { name, item } = route?.params;
    const [datas, setDatas] = useState([])
    const userContext = useContext(AuthContext);
    const contextPanda = useContext(PandaContext);
    const { width, height } = useWindowDimensions()
    const styles1 = makeStyles(height);
    const cartContext = useContext(CartContext);

    useFocusEffect(
        React.useCallback(() => {
            if(item?._id){
                getProductBasedCat();
            }
        }, [item]),
    );

    const addToCart = (item) => {
        cartContext.addToCart(item)
    }

    const getProductBasedCat = async () => {
        setLoading(true);

        let datas = {
            category_id: item?._id,
            coordinates: userContext?.location,
            type: contextPanda?.active,
        };

        await customAxios.post('customer/product/category-based', datas)
        .then(async response => {
            
            let categories = response?.data?.data?.find(
                home => home?.type === 'categories',
            );
            let products = await getProducts(categories?.data)
            let product = {
                type: 'product',
                data: products,
                style: { backgroundColor: '#76867314' },
            }
            //setProducts(products);
            let stores = response?.data?.data?.find(
                home => home?.type === 'stores',
            );
            //setStores(stores?.data);
            // let related_product = response?.data?.data?.find(
            //     home => home?.type === 'related_product',
            // );
            // //setRelatedProduct(related_product?.data);
            // let subcategory = response?.data?.data?.find(
            //     home => home?.type === 'subcategories',
            // );
            //setSubCategory(subcategory?.data);

            let results = [stores, product];

            setDatas(results)

        })
        .catch(async error => {
            Toast.show({
                type: 'error',
                text1: error,
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };


    const viewStore = (item) => {
        navigation.navigate("store", { item })
    }

    const viewProduct = (item) => {
        navigation.navigate("SingleItemScreen", { item })
    }


    const renderProduct = ({item}) => {
        return(
            <View style={{ margin: 5 }}>
            <ProductCard
                key={`${item._id}`}
                data={item}
                styles={styles1}
                width={width / 2.2}
                loggedIn={userContext?.userData ? true : false}
                viewProduct={viewProduct}
                height={height/4}
                addToCart={addToCart}
            />
            </View>
        )
    }


    const _renderItem = ({ section, index }) => {
        if(section?.type === "stores"){
            const items = [];
            let numColumns = 3;
            if (index % numColumns !== 0) return null;

            
    
            for (let i = index; i < index + numColumns; i++) {
                if (i >= section.data.length) {
                    break;
                }
    
                items.push(<PandaShopCard 
                    onClick={() => viewStore(section?.data?.[i])}
                    name={ item?.name?.toLowerCase() } item={ section?.data?.[i] } key={ section?.data?.[i]?._id } />);
            }

            return (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: section?.data?.length > 2 ? "flex-start" : 'flex-start',
                        backgroundColor: '#fff',
                        marginTop: 5,
                    }}
                >
                    {items}
                </View>
                
            );
        }
        else if(section?.type === "product"){
            if(index > 0) {
                return;
            } 

            return (
                <FlatList 
                    data={section?.data}
                    horizontal={false}
                    numColumns={2}
                    keyExtractor={({item}) => item?._id}
                    renderItem={renderProduct}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ 
                        marginVertical: 10, 
                        backgroundColor: '#76867314', 
                        overflow:'scroll', 
                        padding: 5,
                        minWidth: width-10,
                        margin: 5
                    }}
                    style={{ margin: 5 }}
                />
                
            );
            
        }

        
        
    };


    const sectionHeader = () => {
        return(
            <View style={{ paddingBottom: 10 }}>
                <FastImage
                    source={ { uri: `${IMG_URL}${route?.params?.item?.image}` } }
                    style={ styles1.mainImage }
                    borderRadius={ 15 }
                />
                { route?.params?.mode === 'store' && <StoreAddressCard /> }
                <Text 
                style={ [styles1.description, { padding: 5 }] }
                >{ item?.seo_description }</Text>
            </View>
        )
    }

    const rendersectionHeader = ({section}) => {
        if(section.type === "stores" && section?.data?.length > 0){
            return(
                <View
                    style={{ flexDirection: 'row', alignItems: 'center',  marginBottom: 2, justifyContent: 'space-between', backgroundColor: '#76867314', padding: 5 }}
                >
                    <CommonTexts label={'Available Shops'} fontSize={13} />
                </View>
                
            )
        }
        else if(section.type === "product" && section?.data?.length > 0){
            return(
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, justifyContent: 'space-between',  backgroundColor: '#76867314', padding: 5 }}
                >
                    <CommonTexts label={'Available Products'} fontSize={13} />
                </View>
                
            )
        }
    }


    return (
        <View  style={{ backgroundColor: contextPanda?.active === "green" ? '#F4FFE9' : contextPanda?.active === "fashion" ? '#FFF5F7' : '#fff'} }>
            <HeaderWithTitle title={ route?.params?.item?.name } />
            <View style={{ height: cartContext?.cart?.product_details?.length > 0 ?  height-170 : height-100 }}>
            <SectionList
                sections={datas}
                keyExtractor={(item, index) => `${item?._id}${index}`}
                renderItem={_renderItem}
                ListHeaderComponent={sectionHeader}
                renderSectionHeader={rendersectionHeader}
                style={{ backgroundColor: '#fff', marginHorizontal: 5 }}
                stickySectionHeadersEnabled={false}
               
            />
            </View>
            {(datas?.length === 0 && loading) && <View style={{ height: 200, justifyContent:'center', alignItems:'center' }}> 
                <ActivityIndicator color={"red"} size={"large"} />
                <Text>Loading...</Text>
            </View>}
            <CartButton bottom={0} />
        </View>
        
    )
}

export default CategoryScreen

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
    },
    mainImage: {
        width: '100%',
        height: fontScale*0.2,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'flex-end'
    },
})