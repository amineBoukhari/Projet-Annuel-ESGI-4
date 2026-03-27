import { useState } from 'react'; 
import { X } from 'lucide-react';

export default function AddForm({ template, btnTitle }){
    
    const [open, setOpen] = useState(false);

    const handleModal = () => {
        setOpen(!open);
    }

    return(
        <>
            <div>
                <button className="hover:cursor-pointer " onClick={() => handleModal()}>
                    {btnTitle}
                </button>

                {open&&
                    <div className='modal-form bg-transparent backdrop-blur-xs  flex justify-center items-center fixed inset-0 z-9999'>
                        <div className='bg-white border-gray-300 border-1 rounded-lg shadow-xl w-[60%] h-[80%] p-4'>
                            <div className='bg-yellow-100 w-full h-15 flex flex-row justify-between items-center'>
                                <p className='pl-4'>{btnTitle}</p>
                                <X className=' size-10 pr-4' onClick={() => handleModal()} />
                            </div>
                                                                                                
                        </div>
                    </div>
                }
            </div>
        </>
    )
}