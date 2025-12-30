import SwiftUI

struct IssueListView: View {
    @StateObject private var viewModel = IssueListViewModel()
    
    var body: some View {
        NavigationView {
            List(viewModel.issues) { issue in
                VStack(alignment: .leading, spacing: 5) {
                    HStack {
                        Text(issue.title)
                            .font(.headline)
                        Spacer()
                        StatusBadge(status: issue.status)
                    }
                    
                    Text("Example Project") // Placeholder as project might be optional
                        .font(.caption)
                        .foregroundColor(.gray)
                    
                    HStack {
                        Image(systemName: "exclamationmark.circle")
                            .font(.caption)
                        Text(issue.priority)
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundColor(priorityColor(issue.priority))
                    }
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("Issues")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        NetworkManager.shared.logout()
                    }) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                    }
                }
            }
            .onAppear {
                viewModel.loadIssues()
            }
        }
    }
    
    func priorityColor(_ priority: String) -> Color {
        switch priority.uppercased() {
        case "HIGH", "CRITICAL": return .red
        case "MEDIUM": return .orange
        default: return .green
        }
    }
}

struct StatusBadge: View {
    let status: String
    
    var body: some View {
        Text(status)
            .font(.caption2)
            .fontWeight(.bold)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(Color.gray.opacity(0.2))
            .cornerRadius(8)
    }
}
