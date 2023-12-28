/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, Moda, RefreshControl, Modal, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import ItemDetails from './ItemDetails';
import CustomButton from '../../../Components/CustomButton'
import OrderWhatsapp from './OrderWhatsapp'
import VideoPlayer from './VideoPlayer'
import FastImage from 'react-native-fast-image'
import ScheduleDeliveryModal from './ScheduleDeliveryModal'
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown'
import PandaContext from '../../../contexts/Panda'
import CommonItemCard from '../../../Components/CommonItemCard'
import ImageVideoBox from './ImageVideoBox'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonRating from '../../../Components/CommonRating'
import customAxios from '../../../CustomeAxios'
import { IMG_URL, mode } from '../../../config/constants'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import LoaderContext from '../../../contexts/Loader'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message';
import reactotron from 'reactotron-react-native'
import Carousel from 'react-native-reanimated-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import { CommonActions } from '@react-navigation/native';
import Animated, { useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import {
    useQuery,

} from '@tanstack/react-query';
import CommonItemSelectSkeltion from '../../../Components/CommonItemSelectSkeltion';
import Header from '../../../Components/Header';
import ShopCardSkeltion from '../Grocery/ShopCardSkeltion';
import { isEqual } from 'lodash'



const getSingleProductListQuery = async (id) => {
    const response = await customAxios.get(`customer/product/${id}`)
    return response?.data?.data
}

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)



