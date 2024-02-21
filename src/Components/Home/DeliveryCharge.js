import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'


const DeliveryCharge = ({item, onClick, active, selected}) => {
  return (
    <TouchableOpacity
            onPress={onClick}
            style={styles.container}
        >
            <Ionicons name={selected === true ? 'checkmark-circle' : 'ellipse-outline'} color = { active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} size={20}/>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text   
                    style={{
                        color: item?.charge_name === 'Express Delivery' ? '#FF6600' : '#23233C',
                        fontFamily: 'Poppins-Medium',
                        fontSize:12,
                        marginLeft:5
                    }}
                >{`${item?.charge_name} (${item?.time_label})`}</Text>
                <Text style={{ color: '#089321', fontWeight: '900', fontSize: 16, fontFamily: 'Poppins-Bold', }}>{` ₹ ${item?.charge_value}`}</Text>
            </View>
        </TouchableOpacity>
  )
}

export default DeliveryCharge

const styles = StyleSheet.create({
    container : {  
        flexDirection:'row', 
        alignItems:'center', 
        marginRight:10,
        marginTop:10
    },
    textSemi: {
        
    },
    textExtra: {
        fontFamily: 'Poppins-ExtraBold',
        fontSize:13,
        color:'#089321',
        marginHorizontal:2
    }
})