# MIRA iOS App

This is a native SwiftUI application for MIRA.

## How to Run

1. **Transfer Files**: Copy the entire `MiraApp` folder to a Mac.
2. **Open Xcode**: Create a new SwiftUI project in Xcode.
3. **Import Files**: Drag and drop the `Models`, `Services`, `ViewModels`, and `Views` folders into your Xcode project.
    * Make sure "Copy items if needed" is checked.
    * Make sure "Create groups" is selected.
4. **Entry Point**: Ensure `MiraApp.swift` is your `@main` entry point or update your existing App file to call `ContentView()`.
5. **Run**: Select a simulator (e.g., iPhone 15) and press Run (Cmd+R).

## Configuration

- The API URL is currently hardcoded in `Services/NetworkManager.swift`.
* Default: `http://192.168.200.187:5000/api`
* Update this IP if your backend server IP changes.
