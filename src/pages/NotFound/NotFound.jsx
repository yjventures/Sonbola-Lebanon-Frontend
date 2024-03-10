import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <main className="flex flex-col min-h-screen font-main">
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-16">
                <h1 className="text-4xl font-bold text-center">Oops! Page Not Found</h1>
                <p className=" text-lg text-center text-gray-500 dark:text-gray-400">
                    We couldn't find the page you're looking for. Please check the URL or try searching for a different product.
                </p>
                <Link
                    to="/home"
                    className="mt-8 inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                >
                    Go to Homepage
                </Link>
            </div>
           
        </main>
    )
}

export default NotFound