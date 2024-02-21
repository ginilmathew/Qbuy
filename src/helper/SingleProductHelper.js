import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import reactotron from "reactotron-react-native";


export async function singleProduct(prod) {
    const user = await AsyncStorage.getItem("user");
    let customerGroup;
    let storeOffer;

    if (user) {
        let userData = JSON.parse(user)
        if (userData?.customer_group) {
            customerGroup = userData?.customer_group
        }
    }

    if(prod?.validStoreOffer && moment(prod?.validStoreOffer?.expiry_date,"YYYY-MM-DD HH:mm") > moment()){
        storeOffer = prod?.validStoreOffer;
    }

    let comi;
    let minQty = prod?.minimum_qty ? parseFloat(prod?.minimum_qty) : 1
    let vendorCom = prod?.vendors?.additional_details?.commission
    if (vendorCom) {
        comi = parseFloat(vendorCom)
    }

    if (prod?.variants?.length > 0) {
        let variants = await prod?.variants?.map(pr => {
             return  VariantsPrice(pr, customerGroup, parseInt(prod?.stock), minQty, comi, storeOffer)
        })

        //reactotron.log({variants})
        return variants;
    }   
    else{
        return  Normalprice(prod, customerGroup, storeOffer)
    }
}


function VariantsPrice(pr, customerGroup, stock, minQty, vendorComission, storeOffer){
    const { seller_price, regular_price, offer_price, attributs, offer_date_from, offer_date_to, fixed_delivery_price, _id, title, stock_value, commission } = pr

    let available = false, regularPrice, sellerPrice, discountPercentage;

    if(stock){
        if (parseInt(minQty) <= parseInt(stock_value)) {
            available = true
            if (parseInt(regular_price) > 0) {
                regularPrice = parseInt(regular_price)
            }
            else {
                let comi;
                //product commission
                if (commission) {
                    comi = parseInt(commission)
                }
                else { //get vendor commission
                    if (vendorComission) {
                        comi = parseInt(vendorComission)
                    }
                    else {
                        //set commission as 0
                        comi = 0;
                    }
                }
                let comm = (parseInt(seller_price) / 100) * comi
                let amount = parseInt(seller_price) + comm;
                regularPrice = amount
            }

            if(customerGroup){
                const {discount_value, discount_type} = customerGroup
                if (discount_type === "Percentage") {
                    let offerValue = (regularPrice / 100) * parseFloat(discount_value);
    
                    sellerPrice = regularPrice - offerValue
                    discountPercentage = parseFloat(discount_value)
                }
                else {
                    sellerPrice = regularPrice - parseFloat(discount_value)
                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
                }

                return {
                    _id,
                    title,
                    regularPrice,
                    sellerPrice,
                    attributs,
                    stock_value,
                    available,
                    stock: pr?.stock,
                    discount: discountPercentage
                }
            }
            else if(storeOffer){
                const {offer_type, offer_value} = storeOffer
                if (offer_type === "Percentage") {
                    let offerValue = (regularPrice / 100) * parseFloat(offer_value);
    
                    sellerPrice = regularPrice - offerValue
                    discountPercentage = parseFloat(offer_value)
                }
                else {
                    sellerPrice = regularPrice - parseFloat(offer_value)
                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
                }

                return {
                    _id,
                    title,
                    regularPrice,
                    sellerPrice,
                    attributs,
                    stock_value,
                    available,
                    stock: pr?.stock,
                    discount: discountPercentage
                }
            }
            else{
                let offer = offer_price ? parseFloat(offer_price) : 0;
                let offerFromDate = moment(offer_date_from, "YYYY-MM-DD").isValid() ? moment(offer_date_from, "YYYY-MM-DD") : null
                let offerToDate = moment(offer_date_to, "YYYY-MM-DD").isValid() ? moment(offer_date_to, "YYYY-MM-DD") : null

                if (offer > 0) {
                    //products have offer price , check offer price in valid range
                    if (offerFromDate && offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                            sellerPrice = offer;
                        }
                        else {
                            sellerPrice = regularPrice
                        }
                    }
                    else if (offerFromDate && !offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                            sellerPrice = offer
                        }
                        else{
                            sellerPrice = regularPrice
                        }
                    }
                    else if (!offerFromDate && !offerToDate) {
                        sellerPrice = offer
                    }
                    else{
                        sellerPrice = regularPrice
                    }

                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
                    
                    return {
                        _id,
                        title,
                        regularPrice,
                        sellerPrice,
                        attributs,
                        stock_value,
                        available,
                        stock: pr?.stock,
                        discount: discountPercentage
                    }
                }
                else{
                    sellerPrice = regularPrice
                    return {
                        _id,
                        title,
                        regularPrice,
                        sellerPrice,
                        attributs,
                        stock_value,
                        available,
                        stock: pr?.stock,
                        discount: 0
                    }
                }
            }

        }
        else{
            return {
                _id,
                title,
                attributs,
                stock_value,
                available: false,
                stock: pr?.stock
            }
        }
    }
    else{ //product have unlimited stock
        available = true
        if (parseInt(regular_price) > 0) {
            regularPrice = parseInt(regular_price)
        }
        else {
            let comi;
            //product commission
            if (commission) {
                comi = parseInt(commission)
            }
            else { //get vendor commission
                if (vendorComission) {
                    comi = parseInt(vendorComission)
                }
                else {
                    //set commission as 0
                    comi = 0;
                }
            }
            let comm = (parseInt(seller_price) / 100) * comi
            let amount = parseInt(seller_price) + comm;
            regularPrice = amount
        }

        if(customerGroup){
            const {discount_value, discount_type} = customerGroup
            if (discount_type === "Percentage") {
                let offerValue = (regularPrice / 100) * parseFloat(discount_value);

                sellerPrice = regularPrice - offerValue
                discountPercentage = parseFloat(discount_value)
            }
            else {
                sellerPrice = regularPrice - parseFloat(discount_value)
                discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
            }

            return {
                _id,
                title,
                regularPrice,
                sellerPrice,
                attributs,
                stock_value,
                available,
                stock: pr?.stock,
                discount: discountPercentage
            }
        }
        else if(storeOffer){
            const {offer_type, offer_value} = storeOffer
            if (offer_type === "Percentage") {
                let offerValue = (regularPrice / 100) * parseFloat(offer_value);

                sellerPrice = regularPrice - offerValue
                discountPercentage = parseFloat(offer_value)
            }
            else {
                sellerPrice = regularPrice - parseFloat(offer_value)
                discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
            }

            return {
                _id,
                title,
                regularPrice,
                sellerPrice,
                attributs,
                stock_value,
                available,
                stock: pr?.stock,
                discount: discountPercentage
            }
        }
        else{
            let offer = offer_price ? parseFloat(offer_price) : 0;
            let offerFromDate = moment(offer_date_from, "YYYY-MM-DD").isValid() ? moment(offer_date_from, "YYYY-MM-DD") : null
            let offerToDate = moment(offer_date_to, "YYYY-MM-DD").isValid() ? moment(offer_date_to, "YYYY-MM-DD") : null

            if (offer > 0) {
                //products have offer price , check offer price in valid range
                if (offerFromDate && offerToDate) {
                    if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                        sellerPrice = offer;
                    }
                    else {
                        sellerPrice = regularPrice
                    }
                }
                else if (offerFromDate && !offerToDate) {
                    if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                        sellerPrice = offer
                    }
                    else{
                        sellerPrice = regularPrice
                    }
                }
                else if (!offerFromDate && !offerToDate) {
                    sellerPrice = offer
                }
                else{
                    sellerPrice = regularPrice
                }

                discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
                
                return {
                    _id,
                    title,
                    regularPrice,
                    sellerPrice,
                    attributs,
                    stock_value,
                    available,
                    stock: pr?.stock,
                    discount: discountPercentage
                }
            }
            else{
                sellerPrice = regularPrice
                return {
                    _id,
                    title,
                    regularPrice,
                    sellerPrice,
                    attributs,
                    stock_value,
                    available,
                    stock: pr?.stock,
                    discount: 0
                }
            }
        }
    }
}


