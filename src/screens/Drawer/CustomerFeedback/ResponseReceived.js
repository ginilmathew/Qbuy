import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import reactotron from 'reactotron-react-native'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import moment from 'moment'

const ResponseReceived = ({ route }) => {

    let item = route?.params?.item

    reactotron.log(item, "From CArd")

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

    return (
        <>
            <HeaderWithTitle title={'Response'} />
            <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "space-between", paddingBottom: 50 }}>
                <View style={{ marginTop: 10, alignItems: "center" }}>
                    <Text style={{ fontFamily: "Poppins-LightItalic" }}>{moment(item?.updated_at).format("DD-MM-YYYY hh:mm A")}</Text>
                    {item?.order_id ? (<View style={{ flexDirection: "row" }}>
                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 20, color: "#000" }}>Order ID : </Text>
                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#000" }}>{item?.order_id}</Text>
                    </View>) : null}
                    {renderStatus()}
                </View>
                <View style={{ gap: 10 }}>
                    <View style={{ alignItems: "flex-start", marginHorizontal: 20 }}>
                        <Text style={{ color: "#F71C1C", fontFamily: "Poppins-Medium", fontSize: 10 }}>23/05/2023 11 : 00am</Text>
                        <Text style={styles.adChat}>ADMIN REPLY GOES HERE</Text>
                    </View>
                    <View style={{ alignItems: "flex-end", marginHorizontal: 20 }}>
                        <Text style={styles.cusChat}>{item?.complaint}</Text>
                    </View>
                </View>
            </View>
        </>
    )
}

export default ResponseReceived

const styles = StyleSheet.create({
    adChat: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#EFEFEF",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        fontFamily: "Poppins-Regular",
        color: "#000",
        fontSize: 15
    },
    cusChat: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#E6F9E9",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        fontFamily: "Poppins-Regular",
        color: "#000",
        fontSize: 15
    }
})