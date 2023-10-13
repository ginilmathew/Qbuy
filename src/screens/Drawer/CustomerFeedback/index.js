import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
import CommonInput from '../../../Components/CommonInput';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';


const CustomerFeedback = () => {
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const schema = yup.object({
		mobile: yup.string().min(8).required('Phone number is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});

    return (
        <>
            <HeaderWithTitle title={'Customer Feedbacks'} />
            {/* <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', 
                    paddingHorizontal:15 
                }}
            >
                <View style={styles.lottieView}>
                    <Lottie 
                        source={{uri:'https://assets10.lottiefiles.com/packages/lf20_z23r5urh.json'}} 
                        autoPlay
                    />
                </View>
                <Text style={styles.mainText}>{'Give us your valuable feedbacks so thatwe can improve in the future!'}</Text>

                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Order ID (Optional)'}
                    mb={20}
                    shadowOpacity={0}
				/>
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Comments'}
                    mb={20}
				/>
             

                <CustomButton
                    label={'Submit'}
                    bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                    mt={20}
                />

              
                
            </ScrollView> */}
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:18,letterSpacing:1}}>Coming Soon!...</Text>

            </View>
        </>
    )
}

export default CustomerFeedback

const styles = StyleSheet.create({
    
    lottieView : {
        height:140, 
        alignItems:'center', 
        marginTop:30
    },
    mainText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign:'center',
        paddingHorizontal:40,
        marginTop:20,
        marginBottom:20
    }
})