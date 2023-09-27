import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import Lottie from 'lottie-react-native';
import CommonTexts from '../../../Components/CommonTexts';
import MyCoinsText from './MyCoinsText';
import Table from './Table';
import PandaCoinListCard from './PandaCoinListCard';
import PandaContext from '../../../contexts/Panda';
import CommonInput from '../../../Components/CommonInput';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CustomButton from '../../../Components/CustomButton';

const PandaCoins = ({route, navigation}) => {

    const {width} = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const [price, setPrice] = useState('')

    const [newList, setNewList] = useState(datas);


    const schema = yup.object({
		code: yup.string().required('Phone number is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});

    useEffect(() => {
        updateColor();
      }, []);

    const updateColor = () => {
        const updatedNumbers = datas.map(number => {
          if (number.coin < 0) {
            return {
                ...number,
                color: '#F32B2B'
            }
          } else {
            return{ 
                ...number,
                color: active === 'fashion' ? '#2D8FFF' : '#F39E2B'
            }
          }
        });
        setNewList(updatedNumbers);
    }
    





    let datas = [
        {
            _id: '1',
            date: '22/05/2022',
            description: 'Affiliate Bonus',
            coin: +3
        },
        {
            _id: '2',
            date: '20/05/2022',
            description: 'Order ID: #6268',
            coin: -53
        },
        {
            _id: '3',
            date: '08/05/2022',
            description: 'Order ID: #6262',
            coin: +300
        },
        {
            _id: '4',
            date: '20/05/2022',
            description: 'Order ID: #6268',
            coin: -10
        },
        {
            _id: '5',
            date: '20/05/2022',
            description: 'Order ID: #6268',
            coin: 10
        },

    ]

    useEffect(() => {
        if(datas){
            setPrice(datas.reduce((total, currentValue) => total = total + parseInt(currentValue.coin),0))
        }
    }, [datas])



    return (
        <>
            <HeaderWithTitle 
                title={'Panda Coins'}
                // onPress={mode === 'header' ?}
            />
                
            <ScrollView
                showsHorizontalScrollIndicator={false}
                style={{ 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', 
                    paddingHorizontal:15, 
                    flex:1
                }}
            >
                <View style={{height:150,}}>
                    <Lottie 
                        source={{uri: 'https://assets9.lottiefiles.com/packages/lf20_CbT8Hi.json'}} 
                        autoPlay loop
                    />
                </View>

                <MyCoinsText coins={price}/>

                <Text style={styles.redeemCoin}>Redeem Panda Coins</Text>
                <View style={styles.reddemBox}>
                    <CommonInput
                        control={control}
                        error={errors.code}
                        fieldName="code"
                        placeholder={'Enter Code'}
                        placeholderTextColor='#0C256C21'
                        width={width/1.44}
                    />
                    <CustomButton 
                        label={'Apply'}
                        bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                        width={width/5}
                    />
                </View>

                <Table>
                    {newList?.map((item)=>  <PandaCoinListCard item={item} key={item?._id}/>)}
                </Table>
               
                
                
            </ScrollView>
         
        </>
        
    )
}

export default PandaCoins

const styles = StyleSheet.create({
    container : {
        flexDirection:'row' , 
        borderTopWidth:1, 
        borderColor:"#E9E9E9"
    },
    headerView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.25, 
        paddingVertical:8, 
        borderRightWidth:1, 
        borderColor:"#E9E9E9"
    },
    headerText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    descriptionView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.5,  
        borderRightWidth:1, 
        borderColor:"#E9E9E9",
    },
    descriptionText : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
    },
    coinTextView : {
        marginLeft: 10,
        justifyContent:'center', 
        alignItems:'center',
        flex:0.25
    },
    redeemCoin : {
        fontFamily:'Poppins-Regular', 
        fontSize:13, 
        color:'#000000', 
        marginTop:20,
        marginBottom:5
    },
    reddemBox:{
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between'
    }
})