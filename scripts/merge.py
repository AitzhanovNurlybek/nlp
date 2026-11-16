# -*- coding: utf-8 -*-
"""Merge the Kazakh / code-switched slices into the two dataset files."""
import pandas as pd

BASE = "C:/Users/aitzh/OneDrive/Desktop/уроки/nlp/triage_project/"

train = pd.read_csv(BASE + "triage_dataset.csv")
hold = pd.read_csv(BASE + "triage_holdout.csv")
kk = pd.read_csv("kk_part.csv")
kkh = pd.read_csv("kk_holdout_part.csv")

# existing rows are all Russian; their phrase template was never recorded
for frame in (train, hold):
    frame["lang"] = "ru"
    frame["template"] = ""

cols = ["text", "urgency", "specialist", "source", "lang", "template"]
train_out = pd.concat([train[cols], kk[cols]], ignore_index=True)
hold_out = pd.concat([hold[cols], kkh[cols]], ignore_index=True)

# safety checks before anything is written
dups_train = train_out.text.duplicated().sum()
dups_hold = hold_out.text.duplicated().sum()
overlap = len(set(train_out.text) & set(hold_out.text))
print(f"train {train_out.shape}  holdout {hold_out.shape}")
print(f"duplicate texts — train: {dups_train}, holdout: {dups_hold}")
print(f"train/holdout overlap: {overlap}")
assert overlap == 0, "holdout must stay unseen"
train_out = train_out.drop_duplicates(subset=["text"]).reset_index(drop=True)
hold_out = hold_out.drop_duplicates(subset=["text"]).reset_index(drop=True)

print("\ntrain by language:")
print(train_out.groupby(["lang", "urgency"]).size().to_string())
print("\nholdout by language:")
print(hold_out.groupby(["lang", "urgency"]).size().to_string())
print("\ntrain sources:")
print(train_out["source"].value_counts().to_string())

train_out.to_csv(BASE + "triage_dataset.csv", index=False, encoding="utf-8")
hold_out.to_csv(BASE + "triage_holdout.csv", index=False, encoding="utf-8")
print(f"\nwritten: {len(train_out)} train rows, {len(hold_out)} holdout rows")
