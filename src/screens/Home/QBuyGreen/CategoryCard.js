import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import TypeCard from '../Grocery/TypeCard'
import reactotron from '../../../ReactotronConfig'

const CategoryCard = memo(({ data }) => {


	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20 }}>
			{data?.map((item, index) =>
				(<TypeCard item={item} key={index} />)
			)}
		</ScrollView>
	)
})

export default CategoryCard

const styles = StyleSheet.create({})