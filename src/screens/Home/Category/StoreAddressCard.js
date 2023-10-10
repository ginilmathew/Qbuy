import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PandaContext from '../../../contexts/Panda'

const StoreAddressCard = ({address}) => {

    const { height } = useWindowDimensions()

    const styles = makeStyles(height)

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    return (
        <View style={styles.container}>
            <Ionicons name='location-sharp' color={active === 'fashion' ? '#FF7190' : active === 'green' ? '#8ED053' : '#58D36E'} size={15}/>
            <Text style={styles.regularText}>{address}</Text>
        </View>
    )
}

export default StoreAddressCard

const makeStyles = height =>  StyleSheet.create({
    container: {
        flexDirection:'row', 
        marginTop:10,
        paddingRight:5
    },
    regularText: {
        fontFamily:'Poppins-Regular', 
        fontSize:height*0.012, 
        color:'#23233C', 
        marginLeft:5
    }
})