import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VendorDashboardInfo = () => {


  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const countries = [
    {
      name: 'United States',
      amount: '120',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'
    },
    {
      name: 'UK',
      amount: '123',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'
    },
    {
      name: 'CANADA',
      amount: '234',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Canada.png'
    },
    {
      name: 'ENGLAND',
      amount: '332',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'
    },
    {
      name: 'KSA',
      amount: '230',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Canada.png'
    },
    {
      name: 'UAE',
      amount: '121',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'
    },
  ]

  const InfoCard = ({ first_title, value, last_title }) => {
    return (
      <div className='rounded-md px-3 text-center font-main py-4' style={{ boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)' }}>
        <p className='text-gray-600 text-[16px] font-[600]'>
          {first_title}
        </p>
        <p className='text-gray-700 font-[700] text-[30px] py-2'>
          ${value}
        </p>
        <p className='text-gray-600 text-[14px] font-[400]'>
          {last_title}
        </p>
      </div>
    )
  }

  const TopCountry = ({ icon, name, amount }) => {
    return (
      <div className='flex items-center justify-between px-3 py-2 rounded-md' >
        <div className='flex items-center'>
          <img src={icon} alt="icon" className='w-[16px] h-[16px] rounded-md' />
          <p className='text-gray-800 text-[16px] font-[400] ms-2 capitalize'>
            {name}
          </p>
        </div>
        <p className='text-gray-700 text-[16px] font-[600]'>
          ${amount}
        </p>
      </div>
    )
  }

  return (
    <div className='my-4 px-1 font-main'>
      {/* cards */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <InfoCard first_title='Earnings (before taxes)' value='0' last_title='after associated vendor fees' />
        <InfoCard first_title='Your balance' value='0' last_title='Will be processed on Feb 15, 2021' />
        <InfoCard first_title='Pending Orders' value='0' last_title='7/3/2020 - 8/1/2020' />
      </div>
      {/* charts and top country*/}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2 lg:mt-6'>
        <div className='w-full lg:col-span-2 rounded-md p-4' style={{ boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)' }}>
          <p>
            Sales
          </p>
          <ResponsiveContainer width="95%" height={250} >
            <LineChart width={300} height={100} data={data}>
              <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className='rounded-md p-4' style={{ boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)' }}>
          <p className='text-gray-900 text-[16px] font-[600]'>
            Top countries

          </p>
          <div>
            {
              countries.map((country, index) => {
                return (
                  <TopCountry key={index} icon={country.icon} name={country.name} amount={country.amount} />
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboardInfo