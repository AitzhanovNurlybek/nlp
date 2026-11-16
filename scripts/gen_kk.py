# -*- coding: utf-8 -*-
"""Generate a Kazakh and a code-switched slice for the triage dataset."""
import random
import pandas as pd

random.seed(42)

# ---------------------------------------------------------------- phrase banks
# (symptom, urgency) per specialist. "urgent" variants describe a worse state.
KK = {
    "кардиолог": [
        ("қысымымды тексергім келеді", "routine"),
        ("жүрегімді тексертсем деп едім", "routine"),
        ("кардиограмма жасатқым келеді", "routine"),
        ("холестеринді тексергім келеді", "routine"),
        ("жүрек ауруының алдын алу туралы кеңес керек", "routine"),
        ("кеуде тұсым ауырады", "urgent"),
        ("жүрегім қатты соғады", "urgent"),
        ("қысымым 150-ге көтерілді", "urgent"),
        ("аз жүргенде тынысым тарылады", "urgent"),
        ("жүрек тұсым сыздайды", "urgent"),
        ("аяқтарым ісіп кетті", "urgent"),
        ("тамырым бірде жиі, бірде сирек соғады", "urgent"),
        ("баспалдақпен көтерілгенде жүрегім ауырады", "urgent"),
    ],
    "невролог": [
        ("бас ауруының алдын алу туралы кеңес керек", "routine"),
        ("ұйқы режимі туралы сұрағым бар", "routine"),
        ("жүйке жүйесін тексертсем деп едім", "routine"),
        ("басым қатты ауырады", "urgent"),
        ("басым айналады", "urgent"),
        ("қолым ұйып қалады", "urgent"),
        ("саусақтарым шаншиды", "urgent"),
        ("мойным ауырады, қозғалта алмаймын", "urgent"),
        ("түнде ұйықтай алмаймын", "urgent"),
        ("есте сақтау қабілетім нашарлады", "urgent"),
        ("арқам ауырып, аяғыма беріледі", "urgent"),
        ("көз алдым бұлдырайды", "urgent"),
    ],
    "гастроэнтеролог": [
        ("дұрыс тамақтану туралы кеңес керек", "routine"),
        ("гастритті тексертсем деп едім", "routine"),
        ("ас қорыту туралы сұрағым бар", "routine"),
        ("ішім ауырады", "urgent"),
        ("жүрегім айниды", "urgent"),
        ("кекіріп, ішім кебеді", "urgent"),
        ("ішім өтіп жүр", "urgent"),
        ("тамақтан кейін ас қазаным ауырады", "urgent"),
        ("ішім қатып қалды", "urgent"),
        ("май тағамнан кейін оң жақ қабырғам астында ауырсыну", "urgent"),
        ("тамағым өтпей, кеудем ашиды", "urgent"),
        ("тәбетім жоғалды, салмағым түсіп кетті", "urgent"),
    ],
    "дерматолог": [
        ("меңімді тексерткім келеді", "routine"),
        ("теріге күтім жасау туралы кеңес керек", "routine"),
        ("шаш түсуі туралы сұрағым бар", "routine"),
        ("терімде бөртпе шықты", "urgent"),
        ("терім қатты қышиды", "urgent"),
        ("меңімнің түсі өзгерді", "urgent"),
        ("тырнақтарым сынғыш болып кетті", "urgent"),
        ("бетімде безеу көбейді", "urgent"),
        ("теріме қызару шықты, ісіп тұр", "urgent"),
        ("аяғымның терісі қабыршақтанып жарылады", "urgent"),
    ],
    "ЛОР": [
        ("есту қабілетімді тексертсем деп едім", "routine"),
        ("мұрын қуысын тексерту керек пе деп сұрайын дедім", "routine"),
        ("тамағым ауырады", "urgent"),
        ("құлағым ауырады", "urgent"),
        ("мұрным бітеліп қалды", "urgent"),
        ("даусым қарлығып қалды", "urgent"),
        ("құлағым бітеліп, нашар естимін", "urgent"),
        ("жұтынғанда тамағым ауырады", "urgent"),
        ("мұрнымнан қан кетеді", "urgent"),
        ("бадамша безім ісіп тұр", "urgent"),
        ("суық тиіп, мұрным ағады", "urgent"),
    ],
    "терапевт": [
        ("жыл сайынғы тексеруден өткім келеді", "routine"),
        ("анализ тапсырсам деп едім", "routine"),
        ("жұмысқа анықтама керек", "routine"),
        ("егу туралы сұрағым бар", "routine"),
        ("витаминдер туралы кеңес керек", "routine"),
        ("спортқа рұқсат қағазы керек", "routine"),
        ("қызуым көтерілді", "urgent"),
        ("жөтелім басылмай жүр", "urgent"),
        ("әлсіздік сезінемін", "urgent"),
        ("тұмауратып қалдым", "urgent"),
        ("денем қалтырап, тоңамын", "urgent"),
        ("буындарым ауырады", "urgent"),
        ("түнде қатты терлеп шығамын", "urgent"),
    ],
}

