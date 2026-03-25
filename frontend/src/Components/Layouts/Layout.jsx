import { Outlet } from "react-router";
import Header from "../Shared/Header";
import { useState } from "react";

export default function Layout(){

const [open, setOpen] = useState(false);

const handleSideMenu = () => {
    setOpen(!open);
}

    return (
        <div className={"p-3 flex gap-3 h-full"}>
            <div className={open? "side-menu w-1/3" : "hidden"} >
            
                <aside className={open? "bg-white rounded-2xl h-full" : "hidden"}>
                    {/* TODO: ADD SIDE MENU */}
                </aside>
            </div>
            <div className="hero-menu w-full h-full flex flex-col gap-3">
                <Header setOpenMenu={handleSideMenu}/>
                <main className="content h-full w-full rounded-2xl">
                    <Outlet /> 
                </main>
            </div>
        </div>
    )
}
