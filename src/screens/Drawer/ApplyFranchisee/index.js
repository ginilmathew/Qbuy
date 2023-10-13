import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import Lottie from 'lottie-react-native';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import HeaderWithTitle from '../../../Components/HeaderWithTitle';
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
import CommonInput from '../../../Components/CommonInput';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';


const ApplyFranchisee = () => {
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const schema = yup.object({
		mobile: yup.string().min(8).required('Phone number is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});


    // const [values, setValues] = useState(null);


    // const data = [
    //     { label: 'Test1', value: '1' },
    //     { label: 'Test2', value: '2' },
    //     { label: 'Test3', value: '3' },
    // ];

    // const [fran, setFran] = useState(null);


    // const franchise = [
    //     { label: 'Test1', value: '1' },
    //     { label: 'Test2', value: '2' },
    //     { label: 'Test3', value: '3' },
    // ];

    return (
        <>
            <HeaderWithTitle title={'Apply for a franchisee'} />
            {/* <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', 
                    paddingHorizontal:15 
                }}
            >
                <View style={{height:500, marginTop:-150}}>
                    <Lottie 
                        source={{uri :'https://assets3.lottiefiles.com/packages/lf20_fzq71t74.json'}} 
                        autoPlay
                    />
                </View>
                <Text style={styles.mainText}>{'Connect with your ineterested franchisee!'}</Text> */}

                {/* <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Name'}
                    mb={20}
				/>
     
                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Contact Number'}
                    mb={20}
				/> */}
                {/* <CommonSelectDropdown
                    topLabel={'Store Category'}
                    mb={20}
                    data={data}
                    value={values}
                    setValue={setValues}

                />

                <CommonSelectDropdown
                    topLabel={'Franchisee'}
                    mb={20}
                    data={franchise}
                    value={fran}
                    setValue={setFran}
                /> */}

                {/* <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Location'}
                    mb={20}
				/>


                <CustomButton
                    label={'Apply'}
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

export default ApplyFranchisee

const styles = StyleSheet.create({
    
    mainText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign:'center',
        paddingHorizontal:40,
        marginTop:-150,
        marginBottom:20
    }
})