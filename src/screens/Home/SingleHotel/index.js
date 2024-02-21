import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import CommonFiltration from '../../../Components/CommonFiltration'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import CommonItemSelect from '../../../Components/CommonItemSelect'
import PandaContext from '../../../contexts/Panda'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CommonTexts from '../../../Components/CommonTexts'
import CommonRating from '../../../Components/CommonRating'
import StoreAddressCard from '../Category/StoreAddressCard'
import CommonItemCard from '../../../Components/CommonItemCard'
import customAxios from '../../../CustomeAxios'
import LoaderContext from '../../../contexts/Loader'
import Toast from 'react-native-toast-message'


const SingleHotel = ({ route, navigation }) => {

    const storeName = route?.params?.storeName

    const item = route?.params?.item


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading


    const [selected, setSelected] = useState(false)
    const [storeDetails, setStoreDetails] = useState([])


    const { width } = useWindowDimensions()


    datas = [
        {
            _id: '1',
            name: 'Biriyani'
        },
        {
            _id: '2',
            name: 'Fresh Meat'
        },
        {
            _id: '3',
            name: 'Lunch Box'
        },
        {
            _id: '4',
            name: 'Veggies'
        },
        {
            _id: '5',
            name: 'Farm Pick'
        },

    ]

    const backAction = useCallback(() => {
        navigation.navigate('CartNav')
    })

    const backtoOrders = useCallback(() => {
        navigation.navigate('MyOrderNav')
    })
    useEffect(() => {
        getStoreDetails()
    }, [])

    const getStoreDetails = async () => {
        loadingContex.setLoading(true)

        await customAxios.post(`customer/store/${item?._id}`)
            .then(async response => {
                setStoreDetails(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContex.setLoading(false)
            })
    }


    return (
        <>
            <HeaderWithTitle 
                title={storeName} 
                // onPressBack={mode === 'cartItem' ? backAction : mode === 'orderItem' ? backtoOrders : null} 
                />
            <ScrollView style={{ flex: 1, backgroundColor:active === "green" ? '#F4FFE9' : active === "fashion" ? '#FFF5F7' : '#fff',  }}>
                <View style={{ paddingHorizontal: 10 }}>
                    {/* <FastImage
                        source={require('../../../Images/hotel.jpeg')}
                        style={styles.hotelImage}
                        borderRadius={15}
                    >
                    </FastImage> */}
                    <StoreAddressCard />
                    <Text
                        style={styles.descriptionText}
                    >{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."}</Text>
                </View>

                {/* <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.itemsView}
                >
                    {datas?.map((item, index) =>
                        <CommonItemSelect
                            item={item} key={index}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    )}
                </ScrollView> */}

                {active === 'green' || active === 'fashion' ? null : <CommonFiltration margin={10} />}

                {/* <CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={5} />
                <View style={styles.menuContainer}>
                    {foodItems?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
                            width={width / 2.2}
                            height={250}
                        />
                    ))}
                </View> */}


            </ScrollView>
        </>
    )
}

export default SingleHotel

const styles = StyleSheet.create({
    descriptionText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 13,
        alignSelf: 'center',
        marginTop: 10
    },
    hotelImage: {
        width: '100%',
        height: 200,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 15
    },
    itemsView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 20
    },
    itemName: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        paddingVertical: 8
    },
    hotelsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    }
})