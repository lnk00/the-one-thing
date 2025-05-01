//
//  LynxView.swift
//  tot-ios
//
//  Created by Damien Dumontet on 1/5/25.
//

import SwiftUI

struct LynxAppView: UIViewControllerRepresentable {

    typealias UIViewControllerType = ViewController

    func makeUIViewController(context: Context) -> ViewController {
        ViewController()
    }

    func updateUIViewController(_ uiViewController: ViewController, context: Context) {
       // Update the ViewController here
    }
}
