import React from "react";
import { BrowserRouter , Route, Routes } from "react-router-dom";
import AddLocation from "./Pages/AddLocation";
import MyPosts from "./Pages/MyPosts";
import SinglePost from "./Pages/SinglePost";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar/Navbar";
import AuthCheck from "./Components/AuthCheck/AuthCheck";
import Protected from "./Components/AuthCheck/Protected";
import Search from "./Pages/search";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import axios from "axios";

axios.defaults.baseURL = "https://fatemehyousefi.pythonanywhere.com"; // تغییر به دامنه PythonAnywhere
axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.headers.post['Accept'] = "application/json";
axios.defaults.withCredentials = true;


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthCheck />}>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Route>

        <Route element={<Protected />}>
          <Route path="/Addlocation" element={<AddLocation />} />
          <Route path="/MyPosts" element={<MyPosts />} />

        </Route>

        <Route path="/singlePost/:id" element={<SinglePost />} />
        <Route path="/search" element={<Search />} />
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}


export default App;
