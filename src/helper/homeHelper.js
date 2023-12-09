import { getProduct } from "./productHelper";

export function getHomeProduct(homeDatas, filter){
    let categories = homeDatas?.data?.data?.[0];
    let recentes = homeDatas?.data?.data?.[2]
    let suggestions = homeDatas?.data?.data?.[4];
    let products = homeDatas?.data?.data?.[3];

    if(filter === "all"){
        let recentProducts = recentes?.data.slice(0,10)?.map(recent => {
            return getProduct(recent)
        })
    
        let suggestedProducts = suggestions?.data.slice(0,10)?.map(recent => {
            return getProduct(recent)
        })
    
        let productsList = products?.data.slice(0,26)?.map(recent => {
            return getProduct(recent)
        })

        return [categories, 
            {
                title: "Recently Viewed",
                data: recentProducts
            }, 
            {
                title: "Panda Suggestions",
                data: suggestedProducts
            },
            {
                title: "Products",
                data: productsList
            }
        ]
    }
    else{
        let recentProducts = recentes?.data.filter((data => data?.category_type === filter))?.map(recent => {
            return getProduct(recent)
        })
    
        let suggestedProducts = suggestions?.data.filter((data => data?.category_type === filter))?.map(recent => {
            return getProduct(recent)
        })
    
        let productsList = products?.data.filter((data => data?.category_type === filter))?.map(recent => {
            return getProduct(recent)
        })

        return [categories, 
            {
                title: "Recently Viewed",
                data: recentProducts
            }, 
            {
                title: "Panda Suggestions",
                data: suggestedProducts
            },
            {
                title: "Products",
                data: productsList
            }
        ]
    }
    
}