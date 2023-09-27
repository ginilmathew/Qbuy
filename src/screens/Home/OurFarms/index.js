import { Image, StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native'
import React, { useContext, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import VideoPlayer from 'react-native-video-player'
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';
import Title from './Title';

const OurFarms = ({navigation}) => {

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda

    const {width} = useWindowDimensions()


    // farm = [
    //     {
    //         _id: '1',
    //         image : require('../../../Images/farm1.jpeg')
    //     },
    //     {
    //         _id: '2',
    //         image : require('../../../Images/farm2.jpeg')

    //     },
    //     {
    //         _id: '3',
    //         image : require('../../../Images/store2.jpeg')

    //     },
    //     {
    //         _id: '4',
    //         image : require('../../../Images/tomato.jpeg')

    //     },
     
    // ]

    return (
        <>
            <HeaderWithTitle title={'Our Farms'}/>
            {/* <ScrollView style={styles.container} showsVerticalScrollIndicator={false}> */}
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.commingtext}>Coming Soon..!</Text>
                </View>
             

                {/* <View style={{backgroundColor:'#000', paddingVertical:20, borderRadius:20, marginTop:20}}> */}
                    {/* <VideoPlayer
                        video={require('../../../Videos/farming.mp4')} 
                        // showDuration={true}
                        controlsTimeout={2000}
                        pauseOnPress={true}
                        videoHeight={750}
                        resizeMode='contain'
                        thumbnail={require('../../../Images/farmThumb.jpeg')}
                    /> */}
                {/* </View> */}

                {/* <Title 
                    label={'Introducing Qbuy Panda Farms!'}
                    width={width/5.8}
                />
                <Text style={{ fontFamily:'Poppins-LightItalic', fontSize:10, color:'#23233C', marginTop:10 }}>"The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways."</Text>
                <Text style={{ fontFamily:'Poppins-MediumItalic', fontSize:10, color:'#23233C', textAlign:'right', paddingRight:5, marginTop:2 }}> - John F. Kennedy</Text>

                <Text style={{ fontFamily:'Poppins-Regular', fontSize:10, color:'#23233C', marginTop:10 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</Text>

                <Title 
                    label={'Farm Gallery'}
                    width={width/13}
                /> */}

                {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:10}}> */}

                    {/* {farm?.map( item => <Image key={item?._id} source={item?.image} style={{width: width/2.5, height:100, borderRadius:15, marginRight:10}}/>)} */}

                {/* </ScrollView> */}


                {/* <CustomButton
                    onPress={()=>navigation.navigate('RefferRestaurant')}
                    label={'Join Now'}
                    mt={25}
                    bg={ grocery ? '#8ED053' : '#58D36E'}
                    mb={90}

                /> */}

               

                
       
                
            {/* </ScrollView> */}
        </>
    )
}

export default OurFarms

const styles = StyleSheet.create({
    container : { 
        flex:1, 
        backgroundColor:'#F4FFE9', 
        paddingHorizontal:15,
    },
    mainText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign:'center',
        paddingHorizontal:70,
        marginTop:10
    },
    commingtext:{
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 16,
    }
    
})