import { Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Login from "./pages/Login" 
import Profile from "./pages/Profile"
import { useAppContext } from "./context/AppContext"
import Loading from "./components/Loading"
import Onbording from "./pages/Onbording"
import {Toaster} from "react-hot-toast"

const App = () => {

  const { user, isUserFetched, onboardingCompleted } = useAppContext()
  if(!user){
    return isUserFetched ? <Login/> : <Loading/>
  }

  if(!onboardingCompleted){
    return <Onbording/>
  }

  return (
    <>
    <Toaster/>
    
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Dashboard/>} />
         <Route path="food" element={<FoodLog/>} />
          <Route path="activity" element={<ActivityLog/>} />
           <Route path="profile" element={<Profile/>} />
            
      </Route>
    </Routes>
    </>
  )
}

export default App