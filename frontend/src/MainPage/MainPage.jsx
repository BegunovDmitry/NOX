import { useNavigate } from "react-router-dom";
import "./MainPage.css"

import OflineGameField from "../Game/Components/OflineGameField";
import DisconnectPopup from "../Game/Components/DisconnectPopup";
import { useEffect, useState } from "react";

let modal
let close

function MainPage() {

    const navigate = useNavigate();
    const [isDisconnect, setIsDisconnect] = useState(false)

    useEffect(() => {
        modal = document.querySelector(".modal")
        close = document.querySelector(".close")

        close.onclick = function () {
            modal.style.display = 'none';
            setIsDisconnect(false)
          }
    }, [])

    const showPopup = () => {
        setIsDisconnect(true)
        modal.style.display = 'block';
    }

    return(
        <>
            <div className="title"><p>Main Page</p></div>

            <OflineGameField/>

            <DisconnectPopup disconnect={isDisconnect}/>
            <button onClick={showPopup}>show popup</button>


            <button onClick={() => (navigate('/my_profile'))}>To ProfilePage</button>
            <button onClick={() => (navigate('/create_game'))}>Online game</button>
        </>
    )
};

export default MainPage;