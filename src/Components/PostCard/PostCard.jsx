import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {

  const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
          return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
      };

  return (
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
    </div>
  );
};

export default PostCard;
