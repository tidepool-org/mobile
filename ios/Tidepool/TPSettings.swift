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

let kAsyncStorageApiEnvironmentKey = "API_ENVIRONMENT_KEY"
let kAsyncStorageAuthUserKey = "AUTH_USER_KEY"

class TPSettings {
    static let sharedInstance = TPSettings()

    var currentEnvironment: String?
    var currentUserSessionToken: String?
    var currentUserId: String?
    var currentUserFullName: String?
    var currentUserIsDSAUser: Bool = false

    private let userDefaults: UserDefaults
    private let asyncStorage: RCTAsyncLocalStorage

    init() {
        userDefaults = UserDefaults.standard

        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let asyncLocalStorageUrl = documentsDirectory.appendingPathComponent("RCTAsyncLocalStorage", isDirectory: true)
        asyncStorage = RCTAsyncLocalStorage(storageDirectory: asyncLocalStorageUrl.path)!
    }

    func loadSettings() {
        // TODO: health - deal with refresh token in native vs JS. native starts first using cached session token, but, if it's invalid / needs refreshed, requests will fail. we should restart those automatically when we get a refreshed token from JS via setUser, though, right? Confirm that

        // migrateLegacySettings(); // TODO: health - upgrade - we should consider enabling this so that upgrade from 2.x will preserve session token and other settings

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
            dataController.configureHealthKitInterface()
        }
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

    private func getValuesForAyncStorageKeys(keys: [String], values: @escaping ([String?]) -> Void) -> Void {
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

    private func setValuesForAyncStorageKeys(keyValuePairs: [[String]]) {
        asyncStorage.multiSet(keyValuePairs)  { (_: [Any]?) -> Void in }
    }
}
