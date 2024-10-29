import { useNavigate } from "react-router-dom";

function MainPage() {

    const navigate = useNavigate();

    return(
        <>
            <p>Main Page</p>
            <button onClick={() => (navigate('/my_profile'))}>To ProfilePage</button>
        </>
    )
};

export default MainPage;