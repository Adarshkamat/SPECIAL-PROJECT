import {  useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry } from "../types"
import Card from "../components/ui/Card"
import { quickActivities } from "../assets/assets"
import { ActivityIcon, DumbbellIcon, PlusIcon, TimerIcon, Trash2Icon } from "lucide-react"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import toast from "react-hot-toast"
import api from "../configs/api"


const ActivityLog = () => {
  const {allActivityLogs,setAllActivityLogs} = useAppContext()

  const [activities,setActivites] = useState<ActivityEntry[]>([])
  const [showForm,setShowForm] = useState(false)
  const [formdata,setFormdata]  = useState({name:"",duration:0,calories:0})
  const [error,setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const loadActivities = ()=>{
      const todayActivities = allActivityLogs.filter((a:ActivityEntry)=>a.createdAt?.split('T')[0]===today) 
      setActivites(todayActivities)
  }

  useEffect(()=>{
    (()=>{
      loadActivities()
    })()
  },[allActivityLogs])

  const handleQuickAdd = (activity : {name:string,rate: number})=>{
    setFormdata({
      name:activity.name,
      duration:30,
      calories:30* activity.rate
    })
    setShowForm(true)
  }

  const handleDurationChange = (val:string|number)=>{
    const duration = Number(val)
    const activity = quickActivities.find(a=>a.name === formdata.name)


    let calories = formdata.calories
    if(activity){
      calories= duration* activity.rate 

    }

    setFormdata({...formdata,duration,calories})
  }

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(!formdata.name.trim() || formdata.duration <=0)
      return toast("Please enter valid data")
    try{
      const {data} = await api.post(`/api/activity-logs`,{data:formdata})
      setAllActivityLogs(prev=>[...prev,data])
      setFormdata({name:'',duration:0,calories:0})
      setShowForm(false)
    }catch(err){
      console.log(err)
      toast.error("Failed to add activity");
      
    }

  }

  const handleDelete = async (documentId:string)=>{
    try{
      const confirm = window.confirm("Are you sure you want to delete this entry?")
      if(!confirm) return 

      await api.delete(`/api/activity-logs ${documentId}`)
      setAllActivityLogs(prev => prev.filter((a)=>a.documentId != documentId))
    }catch(err:any){
      console.log(err)
      toast.error("Failed to delete activity");
      

    }
  }

  const totalMinutes: number = activities.reduce((sum,a)=>sum + a.duration,0)

  return (
   <div className="page-container">
        <div className="page-header">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Activity Log</h1>
                    <p className="text-slate-500 text-sm">
                        Track your Workouts
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-600">Active Total</p>
                    <p className="text-xl font-bold text-blue-800">{totalMinutes} min</p>
                </div>
                
            </div>
        </div>
        
         <div className="page-content-grid">
          {/* Quick add section 
           */}

           {!showForm && (
            <div className="space-y-4">
              <Card className="">
                <h3 className="font-semibold text-slate-700 mb-3">Quick Add</h3>
                <div className="flex flex-wrap gap-2">
                  {quickActivities.map((activity)=>(
                    <button onClick={() => handleQuickAdd(activity)} key={activity.name} className="px-4 py-2 bg-slate-100 hover:bg-slate-300 rounded-xl text-sm font-medium text-slate-700">
                      {activity.emoji} {activity.name}
                    </button>
                  ))}
                </div>
              </Card>
              <Button className="w-full " onClick={()=>setShowForm(true)}>
                <PlusIcon className="size-5"/>
                Add Custom Activity
              </Button>
            </div>
           )}

           {/* Add form  */}

           {showForm && (
            <Card className="border-2 border-blue-200 ">
              <h3 className="font-semibold text-slate-800 mb-4">New Activity</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Activity Name" placeholder="e.g., Morning Run" required value={formdata.name} onChange={(e)=>{
                  setFormdata({...formdata,name:e.toString()})
                }}/>
                <div className="flex gap-4">
                  <Input label="Duration (min) "
                   type="number" className="flex-1" 
                   placeholder="e.g., 30" required min={1} max={300} 
                   value={formdata.duration} onChange={handleDurationChange}
                />

                 <Input label="Calories Burnred  "
                   type="number" className="flex-1" 
                   placeholder="e.g., 200" required min={100} max={3000} 
                   value={formdata.calories} onChange={(v)=>setFormdata({...formdata,calories:Number(v)})}
                />

                </div>
                {
                  error && <p className="text-red-500 text-sm">{error}</p>
                }

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={()=>{
                      setShowForm(false)
                      setError('')
                      setFormdata({
                        name:'',
                        duration:0,
                        calories:0
                      })
                    }}>
                      Cancel

                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Activity

                    </Button>
                </div>
              </form>
            </Card>
           )}


 {/* Activity list  */}


            {activities.length ===0 ? (<Card className="text-center py-12">
                   <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                          <DumbbellIcon className="size-8 text-slate-400"/>
                      </div>
                      <h3 className="font-semibold text-slate-700 mb-2">No Activity logged today</h3>
                      <p className="text-slate-500 text-sm">Start moving and track your progress</p>
                      </Card>):(<Card>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <ActivityIcon className="size-5 text-blue-600"/>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">Today's Activities </h3>
                            <p className="text-sm text-slate-400">{activities.length} logged</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {activities.map((activity)=>(
                            <div className="activity-entry-item" key={activity.id}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                  <TimerIcon className="size-5 text-blue-500"/>
                                </div>
                              
                              <div>
                                <p className="font-medium text-slate-700">{activity.name}</p>
                              <p className="text-sm text-slate-400">{new Date(activity?.createdAt || '').toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="font-semibold text-slate-700">{activity.duration}</p>
                                <p className="text-xs text-slate-400">{activity.calories}</p>
                              </div>
                              <button onClick={()=>
                                {handleDelete(activity.documentId)}
                              } className="p-2 text-red-400 hover:text-red-600 hocer:bg-red-50 rounded-lg ">
                                <Trash2Icon className="size-4"/>
                                </button>

                              </div>
                            </div >
                          ))}

                        </div>

                        {/* total summary  */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-slate-500 ">
                            Total Active Time
                          </span>
                          <span className="text-lg font-bold text-blue-600 ">
                              {totalMinutes} min
                          </span>
                        </div>

            </Card>)}

         </div>
        </div>
  )
}

export default ActivityLog