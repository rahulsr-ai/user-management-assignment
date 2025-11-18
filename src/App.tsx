import { Route, Routes } from "react-router-dom";
import CreateUser from "./pages/CreateUser";
import Home from "./pages/Home";
const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/create-user" element={<CreateUser />} />
    </Routes>
  );
};

export default App;
