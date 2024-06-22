import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Admin from "./Admin";
import Techinician from "./Techinician";
import NormalUser from "./NormalUser";
// Fetching the details of the login user
// Can be user,admin,techinician
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
        <header className="bg-blue-100 min-h-screen pb-20">
            <div className="flex justify-around bg-blue-700 text-white text-2xl font-bold  py-10">
                <div className="flex gap-5 items-center">
                    <h1>Welcome</h1>
                    {user && <h2 className="uppercase">{emailPrefix}</h2>}
                </div>
                {/* Displaying admin techinician or user accoringly */}
                <div className="text-2xl font-bold flex gap-10">
                    {user?.isAdmin === 1 && <h2>Admin's Login</h2>}
                    {user?.isTechnician === 1 && <h2>Techinician's Login</h2>}
                    {user && !user?.isAdmin && !user?.isTechnician && (
                        <h2>User's Login</h2>
                    )}
                    <button>
                        <a href="/">
                            <button onClick={logout}>logout </button>
                        </a>
                    </button>
                </div>
            </div>
            {/* Displaying the components of  admin techinician or user accoringly */}
            <div className="container mx-auto">
                <nav>
                    <ul>
                        {user?.isAdmin === 1 && <Admin />}
                        {user?.isTechnician === 1 && <Techinician />}
                        {user && !user?.isAdmin && !user?.isTechnician && (
                            <NormalUser />
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
