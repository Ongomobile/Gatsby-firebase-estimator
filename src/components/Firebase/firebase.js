import firebaseConfig from "./config"
import app from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import "firebase/storage"

app.initializeApp(firebaseConfig)

class Firebase {
  constructor() {
    if (!firebaseInstance) {
      this.auth = app.auth()
      this.db = app.firestore()
      this.functions = app.functions()
      this.storage = app.storage()
    }
  }

  getUserProfile({ userId, onSnapshot }) {
    return this.db
      .collection("publicProfiles")
      .where("userId", "==", userId)
      .limit(1)
      .onSnapshot(onSnapshot)
  }
  async sendEmailVerification() {
    await this.auth.currentUser.sendEmailVerification().then(() => {
      console.log(this.auth.currentUser)
    })
  }
  async register({ email, password, username }) {
    await this.auth.createUserWithEmailAndPassword(email, password)
    await this.sendEmailVerification()
    const createProfileCallable = this.functions.httpsCallable(
      "createPublicProfile"
    )
    return createProfileCallable({
      username,
    })
  }

  async login({ email, password }) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  async logout() {
    await this.auth.signOut()
  }
}

let firebaseInstance

function getFirebaseInstance() {
  if (!firebaseInstance) {
    firebaseInstance = new Firebase()
    return firebaseInstance
  } else if (firebaseInstance) {
    return firebaseInstance
  } else {
    return null
  }
}

export default getFirebaseInstance
