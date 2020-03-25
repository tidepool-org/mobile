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

import CocoaLumberjack
import Foundation
import TPHealthKitUploader
import UIKit
import Zip

@objc(TPNative)
class TPNative: RCTEventEmitter, UIDocumentInteractionControllerDelegate {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
      return [
          "onShareWillBeginPreview",
          "onShareDidEndPreview"
          ]
    }

    var isObserving: Bool = false

    override func startObserving() -> Void {
        DDLogVerbose("trace")

        isObserving = true
    }

    override func stopObserving() -> Void {
        DDLogVerbose("trace")

        isObserving = false
    }

    @objc func setUser(_ userId: String, username: String, userFullName: String, isDSAUser: Bool, sessionToken: String) -> Void {
        Rollbar.currentConfiguration()?.setPersonId(userId, username: userFullName, email: username)

        TPApi.sharedInstance.sessionToken = sessionToken

        let dataController = TPDataController.sharedInstance
        dataController.currentUserId = userId
        dataController.currentUserFullName = userFullName
        dataController.currentUserIsDSAUser = isDSAUser
        dataController.configureHealthKitInterface()
    }

    @objc(clearUser)
    func clearUser() -> Void {
        Rollbar.currentConfiguration()?.setPersonId(nil, username: nil, email: nil)

        TPApi.sharedInstance.sessionToken = nil

        let dataController = TPDataController.sharedInstance
        dataController.currentUserId = nil
        dataController.currentUserFullName = nil
        dataController.currentUserIsDSAUser = false
        dataController.configureHealthKitInterface()
    }

    @objc func setEnvironment(_ environment: String) -> Void {
        Rollbar.currentConfiguration()?.environment = environment

        let api = TPApi.sharedInstance
        api.environment = environment
        api.configure()

        let dataController = TPDataController.sharedInstance
        dataController.configureHealthKitInterface()
    }

    @objc func testNativeCrash() -> Void {
        DispatchQueue.main.async(execute: {
            self.perform(Selector("Test native crash"), with: nil, afterDelay: 0.25)
        })
    }

    @objc func testLogWarning(_ message: String) -> Void {
        RollbarReactNative.warning(withMessage: message)
    }

    @objc func testLogError(_ message: String) -> Void {
        RollbarReactNative.error(withMessage: message)
    }

    @objc func isUploaderLoggingEnabled() -> NSNumber {
        let loggingEnabledObject = UserDefaults.standard.object(forKey: "LoggingEnabled")
        return NSNumber(value: loggingEnabledObject != nil && (loggingEnabledObject! as AnyObject).boolValue)
    }

    @objc func enableUploaderLogging(_ enable: Bool) -> Void {
        DispatchQueue.main.async {
            UserDefaults.standard.set(enable, forKey: "LoggingEnabled");
            UserDefaults.standard.synchronize()

            if (enable) {
                dynamicLogLevel = DDLogLevel.verbose
            } else {
                dynamicLogLevel = DDLogLevel.off
                self.clearLogFiles()
            }
        }
    }

    @objc func shareUploaderLogs() -> Void {
        DDLog.flushLog()

        // Delay so we aren't presenting new view controller while Debug UI view controller is transitioning
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(500), execute: {
            let appName = Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as! String
            let progressAlert = UIAlertController(title: "Creating \(appName) logs.zip...", message: nil, preferredStyle: .alert)
            let activityIndicator = UIActivityIndicatorView(style: .gray)
            activityIndicator.translatesAutoresizingMaskIntoConstraints = false
            activityIndicator.isUserInteractionEnabled = false
            activityIndicator.startAnimating()
            progressAlert.view.addSubview(activityIndicator)
            progressAlert.view.heightAnchor.constraint(equalToConstant: 95).isActive = true
            activityIndicator.centerXAnchor.constraint(equalTo: progressAlert.view.centerXAnchor, constant: 0).isActive = true
            activityIndicator.bottomAnchor.constraint(equalTo: progressAlert.view.bottomAnchor, constant: -20).isActive = true
            UIApplication.shared.keyWindow?.rootViewController?.present(progressAlert, animated: true)

            let documentInteractionController = UIDocumentInteractionController()
            DispatchQueue.global(qos: .userInitiated).async {
                let logFilePaths = fileLogger.logFileManager.sortedLogFilePaths as [String]
                var logFileUrls = [URL]()
                for logFilePath in logFilePaths {
                    logFileUrls.append(URL(fileURLWithPath: logFilePath))
                }
                var successfullyCreatedZip = true
                let directory = FileManager.default.urls(for:.cachesDirectory, in: .userDomainMask)[0]
                let zipFileUrl = directory.appendingPathComponent("\(appName) logs.zip")
                do {
                    try Zip.zipFiles(paths: logFileUrls,
                                    zipFilePath: zipFileUrl,
                                    password: nil,
                                    compression: .BestCompression,
                                    progress: { (progress) -> () in })
                }
                catch {
                    successfullyCreatedZip = false
                }

                DispatchQueue.main.async {
                    progressAlert.dismiss(animated: true)
                    if successfullyCreatedZip {
                        documentInteractionController.delegate = self
                        documentInteractionController.url = zipFileUrl
                        documentInteractionController.presentPreview(animated: true)
                    } else {
                        let errorAlert = UIAlertController(title: "Error", message: "Failed to create attachment. The .zip archive might be too large", preferredStyle: .alert)
                        let action = UIAlertAction(title: "OK", style: .default)
                        errorAlert.addAction(action)
                            UIApplication.shared.keyWindow?.rootViewController?.present(errorAlert, animated: true, completion: nil)
                    }
                }
            }
        })
    }
    
    func documentInteractionControllerViewControllerForPreview(_ controller: UIDocumentInteractionController) -> UIViewController {
        return UIApplication.shared.keyWindow!.rootViewController!
    }
    
    func documentInteractionControllerWillBeginPreview(_ controller: UIDocumentInteractionController) {
        DispatchQueue.main.async {
            if self.isObserving {
                self.sendEvent(withName: "onShareWillBeginPreview", body: nil)
            }
        }
    }

    func documentInteractionControllerDidEndPreview(_ controller: UIDocumentInteractionController) {
        DispatchQueue.main.async {
            if self.isObserving {
                self.sendEvent(withName: "onShareDidEndPreview", body: nil)
            }
        }
    }
    
    fileprivate func clearLogFiles() {
        // Clear log files
        let logFileInfos = fileLogger.logFileManager.unsortedLogFileInfos
        for logFileInfo in logFileInfos {
            let logFilePath = logFileInfo.filePath
            do {
                try FileManager.default.removeItem(atPath: logFilePath)
                logFileInfo.reset()
                DDLogInfo("Removed log file: \(logFilePath)")
            } catch let error as NSError {
                DDLogError("Failed to remove log file at path: \(logFilePath) error: \(error), \(error.userInfo)")
            }
        }
    }

}
