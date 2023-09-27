import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { memo } from 'react'
import CommonItemCard from '../../../Components/CommonItemCard'
import CommonTexts from '../../../Components/CommonTexts'

const PandaSuggestions = memo(({data}) => {
    const {width, height} = useWindowDimensions()

    return (
        <>
        {data?.length > 0 &&<CommonTexts label={'Panda Suggestions'}  ml={15} mb={5} mt={15} />}
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: 'row', paddingLeft: 7, }}
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

export default PandaSuggestions

const styles = StyleSheet.create({})