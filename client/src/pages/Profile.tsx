import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import type { ProfileFormData } from "../types"
import Card from "../components/ui/Card"
import { Calendar, LogOutIcon,  RulerIcon, ScaleIcon, Target, User } from "lucide-react"
import Button from "../components/ui/Button"
import { goalLabels, goalOptions } from "../assets/assets"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"

import toast from "react-hot-toast"
import api from "../configs/api"

const Profile = () => {
  const {user,logout,fetchUser,allFoodLogs,allActivityLogs} = useAppContext()
  const [isEditing,setIsEditing] = useState(false)
  const [formdata,setFormData] = useState<ProfileFormData>({
    age:0,weight:0,height:0,goal:'maintain',dailyCalorieIntake:2000,dailyCalorieBurn:400
  })

  const fetchUserData = ()=>{
    if(user){
      setFormData({
        age:user?.age||0,
        weight:user?.weight||0,
        height:user?.height||0,
        goal:user?.goal||'maintain',
        dailyCalorieIntake:user?.dailyCalorieIntake||2000,
        dailyCalorieBurn:user?.dailyCalorieBurn||400,

      })
    }
  }

  useEffect(()=>{
    (()=>{
      fetchUserData()
    })()
  },[user])

  if(!user || !formdata) return null


  const handleSave = async ()=>{
    try{
     
      await api.put(`/api/users/${user.id}`,formdata)
      await fetchUser(user?.token || '')
      toast.success("Profile Updated")
    }catch(err){
      console.log(err)
      toast.error("There has been error while updating your data")
    }
    setIsEditing(false)
  }

  const getStats = ()=>{
    const totalFoodEntries = allFoodLogs?.length || 0  
    const totalActivities = allActivityLogs?.length || 0

    return {totalFoodEntries,totalActivities}
  }

  const stats = getStats()

  return (
    <div className="page-container">
      <div className="page-header"> 
        <h1 className="font-bold text-slate-800 text-2xl">Profile</h1>
        <p className="text-sm text-slate-500">Manage your settings</p>
        </div>

        <div className="profile-content">
          {/* left  */}
          <Card >
            <div className="flex items-center gap-4 mb-6">
              <div className="size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <User className="size-6 text-white"/>
              </div>
              <div>
                <h2 className="text-slate-700 font-semibold">Your Profile</h2>
                <p className="text-xs text-slate-400">Member since {new Date(user?.createdAt || "").toLocaleDateString()}</p>
              </div>
            </div>

            {isEditing ? (<div className="space-y-4">
              <Input label="Age" type="number" value={formdata.age} onChange={(v)=>{setFormData({...formdata,age:Number(v)})}} min={13} max={120}/>
              <Input label="Weight (kg)" type="number" value={formdata.weight} onChange={(v)=>{setFormData({...formdata,weight:Number(v)})}} min={20} max={300}/>
              <Input label="Height" type="number" value={formdata.height} onChange={(v)=>{setFormData({...formdata,height:Number(v)})}} min={100} max={250}/>
              <Select label="Fitness Goal" value={formdata.goal as string} onChange={(v)=>setFormData({...formdata,goal:v as 'lose'|'maintain'|'gain'})} options={goalOptions}/>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1" variant="secondary" onClick={()=>{
                  setIsEditing(false)
                  setFormData({
                    age:Number(user.age),
                    weight:Number(user.weight),
                    height:Number(user.height),
                    goal:user.goal||'',
                    dailyCalorieIntake:user.dailyCalorieIntake||2000,
                    dailyCalorieBurn:user.dailyCalorieBurn||400
                  })
                }}>
                  Cancel

                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save Changes

                </Button>

              </div>


            </div>):(
              <>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-50 eounded-lg">
                  <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center ">
                    <Calendar className="size-4 text-blue-600"/>
                  </div>
                  <div >
                    <p className="text-sm text-slate-500">Age</p>
                    <p className="font-semibold text-slate-800">{user.age} years</p>
                  </div>
                </div>

                {/* Weight 
                 */}

                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center ">
                    <ScaleIcon className="size-4 text-purple-600"/>
                  </div>
                  <div >
                    <p className="text-sm text-slate-500">Weight</p>
                    <p className="font-semibold text-slate-800">{user.weight} kgs</p>
                  </div>
                </div>

                {/* Height  */}

               {user.height !==0 && ( <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center ">
                    <RulerIcon className="size-4 text-green-600"/>
                  </div>
                  <div >
                    <p className="text-sm text-slate-500">Height</p>
                    <p className="font-semibold text-slate-800">{user.height} cm</p>
                  </div>
                </div>)}


                {/* Goal  */}

                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center ">
                    <Target className="size-4 text-orange-600"/>
                  </div>
                  <div >
                    <p className="text-sm text-slate-500">Goal</p>
                    <p className="font-semibold text-slate-800">{goalLabels[user?.goal||'gain']} </p>
                  </div>
                </div>


                </div>
                <Button className="w-full mt-4" variant="secondary" onClick={()=>{setIsEditing(true)}}>Edit Profile</Button>
              
              </>
            )}
          </Card>
          {/* right  */}
          <div className="space-y-4">
            <Card>
              <h3 className="mb-4 font-semibold text-slate-500">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-500 ">{stats.totalFoodEntries}</p>
                  <p className="text-sm text-slate-500">Food Entries</p>
                </div>
                <div className="text-center p-4 bg-blue-100 rounded-xl">
                  <p className="text-2xl font-bold text-blue-500 ">{stats.totalActivities}</p>
                  <p className="text-sm text-slate-500"> Activities</p>
                </div>
              </div>
              
            </Card>
            

            {/* Logout Button  */}

            <Button variant="danger" onClick={logout} className="w-full ring hover:ring-2 ring-red-300">
              <LogOutIcon className="size-4"/>
              Logout
            </Button>

            </div>
          </div>
          </div>

  )
}

export default Profile