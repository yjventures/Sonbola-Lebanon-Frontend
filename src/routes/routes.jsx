import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../pages/Home/Home";
import Signup from "../pages/Signup/Signup";
import NotFound from "../pages/NotFound/NotFound";
import UserLayout from "../layout/UserLayout";
import ResetPassword from "../pages/Signup/ResetPassword";
import ForgetPassword from "../pages/Signup/ForgetPassword";
import EmailVerification from "../pages/Signup/EmailVerification";
import ProfileLayout from "../layout/ProfileLayout";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/EditProfile/EditProfile";
import Signin from "../pages/Signup/Signin";
import Authenticate from "../pages/Authenticate/Authenticate";
import VendorLayout from "../layout/VendorLayout";
import VendorStepTwo from "../pages/Vendor/VendorOnBoarding/VendorStepTwo";
import VendorStepOne from "../pages/Vendor/VendorOnBoarding/VendorStepOne";
import VendorDashboard from "../pages/Vendor/VendorDashboard/VendorDashboard";
import VendorProducts from "../pages/Vendor/VendorProducts/VendorProducts";
import VendorNewProduct from "../pages/Vendor/VendorNewProducts/VendorNewProduct";
import VendorOrders from "../pages/Vendor/VendorOrders/VendorOrders";
import VendorSettings from "../pages/Vendor/VendorSettings/VendorSettings";
import VendorAwaitVerification from "../pages/Vendor/VendorOnBoarding/VendorAwaitVerification";
import VendorEditProfile from "../pages/Vendor/VendorEditProfile/VendorEditProfile";
import VendorHome from "../pages/Vendor/VendorHome/VendorHome";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import ProductList from "../pages/Admin/ProductList/ProductList";
import ProductDetails from "../pages/Admin/ProductsDetails/ProductDetails";
import VendorList from "../pages/Admin/VendorList/VendorList";
import ApproveVendor from "../pages/Admin/ApproveVendor/ApproveVendor";
import ShopSettings from "../pages/Vendor/ShopSettings/ShopSettings";
import VendorInventory from "src/pages/Vendor/VendorInventory/VendorInventory";
import VendorVariations from "src/pages/Vendor/VendorVariations/VendorVariations";
import Products from "src/pages/Users/Product/Product";
import ProductCatalog from "src/pages/Users/ProductCatalog/ProductCatalog";
import Orders from "src/pages/Users/Orders/Orders";
import Wishlist from "src/pages/Users/Wishlist/Wishlist";
import Invoice from "src/pages/Vendor/Invoice/Invoice";
import OrderDetails from "src/pages/Vendor/OrderDetails/OrderDetails";
import Cart from "src/pages/Users/Cart/Cart";
import DeliveryInfo from "src/pages/Users/DeliveryInfo/DeliveryInfo";
import Payment from "src/pages/Users/Payment/Payment";
import PaymentSuccess from "src/pages/Users/PayemntSuccess/PaymentSuccess";
import TrackOrder from "src/pages/Users/TrackOrder/TrackOrder";
import VendorCustomOrder from "src/pages/Vendor/VendorCustomOrder/VendorCustomOrder";
import VendorAllReviews from "src/pages/Vendor/VendorAllReviews/VendorAllReviews";
import RefundSettings from "src/pages/Admin/RefundSetting/RefundSettings";
import CustomerList from "src/pages/Admin/CustomerList/CustomerList";
import AllOrders from "src/pages/Admin/AllOrders/AllOrders";
import OrderDetailsComponent from "src/components/Vendor/OrderDetails/OrderDetailsComponent";
import VendorHomeLayout from "src/layout/VendorHomeLayout";
import RefundList from "src/pages/Admin/RefundList/RefundList";


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/signin",
                element: <Signin />
            },
            {
                path: "/reset-password",
                element: <ResetPassword />
            },
            {
                path: "/forget-password",
                element: <ForgetPassword />
            },
            {
                path: "/email-verificaiton",
                element: <EmailVerification />
            },
            {
                path: "/vendor-step-one",
                element: <VendorStepOne />
            },
            {
                path: "/vendor-step-two",
                element: <VendorStepTwo />
            },
            {
                path: '/authenticate',
                element: <Authenticate />
            },
            {
                path: '/authenticate/:token',
                element: <Authenticate />
            },
            {
                path: "/vendor-await-verificaiton",
                element: <VendorAwaitVerification />
            },
            {
                path: "/product-catalog",
                element: <ProductCatalog />
            },
            {
                path: "/product/:id",
                element: <Products />
            },
            {
                path: "/cart",
                element: <Cart />
            },
            {
                path: "/delivery",
                element: <DeliveryInfo />
            },
            {
                path: "/payment",
                element: <Payment />
            },
            {
                path: "/payment-success",
                // element: <Pay />
                element: <PaymentSuccess />
            },
            {
                profile: '/profile',
                element: <ProfileLayout />,
                children: [
                    {
                        path: "/profile",
                        element: <Profile />
                    },
                    {
                        path: "/edit-profile",
                        element: <EditProfile />
                    },
                    {
                        path: "/orders",
                        element: <Orders />
                    },
                    {
                        path: "/track-order",
                        element: <TrackOrder />
                    },
                    {
                        path: "/wishlist",
                        element: <Wishlist />
                    },

                ]
            },
            {
                profile: '/vendor-dashboard',
                element: <VendorLayout />,
                children: [
                    {
                        path: "/vendor-dashboard",
                        element: <VendorDashboard />
                    },
                    {
                        path: "/vendor-edit-profile",
                        element: <VendorEditProfile />
                    },
                    {
                        path: "/vendor-products",
                        element: <VendorProducts />
                    },
                    {
                        path: "/new-product",
                        element: <VendorNewProduct />
                    },
                    {
                        path: "/vendor-orders",
                        element: <VendorOrders />
                    },
                    {
                        path: "/order-details/:id",
                        element: <OrderDetails />
                    },
                    {
                        path: "/custom-order",
                        element: <VendorCustomOrder />
                    },
                    {
                        path: "/invoice/:id",
                        element: <Invoice />
                    },
                    {
                        path: "/vendor-settings",
                        element: <VendorSettings />
                    },
                    {
                        path: "/shop-settings",
                        element: <ShopSettings />
                    },
                    {
                        path: "/vendor-inventory",
                        element: <VendorInventory />
                    },
                    {
                        path: "/vendor-variations",
                        element: <VendorVariations />
                    },
                    {
                        path: "/all-reviews/:id",
                        element: <VendorAllReviews />
                    }
                ]
            },
            {
                path: "/vendor-home",
                element: <VendorHome />
            },
            {
                path: "/vendor-signup",
                element: <Signup />
            },
            {
                path: "/vendor-signin",
                element: <Signin />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    },
    {
        path: "/",
        element: <AdminLayout />,
        children: [
            {
                path: "/admin-dashboard",
                element: <AdminDashboard />
            },
            {
                path: "/product-list",
                element: <ProductList />
            },
            {
                path: "/product-details/:id",
                element: <ProductDetails />
            },
            {
                path: "/vendor-list",
                element: <VendorList />
            },
            {
                path: "/approve-vendor",
                element: <ApproveVendor />
            },
            {
                path: "/refund-settings",
                element: <RefundSettings />
            },
            {
                path: "/refund-list",
                element: <RefundList />
            },
            {
                path: "/customer-list",
                element: <CustomerList />
            },
            {
                path: "/all-orders",
                element: <AllOrders />
            },
            {
                path: "/admin-order-details/:id",
                element: <OrderDetailsComponent />
            },
        ]
    },

])