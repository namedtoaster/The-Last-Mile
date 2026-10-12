import SwiftUI

struct JournalView: View {
    @EnvironmentObject var session: Session
    @State private var entry = ""

    var body: some View {
        NavigationStack {
            Form {
                TextField("How do you feel?", text: $entry)
                Text("Streak: \(session.streak) days")
                NavigationLink("Go Pro") { ProView() }
                Section("Account") {
                    Text(session.user?.profile?.email ?? "")
                    Button("Sign out") { session.signOut() }
                }
            }
            .navigationTitle("Today")
        }
    }
}
