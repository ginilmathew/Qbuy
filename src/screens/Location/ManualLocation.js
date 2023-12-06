import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const ManualLocation = () => {
    return (
        <SafeAreaView>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, marginHorizontal: 10, marginTop: 10 }}>
                <FontAwesome5 name="arrow-left" style={{ marginRight: 10, fontSize: 20 }} />
                <Text style={{ fontSize: 16 }}>Enter your name or apartment name</Text>
            </View>
            <View style={{ padding: 5 }}>
            <GooglePlacesAutocomplete
                autoFocus={false}
                styles={{
                    container: {
                        // Custom container styles
                        //backgroundColor: 'white',
                        borderBottomWidth: 1,
                        borderColor: 'lightgray',
                        borderRadius: 5,
                        marginTop: 10,
                    },
                    textInputContainer: {
                        // Custom styles for the container containing the input field
                        //backgroundColor: 'white',
                        borderTopWidth: 0, // Remove top border
                        borderBottomWidth: 0, // Remove bottom border
                        paddingLeft: 10, // Add left padding
                        borderColor: 'gray'
                    },
                    textInput: {
                        // Custom input field styles
                        height: 40,
                        fontSize: 16,
                    },
                    listView: {
                        // Custom styles for the suggestion list
                        backgroundColor: 'white', // Background color of the suggestion list
                    },
                }}
                returnKeyType={'default'}
                fetchDetails={true}
                placeholder='Try Ramachandranagar, Kazhakootam,...'
                keyboardAppearance={'light'}
                textInputProps={{
                    placeholderTextColor: 'gray',
                    returnKeyType: 'search',
                }}
                keyboardShouldPersistTaps='always'
                onPress={async (data, details = null) => {
                    let Value = {
                        location: data?.description,
                        city: details?.address_components?.filter(st =>
                            st.types?.includes('locality')
                        )[0]?.long_name,
                        latitude: details?.geometry?.location?.lat,
                        longitude: details?.geometry?.location?.lng,
                    };

                    addressContext.setCurrentAddress(Value);

                    navigation.navigate('LocationScreen', { mode: route?.params?.mode });
                }}
                query={{
                    key: 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY',
                    language: 'en',
                    components: 'country:in'

                }}
                renderRow={(rowData) => {
                    const title = rowData.structured_formatting.main_text;
                    const address = rowData.structured_formatting.secondary_text;

                    return (
                        <View>
                            <Text style={{ fontSize: 14 }}>{title}</Text>
                            <Text style={{ fontSize: 14 }}>{address}</Text>
                        </View>
                    );
                }}
            />
            </View>
        </SafeAreaView>
    )
}

export default ManualLocation

const styles = StyleSheet.create({})