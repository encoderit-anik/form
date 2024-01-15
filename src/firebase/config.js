import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyBlt0oktv1IBIQKTkXH1ea6Pe0SPuz9mE0',
	authDomain: 'java-form-1af03.firebaseapp.com',
	projectId: 'java-form-1af03',
	storageBucket: 'java-form-1af03.appspot.com',
	messagingSenderId: '786644830539',
	appId: '1:786644830539:web:dd2458d2576492e12ac0ce',
}

// init firebase
firebase.initializeApp(firebaseConfig)

//init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.Timestamp

const Auth = projectAuth
const Users = projectFirestore.collection('users')
const Languages = projectFirestore.collection('languages')
export const Messages = projectFirestore.collection('chat')

export { projectFirestore, Users, Languages, Auth, projectAuth, timestamp, projectStorage }
