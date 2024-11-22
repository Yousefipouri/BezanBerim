import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Comments from "../../Components/Comments";
import MapComponent from "../../Components/MakerMap";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'moment/locale/fa'; // for Persian localization
import momentJalaali from 'moment-jalaali';
import '@fortawesome/fontawesome-free/css/all.min.css';


const SinglePost = () => {
  const slideRef = useRef(null);
  const { state } = useLocation();
  const [post, setPost] = useState(null);
  const [lat, setLat] = useState(state.latitude);
  const [lng, setLng] = useState(state.longitude);

  useEffect(() => {
    if (post) {
      setLat(post.latitude);
      setLng(post.longitude);
    }
  }, [post, lat, lng]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await axios.get(`/api/post/${state.id}/`);
      setPost(data);
    };
    fetchPost();
  }, [state.id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleLocationchange = (lat, lng) => {
    setLat(lat);
    setLng(lng);
  };

  const handleLike = async () => {
    const response = await axios.post(
      `/api/post/${post.id}/like/`,
      {},
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.msg === "Liked") {
      setPost((prevPost) => ({
        ...prevPost,
        number_of_likes: prevPost.number_of_likes + 1,
        number_of_dislikes:
          prevPost.number_of_dislikes > 0
            ? prevPost.number_of_dislikes - 1
            : prevPost.number_of_dislikes,
      }));
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        number_of_likes: prevPost.number_of_likes - 1,
      }));
    }
  };

  const handleDislike = async () => {
    const response = await axios.post(
      `/api/post/${post.id}/dislike/`,
      {},
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.msg === "Disliked") {
      setPost((prevPost) => ({
        ...prevPost,
        number_of_dislikes: prevPost.number_of_dislikes + 1,
        number_of_likes:
          prevPost.number_of_likes > 0
            ? prevPost.number_of_likes - 1
            : prevPost.number_of_likes,
      }));
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        number_of_dislikes: prevPost.number_of_dislikes - 1,
      }));
    }
  };

  const convertToPersianTime = (timestamp) => {
     return momentJalaali(timestamp).format("jYYYY-jMM-jDD");
   };
 

  return (
    <div className="container">
      <div className="row justify-content-center">

        <div className="col-lg-8 mt-4">
          <div className="blog-item">
            <h3 className="fw-bold py-3">{post.title}</h3>
               <div className="row">
               <div className="d-none d-sm-block d-md-none col-sm-6">
                   
                      <h6 className="fw-bold mt-4">شهر: {post.city}</h6>
                      <h6 className="fw-bold mt-1">نویسنده: {post.user}</h6>
                      <p className=" mt-3">{convertToPersianTime(post.created_at)}</p>
                     
              <p className="mt-2">
                {post.isNature ? "طبیعت ،" : ""}
                {post.isReligious ? "مذهبی ،" : ""}
                {post.isHistorical ? " تاریخی ،" : ""}
                {post.isIndoor ? "سرپوشیده" : ""}
              </p>
              <p className="mt-5">آدرس: {post.address}</p>

               </div>
               <div className="col-sm-6 col-lg-10 col-md-10">
                    <Slide indicators={true} ref={slideRef}>
                    {post.images.map((image, index) => (
                    <div key={index}>
                         <img src={image.image} alt="" className="w-100 rounded" />
                     </div>
                         ))}
                    </Slide>
               </div>
               </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "0",
              }}
            >
              <div>
                <button
                  onClick={handleLike}
                  className="btn btn-link"
                  style={{ textDecoration: "none", color: "green" }}
                >
                  <i className="fas fa-thumbs-up fa-1.5x"></i>{" "}
                  {post.number_of_likes}{" "}
                </button>
                <button
                  onClick={handleDislike}
                  className="btn btn-link"
                  style={{ textDecoration: "none", color: "red" }}
                >
                  <i className="fas fa-thumbs-down fa-1.5x"></i>{" "}
                  {post.number_of_dislikes}{" "}
                </button>
              </div>
            </div>
            <div className="blog-item-text p-3">
               <div className="d-block d-sm-none d-md-block">
              <div className="author d-flex pb-2 justify-content-between">
               <h6 className="fw-bold">{convertToPersianTime(post.created_at)}</h6>
                <h6 className="fw-bold">نویسنده: {post.user}</h6>
                <h6 className="fw-bold">شهر: {post.city}</h6>
              </div>
              <p className="mt-5">
                {post.isNature ? "طبیعت ،" : ""}
                {post.isReligious ? "مذهبی ،" : ""}
                {post.isHistorical ? "تاریخی" : ""}
                {post.isIndoor ? "سرپوشیده" : ""}
              </p>
              </div>
              <p className="mt-5">{post.description}</p>
              
              <MapComponent
                initialLat={lat}
                initialLng={lng}
                onLocationChange={handleLocationchange}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
