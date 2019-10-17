//
//  ViewController.swift
//  KWebToNativeSample
//
//  Created by Lokesh on 15/10/19.
//  Copyright © 2019 Kobil. All rights reserved.
//

import UIKit
import KWebToNative

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
    }

    @IBAction func onClick(_ sender: Any) {
        let vc = UIStoryboard.init(name: "Main", bundle: Bundle.main).instantiateViewController(withIdentifier: "WebViewController") as? WebViewController
        if let nav = navigationController{
            nav.pushViewController(vc!, animated: true)
        }
    }
    
}