function Normalprice(prod, customerGroup, storeOffer){
    let available = false, regularPrice, sellerPrice;
    let minQty = prod?.minimum_qty ? parseFloat(prod?.minimum_qty) : 1
    let attributesName;
    if (prod?.attributes) {
        let names = prod?.attributes?.map(att => att?.options[0]);
        attributesName = names?.join(', ')
    }
    const { stock_value, regular_price, seller_price, commission, offer_date_from, offer_date_to, offer_price, attributes } = prod
    if (prod?.stock) {
        if (parseInt(minQty) <= parseInt(stock_value)) {
            available = true
            if (parseInt(regular_price) > 0) {
                regularPrice = parseInt(regular_price)
            }
            else {
                let comi;
                //product commission
                if (commission) {
                    comi = parseInt(commission)
                }
                else { //get vendor commission
                    let vendorCom = prod?.vendors?.additional_details?.commission
                    if (vendorCom) {
                        comi = parseInt(vendorCom)
                    }
                    else {
                        //set commission as 0
                        comi = 0;
                    }
                }
                let comm = (parseInt(seller_price) / 100) * comi
                let amount = parseInt(seller_price) + comm;
                regularPrice = amount
            }

            if(customerGroup){
                const {discount_value, discount_type} = customerGroup
                if (discount_type === "Percentage") {
                    let offerValue = (regularPrice / 100) * parseFloat(discount_value);
    
                    sellerPrice = regularPrice - offerValue
                    discountPercentage = parseFloat(discount_value)
                }
                else {
                    sellerPrice = regularPrice - parseFloat(discount_value)
                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice)) * 100
                }

                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice,
                    attributs: prod?.attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: discountPercentage,
                    attributesName
                }
            }
            else if(storeOffer){
                const {offer_type, offer_value} = storeOffer
                if (offer_type === "Percentage") {
                    let offerValue = (regularPrice / 100) * parseFloat(offer_value);
    
                    sellerPrice = regularPrice - offerValue
                    discountPercentage = parseFloat(offer_value)
                }
                else {
                    sellerPrice = regularPrice - parseFloat(offer_value)
                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
                }

                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice,
                    attributs: prod?.attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: discountPercentage,
                    attributesName
                }
            }
            else{
                let offer = offer_price ? parseFloat(offer_price) : 0;
                let offerFromDate = moment(offer_date_from, "YYYY-MM-DD").isValid() ? moment(offer_date_from, "YYYY-MM-DD") : null
                let offerToDate = moment(offer_date_to, "YYYY-MM-DD").isValid() ? moment(offer_date_to, "YYYY-MM-DD") : null

                if (offer > 0) {
                    //products have offer price , check offer price in valid range
                    if (offerFromDate && offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                            sellerPrice = offer;
                        }
                        else {
                            sellerPrice = regularPrice
                        }
                    }
                    else if (offerFromDate && !offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                            sellerPrice = offer
                        }
                        else{
                            sellerPrice = regularPrice
                        }
                    }
                    else if (!offerFromDate && !offerToDate) {
                        sellerPrice = offer
                    }
                    else{
                        sellerPrice = regularPrice
                    }

                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
                    
                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: prod?.attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: discountPercentage
                    }
                }
                else{
                    sellerPrice = regularPrice
                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: prod?.attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: 0
                    }
                }
            }
        }
        else{ //stock not available
            return {
                _id: null,
                title: null,
                attributs: prod?.attributes,
                stock_value,
                available: false,
                stock: prod?.stock
            }
        }
    }
    else{ //product have unlimited stock
        available = true
        if (parseInt(regular_price) > 0) {
            regularPrice = parseInt(regular_price)
        }
        else {
            let comi;
            //product commission
            if (commission) {
                comi = parseInt(commission)
            }
            else { //get vendor commission
                let vendorCom = prod?.vendors?.additional_details?.commission
                if (vendorCom) {
                    comi = parseInt(vendorCom)
                }
                else {
                    //set commission as 0
                    comi = 0;
                }
            }
            let comm = (parseInt(seller_price) / 100) * comi
            let amount = parseInt(seller_price) + comm;
            regularPrice = amount
        }

        if(customerGroup){
            const {discount_value, discount_type} = customerGroup
            if (discount_type === "Percentage") {
                let offerValue = (regularPrice / 100) * parseFloat(discount_value);

                sellerPrice = regularPrice - offerValue
                discountPercentage = parseFloat(discount_value)
            }
            else {
                sellerPrice = regularPrice - parseFloat(discount_value)
                discountPercentage = (((regularPrice - sellerPrice) / regularPrice)) * 100
            }

            return {
                _id: null,
                title: null,
                regularPrice,
                sellerPrice,
                attributs: prod?.attributes,
                stock_value,
                available,
                stock: prod?.stock,
                discount: discountPercentage,
                attributesName
            }
        }
        else if(storeOffer){
            const {offer_type, offer_value} = storeOffer
            if (offer_type === "Percentage") {
                let offerValue = (regularPrice / 100) * parseFloat(offer_value);

                sellerPrice = regularPrice - offerValue
                discountPercentage = parseFloat(offer_value)
            }
            else {
                sellerPrice = regularPrice - parseFloat(offer_value)
                discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
            }

            return {
                _id: null,
                title: null,
                regularPrice,
                sellerPrice,
                attributs: prod?.attributes,
                stock_value,
                available,
                stock: prod?.stock,
                discount: discountPercentage,
                attributesName
            }
        }
        else{
            let offer = offer_price ? parseFloat(offer_price) : 0;
            let offerFromDate = moment(offer_date_from, "YYYY-MM-DD").isValid() ? moment(offer_date_from, "YYYY-MM-DD") : null
            let offerToDate = moment(offer_date_to, "YYYY-MM-DD").isValid() ? moment(offer_date_to, "YYYY-MM-DD") : null

            if (offer > 0) {
                //products have offer price , check offer price in valid range
                if (offerFromDate && offerToDate) {
                    if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                        sellerPrice = offer;
                    }
                    else {
                        sellerPrice = regularPrice
                    }
                }
                else if (offerFromDate && !offerToDate) {
                    if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                        sellerPrice = offer
                    }
                    else{
                        sellerPrice = regularPrice
                    }
                }
                else if (!offerFromDate && !offerToDate) {
                    sellerPrice = offer
                }
                else{
                    sellerPrice = regularPrice
                }

                discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
                
                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice,
                    attributs: prod?.attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: discountPercentage
                }
            }
            else{
                sellerPrice = regularPrice
                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice,
                    attributs: prod?.attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: 0
                }
            }
        }
    }
}