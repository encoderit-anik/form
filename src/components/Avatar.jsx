// styles
import './Avatar.css'
import React from 'react'
import { clsx } from 'clsx'

export default function Avatar({ src, className }) {
	return (
		<div className={clsx(className, 'avatar')}>
			<img src={src} alt="user avatar" className="object-center object-cover" />
		</div>
	)
}
