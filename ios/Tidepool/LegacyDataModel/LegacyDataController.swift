/*
* Copyright (c) 2020, Tidepool Project
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

// NOTE: This is adapted from 2.x TidepoolMobile just to provide access to legacy db data we need for migration

import CocoaLumberjack
import CoreData

class LegacyDataController: NSObject
{
    static let sharedInstance = LegacyDataController()

    private var _currentUser: User?
    var currentUser: User? {
        get {
            if _currentUser == nil {
                if let user = self.getUser() {
                    _currentUser = user
                }
            }
            return _currentUser
        }
    }

    private func getUser() -> User? {
        let moc = self.mocForLocalObjects!
        let request = NSFetchRequest<NSFetchRequestResult>(entityName: "User")
        do {
            if let results = try moc.fetch(request) as? [User] {
                if results.count > 0 {
                    return results[0]
                }
            }
        } catch let error as NSError {
            DDLogInfo("Error fetching legacy user: \(error)")
        }
        return nil
    }
    
    private var _mocForLocalObjects: NSManagedObjectContext?
    private var mocForLocalObjects: NSManagedObjectContext? {
        get {
            if _mocForLocalObjects == nil {
                let coordinator = self.pscForLocalObjects
                let managedObjectContext = NSManagedObjectContext(concurrencyType: .mainQueueConcurrencyType)
                managedObjectContext.persistentStoreCoordinator = coordinator
                _mocForLocalObjects = managedObjectContext
                
            }
            return _mocForLocalObjects!
        }
    }
    
    private let kLocalObjectsStoreFilename = "SingleViewCoreData.sqlite"
    private var _pscForLocalObjects: NSPersistentStoreCoordinator?
    private var pscForLocalObjects: NSPersistentStoreCoordinator? {
        get {
            if _pscForLocalObjects == nil {
                do {
                    try _pscForLocalObjects = createPSC(kLocalObjectsStoreFilename)
                } catch {
                    _pscForLocalObjects = nil
                }
            }
            return _pscForLocalObjects
        }
    }
    
    private func createPSC(_ storeBaseFileName: String) throws -> NSPersistentStoreCoordinator  {
        let coordinator = NSPersistentStoreCoordinator(managedObjectModel: self.managedObjectModel)
        let applicationDocumentsDirectory: URL = {
            let urls = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
            return urls[urls.count-1]
        }()
        var url = applicationDocumentsDirectory
        url = url.appendingPathComponent(storeBaseFileName)
        let pscOptions = [NSMigratePersistentStoresAutomaticallyOption: true, NSInferMappingModelAutomaticallyOption: true]
        do {
            try coordinator.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: url, options: pscOptions)
        } catch {
            throw(error)
        }
        return coordinator
    }
        
    private var _managedObjectModel: NSManagedObjectModel?
    private var managedObjectModel: NSManagedObjectModel {
        get {
            if _managedObjectModel == nil {
                let modelURL = Bundle.main.url(forResource: "Tidepool", withExtension: "momd")!
                _managedObjectModel = NSManagedObjectModel(contentsOf: modelURL)!
            }
            return _managedObjectModel!
        }
        set {
            _managedObjectModel = nil
        }
    }
}
