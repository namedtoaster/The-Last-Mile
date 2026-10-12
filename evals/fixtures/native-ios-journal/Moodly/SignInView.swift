import SwiftUI
import GoogleSignIn

struct SignInView: View {
    @EnvironmentObject var session: Session

    var body: some View {
        VStack(spacing: 16) {
            Text("Moodly").font(.largeTitle)
            Text("A one line journal for how you feel today.")
            Button("Continue with Google") {
                guard let root = UIApplication.shared.connectedScenes
                    .compactMap({ ($0 as? UIWindowScene)?.keyWindow?.rootViewController }).first else { return }
                GIDSignIn.sharedInstance.signIn(withPresenting: root) { result, _ in
                    session.user = result?.user
                }
            }
        }
        .padding()
    }
}
