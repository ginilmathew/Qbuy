import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import Lottie from 'lottie-react-native';
import CommonInput from '../../../Components/CommonInput';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';


const RefferRestaurant = () => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    const [values, setValues] = useState(null);

    const [sub, setSub] = useState(false)


    let status = 'approved'


    const data = [
        { label: 'Trivandrum', value: '1' },
        { label: 'Kochi', value: '2' },
        { label: 'Kannur', value: '3' },
    ];


    const schema = yup.object({
        mobile: yup.string().min(8).required('Phone number is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <>
            <HeaderWithTitle title={ active === 'green' ? 'Lets Farm Together' : active === 'fashion' ? "Sell Your Item" : 'Refer A Restaurant' } />
            <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
                <Text style={ { fontSize: 18 } }>Coming Soon!...</Text>
            </View>
            {/* <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal:15 
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{height:170, alignItems:'center'}}>
                    <Lottie 
                        source={ active === 'green' ? require('../../../Lottie/farm.json') : require('../../../Lottie/rating.json')} 
                        autoPlay
                    />
                </View>
              
                <Text style={styles.mainText}>{active === 'green' ? 'Join Qbuy Panda Farming Community!' : active === 'fashion' ? 'Sell Your Items on Qbuy Panda!' : 'Refer your favourite restaurants so that they can join the Qbuy Panda family too!'}</Text>

                { active === 'green' || active === 'fashion' ?
                <>

                    <CommonInput
                        control={control}
                        error={errors.mobile}
                        fieldName="mobile"
                        inputMode={'numeric'}
                        topLabel={'Name'} 
                        mb={20}
                    />
                    <CommonInput
                        control={control}
                        error={errors.mobile}
                        fieldName="mobile"
                        inputMode={'numeric'}
                        topLabel={'Phone Number'} 
                        mb={20}
                    />
                    <CommonInput
                        control={control}
                        error={errors.mobile}
                        fieldName="mobile"
                        inputMode={'numeric'}
                        topLabel={'Email ID'} 
                        mb={20}
                    />
                    <CommonInput
                        control={control}
                        error={errors.mobile}
                        fieldName="mobile"
                        inputMode={'numeric'}
                        topLabel={'Location'} 
                        mb={20}
                    />
                </>
                : 
                <>
                    <CommonSelectDropdown
                        topLabel={'City'}
                        mb={20}
                        data={data}
                        value={values}
                        setValue={setValues}
                    />
                    <CommonInput
                        control={control}
                        error={errors.mobile}
                        fieldName="mobile"
                        topLabel={'Store Address'}
                        mb={20}
                        placeholder='Complete Address e.g. store number, street name, etc'
                        placeholderTextColor='#0C256C21'
                    />
                    <CommonInput
                        control={control}
                        error={errors.mobile}
                        fieldName="mobile"
                        inputMode={'numeric'}
                        topLabel={'Store Contact Number'} 
                        mb={20}
                        placeholder='Mobile Number e.g. Mobile of the owner'
                        placeholderTextColor='#0C256C21'
                    />
                </>}

              
               
                <CustomButton
                    // onPress={()=>setSub(true)}
                    label={'Submit'}
                    mt={10}
                    bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={80}
                />
                 */}
            {/* <View style={{alignItems:'center'}}>
                    {status !== 'approved' && <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            color: '#1A9730',
                            fontSize: 13,
                            paddingHorizontal:20,
                            textAlign:'center'
                        }}
                    >{'Your Application Has Been Submitted Successfully'}</Text>}
                    <Ionicons name={status === 'approved' ? 'ios-checkmark-circle' : 'alert-circle'} color={status === 'approved' ? '#1A9730' : '#B29211'} size={30} marginTop={10}/>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            color: status === 'approved' ? '#1A9730' : '#B29211',
                            fontSize: 13,
                            marginTop:5
                        }}
                    >{status === 'approved' ? 'Your Application Has Been Approved' : 'Awaiting Approval'}</Text>


                </View> */}



            {/* </ScrollView> */ }
        </>
    )
}

export default RefferRestaurant

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 5,
        marginBottom: 20
    }
})