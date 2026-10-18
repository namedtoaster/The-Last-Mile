import SwiftUI
import GoogleSignIn

@main
struct MoodlyApp: App {
    @StateObject private var session = Session()

    var body: some Scene {
        WindowGroup {
            if session.user == nil {
                SignInView().environmentObject(session)
            } else {
                JournalView().environmentObject(session)
            }
        }
    }
}

final class Session: ObservableObject {
    @Published var user: GIDGoogleUser?
    @AppStorage("streak") var streak = 0

    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        user = nil
    }
}
