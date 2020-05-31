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
import CoreData
import Foundation
import SwiftyJSON
import TPHealthKitUploader

let kUserDefaultsConnectToHealthTipHasBeenShownKey = "ConnectToHealthCelebrationHasBeenShown"
let kUserDefaultsAddNoteTipHasBeenShownKey = "AddNoteTipHasBeenShown"
let kUserDefaultsNeedUploaderTipHasBeenShownKey = "NeedUploaderTipHasBeenShown"
let kUserDefaultsUploaderLimitsIndex = "UploaderLimitsIndex"
let kUserDefaultsUploaderTimeoutsIndex = "UploaderTimeoutsIndex"
let kUserDefaultsUploaderSuppressDeletes = "UploaderSuppressDeletes"
let kUserDefaultsUploaderSimulate = "UploaderSimulate"
let kUserDefaultsUploaderIncludeSensitiveInfo = "UploaderIncludeSensitiveInfo"
let kUserDefaultsUploaderIncludeCFNetworkDiagnostics = "UploaderIncludeCFNetworkDiagnostics"
let kUserDefaultsUploaderShouldLogHealthData = "kUserDefaultsUploaderShouldLogHealthData"
let kUserDefaultsUploaderUseLocalNotificationDebug = "kUserDefaultsUploaderUseLocalNotificationDebug"
let kUserDefaultsUseLocalNotificationDebug = "UseLocalNotificationDebug"

let kAsyncStorageApiEnvironmentKey = "API_ENVIRONMENT_KEY"
let kAsyncStorageAuthUserKey = "AUTH_USER_KEY"

let kUserDefaultsSettingsMigrationVersionKey = "SettingsMigrationVersionKey"

let kUserDefaultsLegacySessionTokenKey = "SToken"
let kUserDefaultsLegacyCurrentEnvironmentKey = "SCurrentService"

class TPSettings {
    static let sharedInstance = TPSettings()

    var currentEnvironment: String?
    var currentUserSessionToken: String?
    var currentUserId: String?
    var currentUserFullName: String?
    var currentUserIsDSAUser: Bool = false

    var uploaderLimitsIndex: Int = 0
    var samplesUploadLimits: [Int] = []
    var deletesUploadLimits: [Int] = []
    var uploaderSuppressDeletes: Bool = false
    var uploaderSimulate: Bool = false
    var includeSensitiveInfo: Bool = false
    var includeCFNetworkDiagnostics: Bool = false
    var shouldLogHealthData: Bool = false
    var useLocalNotificationDebug: Bool = false

    var uploaderTimeoutsIndex: Int = 0
    var uploaderTimeouts: [Int] = []

    private let userDefaults: UserDefaults
    private let asyncStorage: RCTAsyncLocalStorage
    
    private let availableSamplesUploadLimits = [
                    [2400, 1200, 600, 240],
                    [600, 240, 120, 60],
                    [240, 120, 60, 24]]
    private let availableDeletesUploadLimits = [
                    [120, 60, 24, 12],
                    [60, 24, 12, 12],
                    [24, 12, 12, 12]]
    private let availableTimeouts = [
                    [60, 90, 180, 300],
                    [90, 180, 300, 300],
                    [180, 300, 300, 300]]

    init() {
        userDefaults = UserDefaults.standard

        
        
        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let asyncLocalStorageUrl = documentsDirectory.appendingPathComponent("RCTAsyncLocalStorage", isDirectory: true)
        asyncStorage = RCTAsyncLocalStorage(storageDirectory: asyncLocalStorageUrl.path)!
    }

