import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getProducts(productsArray, offer_status = true) {

    const user = await AsyncStorage.getItem("user");
    let customerGroup;

    if (user) {
        let userData = JSON.parse(user)
        if (userData?.customer_group) {
            customerGroup = userData?.customer_group
        }
    }


    


    let products = [];

    await productsArray?.map(async prod => {
        let result = await getProductPrice(prod, customerGroup, offer_status)
        let { _id, product_id, name, store, stock, minimum_qty, product_image, is_wishlist, attributes, vendors, availability } = prod

        let stores = {
            _id: vendors?._id,
            store_name: vendors?.store_name,
            store_address: vendors?.store_address,
            start_time: vendors?.start_time,
            end_time: vendors?.end_time,
            store_logo: vendors?.original_store_logo
        }

        let minQty = minimum_qty ? parseFloat(minimum_qty) : 1



        let newProduct = {
            _id,
            product_id,
            name,
            store_name: store?.name,
            price: result?.sellerPrice,
            regular_price: result?.regularPrice,
            product_image,
            discount_percentage: parseFloat(result?.discount).toFixed(2),
            variant_id: result?._id,
            attributes: result?.attributs,
            stock,
            minQty,
            stockValue: result?.stock_value,
            is_wishlist,
            available: result?.available,
            attributesName: result?.attributesName,
            quantity: parseInt(prod?.quantity) >= minQty ?  parseInt(prod?.quantity) :  parseInt(minQty),
            stores,
            availability
        }


        products.push(newProduct)



    })

    return products;

}

