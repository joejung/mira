import Foundation

class NetworkManager: ObservableObject {
    static let shared = NetworkManager()
    
    // Configurable Base URL (Default to local IP found in config)
    // NOTE: In a real app, this might be dynamic or environment based
    @Published var baseUrl = "http://192.168.200.187:5000/api"
    @Published var authToken: String?
    
    // Simple state to track logged in user
    @Published var currentUser: User?
    
    private init() {}
    
    var isAuthenticated: Bool {
        return authToken != nil
    }
    
    func login(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        guard let url = URL(string: "\(baseUrl)/auth/login") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(error)) }
                return
            }
            
            guard let data = data else { return }
            
            do {
                let response = try JSONDecoder().decode(LoginResponse.self, from: data)
                DispatchQueue.main.async {
                    self?.authToken = response.token
                    self?.currentUser = response.user
                    completion(.success(response.user))
                }
            } catch {
                DispatchQueue.main.async { completion(.failure(error)) }
            }
        }.resume()
    }
    
    func fetchIssues(completion: @escaping (Result<[Issue], Error>) -> Void) {
        guard let url = URL(string: "\(baseUrl)/issues") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        /*
        // If your backend creates protected routes, add the token:
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        */
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(error)) }
                return
            }
            
            guard let data = data else { return }
            
            do {
                let issues = try JSONDecoder().decode([Issue].self, from: data)
                DispatchQueue.main.async { completion(.success(issues)) }
            } catch {
                DispatchQueue.main.async { completion(.failure(error)) }
            }
        }.resume()
    }
    
    func logout() {
        authToken = nil
        currentUser = nil
    }
}
