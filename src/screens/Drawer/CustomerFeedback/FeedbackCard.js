import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import reactotron from 'reactotron-react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { navigationRef } from '../../../Navigations/RootNavigation'

const FeedbackCard = ({ item }) => {

    //reactotron.log(item, "Fed")

    const renderStatus = () => {
        if (item?.status === "processing") {
            return (
                <Text style={{ fontFamily: "Poppins-SemiBold", color: "#D38758" }}>{item?.status}</Text>
            )
        } else if (item?.status === "resolved") {
            return (
                <Text style={{ fontFamily: "Poppins-SemiBold", color: "#12A22B" }}>{item?.status}</Text>
            )
        } else if (item?.status === "picked") {
            return (
                <Text style={{ fontFamily: "Poppins-SemiBold", color: "#5861D3" }}>{item?.status}</Text>
            )
        }
    }

    const responsePage = () => {
        navigationRef.navigate('Respo', { item: item })
    }

    return (
        <TouchableOpacity style={{ backgroundColor: "#FAFAFA", padding: 15, borderRadius: 11, margin: 10 }} onPress={responsePage}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <Text style={{ fontFamily: "Poppins-LightItalic" }}>{moment(item?.updated_at).format("DD-MM-YYYY hh:mm A")}</Text>
                {renderStatus()}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    {item?.order_id ?
                        (<View style={{ flexDirection: "row" }}>
                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}>Order ID : </Text>
                            <Text style={{ fontFamily: "Poppins-Bold", fontSize: 14 }}>{item?.order_id}</Text>
                        </View>) : null}
                    <View style={{ flexDirection: "row", width: "75%" }}>
                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}>Comments : </Text>
                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 14 }}>{item?.complaint.length > 45 ? item?.complaint.slice(45) + "..." : item?.complaint}</Text>
                    </View>
                </View>
                <View>
                    <Ionicons name={"arrow-forward"} size={25} color='#58D36E' />
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default FeedbackCard

const styles = StyleSheet.create({})