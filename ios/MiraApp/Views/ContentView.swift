import SwiftUI

struct ContentView: View {
    @ObservedObject var networkManager = NetworkManager.shared
    
    var body: some View {
        Group {
            if networkManager.isAuthenticated {
                IssueListView()
            } else {
                LoginView()
            }
        }
    }
}
