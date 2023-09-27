import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { memo, useEffect } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';



const TypeSkelton = memo(() => {

	const opacity = useSharedValue(1);


	useEffect(() => {
		opacity.value = withRepeat(
			withSequence(
				withDelay(1000, withTiming(0.5, { duration: 1000 })),
				withDelay(1000, withTiming(1, { duration: 1000 })),
			),
			-1,
			false
		)
	}, [])
	


	const { width, fontScale, height } = useWindowDimensions();

	let imageWidth = width / 6
	let restauranWidth = width / 4.5

	const styles = makeStyles(fontScale, height);

	// React.useEffect(() => {
	//     withTiming(1, { duration: 1000 })
	//   }, []);

	


	return (
		<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 5, padding: 5 }}>
			<Animated.View
				style={[{ alignItems: 'center', width: imageWidth, height: imageWidth, backgroundColor: '#dcddde', borderRadius: imageWidth / 2 }, {opacity}]}
			>


			</Animated.View>
			<Animated.View
				numberOfLines={2}
				style={[styles.shopName, { opacity }]}
			></Animated.View>
		</View>
	)
})

export default TypeSkelton

const makeStyles = (fontScale, width) => StyleSheet.create({
	shopName: {

		textAlign: 'center',
		marginTop: 4,
		height: 10,
		backgroundColor: '#dcddde',
		width: '100%'
	},
})