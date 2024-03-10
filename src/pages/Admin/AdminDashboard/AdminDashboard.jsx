import React from 'react'
import FirstRow from 'src/components/Admin/Dashboard/FirstRow'
import SecondRow from 'src/components/Admin/Dashboard/SecondRow'
import ThirdRow from 'src/components/Admin/Dashboard/ThirdRow'

const AdminDashboard = () => {
  return (
    <div className='font-main bg-[#F6F8F9] gap-2 p-2'>
      {/* first row - */}
      <FirstRow />
      {/* second row - weekly analysis*/}
      <SecondRow />
      {/* third row - recent purchase (orders) and stock out products */}
      <ThirdRow />
    </div>
  )
}

export default AdminDashboard