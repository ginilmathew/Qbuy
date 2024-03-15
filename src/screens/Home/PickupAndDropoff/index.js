import { Image, StyleSheet, Text, View, ScrollView, Platform, Modal, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import Lottie from 'lottie-react-native';
import CommonTexts from '../../../Components/CommonTexts';
import CommonInput from '../../../Components/CommonInput';
import { Controller, useForm } from "react-hook-form";
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
import GooglePlaces from '../../../Components/GooglePlaces';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import customAxios from '../../../CustomeAxios';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AuthContext from '../../../contexts/Auth';
import SuccessPage from '../../../Components/SuccessPage';
import LoadingModal from '../../../Components/LoadingModal';
import reactotron from 'reactotron-react-native';




const PickupAndDropoff = ({ navigation, route }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    const { userData } = useContext(AuthContext);

    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date())
    const [amount, setAmount] = useState(null);
    const [time, setTime] = useState(new Date())
    const [distance, setDistance] = useState({});
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [filePath, setFilePath] = useState({
        assets: [{ fileName: null }]
    });


    const [openCalendar, setOpenCalendar] = useState(false)
    const [openClock, setOpenClock] = useState(false)




    const getDistance = async (vehicleType) => {

        try {
            let response = null;
            
            if (distance?.pickup?.location) { 
                const origin = `${distance?.pickup?.location?.lat},${distance?.pickup?.location?.lng}`;
                const destination = `${distance?.dropoff?.location?.lat},${distance?.dropoff?.location?.lng}`;
                const apiKey = 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY';
    
                const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

                response = await axios.get(url);
            }


            if (response) {
                setLoading(true)
                const distanceValue = response.data.routes[0].legs;

                const km = distanceValue[0]?.distance?.text?.replace(' km', '');


                customAxios.post('customer/pickup-drop-charge', {
                    "vehicle_type": vehicleType,
                    "pickup_location_coordinates": [distance?.pickup?.location?.lat, distance?.pickup?.location?.lng],
                    "kilometer": km
                }).then(res => {
                    let values = getValues()
                    values.amount = res?.data?.data?.pickup_and_drop_charge_amount?.toString()
                    reset(values)
                    setAmount(res?.data?.data)
                    //setValue('amount', res?.data?.data?.pickup_and_drop_charge_amount)
                    setError('amount', { type: 'custom', message: null })
                })
                    .catch(err => {
                        Toast.show({
                            text1: err,
                            type: 'error'
                        })
                    }).finally 
                        setLoading(false)

            }

        } catch (error) {
            console.error('Error fetching distance:', error);

        }
    }


    useEffect(() => {
        if (distance?.pickup && distance?.dropoff) {
            getDistance(getValues()?.vehicle)
        }

    }, [distance])


    const getVehicleTypes = () => {
        customAxios.get('admin/vehicle-type')
            .then(res => {
                setVehicleTypes(res?.data?.data?.map(({ name }) => name))
            })
            .catch(err => {
                Toast.show({
                    type: 'error',
                    text1: err
                })
            })
    }

    const schema = yup.object({
        name: yup.string().required('Pickup item name is required'),
        description: yup.string().required('Description is required'),
        vehicle: yup.string().required('Vehicle type is required'),
        weight: yup.string().required('Weight is required').typeError('Weight type must be number'),
        date: yup.string().required('Date is required'),
        time: yup.string().required('Time is required'),
        pickup: yup.string().required('Pickup location is required'),
        dropoff: yup.string().required('Drop off location is required'),
        image: yup.string().nullable(),
        amount: yup.string().required('Amount is required')
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue, setError, getValues, reset } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange"
    });


    useFocusEffect(useCallback(() => {
        setLoading(false);

        if (route?.params?.date && route?.params?.time) {
            // setValue('time', route?.params?.time);
            // setValue('date', route?.params?.date);
        } else {
            reset()
            setValue('time', new Date());
            setValue('date', new Date());
        }

        getVehicleTypes()
    }, [route?.params]))


    const imageGalleryLaunch = useCallback(() => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
        };

        launchImageLibrary(options, (res) => {

            let format = ['image/png', 'image/jpeg', 'image/jpg']

            let image = res?.assets?.some(obj => format.includes(obj.type))

            if (image) {
                setFilePath(res);
                setError('image', { type: 'custom', message: null })
                setValue('image', res?.assets[0]?.fileName)

            } else {
                setFilePath(null);
                Toast.show({
                    type: 'info',
                    text1: 'unsupported format'
                });
                return;
            }

        });
    }, [])


    const onSubmit = ({ name, description, vehicle, weight, date, time, pickup, dropoff }) => {

        reactotron.log({date, time})

        setLoading(true)
        try {

            const formData = new FormData();
            if (filePath?.assets[0]?.fileName) {

                formData.append('images[0]', {
                    name: filePath?.assets?.[0]?.fileName,
                    type: filePath?.assets?.[0]?.type,
                    uri: Platform.OS === 'ios' ?
                        filePath?.assets[0]?.uri?.replace('file://', '')
                        : filePath?.assets[0]?.uri
                });
            } else {
                formData.append('images[0]', null)
            }

            formData.append('item_name', name);
            formData.append('description', description);
            formData.append('weight', weight);
            formData.append('vehicle_type', vehicle);
            formData.append('pickup_date', moment(date).format('DD-MM-YYYY'));
            formData.append('pickup_time', moment(time).format("hh:mm"));
            formData.append('pickup_location_coordinates', `[${distance?.pickup?.location?.lat}, ${distance?.pickup?.location?.lng}]`);
            formData.append('drop_off_location_coordinates', `[${distance?.dropoff?.location?.lat}, ${distance?.dropoff?.location?.lng}]`)
            formData.append('name', userData?.name || null);
            formData.append('mobile', userData?.mobile || null);
            formData.append('email', userData?.email || null);
            formData.append('franchise', amount?.franchise_id)
            formData.append('pickup_location', pickup);
            formData.append('drop_off_location', dropoff);
            formData.append('grand_total', amount?.pickup_and_drop_charge_amount);
            formData.append('billing_address', dropoff);
            formData.append('shipping_address', dropoff);
            formData.append('type', active);
            formData.append('payment_status', 'pending');
            formData.append('payment_type', 'online');
            formData.append('delivery_date', moment().format('YYYY-MM-DD hh:mm'));




            customAxios.post('customer/pickup-drop', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(async response => {
                    navigation.navigate('SuccessPage', { data: response?.data?.data, time, date })
                })
                .finally(() => {
                    // setLoading(false)
                })

        } catch (error) {
            console.log(error);
            Toast.show({
                text1: error,
                type: 'error'
            })
        } finally {
            // setLoading(false)
        }
    }


    const goHome = useCallback(() => {
        navigation.navigate('Home')
    }, [])

    if (route?.params?.paytmSuccess) {
        return <SuccessPage goHome={goHome} source={require('../../../Lottie/successTick.json')} text={'Your pick-up and drop-off order has been successfully created.'} />
    }



    return (
        <>
            <HeaderWithTitle title={'Pick Up & Drop Off'} />
            <View style={{
                alignItems: 'center',
                backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
            }}>
                <Lottie
                    style={{
                        height: 150,
                        width: 150,
                    }}
                    source={require('../../../Lottie/deliveryBike.json')}
                    autoPlay
                />

                <Text style={styles.mainText}>{'Pickup anything you need in the blink of a n eye!'}</Text>
            </View>
            <ScrollView
                keyboardShouldPersistTaps='always'
                style={{
                    flex: 1,
                    backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
                    paddingHorizontal: 15
                }}
            >

                <CommonInput
                    control={control}
                    error={errors.name}
                    fieldName="name"
                    top={15}
                    topLabel={'Pickup Item Name'}
                />

                <CommonInput
                    control={control}
                    error={errors.description}
                    fieldName="description"
                    multi
                    topLabel={'Item Description'}
                    top={15}
                />

                <CommonInput
                    control={control}
                    error={errors.weight}
                    inputMode={'numeric'}
                    fieldName="weight"
                    topLabel={'Weight (kg)'}
                    top={15}
                />

                <CommonSelectDropdown
                    topLabel={'Vehicle Type'}
                    fieldName={'vehicle'}
                    error={errors.vehicle}
                    placeholder={'Select vehicle'}
                    data={vehicleTypes}
                    onChange={getDistance}
                    mt={15}
                    mb={20}
                    setValue={setValue}
                    setError={setError}
                />

                <CommonPicker
                    onPress={() => setOpenCalendar(true)}
                    label={moment(date).format("DD-MM-YYYY")}
                    topLabel='Pickup Date'
                    mb={20}
                    icon={<Ionicons name={'calendar'} size={20} color={"#5261E0"} />}
                />

                <CommonPicker
                    onPress={() => setOpenClock(true)}
                    label={moment(time).format("hh:mm A")}
                    topLabel='Pickup Time'
                    icon={<MaterialCommunityIcons name={'clock-time-three'} size={23} color={"#5261E0"} />}
                />

                <GooglePlaces
                    control={control}
                    fieldName={'pickup'}
                    topLabel={'Pick Up Location'}
                    setValue={setValue}
                    setDistance={setDistance}
                    setError={setError}
                />

                <GooglePlaces
                    control={control}
                    fieldName={'dropoff'}
                    topLabel={'Drop Off Location'}
                    setValue={setValue}
                    setError={setError}
                    setDistance={setDistance}
                />


                <CommonInput
                    control={control}
                    error={errors.amount}
                    // placeholder={amount && amount?.pickup_and_drop_charge_amount}
                    editable={false}
                    inputMode={'numeric'}
                    fieldName="amount"
                    topLabel={'Amount'}
                    top={15}
                />

                <Controller
                    control={control}
                    name={'image'}
                    render={({ fieldState: { error } }) => (
                        <>
                            <CommonPicker
                                onPress={imageGalleryLaunch}
                                label={filePath?.assets[0]?.fileName}
                                mt={20}
                                topLabel='Upload Images (If Any)'
                                icon={<Ionicons name={'cloud-upload'} size={25} color={"#58D36E"} />}
                            />
                            {error && (
                                <Text style={styles.errorText}>{error?.message}</Text>
                            )}
                        </>
                    )}
                />


                <CustomButton
                    label={'Pay now'}
                    loading={loading}
                    onPress={handleSubmit(onSubmit)}
                    mt={25}
                    bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
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
                        setValue('date', date)
                        setError('date', { type: 'custom', message: null })
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
                        setValue('time', time)
                        setError('time', { type: 'custom', message: null })
                    }}
                    onCancel={() => {
                        setOpenClock(false)
                    }}
                />

            </ScrollView>

            <Modal visible={!!loading} style={{ backgroundColor: 'transparent' }} transparent={true} >
                <View
                    style={{
                        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        shadowOffset: 2,
                    }}
                >
                    <ActivityIndicator color={"red"} size={30} />
                </View>
            </Modal>
        </>
    )
}

export default PickupAndDropoff

const styles = StyleSheet.create({

    mainText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 70,
        marginTop: 10
    },
    errorText: {
        fontFamily: 'Poppins-Regular',
        color: 'red',
        fontSize: 11,
    }

})