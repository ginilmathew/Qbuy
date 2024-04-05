import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import reactotron from 'reactotron-react-native'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import { useQuery, useMutation } from '@tanstack/react-query'
import customAxios from '../../CustomeAxios'


const readStatus = (id) => customAxios.post('customer/read-notification', {
    notification_id: id
})

const NotificationDesign = ({ data, notData }) => {

    //reactotron.log(data, "DATAPASSED")
    const { mutate } = useMutation({
        mutationKey: 'read_status',
        mutationFn: readStatus,
        onSuccess() {
            notData()
        }
    })

    const navigation = useNavigation()

    const pressLinking = useCallback(() => {

        const { read_status, order_id, complaint_id } = data;

        if (read_status && !order_id && !complaint_id) {
            return null
        }

        !read_status && mutate(data?._id)

        if (data?.order_id) {
            navigation.navigate('ViewDetails', { item: { _id: data?.order_id } });
        } else if (data?.complaint_id) {
            navigation.navigate('Respo', { item: { _id: data?.complaint_id } })
        } 
    

    }, [data])


    return (
        <TouchableOpacity
            style={{ paddingHorizontal: 23, width: "100%" }}
            onPress={pressLinking}
        >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: "#00294C" }}>{data?.type}</Text>
                </View>

                <View>
                    <Text style={{ fontSize: 12, color: "#A2A2A2", fontFamily: "Poppins-Regular" }}>{moment(data?.created_at).format("hh:mm A")}</Text>
                </View>
            </View>
            <View>
                <Text style={{ fontFamily: "Poppins-Regular", color: "#6F6F6F", fontSize: 13 }}>{data?.message}</Text>
            </View>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#d1d1d1", marginBottom: 5, marginTop: 15 }} />
            {/* <Divider my="5" thickness="0.5" /> */}

            {!data?.read_status &&
                <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: 'crimson',
                    position: 'absolute',
                    bottom: 13,
                    right: 25
                }} />}
        </TouchableOpacity>
    )
}

export default NotificationDesign

const styles = StyleSheet.create({})