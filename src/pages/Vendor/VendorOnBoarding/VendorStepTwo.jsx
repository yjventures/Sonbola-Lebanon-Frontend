import React, { useRef, useState } from 'react'
import TextField from '../../../components/Signup/TextField'
import Button from '../../../components/Signup/Button'
import { useAtomValue, useSetAtom } from 'jotai'
import { tokenAtom, userAtom, vendorAtom } from '../../../lib/jotai'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import background from 'assets/constant/background/bg-image.png'
import { showToast } from '../../../components/Common/Toastify/Toastify'


const VendorStepTwo = () => {
  const user = useAtomValue(userAtom)
  const setUser = useSetAtom(userAtom)
  const vendorAtomData = useAtomValue(vendorAtom)
  const setVendorAtom = useSetAtom(vendorAtom)
  const token = useAtomValue(tokenAtom)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [signupLoading, setSignuploading] = useState(false)

  const [registrationNumber, setRegistrationNumber] = useState('')
  const [tinNumber, setTinNumber] = useState('')

  const [businessReg, setBusinessReg] = useState(true)
  const [tinReg, setTinReg] = useState(false)

  const [dragAndDrop, setDragAndDrop] = useState(false)
  const [terms, setTerms] = useState(false)

  const [businessLink, setBusinessLink] = useState('')
  const [tinLink, setTinLink] = useState('')

  // Function to upload file to s3
  const uploadFile = async (file, type) => {
    setLoading(true)
    setProgress(0)
    const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
    const REGION = import.meta.env.VITE_AWS_REGION;

    // S3 Credentials
    AWS.config.update({
      accessKeyId: import.meta.env.VITE_AWS_ACCESSKEYID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRETACCESSKEY,
    });
    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    // Files Parameters
    const timeStamp = Math.floor(Date.now() / 1000);
    // return;
    const params = {
      Bucket: S3_BUCKET,
      Key: timeStamp + file.name,
      Body: file,
    };

    // Uploading file to s3

    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // File uploading progress
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
        setProgress(parseInt((evt.loaded * 100) / evt.total))
      })
      .promise();

    await upload.then(data => {
      // Fille successfully uploaded
      showToast('File uploaded successfully', 'success')
      setLoading(false)
      setProgress(100)
      if (type == 'businessLink') {
        setBusinessLink(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + file.name}`)
      } else {
        setTinLink(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + file.name}`)
      }
    });
  };


  // ref for certificate link
  const tinLinkRef = useRef(null)
  const onTinLinkClick = () => {
    tinLinkRef.current.click();
  };

  const businessLinkRef = useRef(null)
  const onBusinessLinkClick = () => {
    businessLinkRef.current.click();
  };


  // business reg certificate upload
  const handleBusinessUpload = (file) => {
    uploadFile(file, 'businessLink');
  }

  // tin_certificate link upload
  const handleTinUpload = (file) => {
    uploadFile(file, 'tinLink');
  }
  const data = vendorAtomData

  const handleVendorSignup = async () => {
    setSignuploading(true)
    if (terms == false) {
      showToast('Please check terms and condition', 'error')
      return
    }


    // console.log(vendorAtomData)
    if (registrationNumber !== '' && businessLink !== '') {
      data.business_reg_number = registrationNumber
      data.business_reg_certificate_link = businessLink
      // setVendorAtom({
      //   ...vendorAtomData,
      //   business_reg_number: registrationNumber,
      //   business_reg_certificate_link: businessLink
      // })
    } else {
      showToast('You need to upload business registration number and certificate', 'error')
      return
    }

    if (tinReg == true) {
      if (tinNumber !== '' && tinLink !== '') {
        data.tin_number = tinNumber
        data.tin_certificate_link = tinLink
      } else {
        showToast('You need to upload tin number and certificate', 'error')
        return
      }
    }
    // call here api to create vendor
    data.userId = user._id
    // console.log(data)
    const response = await axios.post(`${import.meta.env.VITE_API_PATH}/vendors/create`, data)
    // console.log(response)
    if (response.status == 200) {
      showToast('Your account is in verification process', 'success')
      const response = await axios.put(`${import.meta.env.VITE_API_PATH}/users/update/${user._id}`, {
        is_first_time: false
      }, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })
      // console.log(response)
      if (response.status == 200) {
        setUser(response?.data?.user)
        navigate('/vendor-await-verificaiton')
      } else {
        showToast('Please try again', 'error')
      }
    } else {
      showToast('Please try again', 'error')
    }
    setSignuploading(false)
  }

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}
      className='pt-[87px] pb-[100px]'>
      <div className='max-w-7xl mx-auto px-3'>
        {/* header text */}
        <p className='font-teko text-[60px] text-center'>
          Start Selling on Sonbola!
        </p>
        <p className='font-teko text-[18px] text-center'>
          help us verify your organization
        </p>
        {/* box starts here */}
        <div
          style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}
          className='bg-white w-full h-[100%] max-w-[437px] mx-auto pb-6 flex justify-center flex-col items-center mt-[20px] mb-[53px] font-main'>
          <h2 className='text-center text-[#77878F] font-[600] text-[18px] mt-[14px] pb-[12px] border-b-2 w-full border-b-gray-100'>
            Step 2 of 2
          </h2>
          {/* text fields */}
          <div className='w-[100%] grid grid-cols-1 gap-4 px-6 pt-4'>
            <TextField label='Business Registration Number' type='text' placeholder='' value={registrationNumber} onChange={setRegistrationNumber} />
            <label
              className='text-sm text-gray-700 mb-[6px] text-[12px] font-[500] -mt-3'
            >
              What Business Document Do You Have
            </label>
            {/* business reg checkbox */}
            <div className='flex items-center w-full -mt-5' >
              <input type='checkbox' className='mr-2 mb-4 w-4 h-4 text-lime-500 mt-4' defaultChecked onClick={() => setBusinessReg(!businessReg)} />
              <p className='text-sm text-gray-400'>Business Registration Certificate</p>
            </div>
            {/* drag and drop box */}
            {
              businessReg == true &&
              <>
                {
                  businessLink !== '' ?
                    <p className='border border-green-400 text-center py-4 rounded-md'>
                      Awesome..Business certificate uploaded successfully
                    </p> :
                    <div onClick={onBusinessLinkClick} className='w-full flex justify-center items-center bg-gray-100 h-[100px] outline-dotted outline-2 outline-gray-300 rounded-md cursor-pointer'>
                      <p className='text-gray-900 text-[12px] font-bold'>
                        {
                          loading === true ? `Uploading document ${progress}%` : 'Select your document'
                        }
                      </p>
                    </div>
                }
                <p className='text-end text-[7px] text-[#7D879C]'>Business name has to be same as certificate**</p>
                <input type="file" ref={businessLinkRef} className='hidden' onChange={() => {
                  handleBusinessUpload(businessLinkRef.current.files[0])
                }} />
              </>
            }

            {/* TIN reg checkbox */}
            <div className='flex items-center w-full -mt-5'>
              <input type='checkbox' className='mr-2 mb-4 w-4 h-4 text-lime-500 mt-4' onClick={() => setTinReg(!tinReg)} />
              <p className='text-sm text-gray-400'>TIN Certificate</p>
            </div>
            {
              tinReg == true &&
              <>
                <TextField label='TIN Number' type='text' placeholder='' value={tinNumber} onChange={setTinNumber} />
                {
                  tinLink !== '' ?
                    <p className='border border-green-400 text-center py-4 rounded-md'>
                      Looks good.Tin certificate uploaded successfully
                    </p> :
                    <div onClick={onTinLinkClick} className='w-full flex justify-center items-center bg-gray-100 h-[100px] outline-dotted outline-2 outline-gray-300 rounded-md cursor-pointer'>
                      <p className='text-gray-900 text-[12px] font-bold'>
                        {
                          loading === true ? `Uploading document ${progress}%` : 'Select your document'
                        }
                      </p>
                    </div>
                }
                <input
                  type="file"
                  ref={tinLinkRef}
                  className='hidden'
                  onChange={() => {
                    handleTinUpload(tinLinkRef.current.files[0])
                  }}
                />
              </>

            }
          </div>
          <div className='w-full px-6 mt-4'
            onClick={() => {
              if (loading === true) {
                showToast('Your documents are loading, please wait', 'info')
                return;
              }
              handleVendorSignup()
            }}
          >
            <Button text={signupLoading == true ? 'Sign up process in progress' : 'Sign up as a vendor'} />
          </div>
          <div className='flex items-center mb-4 w-full px-6'>
            <input type='checkbox' className='mr-2 mb-4 w-4 h-4 text-lime-500 mt-4' onClick={() => setTerms(!terms)} />
            <p className='text-sm text-gray-400'>I agree to <span className='text-[#2DA5F3] cursor-pointer'>Terms and Conditions</span> and <span className='text-[#2DA5F3] cursor-pointer'> Privacy Policy.</span></p>
          </div>

        </div>
      </div>
    </div >
  )
}

export default VendorStepTwo