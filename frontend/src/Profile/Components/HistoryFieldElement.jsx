import { useEffect } from "react";
import "./HistoryFieldElement.css"

function HistoryFieldElement(props) {

    useEffect(() => {
        props.game.turnsX.forEach(element => {
            document.getElementById(`history_cell_${element}`).classList.add("X")
        })
        props.game.turnsO.forEach(element => {
            document.getElementById(`history_cell_${element}`).classList.add("O")
        })

        if (props.game[`player_${props.game.winner}_id`] == props.user_id) {
            document.querySelector(".history_element").style.backgroundColor = "lightgreen";
        } else {
            document.querySelector(".history_element").style.backgroundColor = "lightcoral";
        }
        
    }, [props])



    return(
        <div className="history_element">

            <div className="history_game_field" id="history_game_field">
                    <div className="history_cell" id="history_cell_1"></div>
                    <div className="history_cell" id="history_cell_2"></div>
                    <div className="history_cell" id="history_cell_3"></div>
                    <div className="history_cell" id="history_cell_4"></div>
                    <div className="history_cell" id="history_cell_5"></div>
                    <div className="history_cell" id="history_cell_6"></div>
                    <div className="history_cell" id="history_cell_7"></div>
                    <div className="history_cell" id="history_cell_8"></div>
                    <div className="history_cell" id="history_cell_9"></div>
            </div>

            <div className="history_game_info">
                <h1>{props.game.player_1_name}</h1>
                <h3>VS</h3>
                <h1>{props.game.player_2_name}</h1>
                <br/>
                <p>{props.game.created_at}</p>
            </div>
        </div>
    )
}

export default HistoryFieldElement;