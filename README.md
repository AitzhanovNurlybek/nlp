# Medical triage NLP

Classifies a patient's complaint (Russian, Kazakh, mixed) by **urgency** and **specialist**. No diagnosis — by design.

## Files
| File | What |
|---|---|
| `triage_project.ipynb` | Main notebook: preprocessing, models, evaluation |
| `triage_dataset.csv` / `triage_holdout.csv` | Dataset and holdout set (read by relative path) |
| `data_real/*.jsonl` | Real-data train/dev/test split |
| `embeddings_e5_small.npz` | Precomputed e5-small embeddings |
| `scripts/` | Data generation, merging, NER gold, embedding experiments, deck builder |
| `triage_project_final.pptx` | Presentation (14 slides) |
| `backup_deck_short_2026-11-09.pptx` | Short backup deck |
| `DEFENCE_EN.md` | Defence script |

## Run
```bash
pip install -r requirements.txt
jupyter notebook triage_project.ipynb
```
