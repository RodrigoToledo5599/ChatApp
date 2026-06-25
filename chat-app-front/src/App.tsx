import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/login/login-page'
import { ThemeProvider } from "next-themes";
import HomePage from './pages/home/home-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FriendshipPage from './pages/friendship/friendship-page';

export const queryClient = new QueryClient()

function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {/* <ThemeProvider> */} 
            <Routes>
              <Route
                path="/"
                element = {
                  <LoginPage/>
                }
              />
              <Route
                path="/home"
                element = {
                  <HomePage/>
                }
              />
              <Route
                path="/friendship"
                element = {
                  <FriendshipPage/>
                }
              />
            </Routes>
          {/* </ThemeProvider> */}
        </QueryClientProvider>
      </BrowserRouter>
    </>
  )
}

export default App
