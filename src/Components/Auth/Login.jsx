import React, { useState } from "react";
import "./auth.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
const formSchema = Yup.object({
  username: Yup.string()
   .required().matches(
     /^([a-zA-Z0-9_]+)$/,
     "Enter valid username !"
   ),
  password: Yup.string().required(),

})

const Login = () => {
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    const data = {
      username: value.username,
      password: value.password,
    };
    try {
 
    const result = await axios.post("/v1/account/login/", data);
  
    console.log(result.data);

      if (result.data.error) {
        setError(result.data.error);
      console.log(result.data);

      } else {
        localStorage.setItem("user_name", result.data.username);
        localStorage.setItem("user_id", result.data.id);
        localStorage.setItem("token",result.data.token);
        
        Swal.fire({
          icon: "success",
          title: "تبریک میگم!",
          text: result.data.message,
          showConfirmButton: true,
          confirmButtonText: "تایید!",
          timer: 5000,
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validationSchema: formSchema,
  });
 
  return (
    
      <div className="auth login">
      <div className="container">
        <div className="row align-items-center min-vh-100 auth-res">
          <div className="col-lg-4 col-md-6 bg-dark py-4 rounded">
            <div className="text-center text-white">
              <h2 className="fw-bold mb-5 auth-title">ورود به حساب کاربری</h2>
            </div>
            <div className="text-center text-danger">
              <h2 className="fw-bold mb-5 h6">{error}</h2>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mt-3">
                <label htmlFor="" className="text-white mb-2">
                  نام کاربری
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formik.values.email}
                  onChange={formik.handleChange("username")}
                  onBlur={formik.handleBlur("username")}
                />
                <p className="help text-danger">
                  {formik.touched.username && formik.errors.username}
                </p>
              </div>

              <div className="form-group mt-3">
                <label htmlFor="" className="text-white mb-2">
                  پسوورد
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  placeholder="مثال * 123456 "
                />
                <p className="help text-danger">
                  {formik.touched.password && formik.errors.password}
                </p>
              </div>
              <div className="form-group mt-4">
                <button type="submit" className="btn btn-success w-100">
                  ورود
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
