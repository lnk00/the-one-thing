//
//  AppDelegate.swift
//  tot-ios
//
//  Created by Damien Dumontet on 1/5/25.
//


import UIKit


class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    LynxEnv.sharedInstance()
    return true
  }
}
