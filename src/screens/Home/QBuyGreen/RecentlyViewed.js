import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { memo } from 'react'
import CommonItemCard from '../../../Components/CommonItemCard'
import CommonTexts from '../../../Components/CommonTexts'

const RecentlyViewed = memo(({data}) => {
    const {width, height} = useWindowDimensions()

    return (
        <>
        {data?.length > 0 &&<CommonTexts label={'Recently Viewed'}  ml={15} mb={5} mt={5} />}
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', padding: 5, gap: 5, overflow: 'scroll' }}
        >
            {data.map((item) =>
                <CommonItemCard
                    key={item?._id}
                    item={item}
                    width={width / 2.5}
                    height={height/7}
                    marginHorizontal={5}
                />
            )}
        </ScrollView>
        </>
        
    )
})

export default RecentlyViewed

const styles = StyleSheet.create({})