import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { FaGooglePlus } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import { IoSearchOutline } from 'react-icons/io5'
import { MdEdit, MdOutlineRemoveRedEye } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import VendorHeader from 'src/components/Vendor/VendorHeader/VendorHeader'
import VendorReports from 'src/components/Vendor/VendorReports/VendorReports'

const AllOrders = () => {
    const queryClient = useQueryClient()
    const user = JSON.parse(localStorage.getItem('user'))
    const limit = 10;
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const [productView, setProductView] = React.useState({});
    const [selectedFilter, setSelectedFilter] = useState('All Date');
    const navigate = useNavigate();
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const path = new URL(window.location.href).pathname;
    const [start_date, setStart_date] = useState(new Date());
    const [end_date, setEnd_date] = useState(new Date());

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['orders', limit, page],
        // start_date, end_date
        queryFn: async () => {
            try {
                // {{BASE_URL}}/order-items/get-all?shop_id=65bccf988c4a2589db57ad23

                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?limit=${limit}&page=${page}${selectedFilter !== `All Date` ? `&start_date=${start_date}&end_date=${end_date}` : ''}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData?.product;
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
        refetchInterval: 10000,
    });


    useEffect(() => {
        queryClient.invalidateQueries('orders')
    }, [])



    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);

        const currentDate = new Date(); // Get the current date

        if (filter === '12 Months') {
            const newStartDate = new Date(start_date);
            newStartDate.setMonth(start_date.getMonth() - 12);
            setStart_date(newStartDate);
            setEnd_date(currentDate); // Assuming you want to set end_date to the current date
        } else if (filter === '30 Days') {
            const newStartDate = new Date(start_date);
            newStartDate.setDate(start_date.getDate() - 30);
            setStart_date(newStartDate);
            setEnd_date(currentDate);
        } else if (filter === '7 Days') {
            const newStartDate = new Date(start_date);
            newStartDate.setDate(start_date.getDate() - 7);
            setStart_date(newStartDate);
            setEnd_date(currentDate);
        } else if (filter === '24 Hour') {
            const newStartDate = new Date(start_date);
            newStartDate.setDate(start_date.getDate() - 1);
            setStart_date(newStartDate);
            setEnd_date(currentDate);
        }
    };


    const handleSelectDates = () => {
        // Add logic to handle selecting dates
    };

    const handleFilters = () => {
        // Add logic to handle filters
    };

    console.log(data)
    const handleDeleteOrder = (id) => async () => {

        fetch(`${import.meta.env.VITE_API_PATH}/products/delete/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    showToast('Product deleted successfully', 'success')
                    queryClient.invalidateQueries('orders')
                }
            })
            .catch(error => {
                showToast('Something went wrong, Please try again', 'error')
                console.log('error', error)
            });
    }


    // component for table cell
    const ProductTableCell = ({ label, hiddenOnLG, type, img }) => {
        const cellClasses = classNames(
            hiddenOnLG && 'hidden lg:table-cell',
            'px-3 py-3.5 text-sm text-gray-500'
        );

        return (
            <td className={cellClasses}>
                {
                    type == 'category' ?
                        <p className={`px-3 py-1 rounded-sm text-center ${label == 'delivered' || label == 'shipped' ? 'text-primary-text-color bg-green-600' : 'text-yellow-800 bg-yellow-300'}`}>
                            {
                                label.charAt(0).toUpperCase() + label.slice(1)
                            }
                        </p> :
                        <p className='flex gap-2 items-center'>
                            {
                                type == 'img' ?
                                    <>
                                        {
                                            img !== undefined ?
                                                <div className='flex items-center gap-2 w-[400px]'>
                                                    <img src={img} alt="product" className='w-10 h-10 rounded-md' />
                                                    {label}
                                                </div> :
                                                <p>
                                                    <span className='bg-red-600 text-primary-text-color px-2 py-1 rounded-full me-4'>Deleted product</span>
                                                    {label}
                                                </p>
                                        }
                                    </> :
                                    <p >
                                        {label}
                                    </p>
                            }

                        </p>
                }

            </td>
        );
    };

    const FilterComponent = () => {
        return (
            <div className="flex justify-between py-2 flex-wrap gap-2 mt-3">
                <div className='border-2 border-gray-100 rounded-md'>
                    <div className="flex space-x-2 flex-wrap py-1 px-1">
                        {['All Date', '12 Months', '30 Days', '7 Days', '24 Hour'].map((filter, index) => (
                            <button
                                key={index}
                                className={`px-4 ${selectedFilter === filter ? 'bg-gray-200 py-1 rounded-md animate-pulse' : ''} `}
                                variant="outline"
                                onClick={() => handleFilterChange(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="flex items-center space-x-1 px-4 py-1 border-2 border-gray-100 rounded-md"
                        variant="outline"
                        onClick={handleSelectDates}
                    >
                        <CalendarIcon className="h-4 w-4" />
                        <span>Select Dates</span>
                    </button>
                    <button
                        className="flex items-center space-x-1 px-4 py-1 border-2 border-gray-100 rounded-md"
                        variant="outline"
                        onClick={handleFilters}
                    >
                        <FilterIcon className="h-4 w-4" />
                        <span>Filters</span>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='font-main'>
            <VendorHeader />
            <div className='mt-10 lg:mt-0'>
                {/* analytics */}
                {/* <VendorReports /> */}

                {/* tabs for filtering */}
                {/* <FilterComponent /> */}

                {/* search and add new product */}
                <div className='flex justify-between items-center mt-6 gap-2 flex-col lg:flex-row lg:items-center'>
                    <div className='relative text-[12px] w-full -mt-4'>
                        <input type="text"
                            placeholder='Search a product'
                            // search text here
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                            className='shadow-sm rounded-md px-8 py-[10px] w-full outline-none text-gray-500' />
                        <IoSearchOutline className='absolute top-[13px] left-3 text-gray-400' />
                    </div>
                    {/* add new Custom Order button */}
                    {
                        path.startsWith('/all-orders') == false && <button
                            onClick={() => {
                                navigate('/custom-order')
                            }}
                            className='hover:bg-green-600 ms-auto transition text-[12px] border-2 border-[#E5E5E5] bg-[#1A985B] text-primary-text-color rounded-md py-2 w-36 px-2 flex justify-center items-center gap-1 mb-4 lg:mt-0'>
                            <GoPlus className='w-4 h-4' />
                            Custom Order
                        </button>
                    }
                </div>

                {/* table for orders */}

                <div className="lg:px-1 overflow-scroll lg:overflow-hidden">
                    <div className="sm:mx-0 bg-white">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <td scope="col" className=" py-3.5 pl-4 pr-3 text-left text-sm text-gray-700 sm:pl-6 lg:table-cell">
                                        Name
                                    </td>
                                    <td
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm text-gray-700 lg:table-cell"
                                    >
                                        Qty
                                    </td>

                                    <td scope="col" className="px-3 py-3.5 text-left text-sm text-gray-700">
                                        Amount
                                    </td>
                                    <td scope="col" className="px-3 py-3.5 text-left text-sm text-gray-700">
                                        Status
                                    </td>
                                    <td scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-700">
                                        Action
                                    </td>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isPending && (
                                        <tr>
                                            <td colSpan='6' className='text-center py-4'>Loading...</td>
                                        </tr>
                                    )
                                }
                                {
                                    data?.length === 0 && (
                                        <tr>
                                            <td colSpan='6' className='text-center py-4'>No Products Found</td>
                                        </tr>
                                    )
                                }
                                {/* all products here */}
                                {data
                                    ?.filter((item) => {
                                        return search.toLowerCase() === '' ? item : item?.name?.en?.toLowerCase()?.includes(search);
                                    })
                                    ?.map((product, productIndex) => (
                                        <tr
                                            key={product._id}
                                            onClick={() => setProductView(product)}
                                            className={classNames(`border-t border-gray-200 ${product?._id === productView?._id && 'bg-gray-50'}`)}
                                        >
                                            {/* <ProductTableCell label={product?.images[0]} /> */}
                                            <ProductTableCell label={product?.name?.en} img={product?.product_id?.images[0]} type='img' />
                                            <ProductTableCell label={product?.quantity} />
                                            {/* <ProductTableCell label={product?.creation_date && new Date(product?.creation_date)} hiddenOnLG /> */}
                                            {/* <ProductTableCell label={product?.billingAddress} hiddenOnLG /> */}
                                            <ProductTableCell label={`$ ${product?.price}`} />
                                            <ProductTableCell label={product?.status} type='category' />
                                            {/* action cell */}
                                            <td
                                                className={classNames(
                                                    productIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'ms-4 relative py-6 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center h-full gap-2 md:flex-nowrap flex-wrap'
                                                )}
                                            >
                                                <MdEdit
                                                    onClick={() => {
                                                        navigate(`/admin-order-details/${product?._id}`)
                                                    }}
                                                    className='mr-2 cursor-pointer w-5 h-5  text-gray-600 hover:text-green-600 transition'
                                                />


                                                <AiFillDelete
                                                    // onClick={handleDeleteProduct(product?._id)}
                                                    className='mr-2 cursor-pointer w-5 h-5 text-gray-600 hover:text-red-600 transition'
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {/* pagination */}
                        <PaginationComponent
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={{}}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllOrders

function CalendarIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}


function FilterIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}
