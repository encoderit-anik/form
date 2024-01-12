import { ROLES } from '@/config'

export const toUser = (v) => ({
	uid: v?.uid,
	email: v?.email,
	photoURL: v?.photoURL,
	displayName: v?.displayName,
	online: v?.online || false,
	roles: v?.roles || [ROLES.USER],
	ref: v?.ref || v,
})
