
const default_classes = {
    "1": "history_cell",
    "2": "history_cell",
    "3": "history_cell",
    "4": "history_cell",
    "5": "history_cell",
    "6": "history_cell",
    "7": "history_cell",
    "8": "history_cell",
    "9": "history_cell"
}

let status_class = ''

function HistoryFieldElement(props) {

    const new_classes = default_classes
    props.game.turnsX.forEach(element => {
        new_classes[element] = "history_cell X"    
    })
    props.game.turnsO.forEach(element => {
        new_classes[element] = "history_cell O"
    })

    if (props.game[`player_${props.game.winner}_id`] == props.user_id) {
        status_class = "hist_el_win"
    } else {
        status_class = "hist_el_lose"
    }


    return(
        <div className={`history_element ${status_class}`}>

            <div className="history_game_field" id="history_game_field">
                    <div className={new_classes["1"]} id="history_cell_1"></div>
                    <div className={new_classes["2"]} id="history_cell_2"></div>
                    <div className={new_classes["3"]} id="history_cell_3"></div>
                    <div className={new_classes["4"]} id="history_cell_4"></div>
                    <div className={new_classes["5"]} id="history_cell_5"></div>
                    <div className={new_classes["6"]} id="history_cell_6"></div>
                    <div className={new_classes["7"]} id="history_cell_7"></div>
                    <div className={new_classes["8"]} id="history_cell_8"></div>
                    <div className={new_classes["9"]} id="history_cell_9"></div>
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