import {useState} from "react";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import Navbar from "../components/navbar/Navbar.jsx";
import {Outlet} from "react-router-dom";


const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="flex flex-col flex-1">
                <Navbar/>
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default MainLayout

