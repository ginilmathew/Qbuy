import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import LoadingModal from '../../../../../Components/LoadingModal'
import customAxios from '../../../../../CustomeAxios'
import Toast from 'react-native-toast-message'
import AddressCard from './AddressCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthContext from '../../../../../contexts/Auth'
import { useNavigation } from '@react-navigation/native'
import AddressContext from '../../../../../contexts/Address'
import CartContext from '../../../../../contexts/Cart'

const SavedAddress = () => {

    const [loading, setLoading] = useState(false)
    const [addressList, setAddressList] = useState([])
    const userContext = useContext(AuthContext);
    const addressContext = useContext(AddressContext)
    const cartContext = useContext(CartContext);

    const navigation = useNavigation()


    useEffect(() => {
        getAddressList()
    }, [])
    


    const getAddressList = async () => {
        try {
            setLoading(true)
            let response = await customAxios.get(`customer/address/list`)
            setAddressList(response?.data?.data)
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error
            })
        }
        finally{
            setLoading(false)
        }
    }


    const selectAddress = async(item) => {
        let location = {
            latitude: item?.area?.latitude,
            longitude: item?.area?.longitude,
            address: item?.area?.address
        }

        await AsyncStorage.setItem("location", JSON.stringify(location))
        userContext.setLocation([item?.area?.latitude, item?.area?.longitude]);
        userContext.setCurrentAddress(item?.area?.address)
        addressContext.setCurrentAddress(item);
        cartContext.setDefaultAddress(item)
        navigation.navigate("green", { screen: "TabNavigator", params: { screen: 'home' } })
    }


    const renderAddress = ({item, index}) => {
        return(
            <AddressCard
                item={item}
                key={index}
                selected={item?.default}
                setSelected={selectAddress}
            />
        )
    }



    return (
        <View style={{ marginVertical: 10 }}>
            <Text>Saved Address</Text>
            <FlatList 
                data={addressList}
                keyExtractor={({item}) => item?._id}
                renderItem={renderAddress}
            />
            <LoadingModal isVisible={loading} />
        </View>
    )
}

export default SavedAddress

const styles = StyleSheet.create({})