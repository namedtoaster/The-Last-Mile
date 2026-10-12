import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

class SignInButton extends StatelessWidget {
  const SignInButton({super.key});
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => GoogleSignIn().signIn(),
      child: const Text('Sign in with Google to sync your streaks'),
    );
  }
}
