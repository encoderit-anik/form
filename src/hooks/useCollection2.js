import { projectFirestore } from '@/firebase/config'
import { useCallback, useEffect, useState } from 'react'

export const useCollection2 = (name, options) => {
	const [data, setData] = useState([])
	const toItem = useCallback((v) => {
		return {
			uid: v.id,
			doc: v,
			...v.data(),
		}
	}, [])
	useEffect(() => {
		let ref = projectFirestore.collection(name)
		if (options?.where) {
			ref = ref.where(...options?.where)
		}
		ref.get()
			.then((res) => res.docs.map(toItem))
			.then((res) => setData(res))

		return projectFirestore
			.collection(name)
			.orderBy('updatedAt', 'desc')
			.limit(1)
			.onSnapshot((snapshot) => {
				if (!snapshot.size) return
				const newItem = toItem(snapshot.docs[0])

				setData((data) => {
					const index = data.findIndex((item) => {
						return item.uid === newItem.uid
					})

					if (index === -1) {
						data.unshift(newItem)
					}
					//
					else if (newItem.deletedAt) {
						data.splice(index, 1)
					}
					//
					else {
						data.splice(index, 1, newItem)
					}
					return [...data]
				})
			})
	}, [])
	return { data, setData }
}
