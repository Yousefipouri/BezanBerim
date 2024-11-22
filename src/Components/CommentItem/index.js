import React, { useState } from 'react';
import axios from 'axios';

import 'moment/locale/fa'; // for Persian localization
import momentJalaali from 'moment-jalaali';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CommentItem = ({ comment}) => {

    const [commentitem, setCommentitem] = useState(comment);

  const convertToPersianTime = (timestamp) => {
    return momentJalaali(timestamp).format("jYYYY-jMM-jDD HH:mm");
  };

  const handleLike = async () => {
    
      const response = await axios.post(`/api/comment/${commentitem.id}/like/`, {}, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.msg === "Liked") {
        setCommentitem(prevCommentitem => ({
              ...prevCommentitem,
              number_of_likes: prevCommentitem.number_of_likes + 1,
              number_of_dislikes: prevCommentitem.number_of_dislikes > 0 ? prevCommentitem.number_of_dislikes - 1 : prevCommentitem.number_of_dislikes,
              }));
             
        } else { 
             setCommentitem(prevPost => ({
                   ...prevPost,
                   number_of_likes: prevPost.number_of_likes - 1,
                   }));
       }
  };

  const handleDislike = async () => {
    
      const response = await axios.post(`/api/comment/${commentitem.id}/dislike/`, {}, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.msg === "Disliked") {
        setCommentitem(prevCommentitem => ({
              ...prevCommentitem,
              number_of_dislikes: prevCommentitem.number_of_dislikes + 1,
              number_of_likes: prevCommentitem.number_of_likes > 0 ? prevCommentitem.number_of_likes - 1 : prevCommentitem.number_of_likes,
              })); 
             } else { 
                  setCommentitem(prevPost => ({ 
                       ...prevPost,
                       number_of_dislikes: prevPost.number_of_dislikes - 1,
                       })); 
       }
  };

  return (
    <div className="d-flex flex-start mt-4">
      <img className="rounded-circle shadow-1-strong me-3"
           src="https://th.bing.com/th/id/OIP.xPQNKnXdhsNathxyFGAj5QHaHa?rs=1&pid=ImgDetMain" 
           alt="avatar" width="60" height="60" />
      <div className="w-100">
        <h6 className="fw-bold mb-1">{commentitem.user}</h6>
        <div className="d-flex align-items-center mb-3">
          <p className="mb-0">{convertToPersianTime(commentitem.created_at)}</p>
          <button onClick={handleLike} className="btn btn-link" style={{ textDecoration: 'none', color: 'green' }}>
            <i className="fas fa-thumbs-up fa-1.5x"></i> {commentitem.number_of_likes}
          </button>
          <button onClick={handleDislike} className="btn btn-link" style={{ textDecoration: 'none', color: 'red' }}>
            <i className="fas fa-thumbs-down fa-1.5x"></i> {commentitem.number_of_dislikes}
          </button>
        </div>
        <p className="mb-0">{commentitem.body}</p>
        <hr className="my-3" style={{ height: '1px' }} />
      </div>
      
    </div>
  );
};

export default CommentItem;
