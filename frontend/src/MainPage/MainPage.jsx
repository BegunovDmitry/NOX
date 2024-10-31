import { useNavigate } from "react-router-dom";
import "./MainPage.css"

import GameField from "../Game/Components/GameField";


function MainPage() {

    const navigate = useNavigate();

    return(
        <>
            <div className="title"><p>Main Page</p></div>

            <GameField/>

            <button onClick={() => (navigate('/my_profile'))}>To ProfilePage</button>
        </>
    )
};

export default MainPage;