import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'sign_in.dart';

class ProScreen extends StatelessWidget {
  const ProScreen({super.key});

  Future<void> _buy(BuildContext context) async {
    if (FirebaseAuth.instance.currentUser == null) {
      await Navigator.push(context, MaterialPageRoute(builder: (_) => const SignInScreen()));
      if (FirebaseAuth.instance.currentUser == null) return;
    }
    final response = await InAppPurchase.instance.queryProductDetails({'hush_pro_yearly'});
    final product = response.productDetails.first;
    await InAppPurchase.instance.buyNonConsumable(purchaseParam: PurchaseParam(productDetails: product));
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l.proTitle)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          Text(l.proBody),
          FilledButton(onPressed: () => _buy(context), child: const Text('\$24.99 a year')),
          TextButton(onPressed: () => InAppPurchase.instance.restorePurchases(), child: const Text('Restore purchases')),
        ]),
      ),
    );
  }
}
