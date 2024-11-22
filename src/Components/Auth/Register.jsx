import React, { useState } from "react";
import "./auth.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik"
import * as Yup from "yup"

const formSchema = Yup.object({
     first_name: Yup.string().required(),
     last_name: Yup.string().required(),
     username: Yup.string()
      .required().matches(
        /^([a-zA-Z0-9_]+)$/,
        "Enter valid username !"
      ),
     password: Yup.string().required(),
     phone_number:Yup.string().required(),
})


const Register = () => {

  const [otpSent, setOtpSent] = useState(false); // Flag to know if OTP was sent
  const [otpVerified, setOtpVerified] = useState(false); // Flag to know if OTP was verified
  const [otp, setOtp] = useState(''); // OTP input value
  const [phone, setPhone] = useState(''); // Phone number input value
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  // Helper function to validate the phone number format
  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^(\+98|0)?9\d{9}$/;
    return regex.test(phoneNumber);
  };

  // Map of backend English errors to Farsi translations
  const errorTranslations = {
    "A user with that username already exists.": "این نام کاربری قبلاً ثبت شده است.",
    "A user with that phone number already exists.": "این شماره تلفن قبلاً ثبت شده است.",
  };

  // Function to translate error messages to Persian
  const translateErrorMessage = (error) => {
    if (typeof error === 'string') {
      return errorTranslations[error] || error;
    } else if (typeof error === 'object') {
      let translatedErrors = {};
      for (let key in error) {
        translatedErrors[key] = error[key].map(msg => errorTranslations[msg] || msg);
      }
      return translatedErrors;
    }
    return error;
  };

  // Step 1: Send OTP
  const sendOtp = async () => {
    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      alert('فرمت شماره تلفن نامعتبر است.');
      return;
    }

    const data = { phone_number: phone };
    const res = await axios.post("/v1/account/send-otp/", data);
    if (res.data.error) {
      const translatedError = translateErrorMessage(res.data.error);
      alert(translatedError || "ارسال کد تایید با مشکل مواجه شد. لطفا دوباره امتحان کنید.");
    }else {
      alert(res.data.message || "کد تایید با موفقیت ارسال شد.");
      setOtpSent(true);
    }
  };
  // Step 2: Verify OTP
  const verifyOtp = async () => {
    const data = { phone_number: phone, otp_code: otp };
    const res = await axios.post("/v1/account/verify-otp/", data);
    if (res.data.error) {
      const translatedError = translateErrorMessage(res.data.error);
      alert(translatedError || "کد تایید نامعتبر است. لطفا دوباره امتحان کنید.");
    }else {
      alert(res.data.message || "کد تایید با موفقیت تایید شد.");
      setOtpVerified(true); // Allow proceeding to registration form
      formik.setFieldValue('phone_number', phone);
    }
  };


  const handleSubmit = async (value) => {
    const data = {
      first_name: value.first_name,
      last_name: value.last_name,
      username: value.username,
      password: value.password,
      phone_number: value.phone_number
    };
    
     try {

  const res = await axios.post("/v1/account/register/",data)
          if(res.data.error){
               setError(res.data.error)
          }else{
  Swal.fire({
     icon: "success",
     title: "تبریک میگم!",
     text: res.data.message,
     showConfirmButton: true,
     confirmButtonText: "تایید!",
     timer: 5000,
   });
   navigate("/Login");
          }
     } catch (error) {
          console.log(error);
     }
  };

  const formik = useFormik({
    initialValues: {
         first_name: "",
         last_name: "",
         username: "",
         password: "",
         phone_number:"",
    },
    onSubmit: (values) => {
       handleSubmit(values);
    },
    validationSchema: formSchema
})

  return (
    <div className="auth register">
      <div className="container">
        <div className="row align-items-center min-vh-100 auth-res">
          <div className="col-lg-4 col-md-6 bg-dark py-4 rounded">
            <div className="text-center text-white">
              <h2 className="fw-bold mb-5 auth-title">ثبت نام کنید</h2>
            </div>
            <div className="text-center text-danger">
              <h2 className="fw-bold mb-5 h6">{error}</h2>
            </div>
            {!otpSent ? (
              <><div className="form-group mt-3">
                <label htmlFor="" className="text-white mb-2">
                  شماره تلفن خود را وارد کنید
                </label>
                <input
                  type="text"
                  required
                  className="form-control mb-1"
                  name="phone_number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  lable="شماره تلفن" />
              </div>
              <div className="form-group mt-4">
                <button type="submit" className="btn btn-success w-100" onClick={sendOtp}>
                ارسال کد تایید
                </button>
              </div>
                 
                </>
            
        ) : !otpVerified ? (
          <><div className="form-group mt-3">
          <label htmlFor="" className="text-white mb-2">
            کد تایید را وارد کنید
          </label>
          <input
            type="text"
            required
            className="form-control mb-1"
            name="otp_code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            lable="کد تایید" />
        </div>
        <div className="form-group mt-4">
                <button type="submit" className="btn btn-success w-100" onClick={verifyOtp}>
                  تایید کد
                </button>
              </div>
              </>
          
        ) : (


            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mt-3">
                <label htmlFor="" className="text-white mb-2">
                  نام شما
                </label>
                <input
                  type="text"
                  className="form-control mb-1"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange("first_name")}
                  onBlur={formik.handleBlur("first_name")}
                
                />
                <p className="help text-danger">
                     {formik.touched.first_name && formik.errors.first_name}
                </p>

              </div>
              <div className="form-group mt-3">
                <label htmlFor="" className="text-white mb-2">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  className="form-control mb-1"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange("last_name")}
                  onBlur={formik.handleBlur("last_name")}
                
                />
                <p className="help text-danger">
                     {formik.touched.last_name && formik.errors.last_name}
                </p>

              </div>
              <div className="form-group mt-3">
                <label htmlFor="" className="text-white mb-2">
                  نام کاربری
                </label>
                <input
                  type="text"
                  className="form-control mb-1"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange("username")}
                  onBlur={formik.handleBlur("username")}
                
                />
                <p className="help text-danger">
                     {formik.touched.username && formik.errors.username}
                </p>

             
              </div>
              <div className="form-group mt-3">
                <label  className="text-white mb-2">
                  پسوورد
                </label>
                <input
                  type="text"
                  className="form-control mb-1"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                />
                <p className="help text-danger">
                     {formik.touched.password && formik.errors.password}
                </p>
             
              </div>
              <div className="form-group mt-4">
                <button type="submit" className="btn btn-success w-100">
                  ثبت نام
                </button>
              </div>
            </form>
        )}
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Register;
