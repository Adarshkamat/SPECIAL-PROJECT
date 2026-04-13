import {Toaster} from "react-hot-toast"

import { AtSignIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { EyeIcon } from "lucide-react"

const Login = () => {

    const [state, setState] = useState("Login")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const{login,signup,user} = useAppContext()

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        if(state==="login"){
            await login({email,password})
        }else{
            await signup({username,email,password})
        }
        setIsSubmitting(false)
    }

    useEffect(()=>{
        if(user){
           
            navigate("/")
            
        }
    },[user,navigate])

  return (
    <>
    <Toaster/>
    <main className="login-page-container">
        <form onSubmit={handleSubmit} className="login-form bg-gray p-8 rounded-lg border border-gray-300 shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">{state==="login"?"Login":"Sign up"}</h2>
            <p>
                {state==="login"?"Please sign in":"Enter your details"}
            </p>
            {state!=="login" && (
                <div className="mt-2">
                <label className="block mb-1">Username</label>
                <div className=" relative mt-2">
                    <AtSignIcon className="absolute left-3 top-3 text-gray-500 size-4.5 "/>
                    <input onChange={(e)=>setUsername(e.target.value)} value={username} type="text" placeholder="Enter a Username" className="login-input" required />
                </div>
                   </div>
               )}

                <div className="mt-2">
                <label className="block mb-1 mt-4">Email</label>
                <div className=" relative mt-2">
                <MailIcon className="absolute left-3 top-3 text-gray-500 size-4.5 "/>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Enter your Email" className="login-input" required />
                </div>
                </div>

               <div className="mt-2">
                 <label className="block mb-1 mt-4">Password</label>
                <div className=" relative mt-2">
                <LockIcon className="absolute left-3 top-3 text-gray-500 size-4.5 "/>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} placeholder="Enter your Password" className="login-input" required />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
                </div>
                </div>

                <button disabled={isSubmitting} className="login-button mt-6">{isSubmitting?"Signing in...":state === "login" ? "Login" : "Sign up"}</button>
               {state==="login" ?<p className="mt-4 text-sm">Don't have an account? <span onClick={()=>setState("signup")} className="text-blue-500 cursor-pointer">Sign up</span></p>:
                               <p className="mt-4 text-sm">Already have an account? <span onClick={()=>setState("login")} className="text-blue-500 cursor-pointer">Login</span></p>
            }

              
        </form>
    </main>
    </>
  )
}

export default Login