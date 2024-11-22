import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import './index.css'
const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
       
        const response = await axios.get('/api/posts/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

   const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/deletepost/${id}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post) => {
    navigate('/addlocation', { state: { post } });
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };


  return (
    <div className="container py-3">
    
    <div className="row mt-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="col-md-4 col-sm-6" key={post.id}>
           <div className="post-card border p-3 mb-4 rounded shadow-sm">
      {post.images && post.images.length > 0 && (
        <img src={post.images[0].image} alt={post.title} className="w-100 mb-3 rounded" />
      )}
      <h3 className="text-primary">{post.title}</h3>
      <p><strong>شهر:</strong> {post.city}</p>
      <p>
        <span>{post.isNature ? "طبیعت، " : ""}</span>
        <span>{post.isReligious ? "مذهبی، " : ""}</span>
        <span>{post.isHistorical ? "تاریخی، " : ""}</span>
        <span>{post.isIndoor ? "سرپوشیده" : ""}</span>
      </p>
      <p>{truncateText(post.description, 10)}</p>
      
      <Link to={`/singlePost/${post.id}`} state={post} className="btn btn-outline-primary w-100">
        مشاهده پست
      </Link>

      <div className="d-flex justify-content-between mt-3">
      <button className="btn btn-outline-primary w-50" onClick={() => handleDelete(post.id)}>حذف پست</button>
      <button className="btn btn-outline-primary w-50" onClick={() => handleEdit(post)}>ویرایش پست</button>
      </div>

    </div>
          </div>
        ))
      ) : (
        <div className="text-center py-5 w-100">
          <h5 className="text-muted">هیچ پستی برای نمایش وجود ندارد</h5>
        </div>
      )}
    </div>

  </div>
    //  <div>
    //    <h1>My Posts</h1>
    //    {posts.map((post) => (
    //     <div key={post.id} className="post-card">
    //       <h2>{post.title}</h2>
    //       <p>{post.city}</p>
    //       <p>{post.description}</p>
    //       <p>{post.approved ? "تایید شد ." : " در حال بررسی . . ."}</p>

    //       {post.images && post.images.length > 0 && <img src={post.images[0].image} alt={post.title} />}
    //       <Link
    //                     className="btn btn-dark d-block w-100 mt-4"
    //                     to={`/singlePost/${post.id}`}
    //                     state={post}
    //                   >
    //                     مشاهده
    //                   </Link>
    //       <button onClick={() => handleDelete(post.id)}>Delete</button>
    //       <button onClick={() => handleEdit(post)}>Edit</button>
    //     </div>
    //   ))}
    // </div>
  );
};

export default MyPosts;


{/* <div className="d-flex justify-content-between mt-3">
        <p><strong>لایک‌ها:</strong> {post.like_count}</p>
        <p><strong>نظرات:</strong> {post.comment_count}</p>
      </div> */}