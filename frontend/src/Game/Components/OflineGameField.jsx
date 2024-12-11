import { useEffect, useState } from "react"


function signRandom() {
    return Math.floor(Math.random() * 2);
  }

const includesAll = (arr, values) => {
    for (const i in values) {
        if (!(arr.includes(values[i]))) {
            return false;
        }
    }
    return true;
}

const disableAll = () => {
    for (let i = 1; i <= 9; i++) {
    document.getElementById(`cell_${i}`).classList.add("disabled")
    }
}

function OflineGameField() {

    const winCombos = [
        ['1','2','3'], ['4','5','6'], ['7','8','9'], //rows
        ['1','4','7'], ['2','5','8'], ['3','6','9'], //cols
        ['1','5','9'], ['3','5','7'] //diagonals
    ]

    const [sign, setSign] = useState("X")

    const [turnsX, setTurnsX] = useState([])
    const [turnsO, setTurnsO] = useState([])

    useEffect(() => {
        if (signRandom()) {
            setSign("O")
        }
    }, [])


    const checkWin = () => {
        if ((turnsX.length + turnsO.length) >= 9) {
            console.log("Nobody");
        }
        else if (((turnsX.length + turnsO.length) >= 4)) {
            for (const i in winCombos) {
                if (includesAll(turnsX, winCombos[i])) {
                    disableAll()
                    console.log("X won!"); 
                    break;
                }
                if (includesAll(turnsO, winCombos[i])) {
                    disableAll()
                    console.log("O won!"); 
                    break;
                }
            }
        }
    }

    const handleClick = (cell_num) => {
        if (sign == "X") {
            cell_num.classList.add("X")
            cell_num.classList.add("disabled")
            setTurnsX(prevs => ([...prevs, cell_num.getAttribute("data-num")]))
            setSign("O")
        } else {
            cell_num.classList.add("O")
            cell_num.classList.add("disabled")
            setTurnsO(prevs => [...prevs, cell_num.getAttribute("data-num")])
            setSign("X")
        }
    }

    useEffect(checkWin, [turnsO, turnsX])

    return (
        <>
        
            <div className="game_field">
                <div onClick={() => handleClick(cell_1)} className="cell" id="cell_1" data-num="1" ></div>
                <div onClick={() => handleClick(cell_2)} className="cell" id="cell_2" data-num="2" ></div>
                <div onClick={() => handleClick(cell_3)} className="cell" id="cell_3" data-num="3" ></div>
                <div onClick={() => handleClick(cell_4)} className="cell" id="cell_4" data-num="4" ></div>
                <div onClick={() => handleClick(cell_5)} className="cell" id="cell_5" data-num="5" ></div>
                <div onClick={() => handleClick(cell_6)} className="cell" id="cell_6" data-num="6" ></div>
                <div onClick={() => handleClick(cell_7)} className="cell" id="cell_7" data-num="7" ></div>
                <div onClick={() => handleClick(cell_8)} className="cell" id="cell_8" data-num="8" ></div>
                <div onClick={() => handleClick(cell_9)} className="cell" id="cell_9" data-num="9" ></div>
            </div>
        
        </>
    )
}

export default OflineGameField;