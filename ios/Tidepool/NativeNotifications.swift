/*
 * Copyright (c) 2019, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import Foundation
import UIKit

@objc(NativeNotifications)
class NativeNotifications: NSObject {    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc func setUser(_ userId: String, username: String, userFullName: String) -> Void {
        DispatchQueue.main.async(execute: {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.setUser(userId, username:username, userFullName:userFullName)
        })
    }

    @objc(clearUser)
    func clearUser() -> Void {
        DispatchQueue.main.async(execute: {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.clearUser()
        })
    }

    @objc func setEnvironment(_ environment: String) -> Void {
        DispatchQueue.main.async(execute: {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.environment = environment
        })
    }

    @objc func testNativeCrash() -> Void {
        DispatchQueue.main.async(execute: {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.testNativeCrash()
        })
    }

    @objc func testLogWarning(_ message: String) -> Void {
        DispatchQueue.main.async(execute: {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.testLogWarning(message)
        })
    }

    @objc func testLogError(_ message: String) -> Void {
        DispatchQueue.main.async(execute: {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.testLogError(message)
        })
    }
}
