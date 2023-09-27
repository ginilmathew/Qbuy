import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import Lottie from 'lottie-react-native';
import CommonTexts from '../../../Components/CommonTexts';
import CommonInput from '../../../Components/CommonInput';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import DatePicker from 'react-native-date-picker'
import CommonPicker from '../../../Components/CommonPicker';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { Dropdown } from 'react-native-element-dropdown';
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown';
import CustomButton from '../../../Components/CustomButton';
import PandaContext from '../../../contexts/Panda';

const PickupAndDropoff = () => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())

    const [openCalendar, setOpenCalendar] = useState(false)
    const [openClock, setOpenClock] = useState(false)

    const [values, setValues] = useState(null);


    const data = [
        { label: 'Car', value: '1' },
        { label: 'Bike', value: '2' },
        { label: 'Truck', value: '3' },
    ];



    const schema = yup.object({
		mobile: yup.string().min(8).required('Phone number is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});

    return (
        <>
            <HeaderWithTitle title={'Pick Up & Drop Off'}/>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:18}}>Coming Soon!...</Text>
            </View>
            {/* <ScrollView 
                style={{ 
                    flex:1, 
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal:15 
                }}
            >
                <View style={{height:150, alignItems:'center'}}>
                    <Lottie 
                        source={require('../../../Lottie/deliveryBike.json')} 
                        autoPlay
                    />
                </View>
                <Text style={styles.mainText}>{'Pickup anything you need in the blink of a n eye!'}</Text>

                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
					inputMode={'numeric'}
                    topLabel={'Pickup Item Name'}
                    mb={20}
				/>

                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Item Description'}
                    mb={20}
				/>

                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Weight'}
                    mb={20}
				/>

                <CommonSelectDropdown
                    topLabel={'Vehicle Type'}
                    mb={20}
                    data={data}
                    value={values}
                    setValue={setValues}
                />
               
                <CommonPicker 
                    onPress={()=>setOpenCalendar(true)}
                    label={moment(date).format("DD-MM-YYYY")}
                    mb={20}
                    topLabel='Pickup Date'
                    icon={<Ionicons name={'calendar'} size={20} color={"#5261E0"} />}
                />

                <CommonPicker 
                    onPress={()=>setOpenClock(true)}
                    label={moment(time).format("hh:mm A")}
                    mb={20}
                    topLabel='Pickup Time'
                    icon={<MaterialCommunityIcons name={'clock-time-three'} size={23} color={"#5261E0"} />}
                />

                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Pick Up Location'}
                    mb={20}
				/>

                <CommonInput
					control={control}
					error={errors.mobile}
					fieldName="mobile"
                    topLabel={'Drop Off Location'}
                    mb={20}
				/>

                <CommonPicker 
                    // onPress={()=>setOpenCalendar(true)}
                    topLabel='Upload Images (If Any)'
                    icon={<Ionicons name={'cloud-upload'} size={25} color={"#58D36E"} />}
                />

                <CustomButton
                    label={'Submit'}
                    mt={25}
                    bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mb={90}

                />

                
                
                <DatePicker
                    mode='date'
                    modal
                    open={openCalendar}
                    date={date}
                    onConfirm={(date) => {
                    setOpenCalendar(false)
                    setDate(date)
                    }}
                    onCancel={() => {
                    setOpenCalendar(false)
                    }}
                />

                <DatePicker
                    mode='time'
                    modal
                    open={openClock}
                    date={time}
                    onConfirm={(time) => {
                        setOpenClock(false)
                        setTime(time)
                    }}
                    onCancel={() => {
                        setOpenClock(false)
                    }}
                    
                />
                
            </ScrollView> */}
        </>
    )
}

export default PickupAndDropoff

const styles = StyleSheet.create({

    mainText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign:'center',
        paddingHorizontal:70,
        marginTop:10
    }
    
})