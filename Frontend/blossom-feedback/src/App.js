import { BrowserRouter, Routes, Route } from 'react-router-dom';


function  App(){
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Feedback Form Page</h1>} />
        <Route path="/login" element={<h1>Admin Login Page</h1>} />
        <Route path="/dashboard" element={<h1>Admin Dashboard Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;