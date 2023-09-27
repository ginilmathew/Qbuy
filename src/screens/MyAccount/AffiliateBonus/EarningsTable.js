import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EarningsTable = ({totalDownloads, totalOrders,todaysOrders}) => {
    return (
        <View 
            style={{ borderWidth:1, 
                borderColor:'#E9E9E9', 
                borderRadius:15,  
                marginTop:20
            }}
        >
            <View style={{flexDirection:'row' , borderColor:"#E9E9E9", borderBottomWidth:1}}>
                <View style={styles.labelView}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'#23233C', fontSize:16}}>Total Downloads</Text>
                </View>
                <View style={styles.countView}>
                    <Text style={{fontFamily:'Poppins-ExtraBold', color:'#000000', fontSize:18}}>{totalDownloads}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row' , borderColor:"#E9E9E9", borderBottomWidth:1}}>
                <View style={styles.labelView}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'#23233C', fontSize:16}}>Total Orders</Text>
                </View>
                <View style={styles.countView}>
                    <Text style={{fontFamily:'Poppins-ExtraBold', color:'#000000', fontSize:18}}>{totalOrders}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row' , borderColor:"#E9E9E9"}}>
                <View style={styles.labelView}>
                    <Text style={{fontFamily:'Poppins-Regular', color:'#23233C', fontSize:16}}>Todays Orders</Text>
                </View>
                <View style={styles.countView}>
                    <Text style={{fontFamily:'Poppins-ExtraBold', color:'#000000', fontSize:18}}>{todaysOrders}</Text>
                </View>
            </View>
        </View>

    )
}

export default EarningsTable

const styles = StyleSheet.create({
    labelView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.7, 
        paddingVertical:8, 
        borderRightWidth:1, 
        borderColor:"#E9E9E9"
    },
    countView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.4,  
        borderRightWidth:1, 
        borderColor:"#E9E9E9"
    },
})