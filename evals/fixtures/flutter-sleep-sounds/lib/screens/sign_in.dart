import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});
  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();

  Future<void> _submit() async {
    await FirebaseAuth.instance.createUserWithEmailAndPassword(email: _email.text, password: _password.text);
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Create an account')),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(children: [
            TextField(controller: _email, decoration: const InputDecoration(labelText: 'Email')),
            TextField(controller: _password, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
            FilledButton(onPressed: _submit, child: const Text('Continue')),
            TextButton(
              onPressed: () async {
                await FirebaseAuth.instance.currentUser?.delete();
                if (context.mounted) Navigator.pop(context);
              },
              child: const Text('Delete my account'),
            ),
          ]),
        ),
      );
}