const SingleItemScreen = ({ route, navigation }) => {

    const refRBSheet = useRef();
    const userContext = useContext(AuthContext)
    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const [showSingleImg, setShowSingleImg] = useState(false)
    const [singleProduct, setSingleProduct] = useState([])
    const [selectedImage, setSelectedImage] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState(new Date())
    const [attributes, setAttributes] = useState([])
    const [price, setPrice] = useState('')
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [loading, setLoading] = useState(false)
    let active = contextPanda.active



    const courasol = useRef(null);

    const [courasolArray, setCourasolArray] = useState([])

    const [images, setImages] = useState(null)
    const [imagesArray, setImagesArray] = useState([])


    const [item, setItem] = useState(null)

    const { data, isLoading, refetch } = useQuery({ 
        queryKey: ['singleProduct'], 
        queryFn: () => getSingleProductListQuery(route?.params?.item?._id) 
    });


    useEffect(() => {
        refetch()
    }, [route?.params?.item?._id])
    

    useEffect(() => {
        if (route?.params?.item) {
            let videoId = null;

            if (route?.params?.item?.video_link) {
                let video = route?.params?.item?.video_link;
                if (video.includes("https://www.youtube.com/")) {
                    videoId = video.split('=')[1]
                }
            }

            let images = [{ url: route?.params?.item?.product_image, type: 'image' }];

            if (route?.params?.item?.image) {
                route?.params?.item?.image?.map(img => {
                    images.push({ url: img, type: 'image' });
                })
            }

            if (videoId) {
                images.push({ url: videoId, type: 'video' })
            }

            setCourasolArray(images);
            setItem(route?.params?.item);
            setImages(route?.params?.item?.image ? [route?.params?.item?.product_image, ...route?.params?.item?.image] : [route?.params?.item?.product_image])
            addViewCount(route?.params?.item);

        }

        return () => {
            setItem(null)
            setImages([])
            setSelectedImage(0)
            setAttributes([])
        }
    }, [route?.params?.item, route?.params?.item?.variants])




    const loadingg = useContext(LoaderContext)



    // const position = new Animated.ValueXY({ x: 0, y: 0 })

    let loader = loadingg?.loading

    const user = useContext(AuthContext)
    const cart = useContext(CartContext)

    let userData = user?.userData

    useEffect(() => {
        if (item) {
            if (item?.variant) {
                let selectedVariant = item?.variants?.find(vari => vari?.available === true)
                setSelectedVariant(selectedVariant)
                let names = selectedVariant?.title?.split(" ")
                let attributes = item?.attributes?.map(att => {
                    let selected;
                    att?.options?.map(opt => {
                        let values = opt?.split(" ");
                        if (values && names) {
                            const containsAll = values?.every(elem => names?.includes(elem));
                            if (containsAll) {
                                selected = opt
                            }
                        }

                    })
                    return {
                        ...att,
                        selected
                    }
                })

                setAttributes(attributes)
            }
            else{
                let attributes = item?.attributes?.map(att => {
                    let selected;
                    att?.options?.map((opt, index) => {
                        if(index === 0){
                            selected = opt;
                        }

                    })
                    return {
                        ...att,
                        selected
                    }
                })
                setAttributes(attributes)
            }
            // getSingleProductList()
        }else{
            setAttributes(item?.attributes)
        }
    }, [item]);





    const { width, height } = useWindowDimensions()





    const addViewCount = async (item) => {
        let datas = {
            type: active,
            product_id: item?._id,
            customer_id: userData?._id
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



    const gotoStore = useCallback(() => {
        navigation.navigate('store', { name: item?.store?.name, mode: 'singleItem', storeId: item?.store?._id })
    }, [item, navigation])

    const proceedCheckout = useCallback(() => {
        navigation.navigate('Checkout')
        setShowModal(false)
    }, [navigation])

    const closeModal = useCallback(() => {
        setShowModal(false)
    }, []);

    const showModals = useCallback(() => {
        setShowModal(true)
    }, [])

    const addToCart = useCallback(async () => {
        if (!userContext?.userData) {
            Alert.alert(
                'Warning',
                'Add to cart option only available for logged in user. Click OK to Login.',
                [
                    {
                        text: 'Cancel',
                        //onPress: () => Alert.alert('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                        style: 'cancel',
                    },
                ],
                {
                    cancelable: true,
                },
            );

            //navigation.navigate('Login')
            return false;
        }

        let price = item?.variant ? selectedVariant?.price : item?.price;
    
        if (parseInt(price) < 1) {
            Toast.show({
                type: 'info',
                text1: 'Price Should be more than 1'
            });
        } else {
          
            let filter = attributes?.filter(attr => attr?.variant === true || attr?.variant === null)

            reactotron.log({filter})

            let attri = filter?.map(attr => attr?.selected)
            let selectedVari;
            item?.variants?.map(vari => {
                reactotron.log({ a: attri.sort(), b: vari?.attributs.sort(), attributes, equal: isEqual(attri?.sort(), vari?.attributs.sort()), vari })
                if(isEqual(attri?.sort(), vari?.attributs.sort())){
                    selectedVari = vari;
                }
                // let variAttributes = vari?.attributs?.sort()
                // if(vari?.attributs?.sort().toString() == attributes.sort().toString()){
                //     selectedVari = vari;
                //     //cartContext.addToCart(item, vari, attributes);
                //     //break;
                // }
            })

            if(item?.variants?.length > 0 && selectedVari){
                cartContext.addToCart(item, selectedVari, attributes);
            }
            else if(!item?.variants){
                let attributes = attributes?.length > 0 ? attributes : null
                cartContext.addToCart(item, selectedVari, attributes);
            }
            else{
                Toast.show({
                    type: 'info',
                    text1: 'Please select attributes to continue'
                });
            }
            //reactotron.log({selectedVari})

            
            
        }
    }, [selectedVariant, cart?.cart, item?.variant, cart?.products, item, attributes])




    const selectAttributes = (value) => {
        reactotron.log({value})
        let attri = [];
        let attr = attributes?.map(att => {
            if (att?.options.includes(value)) {
                if (att?.variant) {
                    let values = value?.split(' ')
                    values?.map(va => {
                        attri.push(va)
                    })
                }

                return {
                    ...att,
                    selected: value
                }
            }
            else {
                if (att?.variant) {
                    let values = att.selected?.split(' ')
                    values?.map(va => {
                        attri.push(va)
                    })
                }
                return att
            }
        })

        let selected = []
        attr?.map(att => {
            if(att?.selected){
                selected.push(att?.selected)
            }
        })


        reactotron.log({attr, variants: item?.variants, selected})

        let selectedVariant;

        item?.variants?.map(vari => {
            if(vari?.attributs?.length === selected?.length){
                if(isEqual(vari?.attributs?.sort(), selected.sort())){
                    selectedVariant = vari;
                }
            }
        })

        if(selectedVariant){
            setSelectedVariant({...selectedVariant})
            setPrice(selectedVariant?.price)
        }


        // item?.variants?.map(sin => {
        //     let attributes = []
        //     sin?.attributs?.map(att => {
        //         attributes.push(att)
        //     })
        //     const containsAll = attri.every(elem => attributes?.includes(elem?.selected));

        //     //reactotron.log({sin, containsAll})

        //     if (containsAll) {

        //         if (item?.stock) {
        //             if (!sin?.available) {
        //                 item.available = false
        //             }
        //             else {
        //                 item.available = true
        //             }
        //         }
        //         setSelectedVariant({...sin})
        //         setPrice(sin?.price)
        //         return false;
        //     }
        // })
        setAttributes([...attr])
    }


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



    const renderInStock = useCallback(() => {
        if (item?.available) {
            if (item?.stock) {
                if (item?.variant) {
                    if (parseFloat(item?.stock_value) > 0) {
                        return (
                            <View
                                style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                            >
                                <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                            </View>
                        )
                    }
                }
                else {
                    if (parseFloat(data?.stock_value) > 0) {
                        return (
                            <View
                                style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                            >
                                <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                            </View>
                        )
                    }
                }
            }
            else {
                return (
                    <View
                        style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
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
    }, [item])

    const openSingleImg = useCallback(() => {
        let imagesss = images?.map((items, index) => {
            return { url: `${IMG_URL}${items}` }
        })

        setImagesArray(imagesss)
        setShowSingleImg(true)
    }, [images])

    const closeSingleImg = useCallback(() => {
        setShowSingleImg(false)
    }, [showSingleImg])

    let image = item?.image ? [item?.product_image, ...item?.image] : [item?.product_image];







    const renderImageAnimation = ({ item, index }) => {

        if (item?.type === "image") {
            return (
                <TouchableOpacity onPress={openSingleImg} style={{ width: width }}>
                    <FastImage
                        source={{ uri: `${IMG_URL}${item?.url}` }}
                        style={{ height: width / 1.7, width: '100%', borderRadius: 2, }}
                        resizeMode='cover'
                    >
                    </FastImage>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <VideoPlayer videoId={item?.url} selected={selectedImage} index={index} item={item} />
            )
        }
    }


    const makeSelected = (index) => {
        setSelectedImage(index)
        courasol?.current?.scrollTo({ index, animated: false })
    }



    const renderRelatedProducts = ({ item, index }) => {
        return (
            <View key={index} style={{ flex: 0.6, justifyContent: 'center' }}>
                <CommonItemCard
                    item={item}
                    key={item?._id}
                    width={width / 2.4}
                    height={height / 3.7}
                    mr={5}
                    ml={8}
                    mb={15}
                />
            </View>
        )
    }

    const ImageViewerChange = (index) => {
        setSelectedImage(index)

    }

    const onClickDrawer = useCallback(() => {
        navigation.openDrawer()
    }, [navigation])

    if (isLoading) {
        return <View>
        <Header onPress={onClickDrawer} />
        <ScrollView

            showsHorizontalScrollIndicator={false}
            style={{ width: width, height: height }}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{ height:width / 1.7 , alignItems: 'center', marginTop: 10, shadowOpacity: 0.1, shadowRadius: 1, opacity, width: width }} >
                    <Animated.View
                        style={{ height: '100%', width: '90%', backgroundColor: '#fff', margin: 5, borderRadius: 20, opacity }}
                    />
                </Animated.View>
            </View>
        </ScrollView>
    </View>
    }

    return (
        <>
            <HeaderWithTitle title={item?.name} />
            <ScrollView
                style={{ flex: 1, backgroundColor: contextPanda?.active === "green" ? '#F4FFE9' : contextPanda?.active === "fashion" ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
            >

                <View style={{ height: width / 1.7 }}>
                    {courasolArray && courasolArray?.length > 0 ?
                        <Carousel
                            ref={courasol}
                            // autoPlay={true}

                            width={width}
                            data={courasolArray}
                            renderItem={renderImageAnimation}
                            onSnapToItem={(index) => setSelectedImage(index)}
                            scrollAnimationDuration={10}
                        /> : <AnimatedFastImage
                            // source={data?.image[selectedImage]?.name} 
                            sharedTransitionTag={`images${item?._id}`}
                            source={{ uri: `${IMG_URL}${images?.[0]}` }}
                            style={{ width: width - 30, height: 180, borderRadius: 15, }}
                            resizeMode='cover'
                        >
                        </AnimatedFastImage>
                    }
                    {renderInStock()}


                </View>
                {courasolArray?.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {courasolArray?.map((item, index) =>
                        <ImageVideoBox
                            key={index}
                            setSelectedImage={makeSelected}
                            selectedImage={selectedImage}
                            item={item}
                            index={index}
                        />
                    )}
                </ScrollView>}

                <ItemDetails
                    onPress={gotoStore}
                    itemName={item?.name}
                    hotelName={item?.store?.name}
                    views={item?.viewCount ? item?.viewCount : 0}
                    sold={item?.order_count}
                    minQty={item?.minQty}
                    price={item?.variant ? selectedVariant?.price : item?.price}
                    regularPrice={item?.variant ? selectedVariant?.regularPrice : item?.regularPrice}
                    available={item?.available}
                />
                {item?.weight !== ('' || null) &&
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

                        }}>{item?.weight}</Text>

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
                                value={attr.selected ? attr.selected : ''}
                                setValue={selectAttributes}
                                height={40}
                                width={'48%'}
                            />
                        ))}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', width: width, justifyContent: contextPanda?.active === "panda" ? 'center' : 'center', marginTop: 10, paddingHorizontal: 10, gap: 5 }}>
                    {item?.available && <CustomButton
                        onPress={addToCart}
                        label={'Add to Cart'} bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} width={width / 2.2}
                        loading={loader}
                    />}
                </View>
                <View style={{ backgroundColor: '#0C256C0D', height: 1, marginVertical: 20 }} />
                {item?.description &&
                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={styles.DetailsText}>Details</Text>
                        <Text style={styles.DetailsTextDescription}>{item?.description}</Text>

                    </View>}
                {data?.relatedProducts?.length > 0 && <View style={{ backgroundColor: '#0C256C0D', height: 1, marginVertical: 20 }} />}
                {data?.relatedProducts?.length > 0 &&

                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>

                        <Text style={styles.headingRelatedProduct}>Related Products</Text>
                        <FlatList
                            data={data?.relatedProducts}
                            keyExtractor={(item, index) => index}
                            renderItem={renderRelatedProducts}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={6}
                            removeClippedSubviews={true}
                            windowSize={10}
                            maxToRenderPerBatch={5}
                            numColumns={2}
                            style={{ marginLeft: 5 }}
                        />

                    </View>}

                <ScheduleDeliveryModal
                    showModal={showModal}
                    setDate={setDate}
                    date={date}
                    onPress={closeModal}
                    checkout={proceedCheckout}
                />



                <Modal
                    // animationType="slide"
                    transparent={true}
                    visible={showSingleImg}
                >

                    {imagesArray && <Modal visible={showSingleImg} >
                        <ImageViewer
                            // onChange={(index) =>ImageViewerChange(index)}
                            style={{ flex: 1 }}
                            enableSwipeDown
                            index={selectedImage}
                            onSwipeDown={closeSingleImg}
                            onCancel={closeSingleImg}
                            imageUrls={imagesArray}
                            onClick={closeSingleImg}
                            renderFooter={() => <TouchableOpacity
                                onPress={closeSingleImg}
                                style={{ alignSelf: 'flex-end', position: 'absolute', zIndex: 150, bottom: 50, left: width / 2, elevation: 5 }}
                            >
                                <AntDesign name='closecircle' onPress={closeSingleImg} color='#fff' size={25} alignSelf={'flex-end'} />
                            </TouchableOpacity>}
                        />

                    </Modal>}
                </Modal>


            </ScrollView>
        </>
    )
}

export default SingleItemScreen

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
