import React, { useEffect, useState } from 'react'
import VendorHeader from 'components/Vendor/VendorHeader/VendorHeader'
import InputField from 'src/components/Vendor/VendorInputs/InputField'
import { IoIosArrowDropdown } from "react-icons/io";
import mobileImage from 'assets/vendor/mobile.svg'
import blackCamera from 'assets/vendor/black-camera.svg'
import { useNavigate } from 'react-router-dom';
import { CiSquareRemove } from "react-icons/ci";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { TiDeleteOutline } from 'react-icons/ti';
import { newProductAtom, userAtom } from 'src/lib/jotai';
import { useAtomValue, useSetAtom } from 'jotai';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const VendorVariations = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    // product atom
    const setProductAtom = useSetAtom(newProductAtom)
    const productAtom = useAtomValue(newProductAtom)
    const user = useAtomValue(userAtom)

    const [productPrice, setProductPrice] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [bulkCheckbox, setBulkCheckbox] = useState(true);
    const [bulkFields, setBulkFields] = useState(1);
    const [bulkPricing, setBulkPricing] = useState([{}]);
    const [productImages, setProductImages] = useState([]); // Store the selected image file
    const [productColor, setProductColor] = useState(productAtom?.color || '#FF0000')
    const [imageLinks, setImageLinks] = useState([]); // Store the image links after uploading to s3
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [track_stock, setTrack_stock] = useState(true);
    const [stockQuantity, setStockQuantity] = useState(0);
    const [limit_to_one, setLimit_to_one] = useState(false);
    const [lowStockThreshold, setLowStockThreshold] = useState(0);
    const [minimumOrder, setMinimumOrder] = useState(1);
    const [sku, setSKU] = useState('');
    const [onSale, setOnSale] = useState(productAtom?.on_sale || false);
    const [isFeatured, setIsFeatured] = useState(productAtom?.featured || false);
    const [selesPrice, setSelesPrice] = useState(productAtom?.sales_price || '');
    const [productName, setProductName] = useState(productAtom?.name || { en: '' });
    console.log(productName)

    const [weight, setWeight] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [weightUnit, setWeightUnit] = useState('kg');
    const [lengthUnit, setLengthUnit] = useState('cm');
    const [widthUnit, setWidthUnit] = useState('cm');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [selectedVariation, setSelectedVariation] = useState('');
    // console.log(productAtom)
    const [allVariations, setAllVariations] = useState([]);
    const [variations, setVariations] = useState([{ attribute: '', values: '' }]);
    const dimensions = {
        weight,
        length,
        width,
        height,
        length_unit: lengthUnit,
        weight_unit: weightUnit,
        width_unit: widthUnit,
        height_unit: heightUnit,
    };
    useEffect(() => {
        // get all variations
        const variationsObject = generateAttributeCombinations(variations).reduce((acc, combination) => {
            // Assuming combination is a string like 'S - Size'
            const key = combination;
            acc[key] = {
                name: {
                    en: key
                },
                attributes: generateAttributesArray(key),  // Initialize with default values
                description: {
                    en: ''
                },
                images: [],
                // color: '#FFFFFF',
                price: 0,
                sales_price: 0,
                track_stock: true,
                quantity: 0,
                low_stock_threshold: 0,
                on_sale: false,
                allow_bulk: true,
                bulk_prices: [{}],
                sku: '',
                dimensions: dimensions,
            };
            return acc;
        }, {});

        setAllVariations(variationsObject);
    }, [variations]);

    useEffect(() => {
        // Update the specific variation object when selectedVariation changes
        if (selectedVariation && allVariations[selectedVariation]) {
            setAllVariations(prevState => ({
                ...prevState,
                [selectedVariation]: {
                    ...prevState[selectedVariation],
                    attributes: generateAttributesArray(selectedVariation),
                    description: {
                        en: productDesc
                    },
                    images: imageLinks,
                    // color: productColor,
                    price: productPrice,
                    sales_price: selesPrice,
                    track_stock: track_stock,
                    quantity: stockQuantity,
                    low_stock_threshold: lowStockThreshold,
                    on_sale: onSale,
                    allow_bulk: bulkCheckbox,
                    bulk_prices: bulkPricing,
                    sku: sku,
                    dimensions: dimensions,
                },
            }));
        }
    }, [selectedVariation, productDesc, imageLinks, productPrice, selesPrice, track_stock, stockQuantity,
        lowStockThreshold, onSale, bulkCheckbox, bulkPricing, weight, length, width, height, lengthUnit, weightUnit,
        widthUnit, heightUnit, sku]);

    // Function to generate attributes array based on the name
    const generateAttributesArray = (name) => {
        const attributeValues = name.split(/[,|-]/).map(value => value.trim());
        const attributesArray = [];

        for (let i = 0; i < attributeValues.length; i++) {
            // For each pair of adjacent elements in the array, create an attribute object
            if (i + 1 < attributeValues.length) {
                attributesArray.push({ attribute: attributeValues[i + 1], value: attributeValues[i] });
                i++; // Skip the next element
            }
        }

        return attributesArray;
    };



    // console.log(sku, productPrice, productDesc)
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

            const imageLink = `https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`;
            // console.log("Image link:", imageLink);

            setLoadingUpload(false);

            return imageLink; // Returning the image link
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error; // Rethrow the error
        }
    };

    const uploadImages = async () => {
        if (productImages.length === 0) {
            // No images to upload
            return;
        }
        setLoadingUpload(true);

        try {
            for (const file of productImages) {
                const link = await uploadFile(file);
                setImageLinks((prevLinks) => [...prevLinks, link]);
            }
            showToast('Images uploaded successfully', 'success');
        } catch (error) {
            showToast('Error uploading images', 'error');
        } finally {
            setLoadingUpload(false);
        }
    };
    // const uploadImages = async () => {
    //     if (productImages.length === 0) {
    //         // No images to upload
    //         return [];
    //     }
    //     setLoadingUpload(true);

    //     try {
    //         const links = [];
    //         for (const file of productImages) {
    //             const link = await uploadFile(file);
    //             links.push(link);
    //         }
    //         showToast('Images uploaded successfully', 'success');
    //         return links;
    //     } catch (error) {
    //         console.error('Error uploading images:', error);
    //         showToast('Error uploading images', 'error');
    //         throw error; // Propagate the error to the calling code
    //     } finally {
    //         setLoadingUpload(false);
    //     }
    // };

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

    const generateSKU = (productNameNew) => {
        console.log(productNameNew)
        const formattedName = productNameNew?.replace(/\s/g, '-')?.toUpperCase();
        const randomPart = Math.floor(Math.random() * 1000);
        const generatedSKU = 'SBL-' + formattedName + '-' + randomPart;
        return generatedSKU;
    };

    const handleGenerateSKU = () => {
        if (productName?.en?.trim() !== '') {
            const generatedSKU = generateSKU(productName?.en);
            setSKU(generatedSKU);
            return;
        }
        // generate own sku
        setSKU(generateSKU(productAtom?.brand?.slice(0, 3) + '-' + productAtom?.name?.en?.slice(0, 3)));
    };


    const handleBulkPricingCheckbox = () => {
        if (bulkCheckbox == false && bulkFields == 0) {
            setBulkFields(1)
            setBulkPricing([{}])
        }
        setBulkCheckbox(!bulkCheckbox)
    };
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

    const handleAddVariation = () => {
        setVariations([...variations, { attribute: '', values: '' }]);
    };
    // console.log(variations)

    const handleAttributeChange = (index, attribute) => {
        const updatedVariations = [...variations];
        updatedVariations[index].attribute = attribute;
        setVariations(updatedVariations);
    };

    const handleValuesChange = (index, values) => {
        const updatedVariations = [...variations];
        updatedVariations[index].values = values;
        setVariations(updatedVariations);
    };
    const handleWeightChange = (value) => {
        setWeight(value);
    };

    const handleLengthChange = (value) => {
        setLength(value);
    };

    const handleWidthChange = (value) => {
        setWidth(value);
    };

    const handleHeightChange = (value) => {
        setHeight(value);
    };

    const handleWeightUnitChange = (unit) => {
        setWeightUnit(unit);
    };

    const handleLengthUnitChange = (unit) => {
        setLengthUnit(unit);
    };

    const handleWidthUnitChange = (unit) => {
        setWidthUnit(unit);
    };

    const handleHeightUnitChange = (unit) => {
        setHeightUnit(unit);
    };

    const handleOnSaleCheckbox = () => {
        setOnSale(!onSale)
    };
    // remove all variation
    const handleRemoveVariation = () => {
        setVariations([{ attribute: '', values: '' }])
        setSelectedVariation('')
    };

    // save draft product
    const [product_id, setProduct_id] = useState(productAtom?._id || '')

    const handleSaveDraft = async (goNext) => {
        // console.log(goNext)
        const variationsArray = Object?.values(allVariations);
        setProductAtom({
            ...productAtom,
            variations: variationsArray,
        });
        const data = {
            ...productAtom,
            variations: variationsArray,
            'is_published': false,
            'draft': true,
        };

        // update draft product
        if (product_id) {
            console.log('updating draft product')
            const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${product_id}`, data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })
            if (res.status === 200) {
                // check if next page or not
                if (goNext) {
                    navigate('/vendor-variations')
                } else {
                    showToast('Product drafted successfully', 'success')
                    navigate('/vendor-products')
                }
            } else {
                showToast('Error adding product, try again', 'error')
            }
            return;
        }

        data.shop = user?.vendor_info?.shop?._id
        // create a new draft product
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

    // save product
    const handleSaveProduct = async () => {
        // remove key from all variations object
        const variationsArray = Object?.values(allVariations);
        setProductAtom({
            ...productAtom,
            variations: variationsArray,
        });
        const data = {
            ...productAtom,
            variations: variationsArray,
            shop: user?.vendor_info?.shop?._id,
        };
        // console.log(data)
        setProductAtom(data);
        // update if product id is present
        if (data?._id) {
            const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${data?._id}`, data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })
            // console.log(res)
            if (res.status == 200) {
                showToast(`Product info updated successfully`, 'info')
                queryClient.invalidateQueries('products')
                navigate('/vendor-products')
            } else {
                showToast('Something went wrong, Please try again', 'error')
            }
            console.log(data?._id)
        } else {
            let isView = true;
            // create new product
            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/products/create`, data)
            // console.log(res)
            if (res.status === 200) {
                showToast('Product created successfully', 'success')
                navigate(`/product/${res?.data?.product?._id}${isView ? '?isView=true' : ''}`);
            } else {
                showToast('Error adding product, try again', 'error')
            }
        }


    };
    console.log(allVariations)
    // console.log(productAtom)    

    // Function to generate all combinations of attribute-value pairs
    const generateAttributeCombinations = (attributes) => {
        if (attributes.length === 0 || attributes[0].attribute === '') {
            return [];
        }

        const [firstAttribute, ...restAttributes] = attributes;
        const restCombinations = generateAttributeCombinations(restAttributes);

        if (restCombinations?.length === 0) {
            return firstAttribute?.values
                .split(',')
                .map(value => `${value.trim()} - ${firstAttribute.attribute}`);
        }

        return firstAttribute?.values
            .split(',')
            .flatMap(value =>
                restCombinations.map(combination => `${value.trim()} - ${firstAttribute.attribute}, ${combination}`)
            );
    };


    return (
        <div className='h-full md:p-3 font-main lg:-ms-10'>
            <VendorHeader text='Variations Set Up' />
            <div className='lg:ms-6 mt-6'>
                <div>
                    <div className='flex justify-between items-start flex-col md:flex-row gap-2'>
                        <p className='font-600 text-[14px]'>Variation</p>
                        <div className='flex gap-2'>
                            {
                                allVariations[selectedVariation] &&
                                <button
                                    onClick={handleRemoveVariation}
                                    className='bg-[#4E97FD] text-primary-text-color px-4 py-2 rounded-sm text-sm'
                                >
                                    Clear All Variation
                                </button>
                            }
                            {/* new variation */}
                            <button
                                onClick={handleAddVariation}
                                className='bg-[#4E97FD] text-primary-text-color px-4 py-2 rounded-sm text-sm'
                            >
                                New Variation
                            </button>
                        </div>

                    </div>
                </div>
                {/* variation data input boxs */}
                {variations.map((variation, index) => (
                    <div key={index} className='grid grid-cols-1 lg:grid-cols-12 lg:gap-5 gap-0 relative'>
                        <div className='col-span-10 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-5 z-10'>
                            <div className='lg:col-span-4 relative mt-4'>
                                <label
                                    htmlFor={`attribute-${index}`}  // Unique name for each attribute input
                                    className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900"
                                >
                                    Attributes
                                </label>
                                <input
                                    type={'text'}
                                    name={`attribute-${index}`}  // Unique name for each attribute input
                                    min={0}
                                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    placeholder={'Colors'}
                                    value={variation.attribute}
                                    onChange={(e) => handleAttributeChange(index, e.target.value)}
                                />
                            </div>
                            <div className='lg:col-span-8 mt-4 relative'>
                                <label
                                    htmlFor={`values-${index}`}  // Unique name for each values input
                                    className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900"
                                >
                                    Values
                                </label>
                                <input
                                    type={'text'}
                                    name={`values-${index}`}  // Unique name for each values input
                                    min={0}
                                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    placeholder={'Black, Green, White'}
                                    value={variation.values}
                                    onChange={(e) => handleValuesChange(index, e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        if (index == 0) {
                                            showToast('At least one variation is required', 'error')
                                        } else {
                                            const updatedVariations = [...variations];
                                            updatedVariations.splice(index, 1);
                                            setVariations(updatedVariations);
                                        }
                                    }}
                                    className='bg-[#4E97FD] text-primary-text-color px-4 py-2 mt-2 lg:py-4 rounded-sm text-sm block lg:hidden'
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        <div className='col-span-2 flex justify-center items-center z-10'>
                            <button
                                onClick={() => {
                                    if (index == 0) {
                                        showToast('At least one variation is required', 'error')
                                    } else {
                                        const updatedVariations = [...variations];
                                        updatedVariations.splice(index, 1);
                                        setVariations(updatedVariations);
                                    }
                                }}
                                className='bg-[#4E97FD] text-primary-text-color px-4 py-4 mt-3 rounded-sm w-full text-sm hidden lg:block'
                            >
                                Remove
                            </button>
                        </div>

                    </div>
                ))}

                {/* generated varition select box */}
                <div className='flex justify-between items-center relative my-6'>
                    <label
                        htmlFor='Variation'
                        className='absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900'
                    >
                        Variation
                    </label>
                    <select
                        onChange={(e) => {
                            setSelectedVariation(e.target.value)
                            // console.log(e.target.value)
                        }}
                        style={{ appearance: 'none' }}
                        className='block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                    >
                        <option value=''>Select Variation</option>
                        {/* generating variation */}
                        {generateAttributeCombinations(variations).map((combination, index) => (
                            <option key={index} value={combination}>
                                {combination}
                            </option>
                        ))}
                    </select>
                    <IoIosArrowDropdown className='absolute right-2 w-6 h-6 text-gray-500' />
                </div>

                {
                    // check selected variation is not empty
                    selectedVariation !== '' &&
                    <>
                        {/* variation products div */}
                        <p className='font-600 text-[14px]'>Variation Products</p>
                        {/* SKU Generator */}
                        <div className='flex justify-between items-center relative my-6'>
                            <label
                                htmlFor='SKU'
                                className='absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900'
                            >
                                SKU*
                            </label>
                            <input
                                type={'text'}
                                name='name'
                                min={0}
                                value={productName?.en?.toUpperCase()}
                                onChange={(e) => setProductName({ ...productName, en: e.target.value })}
                                className='block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                placeholder={'Write a SKU or generate one'}
                            />
                            <button
                                onClick={handleGenerateSKU}
                                className='bg-[#4E97FD] text-primary-text-color px-4 py-2 rounded-sm text-[10px] absolute right-2'
                            >
                                Generate SKU
                            </button>
                        </div>
                        {sku && (
                            <p className='text-sm text-gray-700 mb-4 -mt-2 '>
                                Generated SKU : <span className='font-medium'>{sku}</span>
                            </p>
                        )}
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
                            <button
                                onClick={() => uploadImages()}
                                className='bg-[#4E97FD] text-primary-text-color px-4 py-2 rounded-sm text-[10px] absolute right-2 bottom-2'
                            >
                                Cofirm Image Upload
                            </button>
                            {/* Display selected images */}
                            {productImages.length ? (
                                <div className='mt-3 flex flex-wrap overflow-x-auto'>
                                    {productImages.map((image, index) => (
                                        <div key={index} className='relative mr-2 mb-2'>
                                            <img
                                                src={URL.createObjectURL(image)}
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
                                    ? 'Click cross to remove existing ones'
                                    : 'Upload 280*280 images'}
                            </p>
                        </div>

                        {/* description and price */}
                        <InputField label='Description' type='textField' placeholder={'Samsung Galaxy-M1 Desc'} value={productDesc} onChange={setProductDesc} />
                        <InputField label='Price' type='number' placeholder={'200 USD'} value={productPrice} onChange={setProductPrice} />

                        {/* On Sale pricing and featured */}
                        <div className='flex justify-start items-center gap-5 my-4'>
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
                            {/* featured check box
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
                    </div> */}
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
                        {/* stock management */}
                        <div className='flex justify-start items-start mb-6 flex-col md:flex-row gap-2'>
                            <p className='text-sm font-[600]'>
                                Stock Management
                            </p>
                            <div className='flex justify-center items-center md:ml-[35px]'>
                                <input
                                    type="checkbox"
                                    checked={track_stock}
                                    className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                                    // checkbox state
                                    onChange={() => setTrack_stock(!track_stock)}
                                />
                                <p className='text-sm text-gray-600 ml-[5px]'>Track stock quantity for this product</p>
                            </div>
                        </div>
                        <InputField label='Quantity*' type='number' value={stockQuantity} onChange={setStockQuantity} />
                        {
                            track_stock &&
                            <InputField label={`Low Stock Threshold*`} type='number' value={lowStockThreshold} onChange={setLowStockThreshold} />

                        }
                        {/* sold indivisual */}
                        <div className='flex justify-start items-start mb-6 flex-col md:flex-row gap-2'>
                            <p className='text-sm font-[600]'>
                                Sold Individually
                            </p>
                            <div className='flex justify-center items-center md:ml-[35px]'>
                                <input
                                    type="checkbox"
                                    checked={limit_to_one}
                                    className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                                    // checkbox state
                                    onChange={() => { setLimit_to_one(!limit_to_one) }}
                                />
                                <p className='text-sm text-gray-600 ml-[5px]'>Limit purchases to 1 item per order</p>
                            </div>
                        </div>
                        {
                            !limit_to_one &&
                            <InputField label={`Minimum orders*`} type='number' value={minimumOrder} onChange={setMinimumOrder} />
                        }


                        {/* bulk pricing */}
                        <p className='text-[12px] font-[600] my-[20px]'>
                            Set up Bulk Pricing
                        </p>
                        <div className='flex justify-start items-center'>
                            <p className='text-[12px] font-[600]'>
                                Bulk Purchase
                            </p>
                            <div className='flex justify-center items-center ml-[35px]'>
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
                                <div key={index} className='grid grid-cols-12 gap-5'>
                                    <div className='col-span-5 flex justify-between gap-5'>
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
                                    <p className='col-span-7'>
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
                        {/* drop down for color */}
                        <InputField
                            // label={`Color for filtering *`}
                            type='color'
                            placeholder={'99'}
                            value={productColor}
                            onChange={setProductColor}
                        />
                        {/* dimensions */}
                        <p className='font-600 text-[14px] mt-6'>Dimensions (Please mention unit per input)</p>

                        <div className='w-full grid grid-cols-12 gap-3'>
                            <div className='lg:col-span-11 col-span-10'>
                                <InputField label='Weight' type='text' value={weight} onChange={handleWeightChange} />
                            </div>
                            <select
                                style={{ appearance: 'none' }}
                                className='py-3.5 ps-[5px] lg:ps-[20px] cursor-pointer self-center col-span-2 lg:col-span-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                value={weightUnit}
                                onChange={(e) => handleWeightUnitChange(e.target.value)}
                            >
                                <option value='kg'>KG</option>
                                <option value='lb'>LB</option>
                            </select>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                            <div className='relative'>
                                <InputField label='Length' type='text' value={length} onChange={handleLengthChange} />
                                <select
                                    className='absolute top-[38px] right-2 border-none outline-none'
                                    value={lengthUnit}
                                    onChange={(e) => handleLengthUnitChange(e.target.value)}
                                >
                                    <option value='cm'>cm</option>
                                    <option value='in'>in</option>
                                    <option value='ft'>ft</option>
                                </select>
                            </div>
                            <div className='relative'>
                                <InputField label='Width' type='text' value={width} onChange={handleWidthChange} />
                                <select
                                    className='absolute top-[38px] right-2 border-none outline-none'
                                    value={widthUnit}
                                    onChange={(e) => handleWidthUnitChange(e.target.value)}
                                >
                                    <option value='cm'>cm</option>
                                    <option value='in'>in</option>
                                    <option value='ft'>ft</option>
                                </select>
                            </div>
                            <div className='relative'>
                                <InputField label='Height' type='text' value={height} onChange={handleHeightChange} />
                                <select
                                    className='absolute top-[38px] right-2 border-none outline-none'
                                    value={heightUnit}
                                    onChange={(e) => handleHeightUnitChange(e.target.value)}
                                >
                                    <option value='cm'>cm</option>
                                    <option value='in'>in</option>
                                    <option value='ft'>ft</option>
                                </select>
                            </div>
                        </div>
                    </>
                }

                {/* preview and save as draft button */}
                <div div className='flex justify-start items-center mt-[20px] gap-3' >
                    <p
                        // next button navigate to inventory page
                        onClick={() => {
                            // await uploadImages()
                            // const links = await uploadImages()
                            handleSaveProduct()
                        }}
                        className='text-[12px] font-[600] bg-[#4E97FD] text-primary-text-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'>
                        Save and Preview
                    </p>

                    <p
                        onClick={() => handleSaveDraft(false)}
                        className='text-[12px] font-[600] bg-header-background text-primary-text-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'>
                        Save Draft
                    </p>

                </div >
            </div>
        </div>
    )
}

export default VendorVariations