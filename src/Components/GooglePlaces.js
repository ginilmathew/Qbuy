import { View, Text } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { Controller } from 'react-hook-form'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PandaContext from '../contexts/Panda'

const GooglePlaces = ({ fieldName, control, topLabel, setValue, setError, bottom, setDistance }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const addLoc = (_, data) => {
        setValue(fieldName, data?.formatted_address);
        setError(fieldName, { type: 'custom', message: null })


        if (setDistance) {
            setDistance(distance => {
                return {
                    ...distance, [fieldName]: {
                        location: data?.geometry?.location,
                        string: data?.formatted_address
                    }
                }
            })
        }
        // location: {
        //     latitude: data?.geometry?.location?.lat,
        //     longitude: data?.geometry?.location?.lng
        // }

        // navigation.navigate(ADD_ADDRESS, { path: route?.params?.path })
    }

    const renderRow = (data) => (
        <View style={{ pointerEvents: 'none' }}>
            <TouchableOpacity>
                <Text>{data?.structured_formatting?.main_text}</Text>
                <Text>{data?.structured_formatting?.secondary_text}</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ fieldState: { error }, field: { onChange } }) => (
                <>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#000',
                            fontSize: 11,
                            marginLeft: 5,
                            marginTop: 14
                        }}
                    >{topLabel}</Text>

                    <GooglePlacesAutocomplete
                        isRowScrollable
                        keyboardShouldPersistTaps='always'
                        placeholder={'Search Location ...'}
                        textInputProps={{ onChange }}
                        fetchDetails
                        minLength={2}
                        enablePoweredByContainer={false}
                        listViewDisplayed={false}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        renderRow={renderRow}
                        styles={{
                            textInput: {
                                color: 'black',
                                backgroundColor: active === 'green' || active === 'fashion' ? '#fff' : '#F2F2F2'
                            },
                            description: {
                                fontWeight: 'bold',
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },

                            listView: {
                                color: 'black', //To see where exactly the list is
                                zIndex: 1000, //To popover the component outwards
                            },
                        }}
                        onPress={addLoc}
                        query={{
                            key: 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY',
                            language: 'en'
                        }}
                    />

                    {
                        error && (
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                color: 'red',
                                fontSize: 11,
                            }}>
                                {error?.message}
                            </Text>
                        )
                    }
                </>
            )}
        />
    )
}

export default GooglePlaces