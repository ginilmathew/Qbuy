import { StyleSheet, ImageBackground, useWindowDimensions, FlatList, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../config/constants'


const ImageSlider = ({mt, datas}) => {

    const { width, height } = useWindowDimensions()


  return (
    <View style={{ marginTop: mt }}>

        <FlatList 
            // ref={flat}
            data={datas}
            horizontal
            // keyExtractor={item => item.id.toString()}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem = { ({item}) => {
            return(
                <View style={{alignItems:'center', width:width, height:height/5,}} >
                    <FastImage 
                        source={{ uri: `${IMG_URL}${item?.image}` }}
                        style={{height:height/5, width: width-35,  borderRadius:20}}
                        // resizeMode='contain'
                    >
                    </FastImage>
                </View>
                )
            }}
        />
    

    </View>
  )
}

export default ImageSlider

const styles = StyleSheet.create({})