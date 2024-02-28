import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import reactotron from 'reactotron-react-native'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'

const NotificationDesign = ({ data }) => {

    //reactotron.log(data, "DATAPASSED")

    const navigation = useNavigation()

    const pressLinking = () => {
        navigation.navigate('homepage');
    }

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
        </TouchableOpacity>
    )
}

export default NotificationDesign

const styles = StyleSheet.create({})