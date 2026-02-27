import { SidebarIcon } from "lucide-react";
import Avatar from "../Temp/Avatar";

export default function Header({setOpenMenu}){
    return (
        <header className="bg-white flex items-center justify-between px-3 py-3 rounded-2xl">
            <button className="hover:opacity-50 hover:cursor-pointer text-primary" onClick={() => setOpenMenu(!setOpenMenu)}>
                <SidebarIcon />
            </button>

            <h1 className="uppercase font-bold text-2xl text-primary">Gesto-resto</h1>

            {/*  HERO BUTTON */}
            <div className="flex items-center max-w-1/5 gap-3 hover:opacity-75 hover:cursor-pointer">
                <p className="uppercase font-semibold text-primary">Jane Smith</p>
                <Avatar attributes={"rounded-full size-12 border-outside border-2"}/>
            </div>
        </header>
    )
}
