import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonTexts from '../../../Components/CommonTexts'
import PandaContext from '../../../contexts/Panda'
import AuthContext from '../../../contexts/Auth'
import { navigate } from '../../../Navigations/RootNavigation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import reactotron from 'reactotron-react-native'

const AddressCard = memo(({ setSelected, selected, item, deleteSelect, mode }) => {



    const navigation = useNavigation()
    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    let active = contextPanda.active



    const onClick = useCallback((id) => {
        //   navigate("LocationScreen", { editAddress: item })
        setSelected(id)
    }, [])

    const deleteAddress = (id) => {
        deleteSelect(id)
        // const data = {
        //     location: item?.area?.address,
        //     city: item?.area?.location,
        //     latitude: item?.area?.latitude,
        //     longitude: item?.area?.longitude
        // }
        // navigation.navigate('AddDeliveryAddress', { item: { ...data } })
    }

    //const renderAddress = () => {
        //if (mode === "checkout") {
            return (
                <TouchableOpacity onPress={() => onClick(item?._id)} style={styles.container}>
                    <View style={{ marginHorizontal: 5 }}>
                        <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} size={20} />
                    </View>
                    <View style={{ flex: 0.9 }}>
                        {/* <View style={styles.rowStyle}>
                        <CommonTexts label={item?.address_type} fontSize={13} textTransform={'uppercase'} />{!selected ? <TouchableOpacity style={styles.borderStyle}>
                            <Text style={styles.textStyle}>{ mode === "checkout" ? "Select" : "Set Default" } </Text>
                        </TouchableOpacity> : <Text style={styles.textStyle}>Default</Text>}
                    </View> */}
                        <Text style={styles.addressText}>{item?.name}</Text>
                        <Text
                            style={styles.addressText}
                        >{item?.area?.address}</Text>
                        {(!selected && deleteSelect) &&
                            <Pressable onPress={() => deleteAddress(item?._id)} style={{ alignSelf: 'flex-end' }}>
                                <MaterialCommunityIcons name={'delete'} color={"red"} size={18} marginTop={5} />
                            </Pressable>}
                    </View>

                    <Text
                        style={{
                            fontFamily: 'Poppins-Bold',
                            color: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#31AF48',
                            fontSize: 11,
                            marginTop: 5,
                            position: 'absolute',
                            right: 10
                        }}
                    >{item?.default ? 'DEFAULT' : null}</Text>
                </TouchableOpacity>
            )
        // }
        // else {
        //     return (
        //         <View
        //             // disabled={selected}
        //             //onPress={() => onClick(item?._id)}
        //             style={styles.container}
        //         >
        //             {renderAddress()}
        //             <View style={{ marginHorizontal: 5 }}>
        //                 <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} size={20} />
        //             </View>
        //             <View style={{ flex: 0.9 }}>
        //                 {/* <View style={styles.rowStyle}>
        //             <CommonTexts label={item?.address_type} fontSize={13} textTransform={'uppercase'} />{!selected ? <TouchableOpacity style={styles.borderStyle}>
        //                 <Text style={styles.textStyle}>{ mode === "checkout" ? "Select" : "Set Default" } </Text>
        //             </TouchableOpacity> : <Text style={styles.textStyle}>Default</Text>}
        //         </View> */}
        //                 <Text style={styles.addressText}>{item?.name}</Text>
        //                 <Text
        //                     style={styles.addressText}
        //                 >{item?.area?.address}</Text>
        //                 {(!selected && deleteSelect) &&
        //                     <Pressable onPress={() => deleteAddress(item?._id)} style={{ alignSelf: 'flex-end' }}>
        //                         <MaterialCommunityIcons name={'delete'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#5871D3'} size={18} marginTop={5} />
        //                     </Pressable>}
        //             </View>

        //             <Text
        //                 style={{
        //                     fontFamily: 'Poppins-Bold',
        //                     color: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#31AF48',
        //                     fontSize: 11,
        //                     marginTop: 5,
        //                     position: 'absolute',
        //                     right: 10
        //                 }}
        //             >{item?.default ? 'DEFAULT' : null}</Text>
        //         </View>
        //     )
        // }
    //}
})

export default AddressCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: '#E9E9E9',
        paddingVertical: 8,
    },
    addressText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    borderStyle: {

    },
    textStyle: {
        fontSize: 12,
        margin: 1,
        color: 'black',
        fontWeight: '600',
        marginRight: -15, color: '#8ED053'
    }

})