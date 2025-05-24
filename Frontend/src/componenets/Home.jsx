import React, { useState } from 'react';
import { FaFileWord } from "react-icons/fa";
import axios from 'axios';

const Home = () => {
    const [selectedFile, setSelectedFile]= useState(null);
    const [convert, setConvert] = useState("");
    const [DownloadError, setsetDownloadError]= useState("");
    const handleFileChange =(e)=>{
        // console.log(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async(event)=>{
        event.preventDefault();
        if (!selectedFile) {
            setConvert("Please select a file first");
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        try{
           const response = await axios.post("http://localhost:3000/convertFile", formData,{
                responseType: 'blob',
            })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log(url);
            const link = document.createElement('a');
            console.log(link);
            link.href = url;
            console.log(link)
            link.setAttribute('download', selectedFile.name.replace(/\.[^/.]+$/,"")+".pdf");
            console.log(link);
            document.body.appendChild(link);
            console.log(link)
            link.click();
            link.parentNode.removeChild(link);
            setSelectedFile(null);
            setsetDownloadError("");
            setConvert("File converted successfully"); 
        }catch (error) {
            console.log(error);
            if(error.response && error.response.status === 400){
                setsetDownloadError("File Error",error.response.data.message);
            }else{
                setConvert("");
            }
        }
    }
  return (
    <>
    <div className='max-w-screen-2xl mx-auto container px-6 py-2 md:px-40'>
        <div className='flex h-screen items-center justify-center'>
            <div className='border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-blue-700 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold text-center mb-4'> Word to PDF Online</h1>
                <p className='text-sm font-bold text-center mb-5'>Easily convert word document to PDF format online, without having to intall any software</p>

            <div className='flex flex-col items-center space-y-4'>
                <input type="file" accept='.doc,.docx' className='hidden' id='FileInput' onChange={handleFileChange}/>
                <label htmlFor="FileInput" className='w-full flex items-center justify-center px-4 py-4 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-600 hover:bg-blue-800 duration-300 hover:text-white ' >
                    <FaFileWord className='text-3xl mr-3' />
                    <span className='text-xl mr-2'>{selectedFile?selectedFile.name:"Choose File"}</span>
                </label>
                <button  onClick={handleSubmit} disabled={!selectedFile} className='text-white bg-blue-700 hover:bg-blue-800 duration-300 font-bold px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:pointer-events-none'>Convert File</button>
                {convert && (<div className='text-green-500 text-center'>{convert}</div>)}
                     {DownloadError && (<div className='text-green-500 text-center'>{DownloadError}</div>)}

            </div>
             </div>
        </div>
    </div>
    </>
  )
}

export default Home