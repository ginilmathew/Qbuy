import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Dropdown } from 'react-native-element-dropdown';
import PandaContext from '../contexts/Panda';
import reactotron from 'reactotron-react-native';
import { useFocusEffect } from '@react-navigation/native';

const CommonSelectDropdown = ({topLabel, mb, placeholder, data, value, setValue, search, height, mt, width, shadowOpacity, elevation, flex, index, fieldName, onChange, error, setError }) => {


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const [isFocus, setIsFocus] = useState(false);
    const [item, setItem] = useState(value);

    useFocusEffect(useCallback(() => {
        setItem(value)
    }, [value]))

    const datas = data?.map(opt => {
        return {
            label: opt,
            value: opt
        }
    }) 



    // const renderLabel = () => {
    //     if (values || isFocus) {
    //       return (
    //         <Text style={[styles.label, isFocus && { color: 'blue' }]}>
    //           Dropdown label
    //         </Text>
    //       );
    //     }
    //     return null;
    // };

    const setFocus = () => {
        setIsFocus(true)
    }

    const offFocus = () => {
        setIsFocus(false)
    }

    const changeValue = (item) => {

        reactotron.log({item})
        if (onChange) onChange(item?.label, index)
        if(setValue){
            setValue(fieldName, item?.label);
            setError(fieldName, { type: 'custom', message: null })
        }
        
        setItem(item?.label)
        setIsFocus(false);
    }

    const rightIcon = () => (
        <Ionicons name={ isFocus ? 'chevron-up-circle' : 'chevron-down-circle'} size={25} color={ contextPanda.active === "green" ? '#8ED053' : contextPanda.active === "fashion" ? '#FF7190' : "#58D36E"} />
    )
    

  return (
    <View style={{marginBottom: mb, marginHorizontal:1, marginTop: mt, width:width, flex: flex}}>
        {/* {renderLabel()} */}
        <Text
            style={{
                fontFamily: 'Poppins-Regular',
                color: '#000',
                fontSize: 11,
                marginLeft:5
            }}
        >{topLabel}</Text>
        <Dropdown
            style={{
                height: height ? height : 48,
                borderColor: 'gray',
                borderRadius: 8,
                paddingHorizontal: 8,
                backgroundColor: active === 'green' || active === 'fashion' ? '#fff' : '#F2F2F2',
                shadowOpacity: shadowOpacity,
                shadowRadius: 5,
                elevation: elevation,
                shadowOffset: { width: 1, height: 5 },
                
                marginTop:3,
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={datas}
            search = {search ? search : null} 
            maxHeight={300}
            labelField="label"
            valueField="label"
            placeholder={!isFocus ? placeholder ? placeholder : '' : '...'}
            searchPlaceholder="Search..."
            value={item}
            onFocus={setFocus}
            onBlur={offFocus}
            onChange={changeValue}
            renderRightIcon={rightIcon}
            itemTextStyle={styles.dropdownText}
        />

          {error && <Text style={styles.errorText}>{error?.message}</Text>}
    </View>
  )
}

export default CommonSelectDropdown

const styles = StyleSheet.create({
    dropdown: {
        height: 48,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor:'#F2F2F2',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        shadowOffset: { width: 1, height: 5 },
        marginTop:3,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 13,
        color:'#23233C'
    },
    placeholderStyle: {
        fontSize: 13,
        color:'#23233C',
        fontFamily:'Poppins-LightItalic'
    },
    selectedTextStyle: {
        fontSize: 13,
        fontFamily:'Poppins-Regular',
        color:'#23233C',
    },
 
    inputSearchStyle: {
        height: 40,
        fontSize: 13,
        color:'#23233C'
    },
    errorText: {
        fontFamily: 'Poppins-Regular',
        color: 'red',
        fontSize: 11,
    },
    dropdownText: {
        fontSize: 13,
        fontFamily:'Poppins-Regular',
        color:'#23233C',
    },
})