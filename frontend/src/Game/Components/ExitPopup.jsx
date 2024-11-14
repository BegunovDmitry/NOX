import "./ExitPopup.css"



const handleClosePopup = () => {
    document.querySelector(".exit_popup").style.display = "none"
}

function ExitPopup(props) {

    let info_msg = "Game has been finished"
    let end_msg = "Nobody won (*-*)"
    if (props.end_by_disconnect) {
        info_msg = "Your opponent left the game"
        end_msg = "You won!"
    } else if (props.is_won == "Yes") {
        info_msg = "Game has been finished"
        end_msg = "You won!"
    } else if (props.is_won == "No") {
        info_msg = "Game has been finished"
        end_msg = "You lose :/"
    }

    return(
        <div className="exit_popup">
            <div className="exit_popup-content">
                <p>{info_msg}</p>
                <p>{end_msg}</p>
                <button onClick={handleClosePopup}>Okay</button>
            </div>
        </div>
    )
}

export default ExitPopup;