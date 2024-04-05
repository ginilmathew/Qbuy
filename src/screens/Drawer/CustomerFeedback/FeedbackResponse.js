import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import customAxios from '../../../CustomeAxios';
import Toast from 'react-native-toast-message';
import reactotron from 'reactotron-react-native';
import FeedbackCard from './FeedbackCard';


const FeedbackRes = () => {

    const [loading, setLoading] = useState(false)
    const [feedbackList, setFeedbackList] = useState([])
    const { height } = useWindowDimensions();


    useEffect(() => {
        getFeedbacks()
    }, [])


    const getFeedbacks = async () => {
        try {
            setLoading(true)
            let response = await customAxios.get(`customer/get-complaints`)
            setFeedbackList(response?.data?.data)
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error
            })
        }
        finally {
            setLoading(false)
        }
    }

    const ListEmptyComponents = () => {
        return (
            <View style={{ height: height / 1.3, alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins-Medium', }}>
                <Text style={{ fontSize: 18 }}>No Feedbacks Found!..</Text>
            </View>
        )
    }

    const renderFeedbacks = ({ item, index }) => {
        return (
            <FeedbackCard key={index} item={item} refreshOrder={getFeedbacks} />
        )
    }

    return (
        <>
            <HeaderWithTitle title={'Feedback Responses'} />
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getFeedbacks}

                    />
                }
                data={feedbackList}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                removeClippedSubviews={true}
                windowSize={10}
                maxToRenderPerBatch={5}
                //keyExtractorCategory={keyExtractorOrder}
                refreshing={loading}
                onRefresh={getFeedbacks}
                style={{ backgroundColor: "#fff" }}
                ListEmptyComponent={ListEmptyComponents}
                // contentContainerStyle={{ paddingBottom: 150, paddingTop: 10, paddingHorizontal: 10, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', minHeight: height-160}}
                renderItem={renderFeedbacks}
            />
        </>
    )
}

export default FeedbackRes

const styles = StyleSheet.create({})