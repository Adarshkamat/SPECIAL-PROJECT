import { ActivityIcon, HomeIcon, PersonStandingIcon, UserIcon, UtensilsIcon } from "lucide-react"
import { NavLink } from "react-router"

const Sidebar = () => {
     const navItems =  
     [
        {path:'/',label:'Home',icon:HomeIcon},
        {path:'/food',label:'Food Log',icon:UtensilsIcon},
        {path:'/activity',label:'Activity Log',icon:ActivityIcon},
        {path:'/profile',label:'Profile',icon:UserIcon},
     ]

  return (
    <nav className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 p-6 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-8">
            <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center"><PersonStandingIcon className="size-7 text-white"/></div>
            <h1 className="text-2xl font-bold text-slate-700">FitLife</h1>
        </div>
    <div className="flex flex-col gap-2">
        {navItems.map((item)=>(
            <NavLink
             key={item.path} to={item.path} className={({isActive})=>`flex items-center gap-3 px-4 py-2.5 border-l-3 transition-all duratikon-200 ${isActive ? 'bg-emerld-450 text-emerald-600 font-medium':'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-transparent'}`}>
                <item.icon className="size-5 text-slate-500"/>
                <span className="text-slate-700">{item.label}</span>
            </NavLink>
        ))}
    </div>
    
    </nav>
  ) 
}

export default Sidebar