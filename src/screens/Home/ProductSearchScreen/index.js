import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from 'react-native'
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

    const [isloading,setIsLoading]=useState(false)




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
            await customAxios.post(`customer/product-search`, datas)
                .then(async response => {
                    setFilterResult(response?.data?.data)
                })
                .catch(async error => {
                    // Toast.show({
                    //     type: 'error',
                    //     text1: error
                    // });
                }).finally(() =>{
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000);
                })
        }
        else{
            setIsLoading(false)
        }

    }, [])

    reactotron.log({filterResult})



    

    function header(){
        return(
            <CustomSearch
                values={text}
                mb={2}
                control={control}
                error={errors.name}
                fieldName="name"
                placeholder='Search...'
                onChangeText={filterResults}
                autoFocus={true}
                setIsLoading={(value) =>setIsLoading(value)}
            />
        )
    }


    const renderResult = ({item, index}) => {
        return(
            <SearchResultsCard item={item} key={index} />
        )
    }

    return (
        <>
            <HeaderWithTitle title={'Search Items...'} />
            
            {/* <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    flex: 1,
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                }}
            > */}
                

                <View style={{ height:'90%', backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' }}>
                {header()}
                    <FlatList 
                        data={filterResult}
                        style={{ 
                            flexGrow: 1,
                            padding: 10
                        }}
                        keyExtractor={(item) => item?._id}
                        renderItem={renderResult}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => <View 
                            style={{ height: 200, justifyContent:'center', alignItems:'center' }} >
                                {isloading ? <ActivityIndicator /> : <Text>No result found</Text>}
                            </View>}
                    />
                    
                </View>
            {/* </ScrollView> */} 
        </>
    )
}

export default ProductSearchScreen

const styles = StyleSheet.create({

})