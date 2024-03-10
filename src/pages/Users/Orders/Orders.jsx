import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import React from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import { orderItemsAtom } from 'src/lib/jotai'
import { PiShoppingCartLight } from "react-icons/pi";



const Orders = () => {
  const [showSidebar, setShowSidebar] = React.useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const orderItems = useSetAtom(orderItemsAtom)


  const { isPending, data: orders, error } = useQuery({
    queryKey: ['orders', user.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_PATH}/customer-orders/get-all?user_id=${user._id}`)
      const data = await res.json();
      return data?.orders;
    }
  })

  console.log(orders)


  return (
    <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4'>
      <div className='lg:flex justify-between items-center relative z-10 mb-6'>
        <div className='lg:hidden absolute top-0 right-2 cursor-pointer z-40' onClick={() => {
          setShowSidebar(!showSidebar)
        }}
        >
          <IoReorderThreeOutline className='w-[20px] h-[20px] ' />
        </div>
        <div className='lg:hidden'>
          {
            showSidebar && <ProfileSidebar />
          }
        </div>
      </div>
      {
        isPending && <p>Loading...</p>
      }
      {
        orders &&
        orders.length === 0 &&
        <div className='text-center flex flex-col gap-3 mt-40'>
          <PiShoppingCartLight className='w-20 h-20 text-gray-400 mx-auto animate-pulse' />
          <p className='text-gray-600'>It seems there are no orders available at the moment. Please make an order by clicking below.</p>
          <button
            className='text-green-500 hover:underline'
            onClick={() => navigate('/product-catalog')}
          >
            Shop Now
          </button>

        </div>
      }
      {orders &&
        orders.map((order) => (
          <div key={order._id}

            className='shadow-md pb-2 mb-4 rounded-sm'>
            {/* name, date, and view button  */}
            <div className='flex justify-between py-2 mb-4 border-l-4 border-green-500 '>
              <div className='flex gap-2 px-6 flex-col '>
                <p className='text-sm text-gray-600'>
                  Order ID: <span className='text-gray-800 uppercase'>#{order._id}</span>
                </p>
                <p className='text-sm text-gray-600'>
                  Placed on: <span className='text-gray-800'>{new Date(order.creation_date).toDateString()}</span>
                </p>
              </div>
              <button
                className='text-sm me-6 hover:underline text-green-500 font-medium'
                onClick={() => {
                  orderItems(order)
                  navigate(`/track-order`);
                }}
              >
                View Order
              </button>
            </div>
            {/* items name, status, quantity */}
            {order?.items &&
              order?.items?.map((item) => {

                return (
                  (
                    <div key={item._id} className='grid md:grid-cols-3 grid-cols-1 gap-3 items-center mb-6 px-6'>
                      <div className='flex items-center gap-2'>
                        {
                          item?.image !== '' && <img src={item?.image} alt="image" className='w-20 h-20 object-cover rounded-md' />
                        }
                        {/* <img src={item?.image} alt={'image of ' + item?.name?.en} className='w-20 h-20 rounded-md' /> */}
                        <div>
                          <p className='font-medium text-secondary-text-color'>{item?.name?.en}</p>
                          <p className='text-sm text-gray-500 mt-1'>{`$${item.price} x ${item.quantity}`}</p>
                        </div>

                      </div>
                      {/* status */}
                      <p className={`text-sm text-center`}>
                        <span className={`bg-gray-200 py-1 px-3 capitalize rounded-full ${item.canceled == true ? 'bg-red-500 text-primary-text-color' : item.status === 'delivered' ? 'bg-green-500 text-primary-text-color' : item.status === 'shipped' ? 'bg-green-500 text-primary-text-color' : 'text-yellow-700 bg-yellow-400 '}`}>
                          {
                            item.canceled === true ? 'canceled' : item.status
                          }
                        </span>
                      </p>
                      {/* date */}
                      {/* check if canceled */}
                      {
                        item.canceled === true ?
                          <p className='text-sm text-gray-600 text-end'>
                            Won't arrive!
                          </p>
                          :
                          <>
                            {
                              item.status === 'delivered' ?
                                <p className='text-sm text-gray-600 text-center md:text-end'>
                                  Delivered on: <span className='text-gray-800'>{new Date(order.updatedAt).toDateString()}</span>
                                </p>
                                :
                                <p className='text-sm text-gray-600 text-center md:text-end'>
                                  {
                                    order.estimation_date && `Estimated Delivery Date ${new Date(order.estimation_date).getDate()} ${new Date(order.estimation_date).toLocaleString('default', { month: 'short' })}`
                                  }
                                </p>
                            }
                          </>
                      }

                    </div>
                  )
                )
              })}
          </div>
        ))}

    </div>
  )
}

export default Orders