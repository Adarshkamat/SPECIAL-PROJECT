import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import { useEffect, useState } from "react"
import { type ActivityEntry,type FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import { HamburgerIcon } from "lucide-react"

const Dashboard = () => {

    const {user,allActivityLogs,allFoodLogs} = useAppContext()
    const [todayFood,setTodayFood] = useState<FoodEntry[]>([])
    const [todayActivity,setTodayActivity] = useState<ActivityEntry[]>([])

    const DAILY_CALORIE_LIMIT:number = user?.dailyCalorieIntake || 2000


    const loadUserData = () => {
        const today = new Date().toISOString().split("T")[0]
        const todaysFood = allFoodLogs.filter((f:FoodEntry)=> f.createdAt?.split("T")[0] === today)

        const todaysActivity = allActivityLogs.filter((a:ActivityEntry)=> a.createdAt?.split("T")[0] === today)
        setTodayFood(todaysFood)
        setTodayActivity(todaysActivity)
    }

    useEffect(()=>{
        (()=>{loadUserData()})()
    }, [allFoodLogs,allActivityLogs])

    const totalCalories: number= todayFood.reduce((sum,entry)=> sum + entry.calories, 0) 
    const remainingCalories = DAILY_CALORIE_LIMIT - totalCalories

    const totalActiveMinutes: number = todayActivity.reduce((sum,entry)=> sum + entry.duration, 0)

    const totalBurned: number = todayActivity.reduce((sum,entry)=> sum + (entry.calories || 0), 0)

    const motivation = getMotivationalMessage(totalCalories,totalActiveMinutes,DAILY_CALORIE_LIMIT)
  return (
    <div className="page-container">
        {/* Header */}
        <div className="dashboard-header">
            <p className="text-emerald-50 text-m font-medium">Welcome!</p>
            <h1 className="text-2xl font-bold mt-1">Hi there {user?.username}</h1>
            {/* Motivation Card */}
            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{motivation.emoji}</span>
                    <p className="text-white font-medium">{motivation.text}</p>
                </div>
            </div>
        </div>
        {/* Stats */}
        <div className="dashboard-grid ">

            <Card className="shadow-lg col-span-2">
                
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <HamburgerIcon className="w-6 h-6 text-orange-500"/>
                        </div>
                       <div>
                         <p className="text-sm text-slate-500 ">Calories Consumed </p>
                        <p className="text-2xl font-bold text-slate-800">{totalCalories}</p>
                       </div>

                    </div>
                    <div className="text-right text-slate-500"><p>Limit</p>
                    <p className="text-slate-800 font-bold text-m">{DAILY_CALORIE_LIMIT}</p></div>
                </div>
                <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
                <div className="flex items-center justify-between mb-4"></div>
                <div></div>
                <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400} />
            </Card>
            </div>
       
    </div>
    
  )
}

export default Dashboard