import React from 'react'
import { IoMdArrowDropup } from 'react-icons/io'
import { MdArrowDropDown } from 'react-icons/md'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FaCircle } from "react-icons/fa";
// import { BarChart, Bar, , XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SecondRow() {
    const data = [
        {
            'type': 'Weekly Sales',
            'amount': '9,320',
            'percentage': '25.25%'
        },
        {
            'type': 'Weekly Order',
            'amount': '9,320',
            'percentage': '-25.25%'
        }

    ]

    const WeeklySalesData = [
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

    const salesAndExpense = [
        {
            name: 'Jan',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Feb',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Mar',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'April',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'May',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'June',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'July',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const productShare = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 350 },
    ];

    const marketShare = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
    ];

    const weeklyOrder = [
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

    const COLORS_PRODUCTSHARE = ['#1A985B', '#fff'];
    const COLORS_OF_MARKET_SHARE = ['#0088FE', '#00C49F', '#FFBB28'];

    const ItemsInfo = ({ item }) => {
        return (
            <div className='w-full bg-white p-4 rounded-sm'>
                <p className='text-gray-500'> {item.type}</p>
                <div className='grid grid-cols-2 mt-4'>
                    <div>
                        <p className='text-[24px] my-2'>
                            $ {item.amount}
                        </p>
                        <p className={parseFloat(item.percentage) > 0 ? `flex items-center gap-2 text-green-600` : `flex items-center gap-2 text-red-600`}> {parseFloat(item.percentage) > 0 ? <IoMdArrowDropup className=' h-5 w-5' /> : <MdArrowDropDown className='h-5 w-5' />} {item.percentage}</p>
                    </div>
                    {/* charts */}
                    <div>
                        {
                            item.type === 'Weekly Sales' &&
                            <ResponsiveContainer width={250} height={100}>
                                <BarChart
                                    width={250}
                                    height={100}
                                    data={WeeklySalesData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                // barGap={100}
                                >
                                    <Bar dataKey="pv" fill="#1A985B" barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                        {/* {
                            item.type === 'Product Share' &&
                            <div className='relative'>
                                <PieChart width={100} height={100} >
                                    <Pie
                                        data={productShare}
                                        // cx={120}
                                        // cy={100}
                                        innerRadius={30}
                                        outerRadius={40}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_PRODUCTSHARE[index % COLORS_PRODUCTSHARE.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                                <div className='absolute top-[25%] left-[20%]'>
                                    <p className='text-sm text-center font-bold ms-2'>50%</p>
                                    <p className='text-[12px] ms-1'>Target</p>
                                </div>
                            </div>
                        } */}

                        {/* {
                            item.type === 'Market Share' &&
                            <ResponsiveContainer width='100%' height={100}>
                                <PieChart width={200} height={100}>
                                    <Pie
                                        data={marketShare}
                                        labelLine={false}
                                        // outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_OF_MARKET_SHARE[index % COLORS_OF_MARKET_SHARE.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        } */}
                        {
                            item.type === 'Weekly Order' &&
                            <ResponsiveContainer width={250} height={90}>
                                <AreaChart
                                    width={250}
                                    height={100}
                                    data={weeklyOrder}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                    {/* <XAxis dataKey="name" /> */}
                                    {/* <YAxis /> */}
                                    {/* <Tooltip /> */}
                                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        }

                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 my-4 gap-4'>

            {/* items details */}
            <div className='grid grid-cols-1 gap-4 rounded-md'>
                {
                    data.map((item, index) => <ItemsInfo item={item} key={index} />)
                }
            </div>
            {/* greeting stuff */}
            <div className=' bg-primary-color px-6 py-6 rounded-md'>
                <div className='flex justify-between items-center'>
                    <p className='text-secondary-color text-[18px]'>Analytics</p>
                    <div className='flex justify-center items-center gap-4'>
                        <p className='flex items-center gap-2'>
                            <FaCircle className='text-green-500' />
                            Sales
                        </p>
                        <p className='flex items-center gap-2'>
                            <FaCircle className='text-[#7D879C]' />
                            Expense
                        </p>
                    </div>
                    <select className='outline-none'>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                        width={500}
                        height={210}
                        data={salesAndExpense}
                        margin={{
                            top: 25,
                        }}
                    >
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        <XAxis dataKey="name" />
                        <YAxis />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar dataKey="pv" fill="#1A985B" barSize={10} />
                        <Bar dataKey="uv" fill="#7D879C" barSize={10} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}
