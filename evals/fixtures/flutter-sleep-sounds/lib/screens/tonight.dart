import 'dart:io' show Platform;
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'pro.dart';

class TonightScreen extends StatelessWidget {
  const TonightScreen({super.key});

  String get _storeName => Platform.isIOS ? 'App Store' : 'Google Play';

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l.tonightTitle)),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        Text(l.sleepScore(82), style: Theme.of(context).textTheme.headlineMedium),
        Text(l.sleepScoreClaim),
        const SizedBox(height: 24),
        Card(child: ListTile(title: Text(l.rateTitle), subtitle: Text(l.rateBody))),
        TextButton(
          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProScreen())),
          child: Text('${l.proTitle}: manage it in your $_storeName account'),
        ),
      ]),
    );
  }
}
