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
import SwiftyJSON
import TPHealthKitUploader

let kUserDefaultsLastLegacySettingsMigrationVersionKey = "LastLegacySettingsMigrationVersionKey"
let kUserDefaultsSessionTokenKey = "SToken"
let kUserDefaultsCurrentEnvironmentKey = "SCurrentService"
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

let kAsyncStorageApiEnvironmentKey = "API_ENVIRONMENT_KEY"
let kAsyncStorageAuthUserKey = "AUTH_USER_KEY"

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

    var uploaderTimeoutsIndex: Int = 0
    var uploaderTimeouts: [Int] = []

    private let userDefaults: UserDefaults
    private let asyncStorage: RCTAsyncLocalStorage
    
    private let availableSamplesUploadLimits = [
                    [2000, 1000, 500, 250],
                    [500, 100, 50, 10],
                    [100, 50, 25, 5]]
    private let availableDeletesUploadLimits = [
                    [100, 50, 10, 1],
                    [50, 5, 1, 1],
                    [5, 1, 1, 1]]
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
        // migrateLegacySettings(); // TODO: upgrade - we should consider enabling this so that upgrade from 2.x will preserve session token and other settings

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
    
    private func migrateLegacySettings() {
        let lastMigrationVersion = userDefaults.integer(forKey: kUserDefaultsLastLegacySettingsMigrationVersionKey)
        if lastMigrationVersion == 0 {
            migrateLegacySettingsToVersion(1)
        }
    }

    private func migrateLegacySettingsToVersion(_ version: Int) {
        if version == 1 {
            var currentEnvironment = UserDefaults.standard.string(forKey: kUserDefaultsCurrentEnvironmentKey)
            if currentEnvironment?.isEmpty ?? true {
                currentEnvironment = "Production"
            }
            setValuesForAyncStorageKeys(keyValuePairs: [
                [kAsyncStorageApiEnvironmentKey, currentEnvironment!],
            ])

            userDefaults.set(version, forKey: kUserDefaultsLastLegacySettingsMigrationVersionKey)
            userDefaults.synchronize()
        }
    }
}
