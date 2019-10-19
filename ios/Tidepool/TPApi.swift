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

import Alamofire
import CocoaLumberjack
import CoreData
import Foundation
import UIKit
import SwiftyJSON

/// TPApi is a singleton object with the main responsibility of communicating to the Tidepool service:
/// - Given a username and password, login.
/// - Can refresh connection.
/// - Fetches Tidepool data.
/// - Provides online/offline status.
class TPApi {
    static let sharedInstance = TPApi()
    
    var sessionToken: String?
    var environment: String?
    private(set) var baseUrlString: String?

    // Reachability object, valid during lifetime of this TPApi, and convenience function that uses this
    // Register for ReachabilityChangedNotification to monitor reachability changes             
    var reachability: Reachability?
    func isConnectedToNetwork() -> Bool {
        if let reachability = reachability {
            return reachability.isReachable
        } else {
            DDLogError("Reachability object not configured!")
            return true
        }
    }

    func serviceAvailable() -> Bool {
        if !isConnectedToNetwork() || sessionToken == nil {
            return false
        }
        return true
    }

    // MARK: Initialization
    
    /// Creator of TPApi must call this function after init!
    func configure() -> Void {
        self.baseUrlString = kServers[self.environment!]!
        self.baseUrl = URL(string: self.baseUrlString!)!
        DDLogInfo("Using service: \(String(describing: self.baseUrl))")
        if let reachability = reachability {
            reachability.stopNotifier()
        }
        self.reachability = Reachability()
        
        do {
           try reachability?.startNotifier()
        } catch {
            DDLogError("Unable to start notifier!")
        }
    }
    
    deinit {
        reachability?.stopNotifier()
    }
    
    // TODO: health - need to be able to do this when app is launched in background as well?
    // TODO: health - test this
    func refreshToken(_ completion: @escaping (_ succeeded: Bool, _ responseStatusCode: Int) -> (Void)) {
        
        let endpoint = "/auth/login"
        
        if self.sessionToken == nil || TPDataController.sharedInstance.currentUserId == nil {
            // We don't have a session token to refresh.
            completion(false, 0)
            return
        }
        
        // Post the request.
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.sendRequest(.get, endpoint:endpoint).responseJSON { response in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            if ( response.result.isSuccess ) {
                DDLogInfo("Session token updated")
                self.sessionToken = response.response!.allHeaderFields[self.kSessionTokenResponseId] as! String? // TODO: health - need to store in AsyncStorage so JavaScript gets it too!
                completion(true, response.response?.statusCode ?? 0)
            } else {
                if let error = response.result.error {
                    let message = "Refresh token failed, error: \(error)"
                    DDLogError(message)
                    // TODO: handle network offline!
                }
                completion(false, response.response?.statusCode ?? 0)
            }
        }
    }
    
    // MARK: - Internal

    // User-agent string, based on that from Alamofire, but common regardless of whether Alamofire library is used
    private func userAgentString() -> String {
        if _userAgentString == nil {
            _userAgentString = {
                if let info = Bundle.main.infoDictionary {
                    let executable = info[kCFBundleExecutableKey as String] as? String ?? "Unknown"
                    let bundle = info[kCFBundleIdentifierKey as String] as? String ?? "Unknown"
                    let appVersion = info["CFBundleShortVersionString"] as? String ?? "Unknown"
                    let appBuild = info[kCFBundleVersionKey as String] as? String ?? "Unknown"
                    
                    let osNameVersion: String = {
                        let version = ProcessInfo.processInfo.operatingSystemVersion
                        let versionString = "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)"
                        
                        let osName: String = {
                            #if os(iOS)
                            return "iOS"
                            #elseif os(watchOS)
                            return "watchOS"
                            #elseif os(tvOS)
                            return "tvOS"
                            #elseif os(macOS)
                            return "OS X"
                            #elseif os(Linux)
                            return "Linux"
                            #else
                            return "Unknown"
                            #endif
                        }()
                        
                        return "\(osName) \(versionString)"
                    }()
                    
                    return "\(executable)/\(appVersion) (\(bundle); build:\(appBuild); \(osNameVersion))"
                }
                
                return "TidepoolMobile"
            }()
        }
        return _userAgentString!
    }
    private var _userAgentString: String?
    
    private func sessionManager() -> SessionManager {
        if _sessionManager == nil {
            // get the default headers
            var alamoHeaders = Alamofire.SessionManager.defaultHTTPHeaders
            // add our custom user-agent
            alamoHeaders["User-Agent"] = self.userAgentString()
            // create a custom session configuration
            let configuration = URLSessionConfiguration.default
            // add the headers
            configuration.httpAdditionalHeaders = alamoHeaders
            // create a session manager with the configuration
            _sessionManager = Alamofire.SessionManager(configuration: configuration)
        }
        return _sessionManager!
    }
    private var _sessionManager: SessionManager?
    
    // Sends a request to the specified endpoint
    private func sendRequest(_ requestType: HTTPMethod? = .get,
        endpoint: (String),
        parameters: [String: AnyObject]? = nil,
        headers: [String: String]? = nil) -> (DataRequest)
    {
        let url = baseUrl!.appendingPathComponent(endpoint)
        
        // Get our API headers (the session token) and add any headers supplied by the caller
        var apiHeaders = getApiHeaders()
        if ( apiHeaders != nil ) {
            if ( headers != nil ) {
                for(k, v) in headers! {
                    _ = apiHeaders?.updateValue(v, forKey: k)
                }
            }
        } else {
            // We have no headers of our own to use- just use the caller's directly
            apiHeaders = headers
        }
        
        // Fire off the network request
        DDLogInfo("sendRequest url: \(url), params: \(parameters ?? [:]), headers: \(apiHeaders ?? [:])")
        return self.sessionManager().request(url, method: requestType!, parameters: parameters, headers: apiHeaders).validate()
        //debugPrint(result)
        //return result
    }
    
    func getApiHeaders() -> [String: String]? {
        if ( sessionToken != nil ) {
            return [kSessionTokenHeaderId : sessionToken!]
        }
        return nil
    }
    
    private let kSessionTokenHeaderId = "X-Tidepool-Session-Token"
    private let kSessionTokenResponseId = "x-tidepool-session-token"
    private let kServers = [
        "Development" :  "https://qa1.development.tidepool.org",
        "Staging" :      "https://qa2.development.tidepool.org",
        "Integration" :  "https://int-api.tidepool.org",
        "Production" :   "https://api.tidepool.org"
    ]
    private var baseUrl: URL?
 }
