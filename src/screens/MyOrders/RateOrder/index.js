import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import CommonInput from '../../../Components/CommonInput'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Rating, AirbnbRating } from 'react-native-ratings';
import CustomRating from './CustomRating'
import CustomButton from '../../../Components/CustomButton'
import PandaContext from '../../../contexts/Panda'
import ProductRatingCard from './ProductRatingCard'
import reactotron from 'reactotron-react-native'
import customAxios from '../../../CustomeAxios'
import Toast from 'react-native-toast-message'
import StoreRating from './StoreRating'

const RateOrder = ({ route, navigation }) => {

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    const [loading, setLoading] = useState(false)


    const schema = yup.object({
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    let item = route?.params?.item

    reactotron.log(item, "afyghiasydfgisduyg")

    const [storeRating, setStoreRating] = useState('')

    const [riderRating, setRiderRating] = useState('')

    // const [itemRating, setItemRating] = useState('')

    reactotron.log(riderRating, "riderRating")

    const { width } = useWindowDimensions()




    const onSubmit = async (data) => {


        let stores = item?.stores?.map(st => {
            const { _id: store_id, store_name, ...rest } = st
            return {
                store_id,
                ...rest
            }
        })

        let product_details = item?.product_details?.map(st => {
            const { product_id, rating, feedback } = st
            return {
                product_id,
                rating,
                feedback,
            }
        })
        reactotron.log({ stores: stores })

        // return false;

        data = {
            order_id: item?._id,
            store: stores,
            product: product_details,
            rider_id: item?.riders?._id,
            rider_rating: riderRating,
            rider_feedback: data?.rider
        }
        reactotron.log(data, "data")


        setLoading(true)

        await customAxios.post(`customer/customer-review-rating`, data)
            .then(async response => {
                reactotron.log(response, "RESPONSE")
                Toast.show({
                    type: 'success',
                    text1: 'Rating Submitted Successfully'
                })
                navigation.navigate('MyOrders')
                setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                })
                setLoading(false)
            });

    }


    const updateRating = (rating, position) => {
        item.stores[position]['store_rating'] = rating
    }


    const updateComments = (coments, position) => {
        item.stores[position]['store_feedback'] = coments
    }

    const updateProductRating = (rating, position) => {
        item.product_details[position]['rating'] = rating
    }


    const updateProductComments = (coments, position) => {
        item.product_details[position]['feedback'] = coments
    }


    return (
        <>
            <HeaderWithTitle title={'Order ID ' + item?.order_id} />
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff',
                    paddingTop: 20
                }}
            >

                <View style={{ paddingHorizontal: 10 }}>
                    <CommonTexts fullLabel label={'Rate Your Store Experience'} fontSize={15} />
                    {item?.stores.map((item, index) =>
                        <StoreRating
                            item={item}
                            key={item?._id}
                            setStoreRating={(rating) => updateRating(rating, index)}
                            setComments={(value) => updateComments(value, index)}
                        />)}
                </View>

                <View style={{ width: width, height: 1, backgroundColor: '#F2F2F2', marginVertical: 20 }} />

                <View style={{ paddingHorizontal: 10 }}>
                    <CommonTexts label={'Product Rating'} fontSize={15} />
                    {item?.product_details.map((item, index) =>
                        <ProductRatingCard
                            item={item}
                            key={item?._id}
                            setItemRating={(rating) => updateProductRating(rating, index)}
                            setComments={(value) => updateProductComments(value, index)}
                        />)}
                </View>

                <View style={{ width: width, height: 1, backgroundColor: '#F2F2F2', marginVertical: 20 }} />

                <View style={{ paddingHorizontal: 10 }}>
                    <CommonTexts label={'Rider Rating'} fontSize={15} />
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: '#23233C', marginTop: 10, marginBottom: -5 }}>{item?.riders?.name}</Text>
                    <CustomRating
                        onFinishRating={(rating) => setRiderRating(rating)}
                    />
                    <CommonInput
                        control={control}
                        error={errors.rider}
                        fieldName="rider"
                        topLabel={'Feedback (Optional)'}
                        top={10}
                        placeholder='e.g. How much you loved the delivery'
                        placeholderTextColor='#0C256C21'
                        maxHeight={120}
                        multi={true}
                    />

                    <CustomButton
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        label={'Submit'}
                        bg={grocery ? '#8ED053' : '#58D36E'}
                        mt={20}
                        mb={100}
                    />

                </View>


            </ScrollView>
        </>

    )
}

export default RateOrder

const styles = StyleSheet.create({

    itemView: {
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginVertical: 15,
        backgroundColor: '#fff',
        shadowOffset: { height: 5, width: 1 }
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 6,
        justifyContent: 'space-between'
    },
    orderIdText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    dateText: {
        fontFamily: 'Poppins-Regular',
        color: '#00000029',
        fontSize: 10,
    },
    itemHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        margin: 7,
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        borderColor: '#00000029'
    },
    headerTexts: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
    },
    boldText: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 11,
    },
    statusBox: {
        backgroundColor: '#FFF297',
        borderRadius: 5,
        alignItems: 'center'
    },
    statusText: {
        fontFamily: 'Poppins-Regular',
        color: '#B7A000',
        fontSize: 10,
        marginVertical: 4
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 7,
        marginBottom: 10
    },
    itemUnderProduct: {
        paddingHorizontal: 10,
        backgroundColor: '#F3F3F3',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    }

})