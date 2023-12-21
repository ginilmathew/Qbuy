import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useContext, useState, useEffect, useCallback, } from 'react'
import PandaContext from '../../../contexts/Panda'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CustomSearch from '../../../Components/CustomSearch'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import customAxios from '../../../CustomeAxios'
import LoaderContext from '../../../contexts/Loader'
import { IMG_URL, env, location } from '../../../config/constants'
import SearchResultsCard from './SearchResultsCard'
import Toast from 'react-native-toast-message';
import AuthContext from '../../../contexts/Auth'
import reactotron from '../../../ReactotronConfig'
import { useFocusEffect } from '@react-navigation/native'


const ProductSearchScreen = ({ route }) => {

    const contextPanda = useContext(PandaContext)
    const loadingg = useContext(LoaderContext)
    const userContext = useContext(AuthContext)
    let active = contextPanda.active

    const [isloading,setisLoading]=useState(false)




    let loader = loadingg?.loading

    const [filterResult, setFilterResult] = useState([])
    const [datatrue, setdataTrue] = useState(true)

    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const [search, setSearch] = useState('')
    const [text, setText] = useState(null)

    const searchItem = useCallback((data) => {
        setSearch(data)
    }, [])


    const filterResults = useCallback(async (value) => {
        setText(value)
        if (value === '') {
            setFilterResult([])
        }
        let datas = {
            // coordinates: env === "dev" ? location : userContext?.location,
            coordinates: userContext?.location,
            search: value,
            type: active
        }
     



        if (value !== "") {
            loadingg.setLoading(true)
            await customAxios.post(`customer/product-search`, datas)
                .then(async response => {
                    setFilterResult(response?.data?.data)
                    loadingg.setLoading(false)
                })
                .catch(async error => {
                    // Toast.show({
                    //     type: 'error',
                    //     text1: error
                    // });
                    loadingg.setLoading(false)
                }).finally(
          
                    loadingg.setLoading(false)
                )
        }

    }, [filterResult, text])



    useFocusEffect(
        React.useCallback(() => {
            setText("")
            setFilterResult([])
        }, [])
    );

    return (
        <>
            <HeaderWithTitle title={'Search Items...'} />
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    flex: 1,
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                }}
            >
                <CustomSearch
                    values={text}
                    mb={2}
                    control={control}
                    error={errors.name}
                    fieldName="name"
                    placeholder='Search...'
                    onChangeText={filterResults}
                    autoFocus={true}
                />

                <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
                    {loader ? <ActivityIndicator /> : filterResult?.map((item, index) => (<SearchResultsCard item={item} key={index} setValue={setValue} />))}
                </View>
            </ScrollView>
        </>
    )
}

export default ProductSearchScreen

const styles = StyleSheet.create({

})