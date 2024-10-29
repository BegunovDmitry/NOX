import {Routes, Route} from "react-router-dom"

import MainPage from "./MainPage/MainPage";
import ProfilePage from "./profile/ProfilePage";
import LoginPage from "./Profile/Login_Register/LoginPage";
import RegisterPage from "./Profile/Login_Register/RegisterPage";

function App() {
  
  return (
      <>
        <div>
          <p>
            NOX
          </p>
        </div>

        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/my_profile" element={<ProfilePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </>
  )
}

export default App;
 