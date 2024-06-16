import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Admin from "./Admin";
import Techinician from "./Techinician";
import NormalUser from "./NormalUser";
const Header = () => {
    const { user, logout } = useContext(AuthContext);
    let lastIndex, emailPrefix;
    if (user) {
        lastIndex = user.email.lastIndexOf("@");
        emailPrefix = user.email.slice(0, lastIndex);
    } else {
        console.log("User is null or undefined");
    }
    return (
        <header>
            <h1>Welcome</h1>
            {user && <h2>{emailPrefix}</h2>}{" "}
            <nav>
                <ul>
                    {user?.isAdmin && <Admin />}
                    {user?.isTechnician && <Techinician />}
                    {user && !user?.isAdmin && !user?.isTechnician && (
                        <NormalUser />
                    )}
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
