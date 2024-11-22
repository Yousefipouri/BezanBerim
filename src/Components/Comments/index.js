import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CommentItem from '../CommentItem';
import 'moment/locale/fa'; // for Persian localization 
import "./index.css"


const Comments = () => {
     const [body, setBody] = useState("")
     const [comments, setComments] = useState([])
     const reset = () => {
          setBody("")
     }
     let user_id = JSON.parse(localStorage.getItem("user_id"));
     const { id } = useParams();

     useEffect(() => {
      const getComment = async () => {
        try {
             const response = await axios.get(`/api/posts/${id}/comments/`);
        setComments(response.data)
   } catch (error) {
        console.error('Error fetching posts:', error);
      }
            
   }
          getComment()
     }, [id])


     const handleSubmit = async (e) => {
          e.preventDefault();
          const data = {
               body: body,
               post: id,
               user: user_id
          }
          const result = await axios.post("/api/comments/create/", data ,  {
               headers: {
                 'Authorization': `Token ${localStorage.getItem('token')}`
               }
             })
             
             if (result.data.error) {
             console.log(result.data);
       
             } else {
               
               Swal.fire({
                 icon: "success",
                 title: "کامنت شما ثبت شد. بزودی بررسی می شود.",
                 text: result.data.message,
                 showConfirmButton: true,
                 confirmButtonText: "تایید!",
               });
               //   timer: 5000,
                    reset();
                    // getComment()
               }
     }

    


           
     return (
          <div className="comment">

        <section style={{ backgroundColor: '#eee' }}>
            <div className="container my-5 py-5 text-body">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-6">
                        <div className="card">
                            <div className="card-body p-4">
                                <div className="d-flex flex-start w-100">
                                    <img className="rounded-circle shadow-1-strong me-3 p-1"
                                        src="https://th.bing.com/th/id/OIP.xPQNKnXdhsNathxyFGAj5QHaHa?rs=1&pid=ImgDetMain" alt="avatar" width="65"
                                        height="65" />
                                    <div className="w-100">
                                        <h5>Add a comment</h5>
                                       
                                        <div data-mdb-input-init className="form-outline">
                                            <textarea className="form-control" id="textAreaExample" rows="4" name="body" placeholder="نظر شما" value={body} onChange={e => setBody(e.target.value)}></textarea>
                                            <label className="form-label" htmlFor="textAreaExample">دیدگاه خود را بنویسید </label>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button type="submit" className="btn btn-sm btn-success" onClick={handleSubmit}>ارسال نظر</button>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
               
    <section style={{ backgroundColor: '#eee' }}>
      <div className="container my-5 py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="card text-body">
              <div className="card-body p-4">
                <h4 className="mb-0">دیدگاه های اخیر</h4>

                {/* {comments && comments.map((comment) => (
                     <CommentItem key={comment.id} comment={comment}  /> ))} */}


                {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment}  /> ))
        ) : (
          <div className="text-center py-3 w-100">
            <p className="text-muted">هیچ دیدگاهی تا به حال ثبت نشده</p>
          </div>
        )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>              
          </div>
     )
}

export default Comments