import { useEffect, useState } from "react";
import "./DisconnectPopup.css"


function DisconnectPopup(props) {

    const [waitTime, setWaitTime] = useState(60)

    useEffect(() => (setWaitTime(60)), [props])


    if(props.disconnect) {
        setTimeout(() => (setWaitTime(prev => prev-1)), 1000)
    }

    return(
        <div className="modal">
            <div className="modal-content">
                <p>Your opponent has been disconnected</p>
                <p>Wait reconnect: {waitTime}sec.</p>
                <button className="close">Exit game</button>
            </div>
        </div>
    )
}

export default DisconnectPopup;