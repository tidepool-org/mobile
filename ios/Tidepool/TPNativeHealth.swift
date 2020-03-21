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
        NotificationCenter.default.addObserver(self, selector: #selector(TPNativeHealth.handleUploadRetry(_:)), name: Notification.Name(rawValue: TPUploaderNotifications.UploadRetry), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(TPNativeHealth.handleUploadSuccessful(_:)), name: Notification.Name(rawValue: TPUploaderNotifications.UploadSuccessful), object: nil)
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
            "hasPresentedSyncUI": uploader.hasPresentedSyncUI,
            "interfaceTurnedOffError": interfaceTurnedOffError,
            "isTurningInterfaceOn": uploader.isTurningInterfaceOn(),
            "isInterfaceOn": uploader.isInterfaceOn(),
            "uploaderLimitsIndex": TPSettings.sharedInstance.uploaderLimitsIndex,
            "uploaderTimeoutsIndex": TPSettings.sharedInstance.uploaderTimeoutsIndex,
            "uploaderSuppressDeletes": TPSettings.sharedInstance.uploaderSuppressDeletes,
            "uploaderSimulate": TPSettings.sharedInstance.uploaderSimulate,
            "includeSensitiveInfo": TPSettings.sharedInstance.includeSensitiveInfo,
            "includeCFNetworkDiagnostics": TPSettings.sharedInstance.includeCFNetworkDiagnostics,
            "lastCurrentUploadUiDescription": lastCurrentUploadUiDescription()
        ]
    }

    @objc func uploaderProgress() -> NSDictionary {
        let isUploadingHistorical = self.uploader.isUploadInProgressForMode(TPUploader.Mode.HistoricalAll)
        let isUploadingCurrent = self.uploader.isUploadInProgressForMode(TPUploader.Mode.Current)
        let (historicalUploadLimitsIndex, historicalUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.HistoricalAll)
        let (currentUploadLimitsIndex, currentUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.Current)
        let progress = self.uploader.uploaderProgress()
        return [
            "isUploadingHistorical": isUploadingHistorical,
            "historicalUploadLimitsIndex": historicalUploadLimitsIndex,
            "historicalUploadMaxLimitsIndex": historicalUploadMaxLimitsIndex,
            "historicalUploadCurrentDay": progress.currentDayHistorical,
            "historicalUploadTotalDays": progress.totalDaysHistorical,
            "historicalUploadTotalSamples": progress.totalSamplesHistorical,
            "historicalUploadTotalDeletes": progress.totalDeletesHistorical,
            
            "isUploadingCurrent": isUploadingCurrent,
            "currentUploadLimitsIndex": currentUploadLimitsIndex,
            "currentUploadMaxLimitsIndex": currentUploadMaxLimitsIndex,
            "currentUploadTotalSamples": progress.totalSamplesCurrent,
            "currentUploadTotalDeletes": progress.totalDeletesCurrent,
            "lastCurrentUploadUiDescription": lastCurrentUploadUiDescription()
        ]
    }

    @objc func startUploadingHistorical() -> NSNumber {
        DDLogInfo("\(#function)")

        let dataCtl = TPDataController.sharedInstance
        guard let _ = dataCtl.currentUserId else {
            return NSNumber(value: false)
        }

        if !self.uploader.isInterfaceOn() {
            TPDataController.sharedInstance.configureHealthKitInterface()
        }
        if self.uploader.isTurningInterfaceOn() {
            self.isHistoricalUploadPending = true
        } else if self.uploader.isInterfaceOn() {
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
        connector.nativeHealthBridge?.onHealthKitInterfaceConfiguration()
        return true
    }
    
    @objc func setUploaderLimitsIndex(_ index: NSInteger) -> NSNumber {
        DDLogInfo("\(#function)")

        TPSettings.sharedInstance.setUploaderLimitsIndex(index)
        connector.nativeHealthBridge?.onHealthKitInterfaceConfiguration()
        return true
    }
    
    @objc func setUploaderTimeoutsIndex(_ index: NSInteger) -> NSNumber {
        DDLogInfo("\(#function)")

        TPSettings.sharedInstance.setUploaderTimeoutsIndex(index)
        connector.nativeHealthBridge?.onHealthKitInterfaceConfiguration()
        return true
    }
    
    @objc func setUploaderSuppressDeletes(_ suppress: Bool) -> NSNumber {
        DDLogInfo("\(#function)")

        TPSettings.sharedInstance.setUploaderSuppressDeletes(suppress)
        connector.nativeHealthBridge?.onHealthKitInterfaceConfiguration()
        return true
    }
    
    @objc func setUploaderSimulate(_ simulate: Bool) -> NSNumber {
        DDLogInfo("\(#function)")

        TPSettings.sharedInstance.setUploaderSimulate(simulate)
        connector.nativeHealthBridge?.onHealthKitInterfaceConfiguration()
        return true
    }
    
    @objc func setUploaderIncludeSensitiveInfo(_ includeSensitiveInfo: Bool) -> NSNumber {
        DDLogInfo("\(#function)")

        TPSettings.sharedInstance.setUploaderIncludeSensitiveInfo(includeSensitiveInfo)
        connector.nativeHealthBridge?.onHealthKitInterfaceConfiguration()
        return true
    }
    
    @objc func setUploaderIncludeCFNetworkDiagnostics(_ includeCFNetworkDiagnostics: Bool) -> NSNumber {
        DDLogInfo("\(#function)")

        TPSettings.sharedInstance.setUploaderIncludeCFNetworkDiagnostics(includeCFNetworkDiagnostics)
        connector.nativeHealthBridge?.onHealthKitInterfaceConfiguration()
        return true
    }

    override func supportedEvents() -> [String]! {
      return [
          "onHealthKitInterfaceConfiguration",
          "onTurnOnUploader",
          "onTurnOffUploader",
          "onRetryUpload",
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
        if !self.uploader.isTurningInterfaceOn() {
            if let error = self.connector.interfaceTurnedOffError {
                if self.connector.isConnectedToNetwork() {
                    let message = String("Interface turned off error: \(error.localizedDescription.prefix(50))")
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

        if self.uploader.isInterfaceOn() && self.isHistoricalUploadPending {
            _ = self.startUploadingHistorical()
        }
    }

    @objc func handleTurnOnUploader(_ note: Notification) {
        DDLogVerbose("trace")

        let userInfo = note.userInfo!
        let mode = userInfo["mode"] as! TPUploader.Mode
        let modeValue = (mode == TPUploader.Mode.Current ? "current" : "historical")
        var message = ""
        if mode == TPUploader.Mode.HistoricalAll {
            let (historicalUploadLimitsIndex, historicalUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.HistoricalAll)
            message = "Started historical upload"
            DispatchQueue.main.async {
                DDLogVerbose("handleTurnOnUploader disable idle timer")
                UIApplication.shared.isIdleTimerDisabled = true
                if self.isObserving {
                    self.sendEvent(withName: "onTurnOnUploader", body:[
                        "mode": modeValue,
                        "historicalUploadLimitsIndex": historicalUploadLimitsIndex,
                        "historicalUploadMaxLimitsIndex": historicalUploadMaxLimitsIndex,
                        "hasPresentedSyncUI": self.uploader.hasPresentedSyncUI
                    ])
                }
            }
        } else {
            message = "Started current upload"
            let (currentUploadLimitsIndex, currentUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.Current)
            DispatchQueue.main.async {
                if self.isObserving {
                    self.sendEvent(withName: "onTurnOnUploader", body:[
                        "mode": modeValue,
                        "currentUploadLimitsIndex": currentUploadLimitsIndex,
                        "currentUploadMaxLimitsIndex": currentUploadMaxLimitsIndex
                    ])
                }
            }
        }
        RollbarReactNative.info(withMessage: message)
    }

    @objc func handleTurnOffUploader(_ note: Notification) {
        DDLogVerbose("trace")

        let userInfo = note.userInfo!
        let mode = userInfo["mode"] as! TPUploader.Mode
        let modeValue = (mode == TPUploader.Mode.Current ? "current" : "historical")
        let reason = userInfo["reason"] as! TPUploader.StoppedReason

        var body = [String: Any]()
        switch reason {
        case .interfaceTurnedOff:
            body = ["turnOffUploaderReason": "turned off", "turnOffUploaderError": "", "mode": modeValue]
        case .uploadingComplete:
            body = ["turnOffUploaderReason": "complete", "turnOffUploaderError": "", "mode": modeValue]
        case .error(let error):
            var message = ""
            if !self.connector.isConnectedToNetwork() {
                message = "Upload paused while offline."
            } else {
                message = String("upload error: \(error.localizedDescription.prefix(50))")
            }
            body = ["turnOffUploaderReason": "error", "turnOffUploaderError": message, "mode": modeValue]
        }
        var message = ""
        if mode == TPUploader.Mode.HistoricalAll {
            self.isHistoricalUploadPending = false
            let (historicalUploadLimitsIndex, historicalUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.HistoricalAll)
            body["historicalUploadLimitsIndex"] = historicalUploadLimitsIndex
            body["historicalUploadMaxLimitsIndex"] = historicalUploadMaxLimitsIndex
            if historicalUploadLimitsIndex == historicalUploadMaxLimitsIndex {
                body["historicalUploadMaxRetryLimitReached"] = true
            }
            message = "Stopped historical upload"
            DispatchQueue.main.async {
                DDLogVerbose("handleTurnOffUploader enable idle timer")
                UIApplication.shared.isIdleTimerDisabled = false
                if self.isObserving {
                    self.sendEvent(withName: "onTurnOffUploader", body: body)
                }
            }
        } else {
            message = "Stopped current upload"
            let (currentUploadLimitsIndex, currentUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.Current)
            body["currentUploadLimitsIndex"] = currentUploadLimitsIndex
            body["currentUploadMaxLimitsIndex"] = currentUploadMaxLimitsIndex
            if currentUploadLimitsIndex == currentUploadMaxLimitsIndex {
                body["currentUploadMaxRetryLimitReached"] = true
            }
            DispatchQueue.main.async {
                if self.isObserving {
                    self.sendEvent(withName: "onTurnOffUploader", body: body)
                }
            }
        }
        DDLogInfo("Mode: \(mode), Reason: \(reason), body: \(body)")
        RollbarReactNative.info(withMessage: message, data: body)
    }

    
    @objc func handleUploadRetry(_ note: Notification) {
        DDLogVerbose("trace")

        let userInfo = note.userInfo!
        let mode = userInfo["mode"] as! TPUploader.Mode
        let modeValue = (mode == TPUploader.Mode.Current ? "current" : "historical")
        let reason = userInfo["reason"] as? TPUploader.StoppedReason
        let (historicalUploadLimitsIndex, historicalUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.HistoricalAll)
        let (currentUploadLimitsIndex, currentUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.Current)
        var body = [String: Any]()
        var errorMessage = ""
        var reasonMessage = ""
        var rollbarLogMessage = ""
        var isRetry = true
        switch reason {
        case .error(let error):
            rollbarLogMessage = "Retrying upload"
            reasonMessage = "error"
            errorMessage = String("upload error: \(error.localizedDescription.prefix(50))")
        default:
            rollbarLogMessage = "Retry successful"
            reasonMessage = "success"
            isRetry = false
            break
        }
        if mode == .HistoricalAll {
            body = [
                "retryHistoricalUploadReason": reasonMessage,
                "retryHistoricalUploadError": errorMessage,
                "isUploadingHistoricalRetry": isRetry,
                "historicalUploadLimitsIndex": historicalUploadLimitsIndex,
                "historicalUploadMaxLimitsIndex": historicalUploadMaxLimitsIndex,
                "mode": modeValue]
        } else {
            body = [
                "retryCurrentUploadReason": reasonMessage,
                "retryCurrentUploadError": errorMessage,
                "isUploadingCurrentRetry": isRetry,
                "currentUploadLimitsIndex": currentUploadLimitsIndex,
                "currentUploadMaxLimitsIndex": currentUploadMaxLimitsIndex,
                "mode": modeValue]
        }
        if !isRetry {
            if mode == TPUploader.Mode.HistoricalAll {
                body.merge(self.createBodyForHistoricalStats(), uniquingKeysWith: {
                    (first, _) in first
                })
            } else {
                body.merge(self.createBodyForCurrentStats(), uniquingKeysWith: {
                    (first, _) in first
                })
            }
        }

        DispatchQueue.main.async {
            if self.isObserving {
                self.sendEvent(withName: "onRetryUpload", body: body)
            }
        }

        DDLogInfo("Mode: \(mode), Info: \(body)")
        RollbarReactNative.info(withMessage: rollbarLogMessage, data: body)
    }
    
    @objc func handleUploadSuccessful(_ note: Notification) {
        let userInfo = note.userInfo!
        let mode = userInfo["mode"] as! TPUploader.Mode
        let type = userInfo["type"] as? String
        if type == "All" {
            var body = [String: Any]()
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
    }

    func createBodyForHistoricalStats() -> [String: Any] {
        let isUploadingHistorical = self.uploader.isUploadInProgressForMode(TPUploader.Mode.HistoricalAll)
        let (historicalUploadLimitsIndex, historicalUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.HistoricalAll)
        let progress = self.uploader.uploaderProgress()
        return [
            "mode": "historical",
            "isUploadingHistorical": isUploadingHistorical,
            "isHistoricalUploadPending": self.isHistoricalUploadPending,
            "historicalUploadLimitsIndex": historicalUploadLimitsIndex,
            "historicalUploadMaxLimitsIndex": historicalUploadMaxLimitsIndex,
            "historicalUploadCurrentDay": progress.currentDayHistorical,
            "historicalUploadTotalDays": progress.totalDaysHistorical,
            "historicalUploadTotalSamples": progress.totalSamplesHistorical,
            "historicalUploadTotalDeletes": progress.totalDeletesHistorical,
        ]
    }

    func createBodyForCurrentStats() -> [String: Any] {
        let isUploadingCurrent = self.uploader.isUploadInProgressForMode(TPUploader.Mode.Current)
        let (currentUploadLimitsIndex, currentUploadMaxLimitsIndex) = self.uploader.retryInfoForMode(TPUploader.Mode.Current)
        let progress = self.uploader.uploaderProgress()
        return [
            "mode": "current",
            "isUploadingCurrent": isUploadingCurrent,
            "currentUploadLimitsIndex": currentUploadLimitsIndex,
            "currentUploadMaxLimitsIndex": currentUploadMaxLimitsIndex,
            "currentUploadTotalSamples": progress.totalSamplesCurrent,
            "currentUploadTotalDeletes": progress.totalDeletesCurrent,
            "lastCurrentUploadUiDescription": lastCurrentUploadUiDescription(),
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
