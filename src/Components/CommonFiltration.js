import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'

const CommonFiltration = ({ margin, onChange }) => {

    const [isEnabled, setIsEnabled] = useState(false);

    const [toggleCheckBox, setToggleCheckBox] = useState(false)


    const toggleSwitch = useCallback(() =>{ 
        setToggleCheckBox(true)
        if(isEnabled){
            onChange("veg")
        }
        else{
            onChange("non-veg")
        }
        setIsEnabled(previousState => !previousState)
    }, [isEnabled])

    const clickCheckbox = useCallback(() =>{ 
        if(toggleCheckBox){
            onChange("all")
        }
        else{
            if(isEnabled){
                onChange("non-veg")
            }
            else{
                onChange("veg")
            }
        }
        setToggleCheckBox(!toggleCheckBox)
    }, [toggleCheckBox])

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', margin }}>
            <View style={{flexDirection:'row', alignItems:'center', marginRight:10}}>
                <TouchableOpacity onPress={clickCheckbox}>
                    <Ionicons name={"md-checkbox"} size={17} color={toggleCheckBox ? "#A9A9A9" : '#30B948'} />
                </TouchableOpacity>
                <Text style={styles.textStyle}
                >{'All'}</Text>
            </View>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={"circle-box-outline"} size={18} color='#30B948' />
                <Text style={styles.regularText}>{'Veg'}</Text>
            </View>
            <Switch
                trackColor={{ false: '#ebfce1', true: '#fcd9dc' }}
                thumbColor={isEnabled ? '#EC3D3D' : '#30B948'}
                ios_backgroundColor="#ebfce1"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
            />
            <View style={styles.iconContainer}>
                <FontAwesome name={"toggle-up"} size={16} color='#EC3D3D' />
                <Text style={styles.regularText}>{'Non-veg'}</Text>
            </View>
        </View>
    )
}

export default CommonFiltration

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    regularText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11, marginLeft: 2
    },
    textStyle:{
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize:  11,
    }
})