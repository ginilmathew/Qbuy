import { FlatList, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import customAxios from '../CustomeAxios'
import { useQuery } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthContext from '../contexts/Auth'
import reactotron from 'reactotron-react-native'
import CategoriesCard from './Home/CategoriesCard'
import CommonItemCard from '../Components/CommonItemCard'
import Carousel from 'react-native-reanimated-carousel'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../config/constants'
import SearchBox from '../Components/SearchBox'
import NameText from './Home/NameText'
import CommonTexts from '../Components/CommonTexts'
import CommonFiltration from '../Components/CommonFiltration'


const homeData = async ({ queryKey }) => {
    //reactotron.log({datas})
    if (queryKey[1]) {
        const homeData = await customAxios.post('customer/home', queryKey[1]);
        let sliders = homeData?.data?.data?.[5];
        let newArray = [homeData?.data?.data?.[0], homeData?.data?.data?.[2], homeData?.data?.data?.[4], homeData?.data?.data?.[3]]
        return {
            items: newArray,
            sliders
        }
    }
    else {
        return null
    }
}

const PandaHome = () => {

    const navigation = useNavigation()
    const [datas, setDatas] = useState(null)
    const userContext = useContext(AuthContext)
    const { height, width } = useWindowDimensions();
    const [filter, setFilter] = useState('all')
    const [data, setData] = useState([])

    const { data: homeDatas, isLoading, refetch } = useQuery(['pandaHome', datas], homeData)


    useEffect(() => {
        setData(homeDatas)
    }, [homeDatas])


    useEffect(() => {
        if(filter !== "all"){
            let recentlyviewed = homeDatas?.items?.[1]?.data?.filter(prod => prod?.category_type === filter)
            let recents = {
                ...homeDatas?.items?.[1],
                data: recentlyviewed
            }

            let suggestions = homeDatas?.items?.[2]?.data?.filter(prod => prod?.category_type === filter)
            let pandaSuggestions = {
                ...homeDatas?.items?.[2],
                data: suggestions
            }


            let products = homeDatas?.items?.[3]?.data?.filter(prod => prod?.category_type === filter)
            let finalProducts = {
                ...homeDatas?.items?.[3],
                data: products
            }

            let datas = [homeDatas?.items?.[0], recents, pandaSuggestions, finalProducts]

            reactotron.log({datas}, filter)
            setData({
                items: datas,
                sliders: homeDatas?.sliders
            })
        }
    }, [filter])
    
    


    useFocusEffect(
        React.useCallback(() => {
            getDatas()

            return () => setDatas(null);
        }, [])
    );


    const getDatas = async () => {
        let location = await AsyncStorage.getItem("location");

        let locations = JSON.parse(location)
        reactotron.log({ location })
        let datas = {
            type: 'panda',
            coordinates: [locations?.latitude, locations?.longitude],
        }
        setDatas(datas)
        //refetch(datas)
    }


    


    const onClickDrawer = useCallback(() => {
        navigation.openDrawer()
    })

    const CarouselCardItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={`${index}${item?._id}`} onPress={() => CarouselSelect(item)} style={{ width: '100%', height: '85%', alignItems: 'center', marginTop: 20 }} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.original_image}` }}
                    style={{ height: '100%', width: '95%', borderRadius: 20 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        )
    }


    const renderItems = ({item, index}) => {

        return(
            <CommonItemCard
                    //key={`${index}${section?.type?.trim()}${section?.type}`}
                    item={item}
                    width={width / 3.5}
                    marginHorizontal={5}
                />
        )
    }


    const _renderItem = ({ section, index }) => {
        const items = [];
        if(section?.type === "categories"){
            let numColumns = 4;
            if (index % numColumns !== 0) return null;

            
    
            for (let i = index; i < index + numColumns; i++) {
                if (i >= section.data.length) {
                    break;
                }
    
                items.push(<CategoriesCard item={section.data[i]} key={`${index}${section?.type?.trim()}`} />);
            }

            return (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: '#fff'
                    }}
                >
                    {items}
                </View>
            );
        }
        else if(section?.type === "available_products"){
            let numColumns = 2;
            if (index % numColumns !== 0) return null;

            
    
            for (let i = index; i < index + numColumns; i++) {
                if (i >= section.data.length) {
                    break;
                }
                else if(filter !== "all" && section?.data?.[i]?.category_type !== filter){
                    break;
                }
    
                items.push(<CommonItemCard
                    item={section.data[i]}
                    key={`${i}${section.data[i]?.product_id}${section?.type}`}
                    width={width / 2.3}
                    height={height / 3.6}
                    mr={10}
                    ml={10}
                    mb={5}
                />);
            }

            return (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 5
                    }}
                >
                    {items}
                </View>
            );
        }
        else if(section?.type === "recentlyviewed" || section?.type === "suggested_products"){
            if(index > 0) {
                return;
            } 
            return (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ backgroundColor:'#fff', padding: 10 }}
                >
                    {filter === "all" ? section.data?.map(item => {
                        return(
                            <CommonItemCard
                                //key={`${index}${section?.type?.trim()}${section?.type}`}
                                item={item}
                                width={width / 3.5}
                                marginHorizontal={5}
                            />
                        )
                    }) :  section.data?.filter(prod => prod?.category_type === filter).map(item => {
                        return(
                            <CommonItemCard
                                //key={`${index}${section?.type?.trim()}${section?.type}`}
                                item={item}
                                width={width / 3.5}
                                marginHorizontal={5}
                            />
                        )
                    })}
                </ScrollView>
            );
        }

        
        
    };


    const listHeader = () => {
        return(
            <View style={{ backgroundColor: '#fff' }}>
            {data?.sliders?.data && <Carousel
                loop
                width={width}
                height={height / 5}
                autoPlay={true}
                data={data?.sliders?.data}
                scrollAnimationDuration={1000}
                renderItem={CarouselCardItem}
                
            />}
                <SearchBox onPress={onSearch} />
                <View style={{ marginHorizontal: 2 }}>
                    <NameText userName={ userContext?.userData ? userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile : "Guest"} mt={8} />
                </View>
            </View>
        )
    }

    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen', { mode: 'panda' })
    }, [navigation])


    const sectionHeader = ({section}) => {
        if(section.type === "recentlyviewed"){
            return(
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5, justifyContent: 'space-between', marginRight: 5 }}
                >
                    <CommonTexts label={'Recently Viewed'} fontSize={13} />
                    <CommonFiltration 
                        onChange={setFilter} 
                    />
                </View>
                
            )
        }
        else if(section.type === "suggested_products"){
            return(
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5, justifyContent: 'space-between', marginRight: 5 }}
                >
                    <CommonTexts label={'Panda Suggestions'} fontSize={13} />
                </View>
                
            )
        }
        else if(section?.type === "available_products"){
            return(
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5, justifyContent: 'space-between', marginRight: 5 }}
                >
                    <CommonTexts label={'Products'} fontSize={13} />
                </View>
                
            )
        }
    }


    return (
        <View>
            <Header onPress={onClickDrawer} />
            <SectionList
                sections={data?.items ? data?.items : []}
                keyExtractor={(item, index) => `${item?._id}${index}`}
                renderItem={_renderItem}
                renderSectionHeader={sectionHeader}
                ListHeaderComponent={listHeader}
                style={{ backgroundColor: '#fff' }}
                extraData={filter}
            />
        </View>
    )
}

export default PandaHome

const styles = StyleSheet.create({})