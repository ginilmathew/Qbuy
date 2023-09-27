import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PandaContext from '../../contexts/Panda'


const ListCard = ({ label, pandaCoin, onPress, onValueChange, icon, DntshowRightArrow, noBorder, img }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    return (

        <TouchableOpacity
            onPress={onPress}
            style={{ marginTop: 20, borderBottomWidth: noBorder ? 0 : 1, borderBottomColor: '#00000014', paddingBottom: 20 }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {icon}
                {img && <Image
                    style={{ width: 15, height: 15 }}
                    resizeMode='contain'
                    source={img}
                />}
                <View style={styles.labelView}>
                    <Text style={styles.labelText}>{label}</Text>
                    {pandaCoin && <View
                        style={{
                            backgroundColor: active === "fashion" ? '#d0e2f7' : '#FFF297',
                            borderRadius: 5,
                            alignItems: 'center',
                            marginLeft: 5
                        }}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Bold',
                                color: active === "fashion" ? '#2D8FFF' : '#F39E2B',
                                fontSize: 10,
                                paddingHorizontal: 15,
                                paddingVertical: 3
                            }}
                        >{pandaCoin}</Text>
                    </View>}
                </View>
                {!DntshowRightArrow && <AntDesign name={"arrowright"} color={active === 'green' ? '#8ED053' : active === "fashion" ? '#FF7190' : "#58D36E"} size={18} />}
            </View>

        </TouchableOpacity>
    )
}

export default ListCard

const styles = StyleSheet.create({
    labelView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    labelText: {
        color: '#23233C',
        fontSize: 13,
        fontFamily: 'Poppins-Medium',
        marginLeft: 5
    },


})