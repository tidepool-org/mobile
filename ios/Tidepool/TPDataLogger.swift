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
import HealthKit
import CSV

class TPDataLogger {
    static let sharedInstance = TPDataLogger()

    private init() {
        let appName = Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as! String
        let cachesDirectory = FileManager.default.urls(for:.cachesDirectory, in: .userDomainMask)[0]
        
        loggerInfoMap = [
            TPUploader.Mode.Current: [
                HKDataLogPhase.read: [
                    false: TPDataLoggerInfo(url: cachesDirectory.appendingPathComponent("\(appName)-current-read-samples.csv")),
                    true: TPDataLoggerInfo(url: cachesDirectory.appendingPathComponent("\(appName)-current-read-deletes.csv")),
                ],
                HKDataLogPhase.gather: [
                    false: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-current-gather-samples.csv")),
                    true: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-current-gather-deletes.csv")),
                ],
                HKDataLogPhase.upload: [
                    false: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-current-upload-samples.csv")),
                    true: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-current-upload-deletes.csv")),
                ]
            ],
            TPUploader.Mode.HistoricalAll: [
                HKDataLogPhase.read: [
                    false: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-historical-read-samples.csv")),
                    true: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-historical-read-deletes.csv")),
                ],
                HKDataLogPhase.gather: [
                    false: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-historical-gather-samples.csv")),
                    true: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-historical-gather-deletes.csv")),
                ],
                HKDataLogPhase.upload: [
                    false: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-historical-upload-samples.csv")),
                    true: TPDataLoggerInfo(url:cachesDirectory.appendingPathComponent("\(appName)-historical-upload-deletes.csv")),
                ]
            ],
        ]
    }

    private let dateFormatter = DateFormatter()
    private let dateFormat = "yyyy-MM-dd HH:mm:ssZ"

    private class TPDataLoggerInfo {
        init(url: URL) {
            self.url = url
        }

        var writer: CSVWriter? = nil
        var url: URL
        var needsHeaderRow = false
    }
    private var loggerInfoMap: [TPUploader.Mode: [HKDataLogPhase: [Bool: TPDataLoggerInfo]]]

    func dataLogURLs() -> [URL] {
        var urls = [URL]()
        for (_, phases) in loggerInfoMap {
            for (_, isDeletes) in phases {
                for (_, loggerInfo) in isDeletes {
                    urls.append(loggerInfo.url)
                }
            }
        }
        return urls
    }
    
    func openDataLogs(mode: TPUploader.Mode, isFresh: Bool) {
        let phases = loggerInfoMap[mode]!
        for (phase, isDeletes) in phases {
            for (isDelete, _) in isDeletes {
                openDataLog(mode: mode, phase: phase, isDelete: isDelete, isFresh: isFresh)
            }
        }
    }

    func openDataLog(mode: TPUploader.Mode, phase: HKDataLogPhase, isDelete: Bool, isFresh: Bool) {
        var writer = loggerInfoMap[mode]?[phase]?[isDelete]?.writer
        if writer == nil || isFresh {
            let url = (loggerInfoMap[mode]?[phase]?[isDelete]?.url)!
            writer = try! CSVWriter(
                stream: OutputStream(toFileAtPath: url.path, append: !isFresh)!)
            loggerInfoMap[mode]?[phase]?[isDelete]?.writer = writer
            var needsHeaderRow = isFresh
            if !isFresh {
                if let resources = try? url.resourceValues(forKeys:[.fileSizeKey]),
                   let fileSize = resources.fileSize,
                   fileSize > 0 {
                    needsHeaderRow = false
                } else {
                    needsHeaderRow = true
                }
            }
            loggerInfoMap[mode]?[phase]?[isDelete]?.needsHeaderRow = needsHeaderRow
        }
    }

