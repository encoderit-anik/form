import { projectFirestore } from '@/firebase/config'
import { useCallback, useEffect, useState } from 'react'

const buildQuery = (name, options) => {
	let ref = projectFirestore.collection(name)
	if (options?.where) ref = ref.where(...options?.where)
	if (options?.orderBy) ref = ref.orderBy(...options?.orderBy)
	if (options?.limit) ref = ref.limit(options.limit)
	return ref
}

export const useCollection2 = (name, options, options2) => {
	const [data, setData] = useState([])
	const toItem = useCallback((v) => {
		return {
			uid: v.id,
			doc: v,
			...v.data(),
		}
	}, [])

	const refresh = useCallback(() => {
		buildQuery(name, options)
			.get()
			.then((res) => res.docs.map(toItem))
			.then((res) => setData(res))
	}, [])

	useEffect(() => {
		refresh()
		return buildQuery(name, options2)
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
	return { data, refresh, setData }
}