KK_EMERGENCY = [
    "тыныс ала алмай жатыр",
    "есінен танып қалды, өзіне келмей жатыр",
    "кеудесі қатты ауырады, сол қолына беріледі",
    "қан тоқтамай жатыр",
    "беті қисайып кетті, сөйлей алмайды",
    "талма ұстады",
    "көп дәрі ішіп қойды",
    "қатты күйіп қалды, терісі көпіршіктеніп кетті",
    "биіктен құлап түсті, басын соқты",
    "у ішіп қойды",
    "балам ойыншық жұтып қойып, көгеріп кетті",
    "ерні көгеріп, тынысы тарылып барады",
    "аллергиядан тұншығып жатыр",
    "қан құсты",
    "жүрек ұстамасы болды деп ойлаймын",
    "инсульт белгілері бар, бір жағы қозғалмайды",
    "жол апатынан кейін есі ауысып тұр",
    "жүкті әйелден қан кетіп жатыр",
    "баланың қызуы түспей, талықсып жатыр",
    "қатты соққыдан кейін құса бастады",
]

KK_HELLO = ["Сәлеметсіз бе", "Қайырлы күн", "Сәлеметсіз бе, дәрігер",
            "Кешіріңіз, сұрасам бола ма", "Айтыңызшы, өтінемін",
            "Қайырлы кеш", "Амансыз ба"]
KK_BYE = ["Рахмет", "Алдын ала рахмет", "Кеңес беріңізші",
          "Қай дәрігерге жазылсам болады?", "Не істеу керек?",
          "Жазылуым керек пе?", "Жауабыңызды күтемін"]
KK_BYE_EMERGENCY = ["Көмектесіңіздер!", "Жедел жәрдем шақырдық",
                    "Тез арада көмек керек", "Не істейміз?!", "Қатты қорқып тұрмыз"]
KK_DURATION = ["екінші күн", "үшінші күн", "бір аптадан бері", "екі аптадан бері",
               "бір айдан бері", "кешеден бері", "бүгін таңертеңнен",
               "бірнеше күннен бері", "жарты жылдан бері", "көптен бері"]

# Russian fragments used when a complaint is code-switched, by specialist
# Each Russian fragment carries its own urgency, so a mixed complaint can be
# paired with a Kazakh core of the SAME urgency. Taking the label from the
# Kazakh half alone mislabels "гастритті тексертсем деп едім, тошнит" as routine.
RU_MIX = {
    "кардиолог": [("давление скачет", "urgent"), ("сердце колет", "urgent"),
                  ("одышка при ходьбе", "urgent"),
                  ("хочу проверить сердце", "routine"), ("нужна кардиограмма", "routine")],
    "невролог": [("голова болит", "urgent"), ("рука немеет", "urgent"),
                 ("кружится голова", "urgent"),
                 ("хочу проконсультироваться по сну", "routine")],
    "гастроэнтеролог": [("изжога после еды", "urgent"), ("живот болит", "urgent"),
                        ("тошнит", "urgent"),
                        ("нужен совет по питанию", "routine")],
    "дерматолог": [("сыпь на коже", "urgent"), ("кожа чешется", "urgent"),
                   ("родинка изменилась", "urgent"),
                   ("хочу проверить родинки", "routine")],
    "ЛОР": [("горло болит", "urgent"), ("ухо заложило", "urgent"),
            ("нос не дышит", "urgent"),
            ("хочу проверить слух", "routine")],
    "терапевт": [("температура 38", "urgent"), ("кашель не проходит", "urgent"),
                 ("слабость", "urgent"),
                 ("нужна справка", "routine"), ("хочу сдать анализы", "routine")],
}
RU_MIX_EMERGENCY = ["задыхается", "потерял сознание", "кровь не останавливается",
                    "боль в груди отдает в руку", "судороги"]
