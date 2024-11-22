import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  const [data, setData] = useState([]);
 

  async function searchBlog(query) {
    await axios.get(`/api/searchposts/?q=${query}`)
    .then((res) => {
      setData(res.data)
    });
  }

  return (
    <div className="container py-5">
      <div className="row py-5 justify-content-center">
        <div className="col-lg-4">
          <h4 className="text-center fw-bold border-bottom pb-3">جستجو کنید</h4>
          <input
            type="text"
            className="mt-3 form-control"
            placeholder="متن مورد نظر را وارد کنید"
            onChange={(e) => searchBlog(e.target.value)}
          />
        </div>

        <div className="col-lg-12 mt-5">
          <div className="row">
              {
                   data && data.map((item)=> {
                        return (
                         <div className="col-lg-4 col-md-4 mt" key={item.id}>
                         <div className="blog-search shadow">
                              <img src={item.images[0].image} className="w-100 blog-img" alt="" />
                              <div className="blog-item-text p-3">
                                   <div className="author border-bottom pb-2">
                                        <h6 className="fw-bold">{item.title}</h6>
                                        <small className="fw-bold text-muted">نویسنده : {item.user}</small>
                                   </div>
                                   <Link to={`/singlePost/${item.id}`}
                                    state={item}
                         className="btn btn-dark d-block w-100 mt-4">مشاهده</Link>
                              </div>
                         </div>
                    </div>
                        )
                   })
              }
          </div>
        </div>

      </div>
    </div>
  );
};

export default Search;
