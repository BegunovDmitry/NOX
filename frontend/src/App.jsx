import {Routes, Route} from "react-router-dom"

import MainPage from "./MainPage/MainPage";
import ProfilePage from "./profile/ProfilePage";
import LoginPage from "./Profile/Login_Register/LoginPage";
import RegisterPage from "./Profile/Login_Register/RegisterPage";
import EditProfilePage from "./Profile/Edit/EditProfilePage";
import OnlineGamePage from "./Game/OnlineGamePage";

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
          <Route path="/edit_profile" element={<EditProfilePage/>}/>
          <Route path="/online_game" element={<OnlineGamePage/>}/>
        </Routes>
      </>
  )
}

export default App;
 