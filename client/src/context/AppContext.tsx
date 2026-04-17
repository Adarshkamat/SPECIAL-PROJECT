import { createContext, useContext, useEffect, useState } from "react";
import { type ActivityEntry, type FoodEntry, initialState, type User, type Credentials } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";

import toast from "react-hot-toast";


const AppContext = createContext(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {


    const navigate = useNavigate();
    const [user, setUser] = useState<User>(null);
    const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token')?false:true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const signup = async (credentials:Credentials)=> {
        try
       { const {data} = await api.post('/api/auth/local/register',credentials)
        setUser({...data.user,token:data.jwt})
        if(data?.user.age && data?.user.weight && data?.user.height){
            setOnboardingCompleted(true)
        }

        localStorage.setItem("token", data.jwt)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`
       }catch(err){
            console.log(err);
            toast.error("There's an error")
            
       }
    }

    const login = async (credentials:Credentials) => {
      try{  const {data} = await api.post('/api/auth/local',{identifier:credentials.email, password :credentials.password})
        setUser({...data.user,token:data.jwt})
        if(data?.user.age && data?.user.weight && data?.user.height){
            setOnboardingCompleted(true)
        }
        localStorage.setItem("token", data.jwt)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`
}catch(err){
     console.log(err);
            toast.error("There's an error")
}
    }


    const fetchUser = async (token:string) => {
        try{const {data} = await api.get('/api/users/me',{headers:{Authorization:`Bearer ${token}`}})
        setUser({...data,token})   
        if(data?.age && data?.weight && data?.height){
            setOnboardingCompleted(true)
        }   
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}catch(err){
    console.log(err);
            toast.error("There's an error")

}
setIsUserFetched(true)
    }

     const fetchFoodLogs = async (token:string) => {
       try{ 
        const {data} = await api.get('/api/food-logs',{headers:{Authorization:`Bearer ${token}`}})
        setAllFoodLogs(data)
    }
        catch(err){
            console.log(err);
            toast.error("There's an error")
        }
        
    }

    const fetchActivityLogs = async (token:string) => {
      try{ 
        const {data} = await api.get('/api/activity-logs',{headers:{Authorization:`Bearer ${token}`}})
        setAllActivityLogs(data)
    }
        catch(err){
            console.log(err);
            toast.error("There's an error")
        }
        
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setOnboardingCompleted(false)
        api.defaults.headers.common['Authorization'] = ""

        navigate("/login")
    }

    useEffect(()=>{
        const token = localStorage.getItem("token")

        if(token){
            (async ()=>{
                await fetchUser(token)
                await fetchFoodLogs(token)
                await fetchActivityLogs(token)
            })()
        }
        

    },[])

    const value={user, setUser,fetchUser, isUserFetched, setIsUserFetched, signup, login, logout, onboardingCompleted, setOnboardingCompleted, allFoodLogs, setAllFoodLogs, allActivityLogs, setAllActivityLogs, fetchFoodLogs, fetchActivityLogs}


    return <AppContext.Provider value={value}>    
        {children}
    </AppContext.Provider>



}


export const useAppContext = ()=> useContext(AppContext)
