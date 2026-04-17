import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, TargetIcon, User } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import toast, {Toaster} from "react-hot-toast"
import { useState } from "react"
import { type ProfileFormData } from "../types"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"


import { ageRanges, goalOptions } from "../assets/assets"
import Slider from "../components/ui/Slider"
import api from "../configs/api"



const Onbording = () => {
    const {user,setOnboardingCompleted,fetchUser} = useAppContext()
    const [step,setStep] = useState(1)
    const updateField=(field:keyof ProfileFormData,value:string|number)=>{
        setFormData({...formData,[field]:value})
    }
    const totalStep = 3
    const [formData,setFormData] = useState<ProfileFormData>({age:0,weight:0,height:0,goal:"maintain",
        dailyCalorieIntake:2000,dailyCalorieBurn:400
    })


    const handleNext = async ()=>{

        if(step===1){
            if(!formData.age || Number(formData.age<13) || Number(formData.age>120)){
                return toast("Age is required")
        }
        }

        if(step<totalStep){
            setStep(step+1)
        }else{
            const userData = {
                ...formData,
                age:formData.age,
                weight:formData.weight, 
                height:formData.height ? formData.height : null ,
                createdAt:new Date().toISOString()
            }
            localStorage.setItem("fitenessUser",JSON.stringify(userData))
            try{
                await api.put(`/api/users/${user?.id}`,userData )
                 toast.success("Onboarding Completed")
                setOnboardingCompleted(true)
                fetchUser(user?.token || '')
            }catch(err){
                console.log(err)
                toast.error("There's an error")
            }
           
        }
    }
 
  return (
    <>
    <Toaster/>
    <div className="onboarding-container">
        <div className =" p-6 pt-12 onboarding-wrapper">
            <div className ="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <PersonStanding className="w-6 h-6 text-white"/>
                    </div>
                    <h1 className ="text-2xl font-bold text-slate-800">FitLife</h1>
                </div>
                <p className="text-slate-500 mt-4">Lets Personalize your experience
                    </p>
            </div>
            <div className="onboarding-wrapper px-6 mb-8">
                <div className="flex gap-2 max-w-2xl">
                    {[1,2,3].map((s)=>(
                        <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-300  ${s<=step ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            
                        </div>
                    ))}
                     
                    </div>
                    <p className="text-slate-400 mt-2">Step {step} of {totalStep}</p>
                </div>
                {/* Form content based on step */}
                <div className="flex-1 px-6 onboarding-wrapper px-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center border border-emerald-100">
                                <User className="size-6 bg-emerald-500 "/>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-1">How old are you?</h2>
                                <p className="text-slate-500">This helps us calculate your needs</p>
                            </div>


                        </div>
                        <Input label="Age" value={formData.age} onChange={(e)=>updateField('age',e)} 
                        type="number" placeholder="Enter your age" className=" max-w-2xl " min={13} max={120} required />


                            </div>
                        )}

                         {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center border border-emerald-100">
                                <ScaleIcon className="size-6 bg-emerald-500 "/>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-1">Your Measurements</h2>
                                <p className="text-slate-500">Helps us track your progress</p>
                            </div>


                        </div>
                       <div className="flex flex-col gap-4 max-w-2xl">
                         <Input label="Weight (kg)" value={formData.weight} onChange={(e)=>updateField('weight',e)} 
                        type="number" placeholder="Enter your weight" className=" max-w-2xl" min={18} max={190} required />
                        <Input label="Height (cm) - Optional" value={formData.height} onChange={(e)=>updateField('height',e)} 
                        type="number" placeholder="Enter your height" className=" max-w-2xl" min={100} max={300}  />

                        </div>
                            </div>
                        )}

                         {step === 3&& (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center border border-emerald-100">
                                    <TargetIcon className="size-6 bg-emerald-500 "/>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800 mb-1">What's your Goal</h2>
                                    <p className="text-slate-500">We'll tailor your plan accordingly</p>
                                </div>
                            </div>

                            {/* options
                             */}

                             <div className="space-y-4 max-w-2xl">
                                { goalOptions.map((option)=>(
                                    <button key={option.value} onClick={()=>{
                                        const age = Number(formData.age)
                                        const range = ageRanges.find(r=>age<=r.max )|| ageRanges[ageRanges.length - 1]

                                        let intake = range.maintain
                                        let burn = range.burn

                                        if(option.value === "lose"){
                                            intake -= 400
                                            burn += 100
                                        }else if(option.value === "gain"){
                                            intake += 500
                                            burn -= 100
                                        }

                                    setFormData({...formData,goal:option.value as 'lose' | 'gain' | 'maintain',dailyCalorieIntake:intake,dailyCalorieBurn:burn})
                                    }}
                                     className={`onboarding-option-btn ${formData.goal === option.value && 'ring-2 ring-emerald-500'}`}>
                                    <span className="text-base text-slate-700">{option.label}</span>
                                    </button>
                                )
                                )} 
                             </div>
                            <div className="border-t borer-slate-200 my-6 max-w-lg"></div>
                                        {/* Daily tagets
                                            */}
                                    <div className="space-y-4 max-w-2xl">
                                        <h3 className="text-lg font-semibold text-slate-800"> Daily Targets</h3>
                                        <div className="space-y-6">
                                            <Slider label="Daily Calorie Intake " min={120} max={3000} step={50} value={formData.dailyCalorieIntake} onChange={(value) => updateField("dailyCalorieIntake" , value)} unit="kcal" infoText="The number of calories you should consume daily to meet your goal."/>
                                            <Slider label="Daily Calorie Burn " min={120} max={3000} step={50} value={formData.dailyCalorieBurn} onChange={(value) => updateField("dailyCalorieBurn", value)} unit="kcal" infoText="The number of calories you should burn daily to meet your goal." /> 
                                        </div>
                                    </div>
                            
                            </div>
                        )}
                        </div>

                       <div className="onboarding-wrapper p-6 pb-10">
                        <div className="flex gap-4 lg:justify-end">
                            {step>1 && ( <Button onClick={()=>setStep(step>1?step-1:1)} variant="secondary" className="max-lg:flex-1 lg:px-10">
                                <span className="flex items-center  justify-center gap-2">
                                    <ArrowLeft className="h-5 w-5"/>
                                    Back
                                    </span>
                                </Button>)}
                                <Button onClick={handleNext} className="max-lg:flex-1 lg:px-10">
                                <span className="flex items-center  justify-center gap-2">

                                    {step===totalStep?"Get Started":"Next"}
                                    <ArrowRight className="h-5 w-5"/>
                                 
                                    </span>
                                </Button>
                            </div>
                        </div>
                


                    
               
            </div>
   
    </>
  )
}

export default Onbording