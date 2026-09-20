import { createContext ,useState, useEffect} from "react";
import { getMe } from "./services/auth.api";

 export const AuthContext = createContext();
 export const Authprovider=({children})=>{
    const [User,Setuser]=useState(null)
    const [loading,Setloading]=useState(true)
    useEffect(()=>{
       const getandsetuser= async()=>{
        try{
        const data = await getMe()
        Setuser(data.user)
        }catch{
        Setuser(null)
        }finally{
        Setloading(false)
        }
        }
       getandsetuser();
    },[])
    return<AuthContext.Provider value ={{User,Setuser,loading,Setloading}}>
        {children}</AuthContext.Provider>
 }