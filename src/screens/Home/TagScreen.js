import { RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import { useNavigation } from '@react-navigation/native'
import LoaderContext from '../../contexts/Loader'
import AuthContext from '../../contexts/Auth'
import customAxios from '../../CustomeAxios'
import reactotron from 'reactotron-react-native'
import CommonItemCard from '../../Components/CommonItemCard'

const TagScreen = ({route}) => {

    const { item } = route?.params

    const navigation = useNavigation()
    const loadingContex = useContext(LoaderContext)
    const userContext = useContext(AuthContext)
    const  [products, setProducts] = useState([])

    const { width, fontScale, height } = useWindowDimensions()

    //let imageWidth = width/6

    const styles = makeStyles(height);



    const previous = useCallback(() => {
        navigation.goBack()
    }, [])


    useEffect(() => {
        getTagProducts()
    }, [item?._id])
    


    const getTagProducts = useCallback(async() => {
        loadingContex.setLoading(true)

        let data = {
            type: "panda",
            tag: item?._id,
            coordinates: userContext?.location

        }

        await customAxios.post(`customer/tag/list`, data)
            .then(async response => {
                setProducts(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContex.setLoading(false)
            })
    }, [item?._id])

    return (
        <>
            <HeaderWithTitle title={item?.name} onPressBack={previous} />
            <ScrollView
                style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loadingContex.loading} onRefresh={getTagProducts} />
                }>


                {/* <CommonTexts label={'Available Products'} my={15} ml={10} fontSize={13} /> */}
                <View style={styles.itemContainer}>
                    {products?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
                            width={width / 2.2}
                            height={250}
                        />
                    ))}
                </View>

            </ScrollView>
        </>
    )
}

export default TagScreen

const makeStyles = (height) => StyleSheet.create({
    mainImage: {
        width: '100%',
        height: height / 4,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'flex-end'
    },
    description: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 13,
        marginTop: 10
    },

    hotelView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },
    recommPdtBox: {
        marginTop: 15,
        marginBottom: 60,
        backgroundColor: '#76867314',
        paddingVertical: 5
    },
    restaurantView: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: '#F7F7F7',
        paddingVertical: 10
    },
    foodName: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    },
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },
})