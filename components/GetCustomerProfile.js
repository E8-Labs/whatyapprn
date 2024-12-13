import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Apipath } from "../Api/Apipaths"

export const getCutomerProfile =async (item) =>{
    try{
        const data= await AsyncStorage.getItem("USER")

        if(data){
            let u =JSON.parse(data)
            // console.log('user data is', u)
            let apidata = {
                viewedUserId:item.id
            }
            const response  = await axios.post(Apipath.addProfileView,apidata,{
                headers:{
                    
                    "Authorization":'Bearer '+ u.token,
                    "Content-Type":'application/json'
                }
            })

            if(response.data){
                console.log('add  profile data is', response.data.data)
                return response.data.data
            }
        }
    } catch(e){
        console.log('add profile view api error', e)
    }
}