RU_HELLO = ["Здравствуйте", "Добрый день", "Подскажите, пожалуйста"]
RU_BYE = ["Спасибо", "Заранее спасибо", "Что делать?", "К кому записаться?"]


def assemble(core, urgency, hello_bank, bye_bank, dur_bank, p_dur=0.45):
    parts = []
    if random.random() < 0.55:
        parts.append(random.choice(hello_bank) + ",")
    text = core
    if dur_bank and random.random() < p_dur:
        if random.random() < 0.5:
            text = random.choice(dur_bank) + " " + text
        else:
            text = text + " " + random.choice(dur_bank)
    parts.append(text)
    if random.random() < 0.5:
        parts.append(random.choice(bye_bank))
    out = " ".join(parts)
    # light colloquial noise, same idea as the Russian generator
    if random.random() < 0.12:
        out = out.lower().rstrip(".")
    return out.strip()


rows = []

# ---------------------------------------------------------------- Kazakh, by specialist
for spec, bank in KK.items():
    for core, urg in bank:
        n = 10 if urg == "urgent" else 24
        for _ in range(n):
            rows.append({
                "text": assemble(core, urg, KK_HELLO, KK_BYE, KK_DURATION),
                "urgency": urg,
                "specialist": spec,
                "source": "kk_generated",
                "lang": "kk",
                "template": f"kk::{spec}::{core}",
            })

# ---------------------------------------------------------------- Kazakh, emergency
for core in KK_EMERGENCY:
    for _ in range(9):
        rows.append({
            "text": assemble(core, "emergency", KK_HELLO, KK_BYE_EMERGENCY, None),
            "urgency": "emergency",
            "specialist": "скорая помощь",
            "source": "kk_generated",
            "lang": "kk",
            "template": f"kk::emergency::{core}",
        })

# ---------------------------------------------------------------- code-switched
for spec, ru_bank in RU_MIX.items():
    for ru, urg in ru_bank:
        # pair with a Kazakh core of the same urgency, so the label stays true
        kk_bank = [c for c, u in KK[spec] if u == urg]
        if not kk_bank:
            continue
        for _ in range(11):
            kk_part = random.choice(kk_bank)
            if random.random() < 0.5:
                core = f"{kk_part}, {ru}"
            else:
                core = f"{ru}, {kk_part}"
            hello = KK_HELLO if random.random() < 0.5 else RU_HELLO
            bye = KK_BYE if random.random() < 0.5 else RU_BYE
            rows.append({
                "text": assemble(core, urg, hello, bye, KK_DURATION, p_dur=0.35),
                "urgency": urg,
                "specialist": spec,
                "source": "mixed_generated",
                "lang": "mixed",
                "template": f"mix::{spec}::{kk_part}|{ru}",
            })

for ru in RU_MIX_EMERGENCY:
    for _ in range(8):
        kk_part = random.choice(KK_EMERGENCY)
        core = f"{kk_part}, {ru}" if random.random() < 0.5 else f"{ru}, {kk_part}"
        rows.append({
            "text": assemble(core, "emergency", KK_HELLO, KK_BYE_EMERGENCY, None),
            "urgency": "emergency",
            "specialist": "скорая помощь",
            "source": "mixed_generated",
            "lang": "mixed",
            "template": f"mix::emergency::{kk_part}|{ru}",
        })

new = pd.DataFrame(rows).drop_duplicates(subset=["text"]).reset_index(drop=True)
print("generated:", new.shape)
print(new.groupby(["lang", "urgency"]).size().to_string())
print()
print(new.sample(12, random_state=3)[["text", "urgency", "specialist", "lang"]].to_string())

new.to_csv("kk_part.csv", index=False, encoding="utf-8")
print("\nwritten kk_part.csv")
