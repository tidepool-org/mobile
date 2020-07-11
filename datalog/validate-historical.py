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
import progressbar
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

hk_export_file_df = pd.read_csv(hk_export_file, usecols=["type", "startDate"])
tidepool_file_df = pd.read_csv(tidepool_file, usecols=["type", "startDate"])

item_count = 0
with progressbar.ProgressBar(widgets=[
            "Preprocessing hk file: ",
            progressbar.Counter(format='%(value)02d/%(max_value)d'),
            " ",
            progressbar.Percentage(),
            " ",
            progressbar.AdaptiveETA(),
            " ",
            progressbar.Bar()
        ],
        max_value=len(hk_export_file_df),
        redirect_stdout=True) as bar:
    timestamps = []
    for item in hk_export_file_df.itertuples():
        item_count += 1
        bar.update(item_count)
        if not isinstance(item.type, str) or len(item.type) == 0:
            timestamps.append(0)
            continue
        try:
            timestamp = datetime.strptime(item.startDate, "%Y-%m-%d %H:%M:%S %z").timestamp()
        except:
            try:
                timestamp = datetime.strptime(item.startDate, "%Y-%m-%d %H:%M:%S%z").timestamp()
            except:
                timestamps.append(0)
                continue
        timestamps.append(timestamp)
    labels = list(hk_export_file_df)
    hk_export_file_df["timestamp"] = timestamps
    labels.append("timestamp")
    hk_export_file_df = hk_export_file_df.reindex(labels=labels, axis='columns')
    hk_export_file_df.sort_values(by='timestamp', ascending=True, inplace=True)

item_count = 0
with progressbar.ProgressBar(widgets=[
            "Preprocessing tp file: ",
            progressbar.Counter(format='%(value)02d/%(max_value)d'),
            " ",
            progressbar.Percentage(),
            " ",
            progressbar.AdaptiveETA(),
            " ",
            progressbar.Bar()
        ],
        max_value=len(tidepool_file_df),
        redirect_stdout=True) as bar:
    timestamps = []
    for item in tidepool_file_df.itertuples():
        item_count += 1
        bar.update(item_count)
        if not isinstance(item.type, str) or len(item.type) == 0:
            timestamps.append(0)
            continue
        try:
            timestamp = datetime.strptime(item.startDate, "%Y-%m-%d %H:%M:%S%z").timestamp()
        except:
            timestamp = datetime.strptime(item.startDate, "%Y-%m-%d %H:%M:%S %z").timestamp()
        timestamps.append(timestamp)
    labels = list(tidepool_file_df)
    tidepool_file_df["timestamp"] = timestamps
    labels.append("timestamp")
    tidepool_file_df = tidepool_file_df.reindex(labels=labels, axis='columns')
    tidepool_file_df.sort_values(by='timestamp', ascending=True, inplace=True)

items_not_found_count = 0
item_count = 0
with progressbar.ProgressBar(widgets=[
            "Validating tp file: ",
            progressbar.Counter(format='%(value)02d/%(max_value)d'),
            " ",
            progressbar.Percentage(),
            " ",
            progressbar.AdaptiveETA(),
            " ",
            progressbar.Bar()
        ],
        max_value=len(hk_export_file_df),
        redirect_stdout=True) as bar:
    tidepool_file_df_start_row = 0
    tidepool_file_df_next_row = 0
    for hk_export_file_item in hk_export_file_df.itertuples():
        item_count += 1
        bar.update(item_count)
        if hk_export_file_item.timestamp == 0:
            continue
        # TODO: Also add support for Workout (workoutActivityType in HK export)
        if (hk_export_file_item.type == "DietaryCarbohydrates" or
            hk_export_file_item.type == "InsulinDelivery" or
            hk_export_file_item.type == "BloodGlucose"):
            hk_export_file_item_exists_in_tidepool_file = False
            for tidepool_file_item in tidepool_file_df.iloc[tidepool_file_df_start_row:].itertuples():
                if tidepool_file_item.timestamp < hk_export_file_item.timestamp:
                    tidepool_file_df_next_row += 1
                    continue
                if (tidepool_file_item.timestamp == hk_export_file_item.timestamp and
                    tidepool_file_item.type == hk_export_file_item.type):
                    hk_export_file_item_exists_in_tidepool_file = True
                    break
            tidepool_file_df_start_row = tidepool_file_df_next_row
            if not hk_export_file_item_exists_in_tidepool_file:
                items_not_found_count += 1
                print(f"HK export item not found in Tidepool phase: {hk_export_file_item}")

if items_not_found_count > 0:
    print(f"ERROR: {items_not_found_count} items not found, out of {item_count} items")
else:
    print(f"Success! All items found, out of {item_count} items")
