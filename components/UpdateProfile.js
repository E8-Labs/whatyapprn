import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Apipath } from "../Api/Apipaths"

export const updateProfile = async (apidata) => {
    console.log('api data is', apidata)
    // return
    try {
        const data = await AsyncStorage.getItem("USER")
        if (data) {
            let u = JSON.parse(data)

            const response = await axios.post(Apipath.updateProfile, apidata, {
                headers: {
                    'Authorization': 'Bearer ' + u.token,
                }
            })

            if (response.data) {
                if (response.data.status === true) {
                    console.log('updata profile data is', response.data.data)
                    u.user = response.data.data
                    AsyncStorage.setItem("USER", JSON.stringify(u))
                    return response.data.data
                }else{
                    console.log('update profile message is', response.data.message)
                    return ""
                }
            }
        }
    } catch (e) {
        console.log('update profile api error is', e)
    }
}