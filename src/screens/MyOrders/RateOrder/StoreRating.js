import { StyleSheet, Text, View } from 'react-native'
import React, { memo, useState } from 'react'
import CustomRating from './CustomRating'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CommonInput from '../../../Components/CommonInput';


const StoreRating = memo(({ item, setStoreRating, setComments }) => {

    //const [storeRating, setStoreRating] = useState('')

    const schema = yup.object({
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <View key={item?._id}>
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: '#23233C', marginTop: 10, marginBottom: -5 }}>{item?.store_name}</Text>
            <CustomRating
                onFinishRating={(rate) => setStoreRating(rate)}
            />
            <CommonInput
                control={control}
                error={errors.store}
                fieldName="store"
                topLabel={'Feedback (Optional)'}
                top={10}
                placeholder='e.g. Your opinon on the store'
                placeholderTextColor='#0C256C21'
                maxHeight={120}
                multi={true}
                textChange={setComments}
            />
        </View>
    )
})

export default StoreRating

const styles = StyleSheet.create({})