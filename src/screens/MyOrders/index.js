import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import CommonTexts from '../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../Components/CustomButton'
import OrderCard from './OrderCard'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import PandaContext from '../../contexts/Panda'
import LoaderContext from '../../contexts/Loader'
import AuthContext from '../../contexts/Auth'
import customAxios from '../../CustomeAxios'
import Toast from 'react-native-toast-message';
import { FlatList } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'


const MyOrders = () => {

    const { height } = useWindowDimensions();
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingg = useContext(LoaderContext)
    const user = useContext(AuthContext)
    let loader = loadingg?.loading

    const [orderList, setOrderList] = useState([]);
    const [isLoading,setIsLoading]=useState(false);


  


    const getOrderList = async () => {
       setIsLoading(true)
        await customAxios.get(`customer/order/list/${contextPanda?.active}`)
            .then(async response => {
                setOrderList(response?.data?.data)
               setIsLoading(false)
            })
            .catch(async error => {
             
                Toast.show({
                    type: 'error',
                    text1: error
                });
                setIsLoading(false)
            })
    }



    useFocusEffect(
        React.useCallback(() => {
            getOrderList()
        }, [])
      );
    

    const keyExtractorOrder = (item) => item?._id;

    const renderOrder = ({ item, index }) => {
        return (
            <View>
                <OrderCard key={index} item={item} refreshOrder={getOrderList} />
            </View>
        )
    }

    const ListEmptyComponents = () => {
        return (
            <View style={{ height: height / 1.3, alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins-Medium', }}>
                <Text style={{ fontSize: 18 }}>No Order Found!..</Text>
            </View>
        )
    }

    return (
        <View>
            <HeaderWithTitle title={'My Orders'} noBack />
           
                <FlatList
                    
                    refreshControl={
                        <RefreshControl
                          refreshing={isLoading}
                          onRefresh={getOrderList}
                   
                        />
                      }
                    data={orderList}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={4}
                    removeClippedSubviews={true}
                    windowSize={10}
                    maxToRenderPerBatch={4}
                    keyExtractorCategory={keyExtractorOrder}
                    refreshing={isLoading}
                    onRefresh={getOrderList}
                    // style={{ marginLeft: 5 }}
                    ListEmptyComponent={ListEmptyComponents}
                    contentContainerStyle={{ justifyContent: 'center' , paddingBottom: 150, paddingTop: 10, paddingHorizontal: 10, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff'}}
                    renderItem={renderOrder}
                />
         
        </View>
    )
}

export default MyOrders

const styles = StyleSheet.create({
    emptyMessageStyle: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',

        fontSize: 16,
        marginTop: '80%',
    }
})