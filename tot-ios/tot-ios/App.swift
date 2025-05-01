//
//  App.swift
//  tot-ios
//
//  Created by Damien Dumontet on 1/5/25.
//

import SwiftUI

@main
struct MySwiftUIProejctApp: App {
    
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    
    var body: some Scene {
        WindowGroup {
            LynxAppView().edgesIgnoringSafeArea(.top)
        }
    }
}
