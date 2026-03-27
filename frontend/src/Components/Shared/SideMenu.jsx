import AddForm from "../AddForm/AddForm";

export default function SideMenu(){

    return(
        <>
            <div className=" h-full w-full p-4 flex flex-col text-center">
                <AddForm btnTitle="Form 1"/>
            </div>
        </>
    )
}