import Foundation
import Combine

class AuthViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var networkManager = NetworkManager.shared
    
    func login() {
        isLoading = true
        errorMessage = nil
        
        networkManager.login(email: email, password: password) { [weak self] result in
            self?.isLoading = false
            switch result {
            case .success(_):
                // Login successful, state handled by NetworkManager/ContentView
                break
            case .failure(let error):
                self?.errorMessage = error.localizedDescription
            }
        }
    }
}
