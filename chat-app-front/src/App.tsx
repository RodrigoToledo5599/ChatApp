import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/login/login-page'
import HomePage from './pages/home/home-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FriendshipPage from './pages/friendship/friendship-page';
import { CreateAccountPage } from './pages/create-account/create-account-page';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <Toaster
        position="top-right" 
        richColors 
        theme="dark" 
        closeButton
      />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Routes>
              
              <Route path="/" element={<LoginPage/>} />
              <Route path="/create-account" element={<CreateAccountPage/>} />

              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/home/:conversationId" element={<HomePage />} />
                <Route path="/friendship" element={<FriendshipPage/>} />
              </Route>

            </Routes>
        </QueryClientProvider>
      </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
