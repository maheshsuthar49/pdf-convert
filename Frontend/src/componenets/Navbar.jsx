import React from 'react'

const Navbar = () => {
  return (
    <>
    <div className='max-w-screen-2xl mx-auto container px-6 py-2 md:px-40 shadow-lg h-14 fixed'>
        <div className='flex justify-between '>
            <h1 className='text-2xl cursor-pointer font-bold'>Word<span className='text-3xl text-blue-700'>To</span>PDF</h1>
            <h1 className='mt-1 text-2xl cursor-pointer font-bold hover:scale-120 duration-300'>Home</h1>
        </div>
    </div>
    </>
  )
}

export default Navbar