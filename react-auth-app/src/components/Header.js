import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Admin from "./Admin";
import Techinician from "./Techinician";
import NormalUser from "./NormalUser";
const Header = () => {
    const { user, logout } = useContext(AuthContext);
    console.log(user);
    return (
        <header>
            <h1>hello</h1>
            <nav>
                <ul>
                    {user?.isAdmin && <Admin />}
                    {user?.isTechnician && <Techinician />}
                    {user && !user?.isAdmin && !user?.isTechnician && <NormalUser />}
                    <li>
                        <a href="/">
                            <button onClick={logout}>logout</button>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;