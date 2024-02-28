import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import PandaContext from '../../contexts/Panda'
import NotificationDesign from './NotificationDesign'
import reactotron from 'reactotron-react-native'
import Toast from 'react-native-toast-message'
import customAxios from '../../CustomeAxios'
import { useFocusEffect } from '@react-navigation/native'

const Notifications = () => {

    const { width } = useWindowDimensions()

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    const [notList, setNotList] = useState(null)
    const [isloading, setIsLoading] = useState(false)

    reactotron.log(notList, "notList")

    useFocusEffect(
        React.useCallback(() => {
            notData()
        }, [])
    );


    const notData = async () => {

        try {
            setIsLoading(true);
            const res = await customAxios.get(`customer/notifications`)
            if (res?.data?.status === 200 || 201) {
                setNotList(res?.data?.data)
            } else {
                throw "Internal server error"
            }
            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            Toast.show({
                type: 'error',
                text1: error
            });
        } finally {
            setIsLoading(false);
        }
    }

    // const notPress = async (id) => {
    //     try {
    //         const res = await customAxios.get(`admin/notification/list/${id}`)
    //         if (res?.data?.status === 200 || 201) {
    //             //notData()
    //             navigation.navigate('Home')
    //         } else {
    //             throw "Internal server error"
    //         }
    //     }
    //     catch (error) {
    //         Toast.show({
    //             type: 'error',
    //             text1: error
    //         });
    //     }
    // }

    const newData = ({ item }) => {
        return (
            <NotificationDesign
                data={item}
            //onpress={pressLinking}
            />
        )
    }

    const footerB = () => {
        return (
            <View style={{ height: 90 }} />
        )
    }

    const EmptyComp = () => {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                <Text style={{ fontFamily: "Poppins-SemiBold", color: "#d8d8d8", fontSize: 15 }}>No Notifications Found</Text>
            </View>
        )
    }


    return (
        <>

            <HeaderWithTitle title={'Notifications'} />

            <View style={{
                flex: 1,
                backgroundColor: "#fff",
                paddingVertical: 5
            }}>
                <FlatList
                    data={notList}
                    keyExtractor={(item) => item.job_id}
                    renderItem={newData}
                    refreshing={isloading}
                    onRefresh={notData}
                    ListEmptyComponent={EmptyComp}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={footerB}
                />
            </View>



        </>

    )
}

export default Notifications

const styles = StyleSheet.create({})