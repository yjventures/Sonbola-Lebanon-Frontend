import React from 'react'
import newsletterBg from 'assets/global/home/newsletter-bg.png'

const NewsLetter = () => {
    return (
        <div className="font-main py-16 px-4 flex flex-col gap-2"
            style={{
                backgroundImage: `url(${newsletterBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-primary-text-color sm:text-4xl">
                Subscribe to our newsletter
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-md leading-8 text-gray-300">
                Reprehenderit ad esse et non officia in nulla. Id proident tempor incididunt nostrud nulla et culpa.
            </p>
            <form className="mx-auto mt-4 flex max-w-md gap-x-4 w-full bg-white p-2 rounded-md">
                <label htmlFor="email-address" className="sr-only">
                    Email address
                </label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-secondary-text-color shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 outline-none sm:text-sm sm:leading-6"
                    placeholder="Enter your email"
                />
                <button
                    type="submit"
                    className="flex-none rounded-sm bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-primary-text-color shadow-sm "
                >
                    Subscribe
                </button>
            </form>

        </div>
    )
}

export default NewsLetter