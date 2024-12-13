import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Apipath } from "../Api/Apipaths"

export const getProfile = async () => {
    try {
        const data = await AsyncStorage.getItem("USER")

        if (data) {
            let u = JSON.parse(data)
            console.log('trying to get profile')

            const response = await axios.get(Apipath.getProfile, {
                headers: {
                    "Authorization": 'Bearer ' + u.token,
                }
            })

            if (response.data) {
                u.user = response.data.data
                AsyncStorage.setItem("USER", JSON.stringify(u))
                console.log('get  profile data is', response.data.data)
                return response.data.data
            }
        }
    } catch (e) {
        console.log('add profile view api error', e)
    }
}