import { Routes, Route } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import MerchantLayout from '../layouts/MerchantLayout'
import CustomerLayout from '../layouts/CustomerLayout'
import ProtectedRoute from './ProtectedRoute'

import Home from '../pages/public/Home'
import Products from '../pages/public/Products'
import ProductDetails from '../pages/public/ProductDetails'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import VerifyOtp from '../pages/auth/VerifyOtp'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

import Cart from '../pages/customer/Cart'
import Checkout from '../pages/customer/Checkout'
import Profile from '../pages/customer/Profile'
import Addresses from '../pages/customer/Addresses'
import Orders from '../pages/customer/Orders'
import OrderDetails from '../pages/customer/OrderDetails'
import PaymentHistory from '../pages/customer/PaymentHistory'

import FirstLoginChangePassword from '../pages/merchant/FirstLoginChangePassword'
import MerchantDashboard from '../pages/merchant/MerchantDashboard'
import MerchantProducts from '../pages/merchant/MerchantProducts'
import ProductForm from '../pages/merchant/ProductForm'
import MerchantProfile from '../pages/merchant/MerchantProfile'

import AdminDashboard from '../pages/admin/AdminDashboard'
import MerchantManagement from '../pages/admin/MerchantManagement'
import CustomerManagement from '../pages/admin/CustomerManagement'
import ProductApproval from '../pages/admin/ProductApproval'
import CategoryManagement from '../pages/admin/CategoryManagement'

import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public + Customer shopping (shares the navbar/footer layout) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* Customer account area */}
        <Route
          path="/account"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="payments" element={<PaymentHistory />} />
        </Route>
      </Route>

      {/* Auth pages (no navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Merchant first-login gate (no sidebar until password is changed) */}
      <Route
        path="/merchant/change-password"
        element={
          <ProtectedRoute allowedRoles={['MERCHANT']}>
            <FirstLoginChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Merchant dashboard */}
      <Route
        path="/merchant"
        element={
          <ProtectedRoute allowedRoles={['MERCHANT']}>
            <MerchantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MerchantDashboard />} />
        <Route path="products" element={<MerchantProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="profile" element={<MerchantProfile />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="merchants" element={<MerchantManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="products" element={<ProductApproval />} />
        <Route path="categories" element={<CategoryManagement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
