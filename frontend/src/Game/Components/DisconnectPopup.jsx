import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function DisconnectPopup(props) {

    const navigate = useNavigate();

    const [waitTime, setWaitTime] = useState(60)

    useEffect(() => (setWaitTime(60)), [props])


    if(props.disconnect) {
        setTimeout(() => {
            if (waitTime > 0) {
                setWaitTime(prev => prev-1)
            }
        }, 1000)
    }

    const handleExitGame = () => {
        localStorage.removeItem(props.session);
        localStorage.removeItem(`turns / ${props.session}`)
        navigate('/')
    }

    return(
        <div className="disconnect_popup">
            <div className="disconnect_popup-content">
                <p className="disconnect_popup_msg">There is no people on the other side</p>
                <p className="disconnect_popup_timer">Wait your opponent connection: {waitTime}sec.</p>
                <button onClick={handleExitGame}>Exit game</button>
            </div>
        </div>
    )
}

export default DisconnectPopup;