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
import TPHealthKitUploader
import CocoaLumberjack
import UIKit

@objc(TPNativeHealth)
class TPNativeHealth: RCTEventEmitter {
    private let connector = TPUploaderAPI.connector()
    private let uploader = TPUploaderAPI.connector().uploader()
    private var isHistoricalUploadPending = false;

    public override init() {
        super.init()

        connector.nativeHealthBridge = self

        NotificationCenter.default.addObserver(self, selector: #selector(TPNativeHealth.handleTurnOnUploader(_:)), name: Notification.Name(rawValue: TPUploaderNotifications.TurnOnUploader), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(TPNativeHealth.handleTurnOffUploader(_:)), name: Notification.Name(rawValue: TPUploaderNotifications.TurnOffUploader), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(TPNativeHealth.handleStatsUpdated(_:)), name: Notification.Name(rawValue: TPUploaderNotifications.Updated), object: nil)
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc func enableHealthKitInterfaceAndAuthorize() -> NSNumber {
        DDLogInfo("\(#function)")

        uploader.enableHealthKitInterfaceAndAuthorize()
        return NSNumber(value: true)
    }

    @objc func disableHealthKitInterface() -> NSNumber {
        DDLogInfo("\(#function)")

        _ = stopUploadingHistoricalAndReset();
        uploader.disableHealthKitInterface()
        return NSNumber(value: true)
    }

    @objc func healthKitInterfaceConfiguration() -> NSDictionary {
        var interfaceTurnedOffError = ""
        if let error = connector.interfaceTurnedOffError {
            interfaceTurnedOffError = "Failed to prepare upload. \(error.localizedDescription)"
        }
        return [
            "shouldShowHealthKitUI": uploader.shouldShowHealthKitUI(),
            "isHealthKitAuthorized": uploader.isHealthKitAuthorized(),
            "isHealthKitInterfaceEnabledForCurrentUser": uploader.isHealthKitInterfaceEnabledForCurrentUser(),
            "isHealthKitInterfaceConfiguredForOtherUser": uploader.isHealthKitInterfaceConfiguredForOtherUser(),
            "currentHealthKitUsername": uploader.curHKUserName() ?? "",
            "interfaceTurnedOffError": interfaceTurnedOffError,
            "isTurningInterfaceOn": connector.isTurningInterfaceOn,
            "isInterfaceOn": connector.isInterfaceOn,
            "hasPresentedSyncUI": uploader.hasPresentedSyncUI
        ]
    }

    @objc func uploaderProgress() -> NSDictionary {
        let isUploadingHistorical = self.uploader.isUploadInProgressForMode(TPUploader.Mode.HistoricalAll)
        let progress = self.uploader.uploaderProgress()
        return [
            "isUploadingHistorical": isUploadingHistorical,
            "historicalUploadCurrentDay": progress.currentDayHistorical,
            "historicalUploadTotalDays": progress.totalDaysHistorical,
            "lastCurrentUploadUiDescription": lastCurrentUploadUiDescription()
        ]
    }

    @objc func startUploadingHistorical() -> NSNumber {
        DDLogInfo("\(#function)")

        let dataCtl = TPDataController.sharedInstance
        guard let _ = dataCtl.currentUserId else {
            return NSNumber(value: false)
        }

        if self.connector.isTurningInterfaceOn {
            self.isHistoricalUploadPending = true
        } else if self.connector.isInterfaceOn {
            self.isHistoricalUploadPending = false
            uploader.startUploading(TPUploader.Mode.HistoricalAll)
        }

        let body = self.createBodyForHistoricalStats()
        DispatchQueue.main.async {
            if self.isObserving {
                self.sendEvent(withName: "onUploadStatsUpdated", body: body)
            }
        }

        return NSNumber(value: true)
    }

    @objc func stopUploadingHistoricalAndReset() -> NSNumber {
        DDLogInfo("\(#function)")

        self.isHistoricalUploadPending = false
        uploader.stopUploading(mode: .HistoricalAll, reason: .interfaceTurnedOff)
        uploader.resetPersistentStateForMode(.HistoricalAll)

        let body = self.createBodyForHistoricalStats()
        DispatchQueue.main.async {
            if self.isObserving {
                self.sendEvent(withName: "onUploadStatsUpdated", body: body)
            }
        }

        return NSNumber(value: true)
    }

    @objc func setHasPresentedSyncUI() -> NSNumber {
        DDLogInfo("\(#function)")

        uploader.hasPresentedSyncUI = true
        return true
    }

    override func supportedEvents() -> [String]! {
      return [
          "onHealthKitInterfaceConfiguration",
          "onTurnOnHistoricalUpload",
          "onTurnOffHistoricalUpload",
          "onUploadStatsUpdated"
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

    func onHealthKitInterfaceConfiguration() {
        let body = self.healthKitInterfaceConfiguration()
        if !self.connector.isTurningInterfaceOn {
            if let error = self.connector.interfaceTurnedOffError {
                if self.connector.isConnectedToNetwork() {
                    // TODO: uploader - if interface turned off with an error, and we're connected, then retry up to n times
                    let message = String("\(error.localizedDescription.prefix(50))")
                    DDLogInfo(message)
                    RollbarReactNative.warning(withMessage: message)
                }
            }
        }
        
        DispatchQueue.main.async {
            if self.isObserving {
                self.sendEvent(withName: "onHealthKitInterfaceConfiguration", body: body)
            }
        }
        
        if self.connector.isInterfaceOn && self.isHistoricalUploadPending {
            _ = self.startUploadingHistorical()
        }
    }

    @objc func handleTurnOnUploader(_ note: Notification) {
        DDLogVerbose("trace")

        let userInfo = note.userInfo!
        let mode = userInfo["mode"] as! TPUploader.Mode
        var message = ""
        if mode == TPUploader.Mode.HistoricalAll {
            message = "Started historical upload"
            DispatchQueue.main.async {
                DDLogVerbose("handleTurnOnUploader disable idle timer")
                UIApplication.shared.isIdleTimerDisabled = true

                if self.isObserving {
                    self.sendEvent(withName: "onTurnOnHistoricalUpload", body:[
                        "hasPresentedSyncUI": self.uploader.hasPresentedSyncUI
                    ])
                }
            }
        } else {
            message = "Started current upload"
        }
        RollbarReactNative.info(withMessage: message)
    }

    @objc func handleTurnOffUploader(_ note: Notification) {
        DDLogVerbose("trace")
        
        let userInfo = note.userInfo!
        let mode = userInfo["mode"] as! TPUploader.Mode
        let type = userInfo["type"] as! String
        let reason = userInfo["reason"] as! TPUploader.StoppedReason
        DDLogInfo("Type: \(type), Mode: \(mode), Reason: \(reason)")

        var body = [String: String]()
        switch reason {
        case .interfaceTurnedOff:
            body = ["turnOffUploaderReason": "turned off", "turnOffUploaderError": ""]
            break
        case .uploadingComplete:
            body = ["turnOffUploaderReason": "complete", "turnOffUploaderError": ""]
            break
        case .error(let error):
            // TODO: uploader - retry up to n times, and each time a batch of samples is successfully uploaded, reset retry count
            // TODO: uploader - auto resume once connected again?
            var message = ""
            if !self.connector.isConnectedToNetwork() {
                message = "Unable to upload. The Internet connection appears to be offline."
            } else {
                message = String("\(type) upload error: \(error.localizedDescription.prefix(50))")
            }
            body = ["turnOffUploaderReason": "error", "turnOffUploaderError": message]
            break
        default:
            break
        }
        var message = ""
        if mode == TPUploader.Mode.HistoricalAll {
            message = "Stopped historical upload"
            DispatchQueue.main.async {
                DDLogVerbose("handleTurnOffUploader enable idle timer")
                UIApplication.shared.isIdleTimerDisabled = false

                if self.isObserving {
                    self.sendEvent(withName: "onTurnOffHistoricalUpload", body: body)
                }
            }
        } else {
            message = "Stopped current upload"
        }
        RollbarReactNative.info(withMessage: message, data: body)
    }

    @objc func handleStatsUpdated(_ note: Notification) {
        let userInfo = note.userInfo!
        let mode = userInfo["mode"] as! TPUploader.Mode
        var body: Any? = nil
        if mode == TPUploader.Mode.HistoricalAll {
            body = self.createBodyForHistoricalStats()
        } else {
            body = self.createBodyForCurrentStats()
        }
        DispatchQueue.main.async {
            if self.isObserving {
                self.sendEvent(withName: "onUploadStatsUpdated", body: body)
            }
        }
    }

    func createBodyForHistoricalStats() -> Any? {
        let isUploadingHistorical = self.uploader.isUploadInProgressForMode(TPUploader.Mode.HistoricalAll)
        let progress = self.uploader.uploaderProgress()
        return [
            "type": "historical",
            "isUploadingHistorical": isUploadingHistorical,
            "isHistoricalUploadPending": self.isHistoricalUploadPending,
            "historicalUploadCurrentDay": progress.currentDayHistorical,
            "historicalUploadTotalDays": progress.totalDaysHistorical,
        ]
    }

    func createBodyForCurrentStats() -> Any? {
        return [
            "type": "current",
            "lastCurrentUploadUiDescription": lastCurrentUploadUiDescription()
        ]
    }

    private func lastCurrentUploadUiDescription() -> String {
        var description = "No data available to upload"
        let progress = self.uploader.uploaderProgress()
        if let lastSuccessfulUpload = progress.lastSuccessfulCurrentUploadTime/*, let lastType = self.lastCurrentUploadType()*/
        {
            let lastUploadTimeAgoInWords = lastSuccessfulUpload.timeAgoInWords(Date())
            description = String(format: "Last reading %@", lastUploadTimeAgoInWords)
        }
        return description
    }

    private func lastCurrentUploadType() -> String? {
        var lastType: String?
        var lastUploadTime: Date?
        let currentStats = self.uploader.currentUploadStats()
        for stat in currentStats {
            if stat.hasSuccessfullyUploaded {
                if lastType == nil || lastUploadTime == nil {
                    lastUploadTime = stat.lastSuccessfulUploadTime
                    lastType = stat.typeName
                } else {
                    if stat.lastSuccessfulUploadTime != nil, stat.lastSuccessfulUploadTime!.compare(lastUploadTime!) == .orderedDescending {
                        lastUploadTime = stat.lastSuccessfulUploadTime
                        lastType = stat.typeName
                    }
                }
            }
        }
        return lastType
    }
}
