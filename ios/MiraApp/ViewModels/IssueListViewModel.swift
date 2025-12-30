import Foundation
import Combine

class IssueListViewModel: ObservableObject {
    @Published var issues: [Issue] = []
    @Published var isLoading = false
    
    private var networkManager = NetworkManager.shared
    
    func loadIssues() {
        isLoading = true
        networkManager.fetchIssues { [weak self] result in
            self?.isLoading = false
            switch result {
            case .success(let issues):
                self?.issues = issues
            case .failure(let error):
                print("Error loading issues: \(error)")
            }
        }
    }
}
