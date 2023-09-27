import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { memo, useCallback, useContext } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons'
import PandaContext from '../../../contexts/Panda';

const ChooseTip = memo(({setSelected, selected, item}) => {


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const onClick = useCallback(() => {
        setSelected(item?._id)
    },[])

    return (
        <TouchableOpacity
            onPress={onClick}
            style={{ flex: 0.22, minHeight: 40, borderWidth: 1, borderColor: selected === item?._id ? active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' : '#fff', borderRadius: 10, elevation: 10, alignItems: 'center', justifyContent: "center", marginLeft: 10, marginVertical: 10, shadowOpacity: 0.2, shadowRadius: 2, shadowOffset:{height:1,width:1}, backgroundColor: '#fff'}}
        >
            <Text style={{ fontFamily: 'Poppins-Regular', color: '#23233C', fontSize: 12, marginBottom: 3 }}>{item?.rate}</Text>

            {item?.most && <View style={{ backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', alignItems: 'center', justifyContent: 'center', borderRadius: 5, position: 'absolute', bottom: 0 }}>
                <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 6, marginHorizontal: 7 }}>{item?.most}</Text>
            </View>}

            {item?.most && <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FF6600', 'orange']}
                style={{ backgroundColor: '#58D36E', alignItems: 'center', justifyContent: 'center', borderRadius: 10, position: 'absolute', top: -8, right: -8, width: 17, height: 17 }}>
                <Ionicons name='star' color='#fff' size={12} />
            </LinearGradient>}

        </TouchableOpacity>
    )
})

export default ChooseTip

const styles = StyleSheet.create({})