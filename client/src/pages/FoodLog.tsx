import { PlusIcon, SparkleIcon } from "lucide-react"
import { quickActivitiesFoodLog } from "../assets/assets"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"

import { useAppContext } from "../context/AppContext"
import type { FoodEntry } from "../types"
import { useEffect, useRef, useState } from "react"

interface FoodFormData {
    name: string
    calories: number
    mealType: string
}

const FoodLog = () => {
    const {allFoodLogs,setAllFoodLogs} = useAppContext()
    const [entries,setEntries] = useState<FoodEntry[]>([])
    const [showForm,setShowForm] = useState(false)
    const [formdata,setFormdata] = useState<FoodFormData>({
            name:'',
            calories:0,
            mealType:''
            

        })
const [loading,setLoading] = useState(false)

const inputRef = useRef<HTMLInputElement>(null)

const today = new Date().toISOString().split('T')[0]

const loadEntries = ()=>{
    const todaysEntries = allFoodLogs.filter((e:FoodEntry)=>e.createdAt?.split('T')[0]===today) 
    setEntries(todaysEntries)
}

const totalCalories = entries.reduce((total,entry)=>total+entry.calories,0)

const handleQuickAdd = (activityName : string)=>{
    setFormdata({...formdata, mealType:activityName})
    setShowForm(true)

}

useEffect(()=>{
    (()=>{loadEntries()})()
},[allFoodLogs])


  return (
    <div className="page-container">
        <div className="page-header">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Food Log</h1>
                    <p className="text-slate-500 text-sm">
                        Track your daily intake
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Today's Total</p>
                    <p className="text-xl font-bold text-slate-800">{totalCalories} kcal</p>
                </div>
                
            </div>
        </div>
        <div className="page-content-grid">
            {!showForm && (
                <div className="space-y-4">
                    <Card>
                        <h3 className="font-semibold text-slate-700 mb-3">Quick Add</h3>
                        <div className="flex flex-wrap gap-2">
                            {quickActivitiesFoodLog.map((item)=>(
                                <button onClick={()=>handleQuickAdd(item.name)}
                                key={item.name} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors">
                                   {item.emoji} {item.name}
                                </button>
                            ))}

                        </div>
                    </Card>

                    <Button className="w-full" onClick={()=>setShowForm(true)}>
                        <PlusIcon className="size-4 "/>
                        Add Food Entry
                    </Button>

                    <Button className="w-full " onClick={()=>inputRef.current?.click()} >
                        <SparkleIcon className="size-4 "/>
                        AI Food Snap
                    </Button>
                    <input type="file" accept="image/*" hidden ref={inputRef}/>
                </div>

            )}
        </div>
    </div>
    
  )
}

export default FoodLog