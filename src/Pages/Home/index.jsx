import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBox from '../../Components/FilterBox/FilterBox';
import PostCard from '../../Components/PostCard/PostCard';
import Pagination from 'react-bootstrap/Pagination';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchPosts = async (filters, page = 1) => {
    const query = Object.entries(filters)
      .filter(([, value]) => value === 'true' || (value && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const response = await axios.get(`/api/allposts/?${query}&page=${page}`);
    setPosts(response.data.results);
    setTotalPages(Math.ceil(response.data.count / 6)); // Assuming 2 posts per page
  };

  useEffect(() => {
    fetchPosts(filters, currentPage);
  }, [filters, currentPage]);

  const filtersAreEqual = (obj1, obj2) => {
     return JSON.stringify(obj1) === JSON.stringify(obj2); 
    };


  const handleFilterChange = (newFilters) => {
    if (!filtersAreEqual(newFilters, filters)) {
       setFilters(newFilters); 
       setCurrentPage(1); // Reset to first page when filters change 
       }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container py-3">
      <FilterBox onFilterChange={handleFilterChange} />
      <div className="row mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="col-md-4 col-sm-6" key={post.id}>

              <PostCard post={post} />
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100">
            <h5 className="text-muted">هیچ پستی برای نمایش وجود ندارد</h5>
            <p>پست‌های جدید اضافه کنید یا فیلترها را تغییر دهید.</p>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </div>
  );
};

export default Home;
