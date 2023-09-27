import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import Lottie from 'lottie-react-native';
import CommonTexts from '../../../Components/CommonTexts';
import EarnCoinText from './EarnCoinText';
import EarningsTable from './EarningsTable';
import PandaContext from '../../../contexts/Panda';



const AffiliateBonus = ({route, navigation}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const [price, setPrice] = useState('')

    coins = [
        {
            totalDownloads: 55,
            totalOrders : 320,
            todaysOrders: 10
        }
    ]

    let TotalCoins = coins?.[0]?.totalDownloads + coins?.[0]?.totalOrders + coins?.[0]?.todaysOrders


    datas = [
        {
            _id: '1',
            date: '22/05/2022',
            description: 'Affiliate Bonus',
            coin: '+3'
        },
        {
            _id: '2',
            date: '20/05/2022',
            description: 'Order ID: #6268',
            coin: '-53'
        },
        {
            _id: '3',
            date: '08/05/2022',
            description: 'Order ID: #6262',
            coin: '+300'
        },
        {
            _id: '4',
            date: '20/05/2022',
            description: 'Order ID: #6268',
            coin: '-10'
        },
        {
            _id: '5',
            date: '20/05/2022',
            description: 'Order ID: #6268',
            coin: '-10'
        },

    ]




    return (
        <>
            <HeaderWithTitle  title={'Affiliate Bonus'}/>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                style={{ 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal:15, 
                    flex:1
                }}
            >
                <View style={{height:200, marginBottom:20}}>
                    <Lottie 
                        source={{uri: 'https://assets1.lottiefiles.com/packages/lf20_fjv8qxqn.json'}} 
                        autoPlay loop
                    />
                </View>

                <EarnCoinText coins={TotalCoins}/>

                <Text style={{fontFamily:'Poppins-Regular', color:'#23233C', fontSize:11, textAlign:'center', marginTop:5, paddingHorizontal:50}}>This is the total earnings from orders of your referrals</Text>

                <EarningsTable
                    totalDownloads={coins?.[0]?.totalDownloads}
                    totalOrders={coins?.[0]?.totalOrders}
                    todaysOrders={coins?.[0]?.todaysOrders}
                />
                
            </ScrollView>
         
        </>
        
    )
}

export default AffiliateBonus

const styles = StyleSheet.create({
 
    container : { 
        backgroundColor: '#fff', 
        paddingHorizontal:15, 
        flex:1
    },

   
})