function VariantsPrice(pr, stock, minQty, vendorComission){
    const { seller_price, regular_price, offer_price, attributs, offer_date_from, offer_date_to, fixed_delivery_price, _id, title, stock_value, commission } = pr

    let available = false, regularPrice, sellerPrice, discountPercentage;
    if (stock) {
        if (parseInt(minQty) <= parseInt(stock_value)) {
            available = true
            let offer = offer_price ? parseFloat(offer_price) : 0;
            let offerFromDate = moment(offer_date_from, "YYYY-MM-DD").isValid() ? moment(moment(`${offer_date_from} 00:00:00`) , "YYYY-MM-DD HH:mm:ss") : null
            let offerToDate = moment(offer_date_to, "YYYY-MM-DD").isValid() ? moment(moment(`${offer_date_to} 23:59:59`, "YYYY-MM-DD HH:mm:ss")) : null

            if (offer > 0) {
                //products have offer price , check offer price in valid range
                if (offerFromDate && offerToDate) {
                    if (moment() >= offerFromDate && moment() <= offerToDate) {
                        sellerPrice = offer;
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
                    else if (regular_price > 0) {
                        sellerPrice = regular_price

                        return {
                            _id,
                            title,
                            regularPrice: regular_price,
                            sellerPrice,
                            attributs,
                            stock_value,
                            available,
                            stock: pr?.stock,
                            discount: 0
                        }
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
                        sellerPrice = amount

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
                else if (offerFromDate && !offerToDate) {
                    if (moment() >= offerFromDate) {
                        sellerPrice = offer
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
                    else if (regular_price > 0) {
                        sellerPrice = regular_price

                        return {
                            _id,
                            title,
                            regularPrice: regular_price,
                            sellerPrice,
                            attributs,
                            stock_value,
                            available,
                            stock: pr?.stock,
                            discount: 0
                        }
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
                        sellerPrice = amount

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
                else if (!offerFromDate && !offerToDate) {
                    sellerPrice = offer
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
                else if (regular_price > 0) {
                    sellerPrice = regular_price

                    return {
                        _id,
                        title,
                        regularPrice: regular_price,
                        sellerPrice,
                        attributs,
                        stock_value,
                        available,
                        stock: pr?.stock,
                        discount: 0
                    }
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
                    sellerPrice = amount

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
            else if (parseInt(regular_price) > 0) {
                regularPrice = parseInt(regular_price)
                sellerPrice = regular_price

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
                return {
                    _id,
                    title,
                    regularPrice,
                    sellerPrice: regularPrice,
                    attributs,
                    stock_value,
                    available,
                    stock: pr?.stock,
                    discount: 0
                }
            }
        }
        else {
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
    else {
        available = true
        if (parseInt(regular_price) > 0) {
            regularPrice = parseInt(regular_price)

            return {
                _id,
                title,
                regularPrice,
                sellerPrice: regularPrice,
                attributs,
                stock_value,
                available,
                stock: pr?.stock,
                discount: 0
            }
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

            return {
                _id,
                title,
                regularPrice,
                sellerPrice: regularPrice,
                attributs,
                stock_value,
                available,
                stock: pr?.stock,
                discount: 0
            }
        }
    }
}


function customerGroupVariantsPrice(pr, customerGroupDiscount, customerGroupDiscountType, stock, minQty, vendorComission) {
    const { seller_price, regular_price, offer_price, attributs, offer_date_from, offer_date_to, fixed_delivery_price, _id, title, stock_value, commission } = pr

    let available = false, regularPrice, sellerPrice, discountPercentage;

    if (stock) {
        if (parseInt(minQty) <= parseInt(stock_value)) {
            available = true
            if (parseInt(regular_price) > 0) {
                regularPrice = parseFloat(regular_price)
            }
            else {
                let comi;
                //product commission
                if (commission) {
                    comi = parseFloat(commission)
                }
                else { //get vendor commission
                    if (vendorComission) {
                        comi = parseFloat(vendorComission)
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


            

            if (customerGroupDiscountType?.toLowerCase() === "percentage") {
                let offerValue = (regularPrice / 100) * customerGroupDiscount;

                sellerPrice = regularPrice - offerValue
                discountPercentage = customerGroupDiscount
            }
            else {
                sellerPrice = regularPrice - customerGroupDiscount
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
        else {
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
    else {
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


        if (customerGroupDiscountType?.toLowerCase() === "percentage") {
            let offerValue = (regularPrice / 100) * customerGroupDiscount;

            sellerPrice = regularPrice - offerValue
            discountPercentage = customerGroupDiscount
        }
        else {
            sellerPrice = regularPrice - customerGroupDiscount
            discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)
        }


        return {
            _id,
            title,
            regularPrice,
            sellerPrice,
            attributs,
            stock_value,
            available: true,
            stock: stock,
            discount: discountPercentage
        }

        
    }
}


function NormalProductPrice(prod){
    let available = false, regularPrice, sellerPrice;
    let minQty = prod?.minimum_qty ? parseFloat(prod?.minimum_qty) : 1
    let attributesName;
    if (prod?.attributes) {
        let names = prod?.attributes?.map(att => att?.options[0]);
        attributesName = names?.join(', ')
    }

    if (prod?.stock) {
        const { stock_value, regular_price, seller_price, commission, offer_date_from, offer_date_to, offer_price, attributes } = prod
        if (parseInt(minQty) <= parseInt(stock_value)) {
            available = true
            let offer = offer_price ? parseFloat(offer_price) : 0;
            let offerFromDate = moment(offer_date_from, "YYYY-MM-DD").isValid() ? moment(`${offer_date_from} 00:00:00`, "YYYY-MM-DD HH:mm:ss") : null
            let offerToDate = moment(offer_date_to, "YYYY-MM-DD").isValid() ? moment(`${offer_date_to} 23:59:59`, "YYYY-MM-DD HH:mm:ss") : null

            if (offer > 0) {
                //products have offer price , check offer price in valid range
                if (offerFromDate && offerToDate) {
                    if (moment() >= offerFromDate && moment() <= offerToDate) {
                        sellerPrice = offer;
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

                        discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)

                        return {
                            _id: null,
                            title: null,
                            regularPrice,
                            sellerPrice,
                            attributs: attributes,
                            stock_value,
                            available,
                            stock: prod?.stock,
                            discount: discountPercentage
                        }
                    }
                    else if (regular_price > 0) {
                        sellerPrice = regular_price

                        return {
                            _id: null,
                            title: null,
                            regularPrice: regular_price,
                            sellerPrice,
                            attributs: attributes,
                            stock_value,
                            available,
                            stock: prod?.stock,
                            discount: 0
                        }
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
                        sellerPrice = amount

                        return {
                            _id: null,
                            title: null,
                            regularPrice,
                            sellerPrice,
                            attributs: attributes,
                            stock_value,
                            available,
                            stock: prod?.stock,
                            discount: 0
                        }
                        
                    }
                }
                else if (offerFromDate && !offerToDate) {
                    if (moment() >= offerFromDate) {
                        sellerPrice = offer
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

                        discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)

                        return {
                            _id: null,
                            title: null,
                            regularPrice,
                            sellerPrice,
                            attributs: attributes,
                            stock_value,
                            available,
                            stock: prod?.stock,
                            discount: discountPercentage
                        }
                    }
                    else if (regular_price > 0) {
                        sellerPrice = regular_price

                        return {
                            _id: null,
                            title: null,
                            regularPrice: regular_price,
                            sellerPrice,
                            attributs: attributes,
                            stock_value,
                            available,
                            stock: prod?.stock,
                            discount: 0
                        }
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
                        sellerPrice = amount

                        return {
                            _id: null,
                            title: null,
                            regularPrice,
                            sellerPrice,
                            attributs: attributes,
                            stock_value,
                            available,
                            stock: prod?.stock,
                            discount: 0
                        }
                        
                    }
                }
                else if (!offerFromDate && !offerToDate) {
                    sellerPrice = offer
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

                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)

                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: discountPercentage
                    }
                }
                else if (regular_price > 0) {
                    sellerPrice = regular_price

                    return {
                        _id: null,
                        title: null,
                        regularPrice: regular_price,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: 0
                    }
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
                    sellerPrice = amount

                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: 0
                    }
                    
                }
            }
            else if (parseInt(regular_price) > 0) {
                regularPrice = parseInt(regular_price)

                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice: regularPrice,
                    attributs: attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: 0
                }
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
                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice: regularPrice,
                    attributs: attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: 0
                }
            }
        }
        else {
            return {
                _id: null,
                title: null,
                attributs: null,
                stock_value,
                available: false,
                stock: prod?.stock
            }
        }
    }
    else {
        const { stock_value, regular_price, seller_price, commission, _id, attributes, offer_date_from, offer_date_to, offer_price } = prod
        available = true
        let offer = offer_price ? parseFloat(offer_price) : 0;
        let offerFromDate = moment(offer_date_from, "YYYY-MM-DD").isValid() ? moment(`${offer_date_from} 00:00:00`, "YYYY-MM-DD HH:mm:ss") : null
        let offerToDate = moment(offer_date_to, "YYYY-MM-DD").isValid() ? moment(`${offer_date_to} 23:59:59`, "YYYY-MM-DD HH:mm:ss") : null

        if (offer > 0) {
            //products have offer price , check offer price in valid range
            if (offerFromDate && offerToDate) {
                if (moment() >= offerFromDate && moment() <= offerToDate) {
                    sellerPrice = offer;
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

                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)

                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: discountPercentage
                    }
                }
                else if (regular_price > 0) {
                    sellerPrice = regular_price

                    return {
                        _id: null,
                        title: null,
                        regularPrice: regular_price,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: 0
                    }
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
                    sellerPrice = amount

                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: 0
                    }
                    
                }
            }
            else if (offerFromDate && !offerToDate) {
                if (moment() >= offerFromDate) {
                    sellerPrice = offer
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

                    discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)

                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: discountPercentage
                    }
                }
                else if (regular_price > 0) {
                    sellerPrice = regular_price

                    return {
                        _id: null,
                        title: null,
                        regularPrice: regular_price,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: 0
                    }
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
                    sellerPrice = amount

                    return {
                        _id: null,
                        title: null,
                        regularPrice,
                        sellerPrice,
                        attributs: attributes,
                        stock_value,
                        available,
                        stock: prod?.stock,
                        discount: 0
                    }
                    
                }
            }
            else if (!offerFromDate && !offerToDate) {
                sellerPrice = offer
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

                discountPercentage = (((regularPrice - sellerPrice) / regularPrice) * 100)

                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice,
                    attributs: attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: discountPercentage
                }
            }
            else if (regular_price > 0) {
                sellerPrice = regular_price

                return {
                    _id: null,
                    title: null,
                    regularPrice: regular_price,
                    sellerPrice,
                    attributs: attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: 0
                }
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
                sellerPrice = amount

                return {
                    _id: null,
                    title: null,
                    regularPrice,
                    sellerPrice,
                    attributs: attributes,
                    stock_value,
                    available,
                    stock: prod?.stock,
                    discount: 0
                }
                
            }
        }
        else if (parseInt(regular_price) > 0) {
            regularPrice = parseInt(regular_price)
            return {
                _id: null,
                title: null,
                regularPrice,
                sellerPrice: regularPrice,
                attributs: attributes,
                stock_value,
                available,
                stock: prod?.stock,
                discount: 0
            }
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
            return {
                _id: null,
                title: null,
                regularPrice,
                sellerPrice: regularPrice,
                attributs: attributes,
                stock_value,
                available,
                stock: prod?.stock,
                discount: 0
            }
        }

    }
}


function customerGroupPrice(prod, customerGroupDiscount, customerGroupDiscountType) {


    let available = false, regularPrice, sellerPrice;
    let minQty = prod?.minimum_qty ? parseFloat(prod?.minimum_qty) : 1
    let attributesName;
    if (prod?.attributes) {
        let names = prod?.attributes?.map(att => att?.options[0]);
        attributesName = names?.join(', ')
    }
    if (prod?.stock) {
        const { stock_value, regular_price, seller_price, commission } = prod
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

            if (customerGroupDiscountType?.toLowerCase() === "percentage") {
                let offerValue = (regularPrice / 100) * customerGroupDiscount;

                sellerPrice = regularPrice - offerValue
                discountPercentage = customerGroupDiscount
            }
            else {
                sellerPrice = regularPrice - customerGroupDiscount
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
        else {
            return {
                _id: null,
                title: null,
                attributs: null,
                stock_value,
                available: false,
                stock: prod?.stock
            }
        }
    }
    else {
        const { stock_value, regular_price, seller_price, commission, _id, name } = prod
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

        if (customerGroupDiscountType?.toLowerCase() === "percentage") {
            let offerValue = (regularPrice / 100) * customerGroupDiscount;

            sellerPrice = regularPrice - offerValue
            discountPercentage = customerGroupDiscount
        }
        else {
            sellerPrice = regularPrice - customerGroupDiscount
            discountPercentage = (((regularPrice - sellerPrice) / regularPrice)) * 100
        }

        

        return {
            _id: null,
            title: null,
            regularPrice,
            sellerPrice,
            attributs: prod?.attributes,
            stock_value,
            available: true,
            stock: prod?.stock,
            discount: discountPercentage,
            attributesName
        }
    }
}


async function getProductPrice(prod, customerGroup, offer_status) {
    let comi;
    let minQty = prod?.minimum_qty ? parseFloat(prod?.minimum_qty) : 1
    let vendorCom = prod?.vendors?.additional_details?.commission
    if (vendorCom) {
        comi = parseFloat(vendorCom)
    }
    if (customerGroup) {
        if (prod?.variants?.length > 0) {
            let variants;
            if(prod?.selectedVariant){
                let variant = await prod?.variants?.find(vr => vr?._id === prod?.selectedVariant);
                let res = customerGroupVariantsPrice(variant, parseFloat(customerGroup?.discount_value), customerGroup?.discount_type, prod?.stock, minQty, comi) 
                variants = [res];
            }
            else{
                variants = await prod?.variants?.map(pr => {
                    return customerGroupVariantsPrice(pr, parseFloat(customerGroup?.discount_value), customerGroup?.discount_type, prod?.stock, minQty, comi)
                })
            }


            let available = variants?.filter((vari) => vari?.available === true);
            let result = available
            if(available?.length > 0){
                result = available.reduce(function (res, obj) {
                    return (obj.sellerPrice < res.sellerPrice) ? obj : res;
                });
            }
            // var result = variants?.filter((vari) => vari?.available === true)?.reduce(function (res, obj) {
            //     return (obj.sellerPrice < res.sellerPrice) ? obj : res;
            // });

            result['attributesName'] = result?.attributs?.join(', ')


            return result
        }
        else {
            return customerGroupPrice(prod, parseFloat(customerGroup?.discount_value), customerGroup?.discount_type)
        }
    }
    else if(prod?.validStoreOffer && moment(prod?.validStoreOffer?.expiry_date,"YYYY-MM-DD HH:mm") > moment() && offer_status){
        //store have offer
        const { offer_type, offer_value } = prod?.validStoreOffer
        if (prod?.variants?.length > 0) {

            let variants;
            if(prod?.selectedVariant){
                let variant = await prod?.variants?.find(vr => vr?._id === prod?.selectedVariant);
                let res = customerGroupVariantsPrice(variant, parseFloat(offer_value), offer_type, prod?.stock, minQty, comi) 
                variants = [res];
            }
            else{
                variants = await prod?.variants?.map(pr => {
                    return customerGroupVariantsPrice(pr, parseFloat(offer_value), offer_type, prod?.stock, minQty, comi)
                })
            }



            let available = variants?.filter((vari) => vari?.available === true);
            let result = available

            if(available?.length > 0){
                result = available?.reduce(function (res, obj) {
                    return (obj?.sellerPrice < res?.sellerPrice) ? obj : res;
                });
            }



            

            result['attributesName'] = result?.attributs?.join(', ')

            return result
        }
        else {
            return customerGroupPrice(prod, parseFloat(offer_value), offer_type)
        }
    }
    else{
        if (prod?.variants?.length > 0) {
            let variants;
            if(prod?.selectedVariant){
                let variant = await prod?.variants?.find(vr => vr?._id === prod?.selectedVariant);
                let res = VariantsPrice(variant, prod?.stock, minQty, comi) 
                variants = [res];
            }
            else{
                variants = await prod?.variants?.map(pr => {
                    return VariantsPrice(pr, prod?.stock, minQty, comi)
                })
            }

            // let variants = await prod?.variants?.map(pr => {
            //     return VariantsPrice(pr, parseInt(prod?.stock), minQty, comi)
            // })

            

            let available = variants?.filter((vari) => vari?.available === true);
            let result = available

            if(available?.length > 0){
                result = available?.reduce(function (res, obj) {
                    return (obj.sellerPrice < res.sellerPrice) ? obj : res;
                });
            }
            




            result['attributesName'] = result?.attributs?.join(', ')

            return result
        }
        else{
            return NormalProductPrice(prod)
        }
    }
}