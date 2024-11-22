import React,{ useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineBars } from "react-icons/ai";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import './navbar.css'

const Navbar = () => {
  const navigate = useNavigate();
  const [showIcon , setShowIcon] = useState(false);

  const toggleMenu = () => {
    setShowIcon(!showIcon);
  }
 
  const logout = async (e) => {
    e.preventDefault();

    try {
        await axios.post('/v1/account/logout/', {}, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        });
            localStorage.clear();
            navigate("/Login");
       
    } catch (error) {
        console.error("Error during logout:", error.response ? error.response.data : error.message);
    }
};

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container">
      <div className="menu-icons" onClick={toggleMenu}>
        {
          showIcon ? 
          <RiCloseLine size={35} color={"#fff"} cursor={"pointer"}/>
          :
          <AiOutlineBars size={35} color={"#fff"} cursor={"pointer"} />
           
        }
      </div>


      <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {localStorage.getItem("user_name") ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="/">خانه</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="/search">جستجو</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/addlocation">معرفی مکان</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/MyPosts">پست های شما</NavLink>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={logout}>خروج</span>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="/">خانه</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="/search">جستجو</NavLink>
                  </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">ورود</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">ثبت نام</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className={`collapse navbar-collapse ${showIcon ? 'show' : ''}`} id="navbarNav">
       
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id={showIcon ? "show-links-mobile" : "show-links-mobile-hide" }>
            {
              localStorage.getItem("user_name") ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="/">خانه</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="/search">جستجو</NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink className="nav-link" to="/addlocation">معرفی مکان</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/MyPosts">پست های شما</NavLink>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link" style={{ cursor: "pointer" }} onClick={logout}>خروج</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="/">خانه</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="/search">جستجو</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">ورود</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">ثبت نام</NavLink>
                  </li>
                
                </>
              )
            }

          </ul>

        </div>

        


        <NavLink className="navbar-brand" to="#">بزن بریم</NavLink>
       
      </div>

    </nav>
  )
}

export default Navbar