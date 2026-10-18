import 'package:flutter/material.dart';

/// Shown on every platform after a 7 day streak.
class ShareCard extends StatelessWidget {
  const ShareCard({super.key});
  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Text('7 days! Invite a friend: Streaky is free on Google Play.'),
    );
  }
}
