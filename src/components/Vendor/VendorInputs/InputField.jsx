import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { basicColors } from 'src/lib/helper/basicColors';

const InputField = ({ label, type, placeholder, value, onChange }) => {
    const [searchValue, setSearchValue] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [searchValue, setSearchValue] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    // console.log('selectedProducts', selectedProducts);
    // console.log('filteredProducts', filteredProducts);
    // Adjust the fetchProducts function to use the new API response
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    // console.log(user.vendor_info?.shop?._id)
    const fetchProducts = () => {
        if (!user.vendor_info?.shop?._id) return;
        fetch(`${import.meta.env.VITE_API_PATH}/products/get-all?shop=${user.vendor_info?.shop?._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const productNames = data?.product_info?.map(product => product); // Assuming 'en' is the English language code
                setFilteredProducts(productNames);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    
    // State to keep track of the selected color
    const [selectedColors, setSelectedColors] = useState([]);
    // fetch categories
    const fetchCategories = () => {
        fetch(`${import.meta.env.VITE_API_PATH}/categories/get-all`)
            .then((response) => response.json())
            .then((data) => {
                // Extract only the 'name' property from each category object
                const categoryNames = data?.categories?.map(category => category?.name);
                setCategories(categoryNames);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    };


    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);


    // const [selectedColors, setSelectedColors] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hexValue, setHexValue] = useState([]);
    const ColorPicker = () => {
        const handleColorChange = (color) => {
            if (!selectedColors.some((c) => c.hex === color.hex)) {
                setSelectedColors([...selectedColors, color]);
                setHexValue([...hexValue, color.hex]);
                onChange([...hexValue, color.hex]);
            }
            setIsDropdownOpen(false);
        };

        const handleColorRemove = (colorHex) => {
            const updatedColors = selectedColors.filter((color) => color.hex !== colorHex);
            setSelectedColors(updatedColors);
            setHexValue(updatedColors.map((color) => color.hex));
            onChange();
        };

        const toggleDropdown = () => {
            setIsDropdownOpen(!isDropdownOpen);
        };

        return (
            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                >
                    Select Colors
                </button>
                {isDropdownOpen && (
                    <div className="absolute mt-1 w-full rounded-md bg-white shadow-sm z-10">
                        <div className="flex flex-wrap p-2">
                            {basicColors.map((color) => (
                                <div key={color.name} className="mr-2 mb-2">
                                    <span
                                        onClick={() => handleColorChange(color)}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md cursor-pointer"
                                    >
                                        <div
                                            className="w-4 h-4 bg-gray-900 rounded-full"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="ml-2">{color.name}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mt-2">
                    {
                        selectedColors.length > 0 &&
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selected product colors </label>
                    }
                    <div className="flex flex-wrap mt-1">
                        {selectedColors.map((color) => (
                            <div key={color.hex} className="mr-2 mb-2">
                                <span className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md">
                                    <div className="w-4 h-4 bg-gray-900 rounded-full" style={{ backgroundColor: color.hex }} />
                                    <span className="ml-2">{color.name}</span>
                                    <button
                                        onClick={() => handleColorRemove(color.hex)}
                                        className="ml-2 text-xs font-medium text-red-600 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const handleSearchChange = (value) => {
        setSearchValue(value);

        // Filter categories based on the search value
        const filtered = categories.filter((category) =>
            category.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 10);
        setFilteredCategories(filtered);
    };

    const handleCategoryChange = (value) => {
        onChange([...selectedCategories, value]);
        // Add the selected category to the array of selected categories
        setSelectedCategories((prevSelectedCategories) => [
            ...prevSelectedCategories,
            value,
        ]);


        // Clear the search input and reset filtered categories
        setSearchValue('');
        setFilteredCategories([]);
    };

    const handleProductChange = (product) => {
        // Extract the product ID
        const productId = typeof product === 'object' ? product._id : product;
    
        // Update selected product IDs
        onChange((prevSelectedProducts) => [
            ...prevSelectedProducts,
            productId,
        ]);
        setSelectedProducts((prevSelectedProducts) => [
            ...prevSelectedProducts,
            product,
        ]);
    
        // Clear the search input but keep the filtered products
        setSearchValue('');
    };
    
    



    return (
        <div className="relative my-6">
            <label
                htmlFor="name"
                className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900 whitespace-nowrap"
            >
                {label}
            </label>
            {type === 'category' && (
                <div className=''>
                    <input
                        type="text"
                        name="category"
                        value={searchValue}
                        onChange={(e) => {
                            handleSearchChange(e.target.value);
                        }}
                        className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder={selectedCategories.length == 0 && "Search categories..."}
                    />
                    {searchValue && filteredCategories.length > 0 && (
                        <div className="border px-3 rounded-b-md">
                            {/* Render your dropdown based on the filtered categories */}
                            <ul className="cursor-pointer py-2 ">
                                {filteredCategories?.map((category, index) => (
                                    <li key={index} onClick={() => handleCategoryChange(category)}>
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="absolute top-[13px] left-2">
                        {/* show last 5 selectedCategories */}
                        {selectedCategories?.slice(-5)?.map((category, index) => (
                            <span key={index} className="selected-category rounded-full bg-green-700 px-3 py-1 mr-1 text-primary-text-color">
                                {category}
                                <span className='ml-2 cursor-pointer p-y' onClick={() => {
                                    setSelectedCategories((prevSelectedCategories) =>
                                        prevSelectedCategories.filter(
                                            (prevCategory) => prevCategory !== category
                                        ));
                                    onChange(selectedCategories.filter(
                                        (prevCategory) => prevCategory !== category
                                    ));
                                }}>x</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {type === 'relatedProducts' && (
                <div className=''>
                    <input
                        type="text"
                        name="relatedProduct"
                        value={searchValue}
                        onChange={(e) => {
                            handleSearchChange(e.target.value);
                        }}
                        className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder={selectedProducts.length === 0 && "Search related products..."}
                    />
                    {searchValue && filteredProducts?.length > 0 && (
                        <div className="border px-3 rounded-b-md">
                            {/* Render your dropdown based on the filtered products */}
                            <ul className="cursor-pointer py-2">
                                {filteredProducts?.map((product, index) => (
                                    <li key={index} onClick={() => handleProductChange(product)}>
                                        <div className="flex justify-between">
                                            <span>{product?.name?.en}</span>
                                            <span>{product.price}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="grid grid-cols-3">
                        {/* show last 5 selectedProducts */}
                        {selectedProducts?.slice(-5)?.map((product, index) => (
                            <div key={index} className="flex items-start justify-start flex-col mr-1 mb-1 text-primary-text-color rounded-md mt-4 relative">
                                {
                                    product?.images?.[0] ?
                                    <img src={product?.images?.[0]} alt={product?.name?.en} className="w-full h-[120px] object-cover rounded-t-md" /> :
                                    <div className="w-full h-[120px] object-cover rounded-t-md bg-gray-300">
                                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-8 text-gray-400 text-2xl">No Image</span>
                                    </div>
                                }
                                <p className='text-md text-black p-2'>{product?.name?.en}</p>
                                <span className='cursor-pointer text-black absolute top-2 right-3 bg-white w-5 h-5 flex justify-center items-center rounded-full ' onClick={() => {
                                    setSelectedProducts((prevSelectedProducts) =>
                                        prevSelectedProducts.filter(
                                            (prevProduct) => prevProduct !== product
                                        ));
                                    onChange((prevSelectedProducts) =>
                                        prevSelectedProducts.filter(
                                            (prevProduct) => prevProduct !== product
                                        ));
                                }}>
                                    x
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {
                type === 'color' &&
                <ColorPicker />
            }
            {type === 'textField' ? (
                <textarea
                    name="name"
                    className="block h-32 w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : type === 'text' || type === 'number' || type === 'email' ? (
                <input
                    type={type}
                    name="name"
                    // NUMBER CANT BE NEGATIVE
                    min={0}
                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : null}
        </div>
    );
};

export default InputField;
