package app.pennywise.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var signedIn by remember { mutableStateOf(Auth.currentUser() != null) }
            if (signedIn) BudgetScreen(onSignOut = { Auth.signOut(); signedIn = false })
            else SignInScreen(onSignedIn = { signedIn = true })
        }
    }
}
