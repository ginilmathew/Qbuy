import moment from "moment";
import { min, max } from 'lodash'
import reactotron from "../ReactotronConfig";

export function getProduct (product) {



    let { _id, product_id, name, description, store, franchisee, weight, type, image, stock, minimum_qty, product_image, order_count, is_wishlist, viewCount, attributes, video_link, status, category_type } = product

    // reactotron.log({ is_wishlist })
    let variant = product?.variants?.length > 0 ? true : false
    let minQty = minimum_qty ? parseFloat(minimum_qty) : 1
    let vendorCommission = product?.vendors?.additional_details?.commission ? parseFloat(product?.vendors?.additional_details?.commission) : 0

    let attri = attributes?.length > 0 ? true : false



    let newProduct = {
        _id,
        product_id,
        name,
        description,
        store,
        franchisee,
        weight,
        type,
        image,
        stock,
        minQty,
        product_image,
        order_count,
        is_wishlist,
        variant,
        viewCount,
        attributes: attributes,
        video_link,
        status: status,
        category_type

    }


    let variants = [];
    if (variant) {
        product?.variants?.map(vari => {
            let offer = vari?.offer_price ? parseFloat(vari?.offer_price) : 0;
            let offerFromDate = moment(vari?.offer_date_from).isValid() ? moment(vari?.offer_date_from, "YYYY-MM-DD") : null
            let offerToDate = moment(vari?.offer_date_to).isValid() ? moment(vari?.offer_date_to, "YYYY-MM-DD") : null
            let regular = vari?.regular_price ? parseFloat(vari?.regular_price) : 0
            let seller = vari?.seller_price ? parseFloat(vari?.seller_price) : 0
            let commission = vari?.commission ? parseFloat(vari?.commission) : vendorCommission
            let delivery = vari?.fixed_delivery_price ? parseFloat(vari?.fixed_delivery_price) : 0
            let stockValue = vari?.stock_value ? parseFloat(vari?.stock_value) : 0
            let price;

            if (stock) {
                //if product requires stock
                if (minQty <= stockValue) {
                    if (offer > 0) {
                        //products have offer price , check offer price in valid range
                        if (offerFromDate && offerToDate) {
                            if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                                price = offer;
                            }
                            else if (regular > 0) {
                                price = regular
                            }
                            else {
                                let comm = (seller / 100) * commission
                                let amount = seller + comm;
                                price = amount
                            }
                        }
                        else if (offerFromDate && !offerToDate) {
                            if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                                price = offer
                            }
                            else if (regular > 0) {
                                price = regular
                            }
                            else {
                                let comm = (seller / 100) * commission
                                let amount = seller + comm;
                                price = amount
                            }
                        }
                        else if (!offerFromDate && !offerToDate) {
                            price = offer
                        }
                        else {
                            if (regular > 0) {
                                price = regular
                            }
                            else {
                                let comm = (seller / 100) * commission
                                let amount = seller + comm;
                                price = amount
                            }
                        }
                    }
                    else if (regular > 0) {
                        price = regular
                    }
                    else {
                        let comm = (seller / 100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                    variants.push({
                        id: vari?._id,
                        title: vari?.title,
                        attributs: vari?.attributs,
                        price: parseFloat(price).toFixed(2),
                        minQty,
                        stockValue,
                        delivery,
                        available: true
                    })
                }
                else {
                    //out of stock
                    variants.push({
                        id: vari?._id,
                        title: vari?.title,
                        attributs: vari?.attributs,
                        price: null,
                        minQty,
                        stockValue,
                        delivery,
                        available: false
                    })
                }
            }
            else {
                //no need to check stock
                if (offer > 0) {
                    //products have offer price , check offer price in valid range
                    if (offerFromDate && offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                            price = offer;
                        }
                        else if (regular > 0) {
                            price = regular
                        }
                        else {
                            let comm = (seller / 100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                    else if (offerFromDate && !offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                            price = offer
                        }
                        else if (regular > 0) {
                            price = regular
                        }
                        else {
                            let comm = (seller / 100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                    else if (!offerFromDate && !offerToDate) {
                        price = offer
                    }
                    else {
                        if (regular > 0) {
                            price = regular
                        }
                        else {
                            let comm = (seller / 100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                }
                else if (regular > 0) {
                    price = regular
                }
                else {
                    let comm = (seller / 100) * commission
                    let amount = seller + comm;
                    price = amount
                }
                variants.push({
                    id: vari?._id,
                    title: vari?.title,
                    attributs: vari?.attributs,
                    price: parseFloat(price).toFixed(2),
                    minQty,
                    stockValue,
                    delivery,
                    available: true
                })
            }
        })
        newProduct['variants'] = variants;
        // Get the minimum price
        let priceList = [];
        variants.map(vari => {
            if (vari?.available) {
                if (vari?.price) {
                    priceList.push(parseFloat(vari?.price))
                }

            }
        })

        if (priceList?.length > 1) {
            newProduct['price'] = `${parseFloat(min(priceList)).toFixed(2)}-${parseFloat(max(priceList)).toFixed(2)}`
            newProduct['available'] = true
        }
        else if (priceList?.length === 1) {
            newProduct['price'] = parseFloat(priceList[0]).toFixed(2)
            newProduct['available'] = true
        }
        else {
            newProduct['available'] = false
            newProduct['price'] = null
        }

    }
    else {
        if(attri){
            newProduct['attributes'] = attributes
        }
        let offer = product?.offer_price ? parseFloat(product?.offer_price) : 0;
        let offerFromDate = moment(product?.offer_date_from).isValid() ? moment(product?.offer_date_from, "YYYY-MM-DD") : null
        let offerToDate = moment(product?.offer_date_to).isValid() ? moment(product?.offer_date_to, "YYYY-MM-DD") : null
        let regular = product?.regular_price ? parseFloat(product?.regular_price) : 0
        let seller = product?.seller_price ? parseFloat(product?.seller_price) : 0
        let commission = product?.commission ? parseFloat(product?.commission) : vendorCommission
        let delivery = product?.fixed_delivery_price ? parseFloat(product?.fixed_delivery_price) : 0
        let stockValue = product?.stock_value ? parseFloat(product?.stock_value) : 0
        let price;
        if (stock) {
            if (stockValue >= minQty) {
                if (offer > 0) {
                    //products have offer price , check offer price in valid range
                    if (offerFromDate && offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                            price = offer;
                        }
                        else if (regular > 0) {
                            price = regular
                        }
                        else {
                            let comm = (seller / 100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                    else if (offerFromDate && !offerToDate) {
                        if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                            price = offer
                        }
                        else if (regular > 0) {
                            price = regular
                        }
                        else {
                            let comm = (seller / 100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                    else if (!offerFromDate && !offerToDate) {
                        price = offer
                    }
                    else {
                        if (regular > 0) {
                            price = regular
                        }
                        else {
                            let comm = (seller / 100) * commission
                            let amount = seller + comm;
                            price = amount
                        }
                    }
                }
                else if (regular > 0) {
                    price = regular
                }
                else {
                    let comm = (seller / 100) * commission
                    let amount = seller + comm;
                    price = amount
                }
                newProduct['available'] = true
                newProduct['price'] = parseFloat(price).toFixed(2);
            }
            else {
                //OUT OF STOCK
                newProduct['available'] = false;
                newProduct['price'] = null;
            }
        }
        else {
            if (offer > 0) {
                //products have offer price , check offer price in valid range
                if (offerFromDate && offerToDate) {
                    if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate && moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") <= offerToDate) {
                        price = offer;
                    }
                    else if (regular > 0) {
                        price = regular
                    }
                    else {
                        let comm = (seller / 100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                }
                else if (offerFromDate && !offerToDate) {
                    if (moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") >= offerFromDate) {
                        price = offer
                    }
                    else if (regular > 0) {
                        price = regular
                    }
                    else {
                        let comm = (seller / 100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                }
                else if (!offerFromDate && !offerToDate) {
                    price = offer
                }
                else {
                    if (regular > 0) {
                        price = regular
                    }
                    else {
                        let comm = (seller / 100) * commission
                        let amount = seller + comm;
                        price = amount
                    }
                }

            }
            else if (regular > 0) {
                price = regular
            }
            else {
                let comm = (seller / 100) * commission
                let amount = seller + comm;
                price = amount
            }

            newProduct['price'] = parseFloat(price).toFixed(2);
            newProduct['available'] = true;
        }
        newProduct['stockValue'] = stockValue;
        newProduct['delivery'] = delivery;
    }

    return newProduct;

}