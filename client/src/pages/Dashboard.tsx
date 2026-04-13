import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import { useEffect, useState } from "react"
import { type ActivityEntry,type FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import { Activity, FlameIcon, HamburgerIcon, Ruler, ScaleIcon, TrendingUpIcon, ZapIcon } from "lucide-react"
import CaloriesChart from "../components/CaloriesChart"


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
                    <p className="text-slate-800 font-bold text-m">{DAILY_CALORIE_LIMIT}</p>
                    </div>
                </div>

                <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
                <div className="mt-4 flex justify-between items-center">
                    <div className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        <span className="text-sm font-medium">{remainingCalories >= 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal over`}</span>
                    </div>
                    <span className="text-sm text-slate-400">{Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}% </span>
                </div>




                <div className="border-t border-slate-300 my-4"></div>



                <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <FlameIcon className="w-6 h-6 text-orange-500"/>
                        </div>
                       <div>
                         <p className="text-sm text-slate-500 ">Calories Burned </p>
                        <p className="text-2xl font-bold text-slate-800">{totalBurned}</p>
                       </div>

                    </div>
                    <div className="text-right text-slate-500">
                        <p>Goal</p>
                    <p className="text-slate-800 font-bold text-m">{user?.dailyCalorieBurn || 400}</p>
                    </div>
                </div>
                <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400} />
            </Card>
            {/* Stats row */}


            <div className="dashboard-card-grid">
                {/* Active Minute  */}
                <Card>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Activity className="w-5 h-10 text-blue-500"/>
                        </div>
                        <p className="text-sm font-medium text-slate-600">Active</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{totalActiveMinutes}</p>
                    <p className="text-sm text-slate-500">Minutes Today</p>
                </Card>

                {/* Active Counts  */}
                <Card>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <ZapIcon className="w-5 h-10 text-purple-500"/>
                        </div>
                        <p className="text-sm font-medium text-slate-600">Workout</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{todayActivity.length}</p>
                    <p className="text-sm text-slate-500">Activities Logged</p>
                </Card>
            </div>


            {/* {Goal Card{}} */}

            {user && (
                <Card className="bg-linear-to-r from-slate-800 to-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                            <TrendingUpIcon className="w-8 h-8 text-emerald-400"/>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm"> Your Goal</p>
                            <p className="text-white font-semibold capitalize">
                                {user.goal === 'lose' && "Lose Weight"}
                                 {user.goal === 'maintain' && "Maintain Weight"}
                                  {user.goal === 'gain' && "Gain Weight"}
                            </p>
                        </div>
                    </div>
                </Card> 
            )}

                {/* Bodu Metrics  */}
                {user && user.weight && (
                    <Card>
                        <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                 <ScaleIcon className="w-8 h-8 text-indigo-400"/>
                             </div>
                             <div>
                                <h3 className="font-semibold text-slate-800 ">Body Metrics</h3>
                                <p className="text-slate-500 text-sm">Your Stats</p>
                             </div>
                             
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-slate-100">
                                        <ScaleIcon className="w-5 h-5 text-slate-500"/>
                                    </div>
                                    <span className="w-4 h-4 text-slate-800">Weight</span>
                                </div>
                                <span className="font-semibold text-slate-800">{user.weight} kg</span>
                            </div>

                            {user.height &&( <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-slate-100">
                                        <Ruler className="w-5 h-5 text-slate-500"/>
                                    </div>
                                    <span className="w-4 h-4 text-slate-800">Height</span>
                                </div>
                                <span className="font-semibold text-slate-800">{user.height} cm</span>
                            </div>)}


                                {user.height && (
                                    <div className="pt-2 border-t border-slate-100 ">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm  font-medium text-slate-700">BMI</span>
                                            {(()=>{
                                                const bmi = (user.weight / Math.pow(user.height/100,2)).toFixed(1)
                                                const getStatus = (b: number)=>{
                                                    if(b<18.5) return {color : 'text-blue-500',bg:'bg-blue-500'}

                                                    if(b<25) return {color : 'text-emerald-500',bg:'bg-emerald-100'}

                                                    if(b<30) return {color : 'text-orange-500',bg:'bg-orange-100'}

                                                    return {
                                                        color : 'text-red-500',
                                                        bg:'bg-red-100'
                                                    }
                                                }
                                                const status = getStatus(Number(bmi))
                                                return <span className={`text-lg font-bold px-2 py-0.5 rounded ${status.bg} ${status.color}`}>{bmi}</span>
                                                 })()}
                                            
                                        </div>

                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="flex-1 bg-blue-400 opacity-30">

                                            </div>
                                             <div className="flex-1 bg-emerald-400 opacity-30">

                                            </div>
                                             <div className="flex-1 bg-orange-400 opacity-30">

                                            </div>
                                             <div className="flex-1 bg-red-400 opacity-30">

                                           

                                        </div>
                                         </div>
                                            <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                                            <span className="">18.5</span>
                                            <span>25</span>
                                            <span>30</span>
                                            </div>

                                    </div>

                                )}
                        </div>
                    </Card>
                )}


                {/* Quick summary 
                 */}
                 <Card>
                    <h3 className="font-semibold text-slate-700 mb-4">Today's Summary</h3>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between py-2 border-b border-gray-300">
                         <span className="text-slate-500 ">Meals Logged</span>
                        <span>{todayFood.length}</span>
                       </div>
                         <div className="flex items-center justify-between py-2 border-b border-gray-300">
                         <span className="text-slate-500 ">Total Calories</span>
                        <span>{totalCalories} kcal</span>
                       </div>
                         <div className="flex items-center justify-between py-2 border-b border-gray-300">
                         <span className="text-slate-500 ">Active Time</span>
                        <span>{totalActiveMinutes} min</span>
                       </div>
                    </div>
                 </Card>
          {/* Activity and intake graph */}
                    <Card className="col-span-2">
                        <h3 className="font-semibold text-slate-800 mb-2">This week's Progress</h3>
                        <CaloriesChart/>
                    </Card>
            </div>
       
    </div>
    
  )
}

export default Dashboard