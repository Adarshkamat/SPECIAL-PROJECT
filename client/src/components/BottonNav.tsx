import { Activity, Home, User, Utensils } from "lucide-react"
import { NavLink } from "react-router-dom"

const BottonNav = () => {
    const navItems =  
         [
            {path:'/',label:'Home',icon:Home},
            {path:'/food',label:'Food Log',icon:Utensils},
            {path:'/activity',label:'Activity Log',icon:Activity},
            {path:'/profile',label:'Profile',icon:User},
         ]
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16">
            {navItems.map((item)=>(
                <NavLink key={item.path} to={item.path} className={({isActive})=>`flex flex-col items-center gap-1 px-4 py-2.5 border-l-3 transition-all duration-200 ${isActive ? 'bg-emerald-450 text-emerald-600 font-medium':'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-transparent'}`}>
                    <item.icon className="size-5"/>
                    <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
            ))}
        </div>
    </nav>
  )
}

export default BottonNav