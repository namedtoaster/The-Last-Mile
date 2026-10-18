import 'package:flutter/material.dart';
import 'sign_in.dart';
import 'share.dart';

void main() => runApp(const StreakyApp());

class StreakyApp extends StatelessWidget {
  const StreakyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Streaky',
      home: Scaffold(
        appBar: AppBar(title: const Text('Streaky')),
        body: Column(children: const [
          Text('TODO: write onboarding copy'),
          SignInButton(),
          ShareCard(),
        ]),
      ),
    );
  }
}
