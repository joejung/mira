import Foundation

struct Issue: Codable, Identifiable {
    let id: Int
    let title: String
    let description: String
    let status: String
    let priority: String
    let chipset: String
    let chipsetVer: String?
    let createdAt: String
    
    // Nested structs for project/reporter if API returns them nested
    struct ProjectSummary: Codable {
        let name: String
    }
    let project: ProjectSummary?
}
