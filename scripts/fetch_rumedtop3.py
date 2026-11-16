# -*- coding: utf-8 -*-
"""Download RuMedTop3 (real patient complaints, Apache-2.0) into data_real/."""
import os
import urllib.request

BASE = ("https://raw.githubusercontent.com/sb-ai-lab/MedBench/"
        "main/data/RuMedTop3/")
OUT = "data_real"

os.makedirs(OUT, exist_ok=True)
for name in ["train_v1.jsonl", "dev_v1.jsonl", "test_v1.jsonl"]:
    req = urllib.request.Request(BASE + name, headers={"User-Agent": "curl/8"})
    data = urllib.request.urlopen(req, timeout=60).read()
    with open(os.path.join(OUT, name), "wb") as fh:
        fh.write(data)
    print(f"{name}: {len(data)} bytes")
print("done — run from the project folder")
