import { Loader2Icon } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 ">
        <Loader2Icon className='animate-spin h-8 w-8 text-gray-500'>
        </Loader2Icon>
        </div>
  )
}


export default Loading