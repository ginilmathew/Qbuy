import { StyleSheet, TextInput, Image, View, TouchableOpacity } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Controller } from 'react-hook-form'
import CommonSquareButton from './CommonSquareButton'
import { useFocusEffect } from '@react-navigation/native'
import _debounce from 'lodash/debounce';


const CustomSearch = ({ placeholder, control, fieldName, error, placeHoldeColor, width, keyboardType, mt, mb, onPress, onChangeText, readonly, autoFocus,values, setIsLoading }) => {

    const debounceFn = useCallback(_debounce((value) => {
        onChangeText(value)
    }, 1000), []);

    const textRef = useRef(null);

    const [value, setValue] = useState('');

    useFocusEffect(
        useCallback(() => {
            if (autoFocus) {
                textRef.current.focus();
            }
            setValue(null)
        }, []),
    );

    function handleChange (value) {
        setIsLoading(true)
        setValue(value);
        debounceFn(value);
    };

    return (

        <>
            <View
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginTop: 30,
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 2,
                    shadowOffset: { width: 1, height: 5 },
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 1,
                    justifyContent: 'space-between',
                    marginHorizontal: 18,
                }}
            >

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur } }) => (
                        <TextInput
                            ref={textRef}
                            onPressIn={onPress}
                            isReadOnly={readonly}
                            focusable={true}
                            mt={mt}
                            mb={mb}
                            width={width}
                            onBlur={onBlur}
                            onChangeText={onChangeText ? handleChange : onChange}
                            value={value}
                            variant="unstyled"
                            placeholder={placeholder}
                            backgroundColor={'#fff'}
                            placeholderTextColor={placeHoldeColor ? placeHoldeColor : '#0C256C21'}
                            borderColor={0}
                            keyboardType={keyboardType}
                            paddingLeft={20}
                            flex={1}
                            fontFamily='Poppins-SemiBold'
                            fontSize={12}
                            borderRadius={15}
                            color='#000'
                            autoFocus={autoFocus}
                        />
                    )}
                    name={fieldName}
                />
                {/* <View style={styles.search}>
                    <Ionicons name='search' color='#fff'  size={25}/> 

                </View> */}
                <CommonSquareButton iconName={'search'} onPress={onPress} />
            </View>
            {error && <Text fontFamily={"body"} fontWeight={500} color={"red.500"} fontSize={11}>{error?.message}</Text>}
        </>
    )
}

export default CustomSearch


const styles = StyleSheet.create({

})