    func logData(mode: TPUploader.Mode, phase: HKDataLogPhase, isRetry: Bool, samples: [[String: AnyObject]]?, deletes: [[String: AnyObject]]?) {
        let logDateString = dateFormatter.isoStringFromDate(Date(), zone: TimeZone.current, dateFormat: dateFormat)

        let iso8601dateZuluDateFormatter = DateFormatter()
        iso8601dateZuluDateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        iso8601dateZuluDateFormatter.timeZone = TimeZone(secondsFromGMT: 0)

        if let samples = samples, samples.count > 0 {
            let writer = prepareWriter(mode: mode, phase: phase, isDelete: false)
            for sample in samples {
                let uuidString = sample["origin"]!["id"] as! String
                var type = ""
                var value = 0.0
                let uploaderSampleType = sample["type"] as! String
                if uploaderSampleType == "cbg" || type == "smbg" {
                    type = "BloodGlucose"
                    value = sample["value"] as! Double
                } else if uploaderSampleType == "food" {
                    type = "DietaryCarbohydrates"
                    value = (sample["nutrition"]!["carbohydrate"] as! [String:Any])["net"] as! Double
                } else if uploaderSampleType == "basal" {
                    type = "InsulinDelivery"
                    value = sample["duration"] as! Double
                } else if uploaderSampleType == "bolus" {
                    type = "InsulinDelivery"
                    value = sample["normal"] as! Double
                } else if uploaderSampleType == "physicalActivity" {
                    type = "Workout"
                    value = sample["duration"] != nil ? sample["duration"]!["value"] as! Double : 0
                    if value == 0 {
                        value = sample["distance"] != nil ? sample["distance"]!["value"] as! Double : 0
                    }
                    if value == 0 {
                        value = sample["energy"] != nil ? sample["energy"]!["value"] as! Double : 0
                    }
                }
                
                let startDate = iso8601dateZuluDateFormatter.date(from: sample["time"] as! String)
                let startDateString = dateFormatter.isoStringFromDate(startDate!, zone: TimeZone.current, dateFormat: dateFormat)
                
                try! writer.write(row: [
                        logDateString,
                        uuidString,
                        type,
                        startDateString,
                        value.description,
                        isRetry.description,
                    ])
            }
        }

        if let deletes = deletes, deletes.count > 0 {
            let writer = prepareWriter(mode: mode, phase: phase, isDelete: true)
            for delete in deletes {
                let uuidString = delete["origin"]!["id"] as! String
                logData(writer: writer, logDateString: logDateString, uuidString: uuidString, isRetry: isRetry)
            }
        }
    }
        
    func logData(mode: TPUploader.Mode, phase: HKDataLogPhase, isRetry: Bool, samples: [HKSample]?, deletes: [HKDeletedObject]?) {
        let logDateString = dateFormatter.isoStringFromDate(Date(), zone: TimeZone.current, dateFormat: dateFormat)

        if let samples = samples, samples.count > 0 {
            let writer = prepareWriter(mode: mode, phase: phase, isDelete: false)
            for sample in samples {
                logData(writer: writer, logDateString: logDateString, sample: sample, isRetry: isRetry)
            }
        }

        if let deletes = deletes, deletes.count > 0 {
            let writer = prepareWriter(mode: mode, phase: phase, isDelete: true)
            for delete in deletes {
                logData(writer: writer, logDateString: logDateString, uuidString: delete.uuid.uuidString, isRetry: isRetry)
            }
        }
    }
    
    func logData(writer: CSVWriter, logDateString: String, sample: HKSample, isRetry: Bool) {
        var value: Double = 0
        var unitString: String = ""
        var sampleTypeString = sample.sampleType.identifier
        if let workout = sample as? HKWorkout {
            value = workout.duration
        } else if let quantitySample = sample as? HKQuantitySample {
            if sampleTypeString == HKQuantityTypeIdentifier.bloodGlucose.rawValue {
                unitString = "mg/dL"
                let unit = HKUnit(from: unitString)
                value = quantitySample.quantity.doubleValue(for: unit)
            } else if sampleTypeString == HKQuantityTypeIdentifier.dietaryCarbohydrates.rawValue {
                unitString = "g"
                let unit = HKUnit(from: unitString)
                value = quantitySample.quantity.doubleValue(for: unit)
            } else if sampleTypeString == HKQuantityTypeIdentifier.insulinDelivery.rawValue {
                let unit = HKUnit.internationalUnit()
                unitString = unit.unitString
                value = quantitySample.quantity.doubleValue(for: unit)
            }
        }

        // Simplify sampleType before writing
        sampleTypeString = sampleTypeString.replacingOccurrences(of: "HK", with: "")
        sampleTypeString = sampleTypeString.replacingOccurrences(of: "Quantity", with: "")
        sampleTypeString = sampleTypeString.replacingOccurrences(of: "TypeIdentifier", with: "")
        
        try! writer.write(row: [
                logDateString,
                sample.uuid.uuidString,
                sampleTypeString,
                dateFormatter.isoStringFromDate(sample.startDate, zone: TimeZone.current, dateFormat: dateFormat),
                value.description,
                isRetry.description,
            ])
    }

    func logData(writer: CSVWriter, logDateString: String, uuidString: String, isRetry: Bool) {
        try! writer.write(row: [
            logDateString,
            uuidString,
            isRetry.description])
    }
    
    func prepareWriter(mode: TPUploader.Mode, phase: HKDataLogPhase, isDelete: Bool) -> CSVWriter {
        let writer = (loggerInfoMap[mode]?[phase]?[isDelete]?.writer)!
        let needsHeaderRow = (loggerInfoMap[mode]?[phase]?[isDelete]?.needsHeaderRow)!
        if needsHeaderRow {
            if isDelete {
                try! writer.write(row: [
                    "logDate",
                    "uuid",
                    "retry"
                ])
            } else {
                // newWriter!.
                try! writer.write(row: [
                    "logDate",
                    "uuid",
                    "type",
                    "startDate",
                    "value",
                    "retry"
                ])
            }
            
            loggerInfoMap[mode]?[phase]?[isDelete]?.needsHeaderRow = false
        }
        
        return writer
    }
}
