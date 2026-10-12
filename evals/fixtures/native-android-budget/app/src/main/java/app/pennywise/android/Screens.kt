package app.pennywise.android

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SignInScreen(onSignedIn: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(Modifier.padding(24.dp)) {
        Text("Pennywise", style = MaterialTheme.typography.headlineLarge)
        OutlinedTextField(email, { email = it }, label = { Text("Email") })
        OutlinedTextField(password, { password = it }, label = { Text("Password") })
        Button(onClick = { Auth.signUp(email, password) { if (it) onSignedIn() } }) { Text("Create account") }
        TextButton(onClick = { Auth.signIn(email, password) { if (it) onSignedIn() } }) { Text("I have an account") }
    }
}

@Composable
fun BudgetScreen(onSignOut: () -> Unit) {
    Column(Modifier.padding(24.dp)) {
        Text("This month: $412 of $900", style = MaterialTheme.typography.headlineSmall)
        Text("Add an expense, or snap a receipt.")
        Spacer(Modifier.height(24.dp))
        Button(onClick = onSignOut) { Text("Sign out") }
    }
}
