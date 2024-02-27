import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { memo, useContext } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import customAxios from '../../CustomeAxios';
import reactotron from 'reactotron-react-native';
import ProductCard from '../../Components/Home/ProductCard';
import CommonTexts from '../../Components/CommonTexts';
import { getProducts } from '../../helper/homeProductsHelper';
import { useFocusEffect } from '@react-navigation/native';
import CartContext from '../../contexts/Cart';
//import { getProduct } from '../../helper/productHelper';

const QbuyProducts = async (items, pageparam) => {
    const homeDataProduct = await customAxios.post(`customer/new-product-list?page=` + pageparam, { ...items, page: pageparam });

    reactotron.log({homeDataProduct})
    

    let products = [];
    if(homeDataProduct?.data?.data?.available_product?.length > 0){
        products = await getProducts(homeDataProduct?.data?.data?.available_product)
    }

     

    reactotron.log({products})
    return {
        data: products,
        lastPage:homeDataProduct?.data?.data?.last_page,
        pageparam
    }

}


const AvailableProducts = ({ styles, width, loggedIn, height, datas, viewProduct, addToCart, children }) => {

    const firstTimeRef = React.useRef(true)
    

    const {
        data,
        error,
        fetchNextPage,
        refetch,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        isLoading,
        remove: infiniteQueryRemove
    } = useInfiniteQuery({
        queryKey: ['greenHomeProducts'],
        queryFn: ({ pageParam = 1 }) => QbuyProducts(datas, pageParam),
        getNextPageParam: (lastPage, pages) => {
            return pages?.length + 1
        }
    })


    //reactotron.log({data})


    

    

    const renderProduct = ({ item }) => {
        return (
            <View style={{ width: width / 2, padding: 5 }}>
                <ProductCard
                    key={`${item?._id}product`}
                    data={item}
                    styles={styles}
                    loggedIn={loggedIn}
                    height={height}
                    viewProduct={viewProduct}
                    //sharedTransitionTag={`images${item?._id}`}
                    addToCart={addToCart}
                />
            </View>
        )
    }


    const fetchMoreData = () => {
        let last = data?.pages?.[data?.pages?.length -1];
        if(last?.pageparam < last?.lastPage){
            fetchNextPage()
        }
        
    }


    const listHeader = () => {
        return(
            <>
            {children}
            <View
                style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5, justifyContent: 'space-between', marginRight: 5, paddingVertical: 10 }}
            >
                <CommonTexts label={'Products'} fontSize={13} />
            </View>
            </>
        )
        
    }



    return (
            <FlatList
                
                data={ data?.pages?.map(page => page?.data)?.flat()}
                refreshing={isLoading}
                renderItem={renderProduct}
                style={{ flexGrow: 1, paddingBottom: 70, backgroundColor: '#fff' }}
                numColumns={2}
                onEndReached={fetchMoreData}
                ListFooterComponent={(isLoading || isFetching) ? () => <ActivityIndicator color={"red"} /> : null}
                ListHeaderComponent={listHeader}
                onRefresh={refetch}
                extraData={isFetching}
            />
    )
}

export default memo(AvailableProducts)

const styles = StyleSheet.create({})