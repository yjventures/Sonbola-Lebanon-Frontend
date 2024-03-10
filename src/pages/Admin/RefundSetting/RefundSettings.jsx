import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { CiCircleRemove } from 'react-icons/ci';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import InputField from 'src/components/Vendor/VendorInputs/InputField';

const RefundSetting = () => {
  const token = JSON.parse(localStorage.getItem('token'))


  const [refundDuration, setRefundDuration] = React.useState(null);
  const [status, setStatus] = React.useState('')
  const [reason, setReason] = React.useState([''])


  // console.log(refundDuration)
  const { isPending, isError, data: refund } = useQuery({
    queryKey: ['refundSettings'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_PATH}/refund-settings/refund-setting/65d5a254ef555085f7ccd527`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })
      setRefundDuration(response?.data?.refund_setting.duration)
      setStatus(response?.data?.refund_setting.status)
      setReason(response?.data?.refund_setting.reasons)
      return response?.data?.refund_setting;
    }

  })


  // update refund time function
  const handleRefundTimeUpdate = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/refund-settings/update/65d5a254ef555085f7ccd527`, {
        'duration': refundDuration
      }, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })
      if (res.status === 200) {
        showToast('Refund duration updated', 'info')
      } else {
        showToast('Refund duration could not updated', 'error')
      }
    } catch (e) {
      showToast('Refund duration could not updated!', 'error')
    }

  }


  // update status function
  const handleStatusUpdate = async () => {
    console.log(status)
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/refund-settings/update/65d5a254ef555085f7ccd527`, {
        'status': status
      }, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })
      if (res.status === 200) {
        showToast('Status updated', 'info')
      } else {
        showToast('Status could not updated', 'error')
      }
    } catch (e) {
      showToast('Status could not updated!', 'error')
    }
  }

  // update reasons function
  const handleUpdateReasons = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/refund-settings/update/65d5a254ef555085f7ccd527`, {
        'reasons': reason
      }, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })
      if (res.status === 200) {
        showToast('Reasons updated', 'info')
      } else {
        showToast('Reasons could not updated', 'error')
      }
    } catch (e) {
      showToast('Reasons could not updated!', 'error')
    }

  }

  return (
    <div className='w-full bg-gray-100 font-main py-4 rounded-sm'>
      <p className='p-3 text-lg font-[600]'>
        Refund Settings
      </p>

      <div className='bg-white rounded-md p-3 mx-3'>
        <p className='pt-4 pb-2 text-lg'>
          Refund Time
        </p>
        {/* refund time generation */}
        <div className="relative mt-3 pb-4">
          <label
            htmlFor="name"
            className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900 whitespace-nowrap"
          >
            Refund Request Generation Time (in hours)
          </label>
          <input
            type={'number'}
            name="name"
            // NUMBER CANT BE NEGATIVE
            min={0}
            max={24}
            className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            placeholder={`Select a time in hour (we recommend less than 6 hour) | Current duration ${refundDuration}`}
            value={refundDuration}
            onChange={(e) => setRefundDuration(e.target.value)}
          />
        </div>
        <button
          onClick={handleRefundTimeUpdate}
          className='text-primary-text-color px-6 py-2 rounded-sm bg-green-600 '>
          Update
        </button>

        {/* Order Status */}
        <p className='pt-4 pb-2 text-lg'>
          Order Status
        </p>
        <div className="relative mt-3 pb-4">
          <label
            htmlFor="name"
            className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900 whitespace-nowrap"
          >
            Enabling Refund Request
          </label>

          <select onChange={(e) => setStatus(e.target.value)} className='appearance-none block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 '>
            {
              ['enabled', 'disabled'].map((item, index) => {
                return (
                  <option value={item} key={index}  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                )
              })
            }

          </select>
        </div>
        <button
          onClick={handleStatusUpdate}
          className='text-primary-text-color px-6 py-2 rounded-sm bg-green-600 '>
          Update
        </button>

        {/* refund reasons */}
        <p className='py-3 text-lg'>
          Refund Reasons
        </p>

        <p className='py-1 text-sm'>
          Refund Reasons
        </p>
        <div>
          {
            isPending && 'Loading...'
          }

          {reason?.map((link, index) => (
            <div key={index} className='relative'>
              <InputField
                label={`Reason ${index + 1}`}
                type='text'
                placeholder='Give a reason'
                value={link}
                onChange={(value) => {
                  const updatedreason = [...reason];
                  updatedreason[index] = value;
                  setReason(updatedreason);
                }}
              />
              <CiCircleRemove
                className='w-6 h-6 absolute top-3 right-2 text-gray-400 cursor-pointer'
                onClick={() => {
                  if (reason.length > 1) {
                    const updatedreason = [...reason];
                    updatedreason.splice(index, 1);
                    setReason(updatedreason);
                  } else {
                    showToast('We recommend at least one link, if none you can proceed', 'error');
                  }
                }}
              />
            </div>
          ))}

        </div>
        <div className='flex justify-between'>
          <button
            onClick={handleUpdateReasons}
            className='text-primary-text-color px-6 py-2 rounded-sm bg-green-600 '>
            Update
          </button>
          <button
            className='bg-gray-100 px-4 py-2 rounded-md'
            onClick={() => {
              setReason([...reason, '']);
            }}
          >
            Add New Link
          </button>
        </div>


      </div>
    </div>
  )
}

export default RefundSetting