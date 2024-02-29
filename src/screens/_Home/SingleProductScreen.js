import { ActivityIndicator, FlatList, ScrollView, SectionList, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import Animated from 'react-native-reanimated'
import { IMG_URL } from '../../config/constants'
import reactotron from 'reactotron-react-native'
import PandaContext from '../../contexts/Panda'
import customAxios from '../../CustomeAxios'
import Toast from 'react-native-toast-message'
import Carousel from 'react-native-reanimated-carousel'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImageVideoBox from '../Home/SingleItemScreen/ImageVideoBox'
import VideoPlayer from '../Home/SingleItemScreen/VideoPlayer'
import ItemDetails from '../Home/SingleItemScreen/ItemDetails'
import { singleProduct } from '../../helper/SingleProductHelper'
import CommonSelectDropdown from '../../Components/CommonSelectDropdown'
import { isEqual } from 'lodash'
import CustomButton from '../../Components/CustomButton'
import ProductCard from '../../Components/Home/ProductCard'
import AuthContext from '../../contexts/Auth'
import { getProducts } from '../../helper/homeProductsHelper'
import CartContext from '../../contexts/Cart'
import CartButton from '../../Components/Home/CartButton'

const SingleProductScreen = ({ route, navigation }) => {

    

    const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

    const { width, height } = useWindowDimensions()
    const styles1 = makeStyles(height);
    const [loading, setLoading] = useState(false)
    const [courasolArray, setCourasolArray] = useState(null)
    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    const courasol = useRef(null);
    //const [productItem, setProductItem] = useState({})
    const [image, setImage] = useState(``)
    const [data, setData] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [priceDetails, setPriceDetails] = useState(null)
    const [price, setPrice] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [attributes, setAttributes] = useState([])

    const { variantAddToCart } = useContext(CartContext)
    
    //reactotron.log({ price }) 65df243fb059da96cf074c43

    reactotron.log({data})

    useEffect(() => {
        if(route?.params?.item?._id){
            setCourasolArray(null)
            getSingleProductDetails()
            addViewCount(route?.params?.item?._id)
        }
    }, [route?.params?.item?._id])

    const addViewCount = async (id) => {
        let datas = {
            type: contextPanda?.active,
            product_id: id,
            customer_id: userContext?.userData?._id
        }
        await customAxios.post(`customer/product/viewcount`, datas)
            .then(async response => {

            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })
    }
    

    const getSingleProductDetails = async() => {
        setLoading(true)
        try {
            const response = await customAxios.get(`customer/product/${route?.params?.item?._id}`)
            if(response?.data?.message === "Success"){
                let data = response?.data?.data;
                //setProductItem(data)
                setImage(`${IMG_URL}${data?.product_image}`)
                let priceDetails = await singleProduct(data);

                //reactotron.log({priceDetails})

                
                setPriceDetails(priceDetails)

                if(data?.relatedProducts){
                    let related = await getProducts(data?.relatedProducts)

                    //reactotron.log({related})
                    setRelatedProducts(related)
                }
                //reactotron.log({priceDetails})
                setData(data)
                let images = [ {
                    type: 'image',
                    url: `${IMG_URL}${data?.product_image}`
                }]
                if(data?.image?.length > 0){
                    data?.image?.map(img => {
                        images.push({
                            type: 'image',
                            url: `${IMG_URL}${img}`
                        })
                    })
                    if(data?.video_link){
                        let videoId;
                        let video = data?.video_link;
                        if (video.includes("https://www.youtube.com/")) {
                            videoId = video.split('=')[1]
                            images.push({
                                type: 'video',
                                url: videoId
                            })
                        }
                        
                    }
                    setCourasolArray(images)
                }
                

                if(data?.variants?.length > 0){
                    var result = priceDetails?.find((vari) => vari?.available === true && vari?._id === priceDetails?.variant_id);
                    setPrice(result);
                    //reactotron.log({result})
                    let selectedVariant = data?.variants?.find(vari => vari?._id === result?._id)
                    setSelectedVariant(selectedVariant)
                    

                    if(data?.attributes){
                        let attributes = data?.attributes?.map((att, index) => {
                            return {
                                ...att,
                                selected: selectedVariant?.attributs[index]
                            }
                        })

                        setAttributes(attributes)

                        //setAttributes(attributes)
                        //reactotron.log({selectedVariant, attributes: data.attributes, attributess: attributes})
                    }
                    
                }
                else{
                    //setAttributes(data?.attributes)
                    setPrice(priceDetails)
                }

                
            }
            else{
                throw new Error('Something went wrong. Please try again lator')
            }
            
        } catch (error) {
            Toast.show({
                text1: error
            })
        }
        finally{
            setLoading(false)
        }
    }

    const _renderItem = ({item}) => {
        return(
            <View style={{ width: width / 2 - 15, margin: 5 }}>
                <ProductCard
                    key={`${item?._id}product`}
                    data={item}
                    styles={styles1}
                    loggedIn={userContext?.userData ? true : false}
                    height={height/4}
                    viewProduct={viewProduct}
                    //sharedTransitionTag={`images${item?._id}`}
                />
            </View>
        )
    }

    const viewProduct = (item) => {
        navigation.navigate("SingleItemScreen", { item })
    }


    reactotron.log({priceDetails})

    const renderInStock = useCallback(() => {
        if (priceDetails?.available) {
            if (priceDetails?.stock) {
                if (parseFloat(priceDetails?.stock_value) > 0) {
                    return (
                        <View
                            style={{ position: 'absolute', left: 20, top: 15, backgroundColor: contextPanda?.active === 'green' ? '#8ED053' : contextPanda?.active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                        </View>
                    )
                }
                else{
                    return (
                        <View
                            style={{ position: 'absolute', left: 20, top: 15, backgroundColor: 'red', borderRadius: 8 }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'Out Of Stock'}</Text>
                        </View>
                    )
                }
            }
            else {
                return (
                    <View
                        style={{ position: 'absolute', left: 20, top: 15, backgroundColor: contextPanda?.active === 'green' ? '#8ED053' : contextPanda?.active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                    >
                        <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                    </View>
                )
            }
        }
        else {
            return (
                <View
                    style={{ position: 'absolute', left: 20, top: 15, backgroundColor: 'red', borderRadius: 8 }}
                >
                    <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'Out Of Stock'}</Text>
                </View>
            )
        }
    }, [priceDetails])


    const renderImageAnimation = ({ item, index }) => {

        if (item?.type === "image") {
            return (
                <TouchableOpacity 
                //onPress={openSingleImg} 
                style={{ width: width-10 }}>
                    <FastImage
                        source={{ uri: `${item?.url}` }}
                        style={{ height: width / 1.7, width: '100%', borderRadius: 2 }}
                        resizeMode='cover'
                    >
                    </FastImage>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <VideoPlayer videoId={item?.url} selected={image}  index={index} item={item} />
            )
        }
    }


    const makeSelected = async(index) => {
        //if(courasolArray[index].type === "image"){
            await courasol?.current?.scrollTo({ index, animated: false })
        //}

        if(courasolArray[index].type === "video"){
            setImage(index)
        }
        
        //setImage(index)
        // setTimeout(() => {
        //     setImage(index)
        // }, 200);
        
    }

    const renderImages = useCallback(() => {
        if(courasolArray && courasolArray?.length > 0){
            return(
                <View style={{ height: 220 }}>
                <Carousel
                    ref={courasol}
                    // autoPlay={true}
                    //height={100}
                    width={width-10}
                    data={courasolArray}
                    renderItem={renderImageAnimation}
                    onSnapToItem={(index) => makeSelected(index)}
                    scrollAnimationDuration={10}
                />
                </View>
            )
        }
        else{
            return(
                <AnimatedFastImage
                    // source={data?.image[selectedImage]?.name} 
                    //sharedTransitionTag={`images${route?.params?.item?._id}`}
                    source={{ uri: image }}
                    style={{ width: width - 10, height: 180, borderRadius: 15, }}
                    resizeMode='cover'
                >
                </AnimatedFastImage>
            )
        }
    }, [courasolArray?.length, image])

    const gotoStore = () => {
        navigation.navigate("store", { item: data?.vendors })
        //navigation.navigate('store', { name: data?.vendor?.store_name, mode: 'store', item: data?.vendor, storeId: data?.vendor?._id })
        //navigation.navigate('store', { name: data?.store?.name, mode: 'singleItem', storeId: data?.store?._id })
    }

    const selectAttributes = (value, index) => {

        attributes[index]['selected'] = value
        setAttributes([...attributes])

        //reactotron.log({value, priceDetails, attributes: data?.attributes, index})

        // let selected = priceDetails?.find(price => price?.title === value);

        // setPrice(selected)

        // setSelectedVariant(data?.variants?.find(vari => vari?._id === selected?._id))


        // let attri = [];
        // let attr = data?.attributes?.map(att => {
        //     if (att?.options.includes(value)) {
        //         if (att?.variant) {
        //             let values = value?.split(' ')
        //             values?.map(va => {
        //                 attri.push(va)
        //             })
        //         }

        //         return {
        //             ...att,
        //             selected: value
        //         }
        //     }
        //     else {
        //         if (att?.variant) {
        //             let values = att.selected?.split(' ')
        //             values?.map(va => {
        //                 attri.push(va)
        //             })
        //         }
        //         return att
        //     }
        // })

        let selected = []
        attributes?.map(att => {
            if(att?.selected){
                selected.push(att?.selected)
            }
        })


        

        let selectedVariant;

        data?.variants?.map(vari => {
            //reactotron.log("length matched", vari, selected)
            if(vari?.attributs?.length === selected?.length){
                
                if(isEqual(vari?.attributs?.sort(), selected.sort())){
                    selectedVariant = vari;
                }
            }
        })

        //reactotron.log({selectedVariant})

        if(selectedVariant){
            setSelectedVariant({...selectedVariant})
            setPrice(priceDetails?.find(pr => pr?._id === selectedVariant?._id))
        }
        // //setAttributes([...attr])
    }


    const addToCart = () => {
        //if(price?._id)
        reactotron.log({data, price})
        variantAddToCart(data, price)
    }

    const listHeader = () => {
        return (
            <View style={{ width }}>
                {renderImages()}
                {renderInStock()}
                {courasolArray?.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {courasolArray?.map((item, index) =>
                        <ImageVideoBox
                            key={index}
                            setSelectedImage={() => makeSelected(index)}
                            selectedImage={image === index ? true : false}
                            item={item}
                            index={index}
                        />
                    )}
                </ScrollView>}
                {data && <ItemDetails
                    onPress={gotoStore}
                    itemName={data?.name}
                    hotelName={data?.store?.name}
                    views={data?.viewCount ? data?.viewCount : 0}
                    sold={data?.order_count}
                    minQty={data?.minimum_qty}
                    price={priceDetails?.sellerPrice}
                    regularPrice={priceDetails?.regularPrice}
                    available={priceDetails?.available}
                />}
                {data?.weight !== ('' || null) &&
                <View style={{ paddingLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Text style={{
                        fontFamily: 'Poppins',
                        letterSpacing: 1,
                        fontSize: 10,

                    }}>weight :</Text>
                    <Text style={{
                        fontFamily: 'Poppins',
                        letterSpacing: 1,
                        fontSize: 10,

                    }}>{data?.weight}</Text>

                </View>}
                {(data?.dimensions?.width && data?.dimensions?.width !== "") &&
                    <View style={{ paddingLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <Text style={{
                            fontFamily: 'Poppins',
                            letterSpacing: 1,
                            fontSize: 10,

                        }}>Width :</Text>
                        <Text style={{
                            fontFamily: 'Poppins',
                            letterSpacing: 1,
                            fontSize: 10,

                        }}>{data?.dimensions?.width}</Text>

                    </View>}
                {data?.dimensions?.height &&
                <View style={{ paddingLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Text style={{
                        fontFamily: 'Poppins',
                        letterSpacing: 1,
                        fontSize: 10,

                    }}>Height :</Text>
                    <Text style={{
                        fontFamily: 'Poppins',
                        letterSpacing: 1,
                        fontSize: 10,

                    }}>{data?.dimensions?.height}</Text>

                </View>}
                <View style={{ paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap' }}>
                        {(attributes?.map((attr, index) =>
                            <CommonSelectDropdown
                                key={index}
                                placeholder={attr?.name}
                                data={attr.options}
                                value={attr?.selected}
                                setValue={selectAttributes}
                                height={40}
                                width={'48%'}
                                index={index}
                            />
                        ))}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: width, justifyContent: contextPanda?.active === "panda" ? 'center' : 'center', marginTop: 10, paddingHorizontal: 10, gap: 5 }}>
                    {priceDetails?.available && <CustomButton
                        onPress={addToCart}
                        label={'Add to Cart'} bg={contextPanda?.active === 'green' ? '#8ED053' : contextPanda?.active === 'fashion' ? '#FF7190' : '#58D36E'} width={width / 2.2}
                        loading={loading}
                    />}
                </View>
                <View style={{ backgroundColor: '#0C256C0D', height: 1, marginVertical: 20 }} />
                {data?.description &&
                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={styles.DetailsText}>Details</Text>
                    <Text style={styles.DetailsTextDescription}>{data?.description}</Text>

                </View>}
            </View>
        )
    }

    return (
        <>
            <HeaderWithTitle title={data?.name} />
            {/* {listHeader()} */}
            <FlatList 
                data={relatedProducts}
                ListHeaderComponent={listHeader}
                renderItem={_renderItem}
                contentContainerStyle={{ margin: 5, backgroundColor: '#fff', flexGrow: 1 }}
                ListFooterComponent={loading ? () =>  <ActivityIndicator  /> : null}
                keyExtractor={(item, index) => `${item?._id}${index}`}
                numColumns={2}
                
            />
            {/* <SectionList
                sections={[]}
                keyExtractor={(item, index) => `${item?._id}${index}`}
                renderItem={_renderItem}
                //renderSectionHeader={sectionHeader}
                //renderSectionFooter={sectionFooter}
                ListHeaderComponent={listHeader}
                style={{ backgroundColor: '#fff' }}
                //ListFooterComponent={}
                stickySectionHeadersEnabled={false}
                refreshing={loading}
                refreshControl={()=> <ActivityIndicator color={"red"} />}
                //extraData={filter}
                contentContainerStyle={{ margin: 5 }}
                ListFooterComponent={() => loading ? <ActivityIndicator color={"red"} /> : null}
            /> */}
            <CartButton bottom={20} />
        </>
    )
}

export default SingleProductScreen

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
    video: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    DetailsText: {
        fontFamily: 'Poppins-Bold',
        color: '#000',
        letterSpacing: 1,
        fontSize: 14,
    },
    headingRelatedProduct: {
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
        color: '#000',
        letterSpacing: 1,
        fontSize: 14,
    },
    DetailsTextDescription: {
        fontFamily: 'Poppins-Regular',
        color: '#000',
        letterSpacing: 1,
        fontSize: 12,
    }
})