# -*- coding: utf-8 -*-
"""Kazakh / code-switched holdout: the same situations, deliberately other words.

Nothing here reuses a phrase from gen_kk.py — that is the whole point of the file.
"""
import random
import pandas as pd

random.seed(7)

HOLD = {
    "кардиолог": [
        ("жүрегім шаншиды", "urgent"),
        ("қан қысымым тұрақсыз", "urgent"),
        ("кеудем қысылады", "urgent"),
        ("жүрек соғысы жиілеп кетті", "urgent"),
        ("тамыр соғысын өлшетсем деп едім", "routine"),
        ("жүрек бойынша профилактика керек", "routine"),
    ],
    "невролог": [
        ("шекем шаншиды", "urgent"),
        ("басым зеңіп тұр", "urgent"),
        ("аяғым ұйиды", "urgent"),
        ("желкем ауырады", "urgent"),
        ("ұйқысыздыққа кеңес алсам деп едім", "routine"),
    ],
    "гастроэнтеролог": [
        ("асқазаным ашиды", "urgent"),
        ("лоқсып тұрмын", "urgent"),
        ("ішім бұрап ауырады", "urgent"),
        ("тамақ сіңбейді", "urgent"),
        ("ас мәзірі бойынша кеңес керек", "routine"),
    ],
    "дерматолог": [
        ("денемде қызыл дақтар пайда болды", "urgent"),
        ("терім құрғап кетті", "urgent"),
        ("білегім қышып, тырналып қалды", "urgent"),
        ("теріні қарату керек пе деп едім", "routine"),
    ],
    "ЛОР": [
        ("жұтқыншағым ауырсынады", "urgent"),
        ("құлағым шуылдайды", "urgent"),
        ("танауым бітеулі", "urgent"),
        ("дауысым шықпай қалды", "urgent"),
        ("құлақты қарату керек пе деп сұрайын дедім", "routine"),
    ],
    "терапевт": [
        ("ыстығым бар", "urgent"),
        ("жөтелден тынышым кетті", "urgent"),
        ("дәрменсізбін", "urgent"),
        ("буын-буыным сырқырайды", "urgent"),
        ("медициналық тексеруден өтсем деп едім", "routine"),
        ("еңбекке жарамдылық қағазы керек", "routine"),
    ],
}

HOLD_EMERGENCY = [
    "дем ала алмай қалды",
    "құлап түсіп, қимылсыз жатыр",
    "кеудесі қысылып, бозарып кетті",
    "қаны тыйылмай тұр",
    "сөзі күрмеліп, бір жағы қимылдамайды",
    "денесі тартылып, құрысып қалды",
    "улы зат жұтып қойған сияқты",
    "отқа күйіп, терісі сыдырылды",
    "баласы суға батып қалды",
    "қатты соғылып, есі кіресілі-шығасылы",
]

HELLO = ["Ассалаумағалейкум", "Сәлем", "Кешірерсіз", "Сұрағым бар еді", "Қайырлы таң"]
BYE = ["Көмектессеңіз", "Қайда баруым керек?", "Кеңесіңіз қажет", "Жауап берсеңіз"]
BYE_EM = ["Жедел көмек керек!", "Тезірек!", "Не істерімізді білмей тұрмыз"]
DUR = ["екі күннен бері", "төртінші күн", "үш аптадан бері",
       "өткен аптадан бері", "түннен бері", "ай бойы"]

RU_HOLD = {
    "кардиолог": [("пульс частит", "urgent"), ("хочу проверить давление", "routine")],
    "невролог": [("виски ломит", "urgent"), ("плохо сплю, нужен совет", "routine")],
    "гастроэнтеролог": [("мутит после еды", "urgent"), ("вопрос по диете", "routine")],
    "дерматолог": [("кожа шелушится", "urgent"), ("осмотр кожи плановый", "routine")],
    "ЛОР": [("в ухе шумит", "urgent"), ("плановая проверка слуха", "routine")],
    "терапевт": [("знобит весь день", "urgent"), ("нужно пройти медосмотр", "routine")],
}
RU_HOLD_EM = ["перестал дышать", "упал и не встаёт", "кровь хлещет", "речь пропала"]


def assemble(core, hello, bye, dur, p_dur=0.4):
    parts = []
    if random.random() < 0.5:
        parts.append(random.choice(hello) + ",")
    text = core
    if dur and random.random() < p_dur:
        text = (random.choice(dur) + " " + text) if random.random() < 0.5 \
            else (text + " " + random.choice(dur))
    parts.append(text)
    if random.random() < 0.45:
        parts.append(random.choice(bye))
    out = " ".join(parts).strip()
    return out.lower().rstrip(".") if random.random() < 0.12 else out


rows = []
for spec, bank in HOLD.items():
    for core, urg in bank:
        for _ in range(4):
            rows.append({"text": assemble(core, HELLO, BYE, DUR), "urgency": urg,
                         "specialist": spec, "source": "kk_holdout", "lang": "kk",
                         "template": f"kkh::{spec}::{core}"})

for core in HOLD_EMERGENCY:
    for _ in range(4):
        rows.append({"text": assemble(core, HELLO, BYE_EM, None), "urgency": "emergency",
                     "specialist": "скорая помощь", "source": "kk_holdout", "lang": "kk",
                     "template": f"kkh::emergency::{core}"})

for spec, ru_bank in RU_HOLD.items():
    for ru, urg in ru_bank:
        kk_bank = [c for c, u in HOLD[spec] if u == urg]
        if not kk_bank:
            continue
        for _ in range(4):
            kk_part = random.choice(kk_bank)
            core = f"{kk_part}, {ru}" if random.random() < 0.5 else f"{ru}, {kk_part}"
            rows.append({"text": assemble(core, HELLO, BYE, DUR, p_dur=0.3),
                         "urgency": urg, "specialist": spec,
                         "source": "mixed_holdout", "lang": "mixed",
                         "template": f"mixh::{spec}::{kk_part}|{ru}"})

for ru in RU_HOLD_EM:
    for _ in range(3):
        kk_part = random.choice(HOLD_EMERGENCY)
        core = f"{kk_part}, {ru}" if random.random() < 0.5 else f"{ru}, {kk_part}"
        rows.append({"text": assemble(core, HELLO, BYE_EM, None), "urgency": "emergency",
                     "specialist": "скорая помощь", "source": "mixed_holdout",
                     "lang": "mixed", "template": f"mixh::emergency::{kk_part}|{ru}"})

new = pd.DataFrame(rows).drop_duplicates(subset=["text"]).reset_index(drop=True)

train_kk = pd.read_csv("kk_part.csv")
overlap = set(new.text) & set(train_kk.text)
print("holdout:", new.shape, "| overlap with kk train:", len(overlap))
print(new.groupby(["lang", "urgency"]).size().to_string())
print()
print(new.sample(8, random_state=1)[["text", "urgency", "specialist", "lang"]].to_string())
new.to_csv("kk_holdout_part.csv", index=False, encoding="utf-8")
print("\nwritten kk_holdout_part.csv")
