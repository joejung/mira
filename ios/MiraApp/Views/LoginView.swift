import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "cpu")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(.indigo)
                .padding(.bottom, 20)
            
            Text("MIRA")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("Chipset Issue Tracker")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            VStack(spacing: 15) {
                TextField("Email", text: $viewModel.email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .autocapitalization(.none)
                    .keyboardType(.emailAddress)
                
                SecureField("Password", text: $viewModel.password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }
            .padding(.horizontal)
            .padding(.top, 20)
            
            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
            }
            
            Button(action: viewModel.login) {
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color.indigo)
                        .frame(height: 50)
                    
                    if viewModel.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Text("Sign In")
                            .foregroundColor(.white)
                            .fontWeight(.semibold)
                    }
                }
            }
            .padding(.horizontal)
            .padding(.top, 10)
            .disabled(viewModel.isLoading)
        }
        .padding()
    }
}
