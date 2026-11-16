# -*- coding: utf-8 -*-
"""Do multilingual sentence embeddings beat character n-grams on this task?

The dictionary ceiling found in the NER evaluation motivates the question: a
surface-form model cannot match a word it has never seen, and the external
holdout is written specifically in unseen words. An encoder that represents
meaning should, in principle, not care.
"""
import time
import numpy as np
import pandas as pd
import nbformat
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.metrics import f1_score, recall_score

B = "C:/Users/aitzh/OneDrive/Desktop/уроки/nlp/triage_project/"
NB = B + "triage_project.ipynb"
MODEL = "intfloat/multilingual-e5-small"   # XLM-R based, covers Kazakh

nb = nbformat.read(NB, as_version=4)
ns = {"__name__": "__nb__"}
for i in [2, 3, 7, 9]:
    exec(compile(nb.cells[i].source, f"cell{i}", "exec"), ns)

train_df, val_df, test_df = ns["train_df"], ns["val_df"], ns["test_df"]
external = ns["external"]

from sentence_transformers import SentenceTransformer

print("loading", MODEL, flush=True)
t0 = time.time()
model = SentenceTransformer(MODEL)
print(f"loaded in {time.time()-t0:.0f}s", flush=True)


def enc(texts, tag):
    t = time.time()
    # e5 models expect this prefix on plain passages
    v = model.encode(["query: " + x for x in texts], batch_size=64,
                     show_progress_bar=False, normalize_embeddings=True)
    print(f"  encoded {tag}: {len(texts)} rows in {time.time()-t:.0f}s", flush=True)
    return v


E = {}
for name, frame in [("train", train_df), ("val", val_df),
                    ("test", test_df), ("external", external)]:
    E[name] = enc(list(frame["text"]), name)

np.savez_compressed(B + "embeddings_e5_small.npz",
                    train=E["train"], val=E["val"],
                    test=E["test"], external=E["external"])
print("cache written", flush=True)

# ---------------------------------------------------------------- urgency
res = []
clf = LogisticRegression(C=2.0, max_iter=3000, class_weight="balanced")
clf.fit(E["train"], train_df["urgency"])
for name, frame, X in [("validation", val_df, E["val"]),
                       ("test", test_df, E["test"]),
                       ("external", external, E["external"])]:
    p = clf.predict(X)
    res.append({"task": "urgency", "set": name,
                "f1_macro": round(f1_score(frame["urgency"], p, average="macro"), 3),
                "recall_emergency": round(recall_score(frame["urgency"], p,
                                          labels=["emergency"], average="macro"), 3)})

# ---------------------------------------------------------------- specialist
mask_tr = (train_df["urgency"] != "emergency").values
spec = LinearSVC(C=0.5, class_weight="balanced")
spec.fit(E["train"][mask_tr], train_df.loc[train_df["urgency"] != "emergency", "specialist"])
for name, frame, X in [("validation", val_df, E["val"]),
                       ("test", test_df, E["test"]),
                       ("external", external, E["external"])]:
    m = (frame["urgency"] != "emergency").values
    p = spec.predict(X[m])
    res.append({"task": "specialist", "set": name,
                "f1_macro": round(f1_score(frame.loc[m, "specialist"], p, average="macro"), 3),
                "recall_emergency": float("nan")})

print()
print(pd.DataFrame(res).to_string(index=False))

# per-language on the external set, where the question actually matters
print()
rows = []
for lang in ["ru", "kk", "mixed"]:
    m = (external["lang"] == lang).values
    p = clf.predict(E["external"][m])
    rows.append({"lang": lang, "n": int(m.sum()),
                 "urgency f1": round(f1_score(external.loc[m, "urgency"], p, average="macro"), 3)})
print(pd.DataFrame(rows).to_string(index=False))
