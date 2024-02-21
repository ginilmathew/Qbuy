import { NativeModules } from "react-native"


const { env, mode } = NativeModules.RNENVConfig

export const MAPS_KEY = "AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY"

const URLS = {
    live: "https://apiqbuygreen.diginestsolutions.in/public/api/",
    testing: "https://apiqbuypanda.diginestsolutions.in/public/api/",
    dev: "https://apiqbuypanda.diginestsolutions.in/public/api/",
    demo: "https://apigreenstore.diginestsolutions.in/public/api/"
}

const IMG_BASEPATH = {
    live: "https://apiqbuygreen.diginestsolutions.in/public/",
    testing: "https://apiqbuypanda.diginestsolutions.in/public/",
    dev: "https://apiqbuypanda.diginestsolutions.in/public/",
    demo: "https://apigreenstore.diginestsolutions.in/public/"
}

//export const mode = "fashion"


//export const BASE_URL = URLS[env]
export const BASE_URL = URLS[env]

//export const IMG_URL = IMG_BASEPATH[env]
export const IMG_URL = IMG_BASEPATH[env]

export const location = [8.5728749, 76.8636977];