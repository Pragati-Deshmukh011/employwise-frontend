import { Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Users from './components/users';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

export default App;
