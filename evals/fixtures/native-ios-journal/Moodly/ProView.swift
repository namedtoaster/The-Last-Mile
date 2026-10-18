import SwiftUI
import StoreKit

struct ProView: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("Moodly Pro").font(.title)
            Text("Mood charts and reminders.")
            Button("Subscribe for $2.99 a month") {
                Task {
                    if let product = try? await Product.products(for: ["moodly.pro.monthly"]).first {
                        _ = try? await product.purchase()
                    }
                }
            }
            Text(NSLocalizedString("pro.footer", comment: ""))
                .font(.footnote)
        }
        .padding()
    }
}
