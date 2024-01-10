import React, { useEffect, useState } from 'react';
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from '../../hooks/useFirestore';
import Avatar from '../../components/Avatar';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export default function QuestionComments({ question }) {
    const { updateDocument, response, addNotification } = useFirestore('questions')
    const [newComment, setNewComment] = useState('');
    const { user } = useAuthContext();
    
    // Initialize likes and dislikes based on question.comments
    const [likes, setLikes] = useState({});
    const [dislikes, setDislikes] = useState({});
    useEffect(() => {
        const initialLikes = {};
        const initialDislikes = {};
        question.comments.forEach(comment => {
            initialLikes[comment.id] = false;
            initialDislikes[comment.id] = false;
        });
        setLikes(initialLikes);
        setDislikes(initialDislikes);
    }, [question.comments]);

    const handleLike = async (commentId, commentAuthorId) => {
      if (!likes[commentId]) {
        const updatedComments = question.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.likes + 1,
              dislikes: dislikes[commentId] ? comment.dislikes - 1 : comment.dislikes,
            };
          }
          return comment;
        });
  
        await updateDocument(question.id, {
          comments: updatedComments,
        });
  
        setLikes(prevLikes => ({
          ...prevLikes,
          [commentId]: true,
        }));
  
        setDislikes(prevDislikes => ({
          ...prevDislikes,
          [commentId]: false,
        }));
  
        // Add notification to the comment author
        await addNotification(question.createdBy.id, 'like', question.id, commentId);

      }
    };
  
    const handleDislike = async (commentId, commentAuthorId) => {
      if (!dislikes[commentId]) {
        const updatedComments = question.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              dislikes: comment.dislikes + 1,
              likes: likes[commentId] ? comment.likes - 1 : comment.likes,
            };
          }
          return comment;
        });
  
        await updateDocument(question.id, {
          comments: updatedComments,
        });
  
        setDislikes(prevDislikes => ({
          ...prevDislikes,
          [commentId]: true,
        }));
  
        setLikes(prevLikes => ({
          ...prevLikes,
          [commentId]: false,
        }));
  
        // Add notification to the comment author
        await addNotification(question.createdBy.id, 'dislike', question.id, commentId);
      }
    };
    const handleSumbit = async (e) => {
        e.preventDefault();
        const commentToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: newComment,
            createdAt: timestamp.fromDate(new Date()),
            id: user.uid,
            likes: 0, // Initialize likes
            dislikes: 0, // Initialize dislikes
        };
        await updateDocument(question.id, {
            comments: [...question.comments, commentToAdd],
        });
        if (!response.error) {
            setNewComment('');
        }
    };

    return (
        <div className='question-comments'>
            <h4>Comments</h4>
            <ul>
                {question.comments.length > 0 && question.comments.map(comment => (
                    <li key={comment.id}>
                        <div className="comment-author">
                            <Avatar src={comment.photoURL} />
                            <p>{comment.displayName}</p>
                        </div>
                        <div className="comment-date">
                            <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                        </div>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                        <div className="comment-actions">
                            <button
                                onClick={() => handleLike(comment.id)}
                                className={likes[comment.id] ? 'liked' : ''}
                            >
                                Like ({comment.likes})
                            </button>
                            <button
                                onClick={() => handleDislike(comment.id)}
                                className={dislikes[comment.id] ? 'disliked' : ''}
                            >
                                Dislike ({comment.dislikes})
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <form className="add-comment" onSubmit={handleSumbit}>
                <label>
                    <span>Add new comment :</span>
                    <textarea required onChange={(e) => setNewComment(e.target.value)} value={newComment}>
                    </textarea>
                </label>
                <button className="btn">Add Comment</button>
            </form>
        </div>
    );
}