
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapComponent from "../../Components/MakerMap";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";

const AddLocation = () => {
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [oldimages, setoldImages] = useState([]);
  const [cities, setCities] = useState([]);
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(36.54);
  const [lng, setLng] = useState(53.052);
  const [isReligious, setIsReligious] = useState(false);
  const [isNature, setIsNature] = useState(false);
  const [isHistorical, setIsHistorical] = useState(false);
  const [isIndoor, setIsIndoor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.post) {
      if (lat === 36.54) {
        const { post } = location.state;
        setTitle(post.title);
        setCity(post.city);
        setDescription(post.description);
        setAddress(post.address);
        setLat(post.latitude);
        setLng(post.longitude);
        setIsHistorical(post.isHistorical);
        setIsIndoor(post.isIndoor);
        setIsReligious(post.isReligious);
        setIsNature(post.isNature);
        fetchOldImages(post);
        setPostId(post.id);
        setIsEdit(true);
      }
    }
  }, [location, lat, lng]);

  const fetchOldImages = async (post) => {
    const formattedImages = await Promise.all(
      post.images.map(async (img) => {
        const response = await axios.get(img.image, { responseType: "blob" });
        const blob = response.data;
        const file = new File([blob], img.id, { type: blob.type });
        return {
          src: URL.createObjectURL(file),
          id: img.id,
          file: file,
        };
      })
    );
    setoldImages(formattedImages);
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await axios.get("/api/cities/");
        const formattedCities = result.data.map((city) => ({
          value: city,
          label: city,
        }));
        setCities(formattedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const navigate = useNavigate();
  const handlePictureChange = (e) => {
    if (e.target.files.length + oldimages.length + images.length <= 4) {
      setImages([...images, ...e.target.files]);
    } else {
      alert("You can only upload up to 4 pictures.");
    }
  };

  const handleRemoveImage = (index, isOld) => {
    if (isOld) {
      setoldImages(oldimages.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleLocationSubmit = (lat, lng) => {
    setLat(lat);
    setLng(lng);
  };
  const handlecity = (selectedOption) => {
    setCity(selectedOption ? selectedOption.value : "");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      city,
      description,
      address,
      isReligious,
      isNature,
      isHistorical,
      isIndoor,
      latitude: lat,
      longitude: lng,
    };
    console.log("Post Data:", postData);

    try {
      if (isEdit) {
        await axios.delete(`/api/deletepost/${postId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
      }

      const postResponse = await axios.post("/api/create-posts/", postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const pId = postResponse.data.id;
      const allimages = [...oldimages, ...images];

      const formData = new FormData();
      for (let i = 0; i < allimages.length; i++) {
        if (allimages[i].file) {
          formData.append("image", allimages[i].file);
        } else {
          formData.append("image", allimages[i]);
        }
      }

      try {
        const response = await axios.post(
          `/api/create-posts/${pId}/images/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }

      navigate("/"); 
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data) {
        console.error("Response Data:", error.response.data); 
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setPostId(null);
    navigate("/MyPosts");
  };

  return (
    <form className="container py-3" onSubmit={handleSubmit}>
      <div className="py-1">
        <label>عنوان :</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="col-6 py-1">
        <label>شهر :</label>
        <Select
          id="city"
          value={cities.find((option) => option.value === city)}
          onChange={handlecity}
          options={cities}
          placeholder="انتخاب کنید"
        />
      </div>
      <div className="py-1">
        <label>تصاویر : </label>
        <div style={{ display: "flex", gap: "10px" }}>
          {oldimages.map((image, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={image.src}
                alt="Uploaded"
                style={{ width: "100px", height: "100px" }}
              />
              <FaTrash
                onClick={() => handleRemoveImage(index, true)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  cursor: "pointer",
                  color: "red",
                }}
              />
            </div>
          ))}
          {images.map((image, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(image)}
                alt="New Upload"
                style={{ width: "100px", height: "100px" }}
              />
              <FaTrash
                onClick={() => handleRemoveImage(index, false)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  cursor: "pointer",
                  color: "red",
                }}
              />
            </div>
          ))}
          <div>
            <label
              htmlFor="add-image"
              style={{
                border: "1px dashed #000",
                padding: "20px",
                cursor: "pointer",
              }}
            >
              <span>افزودن عکس</span>
            </label>
            <input
              id="add-image"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handlePictureChange}
            />
          </div>
        </div>
      </div>
      <div className="py-1">
        <label>توضیحات :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="py-1">
        <label>آدرس : </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div className="py-3">
      <MapComponent
        initialLat={lat}
        initialLng={lng}
        onLocationChange={handleLocationSubmit}
      />
      </div>

  <div className="d-flex justify-content-between mt-3 py-2">
        <label> نوع مکان :</label>
        <div>
          <label> طبیعت </label>
          <input
            type="checkbox"
            checked={isNature}
            onChange={(e) => setIsNature(e.target.checked)}
          />
        </div>
        <div>
          <label> مذهبی </label>
          <input
            type="checkbox"
            checked={isReligious}
            onChange={(e) => setIsReligious(e.target.checked)}
          />
        </div>
        <div>
          <label> تاریخی </label>
          <input
            type="checkbox"
            checked={isHistorical}
            onChange={(e) => setIsHistorical(e.target.checked)}
          />
        </div>
        <div>
          <label> سرپوشیده </label>
          <input
            type="checkbox"
            checked={isIndoor}
            onChange={(e) => setIsIndoor(e.target.checked)}
          />
        </div>
      </div>
      {isEdit ? (
        <div className="d-flex justify-content-between mt-3">
          <button type="submit" className="btn btn-outline-primary">اعمال تغییرات</button>
          <button type="button" className="btn btn-outline-primary" onClick={handleCancelEdit}>
            بازگشت به عقب
          </button>
        </div>
      ) : (
        <button type="submit" className="btn btn-outline-primary">ثبت مکان</button>
      )}
    </form>
  );
};

export default AddLocation;
