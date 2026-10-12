package com.example.pennywise

import com.google.firebase.auth.FirebaseAuth

object Auth {
    private val auth = FirebaseAuth.getInstance()
    fun currentUser() = auth.currentUser
    fun signIn(email: String, password: String, done: (Boolean) -> Unit) {
        auth.signInWithEmailAndPassword(email, password).addOnCompleteListener { done(it.isSuccessful) }
    }
    fun signUp(email: String, password: String, done: (Boolean) -> Unit) {
        auth.createUserWithEmailAndPassword(email, password).addOnCompleteListener { done(it.isSuccessful) }
    }
    fun signOut() = auth.signOut()
}
