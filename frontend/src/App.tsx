import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./auth-callback/AuthCallbackPage";
import SSOCallbackPage from "./sso-callback/SSOCallbackPage";

const App = () => {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/sso-callback" element={<SSOCallbackPage />} />
      </Routes>
    </>
  )
}

export default App;