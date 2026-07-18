import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                borderRadius: '8px',
              },
              success: { iconTheme: { primary: '#4c7a5b', secondary: '#fff' } },
              error: { iconTheme: { primary: '#b4443a', secondary: '#fff' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
