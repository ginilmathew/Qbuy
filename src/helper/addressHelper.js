import axios from "axios";

export function getAddressfromLocation(lat, lng) {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(response => {

    //userContext.setCurrentAddress(response?.data?.results[0]?.formatted_address);

    
    let Value = {
        location: response?.data?.results[0]?.formatted_address,
        city: response?.data?.results[0]?.address_components?.filter(st =>
            st.types?.includes('locality')
        )[0]?.long_name,
        latitude: lat,
        longitude: lng,
    };


    //addressContext.setCurrentAddress(Value);

    return Value


    //setLocation
})
    .catch(err => {
    });
}