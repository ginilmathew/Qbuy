import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { memo, useCallback, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import PandaContext from '../../../contexts/Panda'

const ChooseDeliveryType = memo(({setSelected, selected, item}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const onClick = useCallback(() => {
        setSelected(item?._id)
    },[])

    return (
        <TouchableOpacity
            onPress={onClick}
            style={{ flex: 0.5, minHeight: 70, borderWidth:  1, borderColor: selected === item?._id ? active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' : '#fff', borderRadius: 10, elevation: 10, alignItems: 'center', justifyContent:'center', marginRight:10, marginVertical: 10, shadowOpacity: 0.2, shadowRadius: 2, shadowOffset:{height:1,width:1}, paddingHorizontal:5, backgroundColor: '#fff'}}
        >
            <View style={{flex:0.3}}>
                <FontAwesome5 name={item?.iconName} color={ selected === item?._id ? active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' : '#A5A5A5'} size={20} marginTop={7}/>
            </View>
            <View style={{flex:0.5}}>
                <Text style={{ fontFamily: 'Poppins-Regular', color: '#23233C', fontSize: 9, marginTop:5, textAlign:'center'}}>{item?.name}</Text>
            </View>
            
            {selected === item?._id && <View
                style={{ backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', alignItems: 'center', justifyContent: 'center', borderRadius: 10, position: 'absolute', top: -8, right: -8, width: 17, height: 17 }}>
                <Ionicons name='checkmark-sharp' color='#fff' size={12} />
            </View>}
        </TouchableOpacity>
    )
})

export default ChooseDeliveryType

const styles = StyleSheet.create({})