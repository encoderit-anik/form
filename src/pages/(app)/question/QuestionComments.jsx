import React, { useCallback, useEffect, useState } from 'react'
import { timestamp } from '@/firebase/config'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useFirestore } from '@/hooks/useFirestore'
import Avatar from '@/components/Avatar'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import IconButton from '@/components/base/IconButton'

export default function QuestionComments({ question }) {
	const { updateDocument, response, addNotification } = useFirestore('questions')
	const [newComment, setNewComment] = useState('')
	const { user } = useAuthContext()

	// Initialize likes and dislikes based on question.comments
	const [likes, setLikes] = useState({})
	const [dislikes, setDislikes] = useState({})
	useEffect(() => {
		const initialLikes = {}
		const initialDislikes = {}
		question.comments.forEach((comment) => {
			initialLikes[comment.id] = false
			initialDislikes[comment.id] = false
		})
		setLikes(initialLikes)
		setDislikes(initialDislikes)
	}, [question.comments])

	const handleLike = async (commentId, commentAuthorId) => {
		if (!likes[commentId]) {
			const updatedComments = question.comments.map((comment) => {
				if (comment.id === commentId) {
					return {
						...comment,
						likes: comment.likes + 1,
						dislikes: dislikes[commentId] ? comment.dislikes - 1 : comment.dislikes,
					}
				}
				return comment
			})

			await updateDocument(question.id, {
				comments: updatedComments,
			})

			setLikes((prevLikes) => ({
				...prevLikes,
				[commentId]: true,
			}))

			setDislikes((prevDislikes) => ({
				...prevDislikes,
				[commentId]: false,
			}))

			// Add notification to the comment author
			await addNotification(question.createdBy.id, 'like', question.id, commentId)
		}
	}

	const handleDislike = async (commentId, commentAuthorId) => {
		if (!dislikes[commentId]) {
			const updatedComments = question.comments.map((comment) => {
				if (comment.id === commentId) {
					return {
						...comment,
						dislikes: comment.dislikes + 1,
						likes: likes[commentId] ? comment.likes - 1 : comment.likes,
					}
				}
				return comment
			})

			await updateDocument(question.id, {
				comments: updatedComments,
			})

			setDislikes((prevDislikes) => ({
				...prevDislikes,
				[commentId]: true,
			}))

			setLikes((prevLikes) => ({
				...prevLikes,
				[commentId]: false,
			}))

			// Add notification to the comment author
			await addNotification(question.createdBy.id, 'dislike', question.id, commentId)
		}
	}

	const handleSumbit = async (e) => {
		e.preventDefault()
		const commentToAdd = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			content: newComment,
			createdAt: timestamp.fromDate(new Date()),
			id: user.uid,
			likes: 0, // Initialize likes
			dislikes: 0, // Initialize dislikes
		}
		await updateDocument(question.id, {
			comments: [...question.comments, commentToAdd],
		})
		if (!response.error) {
			setNewComment('')
		}
	}

	const onDeleteComment = useCallback(
		async (index) => {
			if (confirm(`Are you sure delete this comment?`)) {
				question.doc.ref.update({
					comments: question.comments.filter((_, i) => {
						return i !== index
					}),
				})
			}
		},
		[question]
	)

	return (
		<div className="question-comments">
			<h4>Comments</h4>
			<ul>
				{question.comments.length > 0 &&
					question.comments.map((comment, index) => (
						<li key={index} className="relative group">
							{user.isAdmin && (
								<IconButton
									icon="bx:trash"
									className="transition-transform duration-300 transform scale-0 group-hover:scale-100 absolute right-2 top-2"
									onClick={() => onDeleteComment(index)}
								/>
							)}
							<div className="comment-author">
								<Avatar src={comment.photoURL} />
								<p>{comment.displayName}</p>
							</div>
							<div className="comment-date">
								<p>
									{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
								</p>
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
					<textarea
						required
						onChange={(e) => setNewComment(e.target.value)}
						value={newComment}
					></textarea>
				</label>
				<button className="btn">Add Comment</button>
			</form>
		</div>
	)
}
