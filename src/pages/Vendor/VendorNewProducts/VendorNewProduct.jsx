import React, { useEffect, useState } from 'react'
import VendorHeader from '../../../components/Vendor/VendorHeader/VendorHeader'
import { useNavigate, useParams } from 'react-router-dom'
import InputField from '../../../components/Vendor/VendorInputs/InputField';
import mobileImage from 'assets/vendor/mobile.svg'
import blackCamera from 'assets/vendor/black-camera.svg'
import NextAndDraft from 'components/Vendor/NextAndDraft/NextAndDraft';
import { TiDeleteOutline } from "react-icons/ti";
import { useAtomValue, useSetAtom } from 'jotai';
import { newProductAtom, userAtom } from 'src/lib/jotai';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const VendorNewProduct = () => {
  // for editing product
  const navigate = useNavigate();
  // product atom
  const setProductAtom = useSetAtom(newProductAtom)
  const productAtom = useAtomValue(newProductAtom)
  const user = useAtomValue(userAtom)
  // console.log(productAtom)
  const [onSale, setOnSale] = useState(productAtom?.on_sale || false);
  const [isFeatured, setIsFeatured] = useState(productAtom?.featured || false);
  const [selesPrice, setSelesPrice] = useState(productAtom?.sales_price || '');
  const [is_published, setIs_published] = useState(productAtom?.is_published || false);
  const [bulkCheckbox, setBulkCheckbox] = useState(productAtom?.allow_bulk || false);
  const [bulkFields, setBulkFields] = useState(1);
  const [bulkPricing, setBulkPricing] = useState([{}]);
  const [productName, setProductName] = useState(productAtom?.name?.en || '');
  const [productBrand, setProductBrand] = useState(productAtom?.brand || '');
  const [productDescription, setproductDescription] = useState(productAtom?.description?.en || '');
  const [productPrice, setProductPrice] = useState(productAtom?.price || '');
  const [productImages, setProductImages] = useState(productAtom?.images || []);
  const [productColors, setProductColors] = useState(productAtom?.color || [])
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState(productAtom?.tags || []);
  const [categories, setCategories] = useState(productAtom?.main_category || [])
  const [sku, setSku] = useState(productAtom?.sku || '')
  const [newTags, setNewTags] = useState([]);
  const allTags = ["Air Freshner", "Light", "Fan", "Mini fan"];
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageLinks, setImageLinks] = useState(productAtom?.images || []); // Store the uploaded image links
  const [selectedProducts, setSelectedProducts] = useState(productAtom?.related_product || []);

  const filteredCategories = allTags.filter(category =>
    category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setNewTags([]);
  };

  const handleCategoryChange = (category) => {
    // Handle existing categories
    setSelectedTags(prevSelectedCategories => [...prevSelectedCategories, category]);
    setSearchValue('');
    setNewTags([]);
  };

  // console.log(productImage)
  const handleBulkInputChange = (index, field, value) => {
    // Update the bulk pricing array based on the input changes
    const updatedBulkPricing = [...bulkPricing];
    updatedBulkPricing[index] = {
      ...updatedBulkPricing[index],
      [field]: value,
    };
    setBulkPricing(updatedBulkPricing);
  };

  const handleRemoveBulkRange = () => {
    // Remove the last bulk range
    if (bulkFields === 1 && bulkCheckbox === true) {
      setBulkFields(0)
      setBulkCheckbox(false)
    }
    setBulkFields(bulkFields - 1);
    setBulkPricing(bulkPricing.slice(0, bulkPricing.length - 1));
  };

  const handleAddBulkRange = () => {
    // Add a new bulk range
    setBulkFields(bulkFields + 1);
    setBulkPricing([...bulkPricing, {}]);
  };

  const handleBulkPricingCheckbox = () => {
    if (bulkCheckbox == false && bulkFields == 0) {
      setBulkFields(1)
      setBulkPricing([{}])
    }
    setBulkCheckbox(!bulkCheckbox)
  };

  const handleOnSaleCheckbox = () => {
    setOnSale(!onSale)
  };

  const uploadFile = async (file) => {
    try {
      // S3 Bucket Name & region
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
      const params = {
        Bucket: S3_BUCKET,
        Key: timeStamp + user._id + file.name,
        Body: file,
      };

      // Uploading file to s3
      setLoadingUpload(true);

      await s3.putObject(params).promise();
      // get real time progress of file upload
      s3.upload(params, function (err, data) {
        if (err) {
          console.log("Error uploading file: ", err);
        }
        // console.log("File uploaded successfully: ", data);
      }).on('httpUploadProgress', function (progress) {
        setProgress(Math.round((progress.loaded / progress.total) * 100));
      });

      // set progress to 100 after uploading
      const imageLink = `https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`;
      // console.log("Image link:", imageLink);

      setLoadingUpload(false);

      return imageLink; // Returning the image link
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Rethrow the error
    }
  };

  // const uploadImages = async () => {
  //   if (productImages.length === 0) {
  //     // No images to upload
  //     return;
  //   }
  //   setLoadingUpload(true);

  //   try {
  //     for (const file of productImages) {
  //       const link = await uploadFile(file);
  //       setImageLinks((prevLinks) => [...prevLinks, link]);
  //     }
  //     showToast('Images uploaded successfully', 'success');
  //     // setProductImages([]);
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     showToast('Error uploading images', 'error');
  //   } finally {
  //     setLoadingUpload(false);
  //   }
  // };
  const uploadImages = async () => {
    if (productImages.length === 0) {
      // No images to upload
      return [];
    }
    setLoadingUpload(true);

    try {
      const links = [];
      for (const file of productImages) {
        const link = await uploadFile(file);
        links.push(link);
      }
      showToast('Images uploaded successfully', 'success');
      return links;
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast('Error uploading images', 'error');
      throw error; // Propagate the error to the calling code
    } finally {
      setLoadingUpload(false);
    }
  };

  // console.log(imageLinks)
  // console.log(bulkPricing);
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setProductImages((prevImages) => [...prevImages, ...droppedFiles]);
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    setProductImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const removeImage = (index) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
    setImageLinks((prevLinks) => prevLinks.filter((link, i) => i !== index));
  };
  // console.log(imageLinks)
  // save for next page
  const handleSave = async () => {
    let imageLinks = await uploadImages();
    if (imageLinks?.length < 1) return showToast('Please upload images', 'error')
    // return;
    if (!productName || !productDescription || !productPrice || categories?.length < 1 || !productBrand) { // || productColors?.length < 1
      console.log(
        productName,
        productDescription,
        productPrice,
        productImages.length,
        categories.length,
        productBrand,
        productColors
      )
      return showToast('Please fill all required fields', 'error')
    }
    if (bulkCheckbox === true) {
      for (let i = 0; i < bulkPricing.length; i++) {
        if (!bulkPricing[i].low_range || !bulkPricing[i].high_range || !bulkPricing[i].price) return showToast(`Bulk pricing can't be empty`, 'error')
      }
    }
    // Save the product to the database
    const product = {
      ...productAtom,
      name: {
        en: productName
      },
      images: imageLinks,
      description: {
        en: productDescription
      },
      price: productPrice,
      on_sale: onSale,
      sales_price: selesPrice,
      featured: isFeatured,
      brand: productBrand,
      main_category: categories[0],
      tags: selectedTags,
      allow_bulk: bulkCheckbox,
      bulk_prices: bulkPricing,
      color: productColors,
      is_published: is_published,
      related_products: selectedProducts,
    };
    setProductAtom(product)
    navigate('/vendor-inventory')
  }

  // for saving draft
  const [product_id, setProduct_id] = useState(productAtom?._id || '')

  const handleSaveDraft = async () => {
    // Save the product to the database
    const imageLinks = await uploadImages();
    if (!productName) {
      showToast('At least provide product name', 'error')
      return;
    }
    const data = {
      'is_published': false,
      'draft': true,
    };

    if (productName) data.name = { en: productName }
    if (productDescription) data.description = { en: productDescription }
    if (productPrice) data.price = Number(productPrice)
    if (onSale) data.on_sale = onSale
    if (selesPrice) data.sales_price = Number(selesPrice)
    if (isFeatured) data.featured = isFeatured
    if (productBrand) data.brand = productBrand
    if (categories) data.main_category = categories
    if (selectedTags) data.tags = selectedTags
    if (bulkCheckbox) data.allow_bulk = bulkCheckbox
    if (bulkPricing) data.bulk_prices = bulkPricing
    if (productColors) data.color = productColors[0]
    if (sku) data.sku = sku
    if (imageLinks) data.images = imageLinks
    // update draft product
    if (product_id) {
      console.log('updating draft product')
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${product_id}`, data, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
        }
      })
      if (res.status === 200) {
        showToast('Product drafted successfully', 'success')
        navigate('/vendor-products')
      } else {
        showToast('Error adding product, try again', 'error')
      }
      return;
    }

    // 'shop': user?.vendor_info?.shop?._id,
    data.shop = user?.vendor_info?.shop?._id
    // create a new draft product
    if (selectedProducts) data.related_products = selectedProducts
    const res = await axios.post(`${import.meta.env.VITE_API_PATH}/products/create`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })

    if (res.status === 200) {
      showToast('Product drafted successfully', 'success')
      navigate('/vendor-products')
    } else {
      showToast('Error adding product, try again', 'error')
    }


  }

  const handleSaveDraftAndNext = async () => {
    // Save the product to the database
    if (!productName) {
      showToast('At least provide product name', 'error')
      return;
    }
    const data = {
      'is_published': false,
      'draft': true,
    };

    if (productName) data.name = { en: productName }
    if (productDescription) data.description = { en: productDescription }
    if (productPrice) data.price = Number(productPrice)
    if (onSale) data.on_sale = onSale
    if (selesPrice) data.sales_price = Number(selesPrice)
    if (isFeatured) data.featured = isFeatured
    if (productBrand) data.brand = productBrand
    if (categories) data.main_category = categories
    if (selectedTags) data.tags = selectedTags
    if (bulkCheckbox) data.allow_bulk = bulkCheckbox
    if (bulkPricing) data.bulk_prices = bulkPricing
    if (productColors) data.color = productColors[0]
    if (sku) data.sku = sku
    if (imageLinks) data.images = imageLinks

    // // update draft product
    if (product_id) {
      console.log('updating draft product')
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${product_id}`, data, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
        }
      })
      if (res.status === 200) {
        navigate('/vendor-inventory')
      } else {
        showToast('Error adding product, try again', 'error')
      }
      return;
    }

    // 'shop': user?.vendor_info?.shop?._id,
    data.shop = user?.vendor_info?.shop?._id
    // create a new draft product
    const res = await axios.post(`${import.meta.env.VITE_API_PATH}/products/create`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })

    if (res.status === 200) {
      navigate('/vendor-inventory')
    } else {
      showToast('Error adding product, try again', 'error')
    }
  }


  return (
    <div className='h-full md:p-3  font-main lg:-ms-10'>
      {/* file upload progress */}
      {
        loadingUpload && (
          <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-10'>
            <div className='bg-white p-5 rounded-md'>
              <p className='text-center'>Uploading product images | Progress {progress}%</p>
              <div className='w-full h-2 bg-gray-300 rounded-md'>
                <div className='w-[50%] h-full bg-[#4E97FD] rounded-md'></div>
              </div>
            </div>
          </div>
        )
      }
      <VendorHeader text='Product' />
      <div>
        {/* product name */}
        <InputField label='Name*' type='text' placeholder={'Samsung Galaxy-M1'} value={productName} onChange={setProductName} />
        {/* image upload field */}
        <div
          className='bg-gray-100 cursor-pointer relative p-2 h-[220px] rounded-md flex justify-center items-center flex-col border-dashed border-gray-300 border-[1px]'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            if (!productImages.length) {
              handleImageClick();
            }
          }}
        >
          {/* <button
            onClick={() => uploadImages()}
            className='bg-[#4E97FD] text-primary-text-color px-4 py-2 rounded-sm text-[10px] absolute right-2 bottom-2'
          >
            Cofirm Image Upload
          </button> */}
          {/* Display selected images */}

          {
            productImages.length ? (
              <div className='mt-3 flex flex-wrap overflow-x-auto'>
                {productImages.map((image, index) => (
                  <div key={index} className='relative mr-2 mb-2'>
                    <img
                      src={typeof (image) == 'string' ? image : URL.createObjectURL(image)}
                      alt={`selected-product-${index}`}
                      className='w-[150px] h-[150px] rounded-md object-cover mb-2'
                    />
                    <TiDeleteOutline
                      className='absolute w-7 h-7 text-gray-400 border-sky-100 top-0 right-0 cursor-pointer'
                      onClick={() => removeImage(index)}
                    />
                  </div>
                ))}

              </div>
            ) : (
              <>
                <p className='text-[12px] font-[600]'>Drag & drop product images here</p>
                {/* or */}
                <div className='flex justify-center items-center w-[150px]'>
                  <div className='w-[100%] h-[1px] bg-gray-300'></div>
                  <p className='text-sm text-gray-400 mx-2 mb-1'>or</p>
                  <div className='w-[100%] h-[1px] bg-gray-300'></div>
                </div>
                <div className='relative -mt-2'>
                  <img src={mobileImage}
                    alt="mobile-icon"
                    className='w-[100px] h-[100px] '
                  />
                  <img src={blackCamera}
                    alt="mobile-icon"
                    className='w-[25px] h-[25px] absolute bottom-2 left-[37%]'
                  />
                </div>
              </>
            )}
          {/* input field for image upload handling */}
          <input
            type='file'
            id='fileInput'
            className='hidden'
            multiple
            onChange={handleFileInputChange}
          />
          <p className='text-[11px] text-gray-900'>
            {productImages.length
              ? 'Click again to add more images or remove existing ones'
              : 'Upload 280*280 images'}
          </p>
        </div>
        {/* description */}
        <InputField label='Description*' type='textField' placeholder={'Samsung Galaxy-M1 Desc'} value={productDescription} onChange={setproductDescription} />
        {/* price */}
        <InputField label='Price*' type='number' placeholder={'200 USD'} value={productPrice} onChange={setProductPrice} />
        {/* On Sale pricing and featured */}
        <div className='flex justify-start items-center gap-5'>
          <div className='flex justify-center items-center '>
            <input
              type="checkbox"
              checked={onSale}
              className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
              // checkbox state handling for bulk pricing
              onChange={handleOnSaleCheckbox}
            />
            <p className='text-[11px] text-gray-900 ml-[5px]'>ON SALE AVAILABLE</p>
          </div>
          {/* featured check box */}
          <div className='flex justify-center items-center '>
            <input
              type="checkbox"
              checked={isFeatured}
              className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
              // checkbox state handling for bulk pricing
              onChange={() => {
                setIsFeatured(!isFeatured)
              }}
            />
            <p className='text-[11px] text-gray-900 ml-[5px]'>MARK AS <span className='font-bold'>FEATURED</span> PRODUCT</p>
          </div>
        </div>
        {/* if on sale is clicked */}
        {
          onSale &&
          <InputField
            label={`Sales price`}
            type='number'
            // placeholder={'1'}
            value={selesPrice}
            onChange={setSelesPrice}
          />
        }
        {/* brand */}
        <InputField label='Brand*' type='text' placeholder={'Samsung'} value={productBrand} onChange={setProductBrand} />
        {/* main category */}
        <InputField label='Main Category*' type='category' value={categories} onChange={setCategories} />
        {/* tags */}
        <div className='relative'>
          <label
            htmlFor="name"
            className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900"
          >
            Tags
          </label>
          <div className="">
            <input
              type="text"
              name="category*"
              value={searchValue}
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
              className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder={selectedTags.length === 0 && "Search categories..."}
            />
            {searchValue && filteredCategories.length > 0 && (
              <div className="border rounded-b-md">
                <ul className="cursor-pointer ">
                  {filteredCategories.map((category, index) => (
                    <li
                      className='hover:bg-slate-100 py-1 px-3 transitionc'
                      key={index}
                      onClick={() => handleCategoryChange(category)}>
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {
              searchValue.length > 0 &&
              <p
                className='p-3 cursor-pointer hover:bg-slate-100'
                onClick={() => {
                  setNewTags((prevNewTags) => [...prevNewTags, searchValue]);
                  handleCategoryChange(searchValue);
                }}
              >
                Add Tag: {searchValue}
              </p>
            }
            <div className="flex flex-wrap gap-2 my-2">
              {[...selectedTags, ...newTags]?.map((category, index) => (
                <span key={index} className="selected-category rounded-full bg-green-700 px-3 py-1 mr-1 text-primary-text-color">
                  {category}
                  <span
                    className="ml-2 cursor-pointer p-y"
                    onClick={() => {
                      setSelectedTags((prevSelectedCategories) =>
                        prevSelectedCategories.filter(
                          (prevCategory) => prevCategory !== category
                        )
                      );
                      setNewTags((prevNewTags) =>
                        prevNewTags.filter((newTag) => newTag !== category)
                      );
                    }}
                  >
                    x
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* drop down for color */}
        <InputField
          type='color'
          value={productColors}
          onChange={setProductColors}
        />
        {/* bulk pricing */}
        <p className={`text-[12px] font-[600] mb-[20px] md:mt-4`}>
          Set up Bulk Pricing
        </p>
        <div className='flex justify-start md:items-center flex-col md:flex-row gap-2'>
          <p className='text-[12px] font-[600]'>
            Bulk Purchase
          </p>
          <div className='flex justify-start md:items-center md:ml-[35px]'>
            <input type="checkbox"
              checked={bulkCheckbox}
              className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
              // checkbox state handling for bulk pricing
              onChange={handleBulkPricingCheckbox}
            />
            <p className='text-[11px] text-gray-900 ml-[5px]'>ALLOW <span className='font-bold'>BULK</span> PURCHASE</p>
          </div>
        </div>
        {/* fields for bulk pricing */}
        {bulkCheckbox &&
          bulkPricing.map((range, index) => (
            <div key={index} className='grid grid-cols-12 sm:gap-5 gap-1 '>
              <div className='sm:col-span-5 col-span-12 flex justify-between sm:gap-5 gap-2'>
                <InputField
                  label={`Lower Range ${index + 1}`}
                  type='number'
                  placeholder={'1'}
                  onChange={(value) => handleBulkInputChange(index, 'low_range', value)}
                />
                <InputField
                  label={`Upper Range ${index + 1}`}
                  type='number'
                  placeholder={'99'}
                  onChange={(value) => handleBulkInputChange(index, 'high_range', value)}
                />
              </div>
              <p className='sm:col-span-7 col-span-12'>
                <InputField
                  label={`Bulk Price ${index + 1}`}
                  type='number'
                  placeholder={'250 USD'}
                  onChange={(value) => handleBulkInputChange(index, 'price', value)}
                />
              </p>
            </div>
          ))
        }

        {/* add more bulk pricing */}
        {bulkCheckbox && (
          <div className='flex justify-end items-center gap-3'>
            {bulkFields > 0 && (
              <p
                className='text-[12px] font-[600] bg-header-background text-primary-text-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'
                onClick={handleRemoveBulkRange}
              >
                Remove
              </p>
            )}
            <p
              className='text-[12px] font-[600] bg-[#4E97FD] text-primary-text-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'
              onClick={handleAddBulkRange}
            >
              Add Another Range
            </p>
          </div>
        )}
        {/* <button
          className='mt-2 bg-blue-500 text-primary-text-color px-4 py-2 rounded-md'
          onClick={uploadImages}
          disabled={loadingUpload || !productImages.length}
        >
          Upload Images
        </button> */}
        <InputField label='Related Product' placeholder={'Search related products...'} type='relatedProducts' value={selectedProducts} onChange={setSelectedProducts} />
        {/* next and save draft button */}
        <div div className='flex justify-start items-center mt-[20px] gap-3' >
          <p
            // next button navigate to inventory page
            onClick={handleSave}
            className='text-[12px] font-[600] bg-[#4E97FD] py-2 text-primary-text-color px-4 rounded-sm cursor-pointer flex justify-center items-center'>
            Next
          </p>

          <p
            onClick={handleSaveDraft}
            className='text-[12px] font-[600] bg-header-background py-2 text-center text-primary-text-color px-4 rounded-sm cursor-pointer flex justify-center items-center'>
            Save Draft
          </p>
          <p
            onClick={handleSaveDraftAndNext}
            className='text-[12px] font-[600] bg-header-background py-2 text-center text-primary-text-color px-4 rounded-sm cursor-pointer flex justify-center items-center'>
            Draft & Go Next
          </p>
        </div >
      </div>
    </div >
  )
}

export default VendorNewProduct