import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";

const Comments = ({ listingId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/${listingId}`);
        const data = await res.json();

         // Fetch user information for each comment
      const commentsWithUserInfo = await Promise.all(
        data.map(async (comment) => {
          const userRes = await fetch(`/api/user/${comment.userRef}`);
          const userInfo = await userRes.json();
          return { ...comment, userInfo };
        })
      );

      setComments(commentsWithUserInfo);
        console.log(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [listingId]);


  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      try {
        const response = await fetch('/api/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            listingID: listingId, 
            comment: comment,
            userRef: currentUser._id, }),
        });

        if (response.ok) {
          const newComment = await response.json();
          setComments((prevComments) => [...prevComments, newComment]);
          setComment('');
  
          // Fetch user information for the new comment
          const userRes = await fetch(`/api/user/${newComment.userRef}`);
          const userInfo = await userRes.json();
          const commentWithUserInfo = { ...newComment, userInfo };
          setComments((prevComments) => [...prevComments.slice(0, -1), commentWithUserInfo]);
        } else {
          console.error('Failed to submit comment');
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comment/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div>
  {comments.map((comment, index) => (
    <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
      <div className="flex items-center mb-2">
        <img
          src={comment.userInfo?.avatar || 'https://via.placeholder.com/50'} // Use a placeholder image if userInfo.avatar is undefined
          alt="Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="font-semibold">{comment.userInfo?.username || 'Unknown User' } </span>  
        {comment.userRef === currentUser._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <MdDelete className='scale-150' />
                </button>)}
      </div>
      <p>{comment.comment}</p>
    </div>
  ))}
</div>
      <form onSubmit={handleSubmitComment} className="flex mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={handleCommentChange}
          className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      
    </div>
  );
};

export default Comments;