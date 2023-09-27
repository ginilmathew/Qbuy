import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { memo } from 'react'
import CommonItemCard from '../../../Components/CommonItemCard'
import CommonTexts from '../../../Components/CommonTexts'

const AvailableProducts = memo(({ data }) => {

    const { width } = useWindowDimensions()
    return (
        <>
            {data?.length > 0 &&<CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={15} mt={15} />}
            <View style={styles.productContainer}>
                {data?.map((item) => (
                    <CommonItemCard
                        item={item}
                        key={item?._id}
                        width={width / 2.25}
                        height={220}
                        wishlistIcon
                    />
                ))}
            </View>
        </>
    )
})

export default AvailableProducts

const styles = StyleSheet.create({
    productContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 17,
        paddingHorizontal: '3%'
    }
})