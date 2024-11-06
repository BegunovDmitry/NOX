import { useNavigate } from "react-router-dom";
import "./MainPage.css"

import OflineGameField from "../Game/Components/OflineGameField";


function MainPage() {

    const navigate = useNavigate();

    return(
        <>
            <div className="title"><p>Main Page</p></div>

            <OflineGameField/>

            <button onClick={() => (navigate('/my_profile'))}>To ProfilePage</button>
            <button onClick={() => (navigate('/create_game'))}>Online game</button>
        </>
    )
};

export default MainPage;