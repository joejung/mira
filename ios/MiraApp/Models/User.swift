import Foundation

struct User: Codable, Identifiable {
    let id: Int
    let email: String
    let name: String
    let role: String
}

struct LoginResponse: Codable {
    let token: String
    let user: User
}
