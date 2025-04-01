import React from 'react'

type TProps = {
  label?: string,
  value?: any,
}

const ApLabelValue : React.FC<TProps> = ({label, value}) => {
  return (
    <div className='flex flex-col'>
        <span className='text-base font-semibold'>{label}</span>
        <span className='text-gray-400'>{value}</span>
    </div>
  )
}

export default ApLabelValue