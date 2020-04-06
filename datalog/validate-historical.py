#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Validator to validate that read, gather, and upload phases of historical upload contain all the samples
for all the Tidepool upload types from HealthKit data export (from apple_health_xml_convert.py)
==============================
:File: validate-historical.py
:Description: Validate that all HealthKit samples are read, gathered, and uploaded to Tidepool backend
"""

import argparse
from datetime import datetime
import pandas as pd
import time

parser = argparse.ArgumentParser(
    description="Validate that read, gather, and upload phases of historical upload contain all the samples for all the Tidepool upload types from HealthKit data export (from apple_health_xml_convert.py)"
)
parser.add_argument("--tp",
    type = str,
    required = True,
    help="CSV file for historical phase (read, gather, or upload)")
parser.add_argument("--hk",
    type = str,
    required = True,
    help = "CSV file for HealthKit data export")
args=parser.parse_args()
tidepool_file = args.tp
hk_export_file = args.hk

start_time = time.time()
item_count = 0
items_not_found_count = 0
hk_export_file_df = pd.read_csv(hk_export_file, usecols=["type", "startDate"])
tidepool_file_df = pd.read_csv(tidepool_file, usecols=["type", "startDate"])

for hk_export_file_item in hk_export_file_df.itertuples():
    item_count += 1
    # TODO: Also add support for Workout (workoutActivityType in HK export)
    if (hk_export_file_item.type == "DietaryCarbohydrates" or
        hk_export_file_item.type == "InsulinDelivery" or
        hk_export_file_item.type == "BloodGlucose"):
        hk_export_file_item_exists_in_tidepool_file = False
        exported_file_item_start_date = datetime.strptime(hk_export_file_item.startDate, "%Y-%m-%d %H:%M:%S %z")
        for tidepool_file_item in tidepool_file_df.itertuples():
            tidepool_file_item_start_date = datetime.strptime(tidepool_file_item.startDate, "%Y-%m-%d %H:%M:%S%z")
            if (tidepool_file_item_start_date.timestamp() == exported_file_item_start_date.timestamp() and
                tidepool_file_item.type == hk_export_file_item.type):
                hk_export_file_item_exists_in_tidepool_file = True
                break
        if not hk_export_file_item_exists_in_tidepool_file:
            items_not_found_count += 1
            print("HK export item not found in Tidepool phase: ", hk_export_file_item)

if items_not_found_count > 0:
    print("ERROR: %d items not found" % items_not_found_count)
else:
    print("Success! All items found")
print("Finished in %s seconds" % int(time.time() - start_time))