import { useEffect, useState } from "react"


function OnlineGameField(props) {

    const [turnsX, setTurnsX] = useState(props.turns[0])
    const [turnsO, setTurnsO] = useState(props.turns[1])


    useEffect(() => {

        const CELLS = [1,2,3,4,5,6,7,8,9]
        if (!props.isMyTurn) {
            CELLS.forEach(element => {
                document.getElementById(`cell_${element}`).classList.add("disabled")
            })
        } else {
            CELLS.forEach(element => {
                document.getElementById(`cell_${element}`).classList.remove("disabled")
            })
        }

        props.turns[0].forEach(element => {
            document.getElementById(`cell_${element}`).classList.add("X")
            document.getElementById(`cell_${element}`).classList.add("disabled")
        })
        props.turns[1].forEach(element => {
            document.getElementById(`cell_${element}`).classList.add("O")
            document.getElementById(`cell_${element}`).classList.add("disabled")
        })
    }, [props])

    const handleClick = (cell_num) => {
        if (props.user_sign == "X") {
            cell_num.classList.add("X")
            cell_num.classList.add("disabled")
            setTurnsX(prevs => ([...prevs, cell_num.getAttribute("data-num")]))
        } else {
            cell_num.classList.add("O")
            cell_num.classList.add("disabled")
            setTurnsO(prevs => [...prevs, cell_num.getAttribute("data-num")])
        }
    }

    useEffect(() => {
        if (props.user_sign == "X") {
            props.turnFuncs[0](turnsX)
        } else {
            props.turnFuncs[1](turnsO)
        }
    }, [turnsO, turnsX])

    return (
        <>
        
            <div className="game_field">
                <div onClick={() => {
                    handleClick(cell_1)
                    props.turnFuncs[2]("1")
                }} className="cell" id="cell_1" data-num="1" ></div>
                <div onClick={() => {
                    handleClick(cell_2)
                    props.turnFuncs[2]("2")
                }} className="cell" id="cell_2" data-num="2" ></div>
                <div onClick={() => {
                    handleClick(cell_3)
                    props.turnFuncs[2]("3")
                }} className="cell" id="cell_3" data-num="3" ></div>
                <div onClick={() => {
                    handleClick(cell_4)
                    props.turnFuncs[2]("4")
                }} className="cell" id="cell_4" data-num="4" ></div>
                <div onClick={() => {
                    handleClick(cell_5)
                    props.turnFuncs[2]("5")
                }} className="cell" id="cell_5" data-num="5" ></div>
                <div onClick={() => {
                    handleClick(cell_6)
                    props.turnFuncs[2]("6")
                }} className="cell" id="cell_6" data-num="6" ></div>
                <div onClick={() => {
                    handleClick(cell_7)
                    props.turnFuncs[2]("7")
                }} className="cell" id="cell_7" data-num="7" ></div>
                <div onClick={() => {
                    handleClick(cell_8)
                    props.turnFuncs[2]("8")
                }} className="cell" id="cell_8" data-num="8" ></div>
                <div onClick={() => {
                    handleClick(cell_9)
                    props.turnFuncs[2]("9")
                }} className="cell" id="cell_9" data-num="9" ></div>
            </div>
        
        </>
    )
}

export default OnlineGameField;