    func loadSettings() {
        migrate();

        uploaderLimitsIndex = userDefaults.integer(forKey: kUserDefaultsUploaderLimitsIndex)
        uploaderLimitsIndex = min(uploaderLimitsIndex, availableSamplesUploadLimits.count - 1)
        samplesUploadLimits = availableSamplesUploadLimits[uploaderLimitsIndex]
        deletesUploadLimits = availableDeletesUploadLimits[uploaderLimitsIndex]

        uploaderTimeoutsIndex = userDefaults.integer(forKey: kUserDefaultsUploaderTimeoutsIndex)
        uploaderTimeoutsIndex = min(uploaderTimeoutsIndex, availableTimeouts.count - 1)
        uploaderTimeouts = availableTimeouts[uploaderTimeoutsIndex]
        
        uploaderSuppressDeletes = userDefaults.bool(forKey: kUserDefaultsUploaderSuppressDeletes)
        uploaderSimulate = userDefaults.bool(forKey: kUserDefaultsUploaderSimulate)
        includeSensitiveInfo = userDefaults.bool(forKey: kUserDefaultsUploaderIncludeSensitiveInfo)
        includeCFNetworkDiagnostics = userDefaults.bool(forKey: kUserDefaultsUploaderIncludeCFNetworkDiagnostics)
        shouldLogHealthData = userDefaults.bool(forKey: kUserDefaultsUploaderShouldLogHealthData)
        useLocalNotificationDebug = userDefaults.bool(forKey: kUserDefaultsUseLocalNotificationDebug)

        getValuesForAyncStorageKeys(keys: [kAsyncStorageApiEnvironmentKey, kAsyncStorageAuthUserKey]) { (values: [String?]) in
            // kAsyncStorageApiEnvironmentKey
            self.currentEnvironment = values[0] ?? "Production"

            // kAsyncStorageAuthUserKey
            let authUserValue = values[1] ?? ""
            let json = JSON.init(parseJSON: authUserValue)
            self.currentUserSessionToken = json["sessionToken"].string
            if self.currentUserSessionToken?.isEmpty ?? true {
                self.currentUserSessionToken = nil
            }
            self.currentUserId = json["userId"].string
            if self.currentUserId?.isEmpty ?? true {
                self.currentUserId = nil
            }
            self.currentUserFullName = json["fullName"].string
            if self.currentUserFullName?.isEmpty ?? true {
                self.currentUserFullName = nil
            }
            self.currentUserIsDSAUser = json["patient"].exists()
            
            let api = TPApi.sharedInstance
            api.environment = self.currentEnvironment
            api.sessionToken = self.currentUserSessionToken
            api.configure()

            let dataController = TPDataController.sharedInstance
            dataController.currentUserId = self.currentUserId
            dataController.currentUserFullName = self.currentUserFullName
            dataController.currentUserIsDSAUser = self.currentUserIsDSAUser
        }
    }
    
    func setUploaderLimitsIndex(_ index: NSInteger) {
        uploaderLimitsIndex = min(index, availableSamplesUploadLimits.count - 1)
        samplesUploadLimits = availableSamplesUploadLimits[uploaderLimitsIndex]
        deletesUploadLimits = availableDeletesUploadLimits[uploaderLimitsIndex]
        userDefaults.set(uploaderLimitsIndex, forKey: kUserDefaultsUploaderLimitsIndex)
    }

    func setUploaderTimeoutsIndex(_ index: NSInteger) {
        uploaderTimeoutsIndex = min(index, availableTimeouts.count - 1)
        uploaderTimeouts = availableTimeouts[uploaderTimeoutsIndex]
        userDefaults.set(uploaderTimeoutsIndex, forKey: kUserDefaultsUploaderTimeoutsIndex)
    }
    
    func setUploaderSuppressDeletes(_ suppress: Bool) {
        uploaderSuppressDeletes = suppress
        userDefaults.set(uploaderSuppressDeletes, forKey: kUserDefaultsUploaderSuppressDeletes)
    }
    
    func setUploaderSimulate(_ simulate: Bool) {
        uploaderSimulate = simulate
        userDefaults.set(uploaderSimulate, forKey: kUserDefaultsUploaderSimulate)
    }
    
    func setUploaderIncludeSensitiveInfo(_ includeSensitiveInfo: Bool) {
        self.includeSensitiveInfo = includeSensitiveInfo
        userDefaults.set(includeSensitiveInfo, forKey: kUserDefaultsUploaderIncludeSensitiveInfo)
    }
    
    func setUploaderIncludeCFNetworkDiagnostics(_ includeCFNetworkDiagnostics: Bool) {
        self.includeCFNetworkDiagnostics = includeCFNetworkDiagnostics
        userDefaults.set(includeCFNetworkDiagnostics, forKey: kUserDefaultsUploaderIncludeCFNetworkDiagnostics)
    }
    
