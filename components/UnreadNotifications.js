import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Apipath } from "../Api/Apipaths"

export async function unreadNotification () {
    try{
        let data = await AsyncStorage.getItem("USER")

        if(data){
            let u = JSON.parse(data)
            let path = Apipath.adminUnreadChat
            console.log('u.user.id', u.token)
            let apidata = {}
            // path = path+"?userid="+u.user.id
            const response = await axios.post(path,apidata,{
                headers:{
                    
                    "Authorization":'Bearer '+ u.token,
                    "Content-Type":'application/json'
                }
            })

            if(response.data){
                if(response.data.status == true){
                    console.log('unread api called',)
                    u.user.unread = 0
                    AsyncStorage.setItem("USER",JSON.stringify(u))
                }else{
                    console.log('unread api message is', response.data.message)
                }
            }
        }
    }catch(e){
        console.log('error in unread api', e)
    }
}