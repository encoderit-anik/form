import { useCallback, useState } from 'react'
import { timestamp } from '@/firebase/config'
import { useFirestore } from '@/hooks/useFirestore'
import { useAuthContext } from '@/hooks/useAuthContext'

import Avatar from '@/components/Avatar'
import IconButton from '@/components/base/IconButton'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function QuestionComments({ question }) {
	const [newComment, setNewComment] = useState('')

	const { user } = useAuthContext()
	const { updateDocument, response, addNotification } = useFirestore('questions')

	const handleLike = async (comment, index) => {
		if (comment.likedBy.includes(user.uid)) return
		await updateDocument(question.id, {
			comments: question.comments.map((item, itemIndex) => {
				if (index !== itemIndex) return item
				return {
					...item,
					likedBy: [...new Set([...item.likedBy, user.uid])],
					dislikedBy: item.dislikedBy.filter((uid) => uid !== user.uid),
				}
			}),
		})
		await addNotification(question.createdBy.id, 'like', question.id, comment.id)
	}

	const handleDislike = async (comment, index) => {
		if (comment.dislikedBy.includes(user.uid)) return
		await updateDocument(question.id, {
			comments: question.comments.map((item, itemIndex) => {
				if (index !== itemIndex) return item
				return {
					...item,
					likedBy: item.likedBy.filter((uid) => uid !== user.uid),
					dislikedBy: [...new Set([...item.dislikedBy, user.uid])],
				}
			}),
		})
		await addNotification(question.createdBy.id, 'dislike', question.id, comment.id)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		await updateDocument(question.id, {
			comments: [
				...question.comments,
				{
					displayName: user.displayName,
					photoURL: user.photoURL,
					content: newComment,
					createdAt: timestamp.fromDate(new Date()),
					id: user.uid,
					likedBy: [], // Initialize likes
					dislikedBy: [], // Initialize dislikes
				},
			],
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
									onClick={() => handleLike(comment, index)}
									className={comment.likedBy.includes(user.uid) ? 'liked' : ''}
								>
									Like ({comment.likedBy.length})
								</button>
								<button
									onClick={() => handleDislike(comment, index)}
									className={comment.dislikedBy.includes(user.uid) ? 'disliked' : ''}
								>
									Dislike ({comment.dislikedBy.length})
								</button>
							</div>
						</li>
					))}
			</ul>

			<form className="add-comment" onSubmit={handleSubmit}>
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