    func setUploaderShouldLogHealthData(_ shouldLogHealthData: Bool) {
        self.shouldLogHealthData = shouldLogHealthData
        userDefaults.set(shouldLogHealthData, forKey: kUserDefaultsUploaderShouldLogHealthData)
    }
    
    func setUploaderUseLocalNotificationDebug(_ useLocalNotificaitionDebug: Bool) {
        if useLocalNotificaitionDebug {
            UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            }
        }

        self.useLocalNotificationDebug = useLocalNotificaitionDebug
        userDefaults.set(useLocalNotificationDebug, forKey: kUserDefaultsUseLocalNotificationDebug)
    }

    func getValuesForAyncStorageKeys(keys: [String], values: @escaping ([String?]) -> Void) -> Void {
        asyncStorage .multiGet(keys) { (multiGetResponsePair: [Any]?) -> Void in
            var valuesArray: [String?] = []
            if let responsePairs = multiGetResponsePair![1] as? [Any] {
                for item in responsePairs {
                    if let responsePair = item as? [Any] {
                        valuesArray.append(responsePair[1] as? String)
                    } else {
                        valuesArray.append(nil)
                    }
                }
            } else {
                valuesArray = Array<String?>(repeating: nil, count: keys.count)
            }
            values(valuesArray)
        }
    }

    func setValuesForAyncStorageKeys(keyValuePairs: [[String]]) {
        asyncStorage.multiSet(keyValuePairs)  { (_: [Any]?) -> Void in }
    }
    
    private func migrate() {
        let lastMigrationVersion = userDefaults.integer(forKey: kUserDefaultsSettingsMigrationVersionKey)
        if lastMigrationVersion == 0 {
            migrateToVersion(1)
        }
    }

    private func migrateToVersion(_ version: Int) {
        if version == 1 {
            if let legacySessionToken = UserDefaults.standard.string(forKey: kUserDefaultsLegacySessionTokenKey),
               let legacyCurrentUser = LegacyDataController.sharedInstance.currentUser,
               let legacyCurrentUserId = legacyCurrentUser.userid,
               let legacyCurrentUserUsername = legacyCurrentUser.username,
               let legacyCurrentUserFullName = legacyCurrentUser.fullName,
               let legacyCurrentUserIsDSAUser = legacyCurrentUser.accountIsDSA {
               let legacyCurrentEnvironment = UserDefaults.standard.string(forKey: kUserDefaultsLegacyCurrentEnvironmentKey) ?? "Production"
                
                // Only migrate previous session if we have all the needed properties and a valid environment
                
                if legacyCurrentEnvironment == "Development" ||
                   legacyCurrentEnvironment == "Staging" ||
                   legacyCurrentEnvironment == "Production" {

                    setValuesForAyncStorageKeys(keyValuePairs: [
                        [kAsyncStorageApiEnvironmentKey, legacyCurrentEnvironment],
                    ])

                    var jsonValue = ""
                    if legacyCurrentUserIsDSAUser.boolValue {
                        jsonValue = """
                        {
                          "username" : "\(legacyCurrentUserUsername)",
                          "userId" : "\(legacyCurrentUserId)",
                          "fullName" : "\(legacyCurrentUserFullName)",
                          "sessionToken" : "\(legacySessionToken)",
                          "patient" : {}
                        }
                        """
                    } else {
                        jsonValue = """
                        {
                          "username" : "\(legacyCurrentUserUsername)",
                          "userId" : "\(legacyCurrentUserId)",
                          "fullName" : "\(legacyCurrentUserFullName)",
                          "sessionToken" : "\(legacySessionToken)"
                        }
                        """
                    }
                    setValuesForAyncStorageKeys(keyValuePairs: [
                        [kAsyncStorageAuthUserKey, jsonValue],
                    ])

                    DDLogInfo("Migrated legacy session")
                }
            } else {
                DDLogInfo("Unable to Migrate legacy session")
            }
        }
        userDefaults.set(version, forKey: kUserDefaultsSettingsMigrationVersionKey)
        userDefaults.synchronize()
    }
}
