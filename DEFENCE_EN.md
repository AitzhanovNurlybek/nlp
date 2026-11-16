# Defence script — three weeks of work

For `triage_project_final.pptx`, 14 slides. Every number here is checked against the notebook's live output. Full run is about 8 minutes. If you get less time, use the blocks marked ★.

---

## ★ The 40-second version

> The system reads a patient's complaint and says two things: how urgent it is, and which doctor to see. It does not give a diagnosis — that limit is deliberate.

> Three weeks, three different kinds of work. First: we added Kazakh, and complaints where someone mixes two languages in one sentence — which is how people actually write in Kazakhstan. Second, and this one matters more: we found out we had been measuring ourselves with the wrong number. The comfortable number said 80%. The real one was 54%. Third: we finally tested on data we did not write ourselves.

> The headline figure for three weeks is 0.64 on real patient complaints. Not 0.98.

---

## Slide 1 — title (15 seconds)

> This is first-contact triage for patient requests. A person writes what hurts. The system answers: how urgent, and which specialist. Three urgency levels, six specialties.

> What it does not do is diagnose. That boundary has been there since day one.

Do not linger here.

---

## Slide 2 — how it works (30 seconds)

> Five steps. Read the text. Detect the language — that step is new, it is the black one. Pull the facts out: what hurts, where, for how long. Judge urgency. And only then decide where to send the patient.

Say this one sentence without fail:

> The danger-phrase list can only ever **raise** urgency, never lower it. A false alarm costs a wasted trip. A miss can cost a life. The two errors are not symmetrical, so the handling is not symmetrical either.

---

## ★ Slide 3 — what changed over three weeks (40 seconds)

> Five changes. Languages: Russian only, now three cases. Text cleaning — I will come back to that on slide five, there was a serious bug. How we test: one pile of data doing every job, now three piles with one job each. How we judge the reading step: the question used to be "did we find anything", now it is "did we find everything", checked by hand. And the danger phrases: fixed Russian wordings became word patterns in both languages.

> The fourth row is the main story of week two. I will come back to it on slide eight.

---

## Slide 4 — the data (35 seconds)

> 6 387 complaints to learn from, and 682 kept aside. The ones kept aside describe the same conditions, deliberately written in different words. The system never sees them while it learns. That is the pile that tells us the truth.

And immediately, without waiting to be asked:

> We wrote this data ourselves. No doctor has read it. No native Kazakh speaker has read the Kazakh half. That is acceptable for a student project and not acceptable for a real clinic. We say this first rather than waiting for the question.

---

## ★ Slide 5 — what Kazakh broke (50 seconds)

> When we added Kazakh, three things broke, and not one of them raised an error.

> First. The text cleaner kept Russian letters only. Kazakh has nine more. Every one of them was turned into a blank space **before** the system even looked at the words. The example at the bottom: «Құлағым ауырады, қызуым жоқ» became «ла ым ауырады, ызуым жо». No error, no lost rows — the model simply learned mutilated words.

> Second. For Russian there is a ready tool that reduces any word form to its base. Nothing like that exists for Kazakh, so we match the beginning of the word and check the ending ourselves.

> Third. A letter rule fundamentally cannot see a mixed sentence. A Russian phrase dropped into Kazakh is often made of letters Kazakh also has. There is nothing for the rule to notice, so it calls the whole sentence Kazakh.

If you have time, add:

> What the three have in common is that none of them crashed. The system kept running and kept producing normal-looking numbers.

---

## Slide 6 — what the system pulls out (30 seconds)

> This is what the system extracts. Russian complaint on the left, Kazakh on the right. Two different mechanisms inside, one output format outside.

> Look at the Russian example: "no fever" is recognised as something the patient **denies**, not as a symptom. That is separate logic.

> The point of this layer is not accuracy. It is that a doctor can check the reasoning instead of trusting a label blindly.

---

## Slide 7 — finding the language (35 seconds)

> We started with a rule. Kazakh has nine unique letters, so a word carrying one is definitely Kazakh. The rule separates Russian from Kazakh very well: 1.00 and 0.99.

> On mixed sentences it gets 0.43. The reason is fundamental, not an implementation flaw. A rule can only recognise a language by evidence **for** it. The phrase «давление скачет» contains no letter that Kazakh does not also have. No evidence, so the rule sees nothing Russian there.

> So we replaced it with a trained model that looks at the spelling of each word separately. On mixed sentences: 0.43 became 0.98.

---

## ★★ Slide 8 — the main finding of week two (60 seconds)

This is the most important slide. Do not rush. Let the numbers sit.

> For two weeks we reported the quality of the reading step as "coverage" — the share of complaints where at least one entity was found. That gave 75 to 86 percent, and it looked like a result.

> Then we took 60 complaints from the pile kept aside, read them ourselves, wrote down every symptom that was actually in them, and compared that against what the system found.

> The real number is 54 percent. Of what the system does report, 95 percent is correct. So it is right about what it says, and silent about roughly half of what is in the text.

> The old number was not a lie. It answered an easier question: "did we find anything" instead of "did we find everything".

About the annotation — say this, it closes the obvious objection:

> We annotated what a reader sees, not what is in our word list. Otherwise the system would be marking its own exam and any score would come out near one. We deliberately left symptoms in the gold standard that the system cannot produce — so that recall would expose them.

---

## ★ Slide 9 — why we cannot just add more words (40 seconds)

> Recall of 54 percent is a dictionary problem, and the obvious move is to make the dictionary bigger. The question is where the words may come from. Not from the exam — that would end the measurement. Only from the training data.

> So we combed through it. And here is the result: **not one** of the fifteen words the system failed on appears in the training data at all. And 52 percent of the words in the pile kept aside were never seen in training.

> That explains the lopsided gain. Body parts are a couple of dozen words that repeat everywhere, so finding them went from 75 to 88 percent. A symptom can be phrased a hundred ways — «пучит», «крутит», «дерёт», «трепещет» — and there the gain was 52 to 54.

> The conclusion: a hand-written dictionary cannot be read into generality from data you already have. Either you bring in a real medical lexicon from outside, or you stop matching words altogether. We tested the second option — that is slide twelve.

---

## ★ Slide 10 — what our teacher asked us to fix (40 seconds)

> The feedback was methodological: we had no separate pile for tuning. The same data was used both to choose settings and to report the result. A score obtained that way partly measures not the quality of the system, but how well our choices happened to fit that particular pile.

> Now there are four piles, each with one job. The system learns on the first. We try options on the second. The third we look at **once**, at the very end, and it chooses nothing. The fourth is the pile kept aside, written in different words.

> Every pile has the same proportion of urgent cases and the same proportion of languages.

If they ask for a concrete example:

> The confidence threshold used to be set by hand, with a comment saying it was picked by eye. Now it is chosen from a trade-off table on the second pile, and never touched again.

---

## ★ Slide 11 — which number to believe (35 seconds)

> Three numbers. 0.99 on the pile we tuned on, which therefore flatters us and is no longer an estimate of anything. 0.98 on the checking pile, where the wording is like the training data. And 0.76 on the pile kept aside, where the same conditions are described in different words.

> Judge us on 0.76. The gap between the numbers is not a fault to be fixed. It is a measurement of how much of the pretty number is recognition of familiar phrasing.

> And the thing that matters most holds up best: on words the system has never seen, it still catches 79 percent of the emergencies.

Say this yourself, do not wait:

> On Kazakh the checking pile shows exactly 1.00. That is a warning sign, not a result: we have fewer Kazakh templates, so a test sentence almost always has a near-twin in training. The honest Kazakh figure is 0.77.

---

## ★ Slide 12 — we tried a smarter model, and it lost (45 seconds)

> Slide nine leads to a hypothesis: a model that understands meaning rather than spelling should not care which words a complaint is written in. We tested that instead of assuming it.

> The hypothesis **was not confirmed**. On the pile kept aside our model gets 0.757, the smarter one 0.708. On choosing the doctor it is worse: 0.840 against 0.755.

The explanation is the valuable part — without it this is just a failure:

> The reason is that we built our data from a bank of set phrases. So the useful clues in it are the exact words. Our model is built to use them; the smarter model abstracts away from exact words and throws those clues out. Which means the comparison says as much about our data as it does about the models.

> And it wins exactly where the theory predicted: on Kazakh, and on catching emergencies — the two places where exact words help least.

---

## Slide 13 — the surprise about the rules (35 seconds)

> We measured the danger-phrase list **separately** from the model, and that turned out to be the most useful check we ran.

> On its own the list catches 72 percent of emergencies. The model catches 98. So the intuition that "the rules keep the patient safe and the model is convenience" is backwards. The model carries the safety; the list is a narrow backstop.

> And the improvement had a price. We rewrote the list so one pattern covers many wordings, and it went from 30 percent to 72. But it also raises more false alarms: it is right 75 percent of the time instead of 87. For patient triage that is the correct direction, but it is a choice we made, not a free win.

---

## ★★ Slide 14 — finally, data we did not write (50 seconds)

The final slide, and the most important one of the three weeks. It closes the most obvious objection to the project, so end the talk on it.

> Until now, everything we tested ourselves on, we had written ourselves. That was the largest assumption in the work, and it is now partly removed.

> We used **RuMedTop3** — 6 360 real patient complaints, collected and released by Sber's AI lab under an open licence. These are genuine outpatient records: with typos, abbreviations, drug names.

> And here are three numbers. 0.98 on our own data. 0.84 on our own, written in different words. And **0.64** on complaints written by real patients and doctors.

> Each step down removes one assumption. The last one is the first check in this project against text that nobody here wrote. That is the number to judge us on.

Explain the drop yourself:

> The drop makes sense. Our complaints are what a person types into a booking form. Theirs are clinical shorthand: «с иррад в кисть», «по ВАШ 6-7 баллов». A different vocabulary and a different genre of text.

Two honest limits on this check:

> It cannot test urgency at all. The records carry a diagnosis and nothing else, and urgency does not follow from a diagnosis: the same condition is routine in one patient and an emergency in another.

> And it covers 46 percent of the corpus. The rest is musculoskeletal, urological and endocrine cases — an orthopedist, a urologist and an endocrinologist, three specialists our system does not route to. We mapped the codes one by one rather than by ICD chapter, because otherwise all of that would have landed on the therapist and inflated that class.

If they ask about the model's errors:

> The confusion matrix shows clinically sensible mix-ups rather than random ones. Cardiology and neurology trade cases in both directions — chest pain radiating into an arm, dizziness, numbness genuinely belong to either. The therapist is worst again: it has no symptom profile of its own, so it absorbs whatever the others reject.

---

## If they ask: "so what exactly did you do?"

Three rounds, one connected sentence each:

> **First — language.** We added Kazakh and code-switched complaints; the dataset grew from 5 000 to 6 400 rows. We wrote language detection, a fact-extraction layer for Kazakh, and Kazakh danger phrases. Along the way we found three bugs that had been failing silently: the text cleaner was deleting Kazakh letters, labels for mixed rows were taken from one half of the sentence, and de-identification was erasing the symptom.

> **Second — measurement.** We built a hand-annotated gold standard and discovered we had been measuring the wrong quantity: reporting "coverage" instead of recall. We proved the dictionary cannot be repaired from the training data. We doubled the recall of the danger phrases. We tested the hypothesis about a smarter model and got a negative result with an explanation. And we closed the feedback about the missing tuning set.

> **Third — other people's data.** We tested on real patient complaints for the first time: 0.64 instead of 0.84 on our own. We also found that we miss durations not because we are blind to them, but because clinical notes usually do not state them.

---

## The full list of bugs we found

All eight were found by measuring, not by guessing.

1. **No tuning set** — settings were chosen and reported on the same pile.
2. **We measured the wrong quantity** — "coverage" instead of recall. Only found once we built the gold standard.
3. **The text cleaner deleted Kazakh letters.**
4. **Labels for mixed rows came from one half of the sentence** — «гастритті тексертсем деп едім, тошнит» was labelled routine.
5. **De-identification erased the symptom** — «Давящая боль за грудиной» became «[ИМЯ] боль за грудиной».
6. **The preposition "без" swallowed a danger phrase** — «упал без сознания» was read as "no loss of consciousness".
7. **Negation could not see a particle in between** — «температуры вроде нет» counted as a symptom.
8. **One classifier was doing two jobs** — the language label and the choice of parsing mechanism. We tightened the label to make a demo look better and made things worse: bilingual complaints went through one mechanism and lost half their facts. We split it into a strict label for reporting and a permissive one for routing.

Items 2, 7 and 8 are the best ones to talk about: they are not bugs in the code, they are bugs in what and why we were measuring.

---

## Limitations — say them yourself

> The data is synthetic, no doctor has reviewed it, and no native speaker has reviewed the Kazakh half. The checking pile shares templates with the training pile, so its score is optimistic by construction — that is exactly why the pile kept aside exists. The gold standard is 60 complaints annotated by one person, the project's own author; real work would need a second annotator and inter-annotator agreement. The system does not tell a mention from a complaint: "I want to get my blood pressure checked" is a request, not a symptom. The danger-phrase list is not a medical triage protocol.

---

## Likely questions

**"Why not use a bigger model, since this one lost?"**
> It is not about size. The useful clues in our data are the exact words, and a smarter model abstracts away from exactly those. A bigger model would do the same thing more confidently. What is needed is real data, or fine-tuning on it.

**"60 examples is a small gold standard."**
> Agreed, and we say so in the limitations. But even 60 was enough to move the estimate by thirty points and to reveal that we were measuring the wrong quantity. The next step is a second annotator.

**"The precision of the danger list dropped — isn't that bad?"**
> It is a trade we chose deliberately. A false alarm costs a trip; a missed heart attack costs a life. We bought recall with precision, and we report both numbers.

**"How do you know you did not tune the dictionary on the test set?"**
> We looked for gaps only in the training data, and the notebook has a section proving it: not one of the words we failed on occurs in the training data.

**"Why is 0.76 so low?"**
> For data written in different words, that is an honest figure. And on the most expensive class the system holds: 79 percent of emergencies caught, at 89 percent precision.

**"Isn't 0.64 bad?"**
> It is the first honest figure on somebody else's text, and it is exactly where it should be. What matters is the direction: 0.98 on our own, 0.84 on our own in different words, 0.64 on real ones. Each step removes an assumption. If real data had scored the same as our own, that would be a reason to go looking for a bug, not a reason to celebrate.

**"Why only 46 percent of the corpus?"**
> Because we mapped the ICD codes one by one rather than by chapter. The rest is orthopedics, urology and endocrinology, and we have no such specialists in our scheme. Sending them all to the therapist would have been easier, but it would have inflated one class and distorted the whole table.

**"Why didn't you test urgency on real data?"**
> Because it is not in there. The records carry a diagnosis only, and urgency does not follow from a diagnosis. No public Russian or Kazakh corpus carries urgency labels — that is the next step, and it needs a physician to annotate.

**"How long does it take to run?"**
> The whole notebook is 35 seconds, 67 cells, no errors.

---

## Numbers cheat sheet

| | value |
|---|---|
| Training / kept aside | 6 387 / 682 |
| Four piles | 4 470 / 958 / 959 / 682 |
| Languages | ru 4 995, kk 1 067, mixed 325 |
| Urgency: tuning / checking / kept aside | 0.988 / 0.983 / **0.757** |
| Emergency recall | 0.982 / 0.982 / **0.791** |
| Choosing the doctor | 0.983 / 0.976 / **0.840** |
| **Choosing the doctor on REAL complaints** | **0.641** |
| RuMedTop3 covered by our six specialties | 46% (2 953 of 6 360) |
| NER on real text, at least one entity | 92% |
| Duration: stated in text / of those, caught | 19% / 83% |
| **Reading the text: recall / precision** | **0.536 / 0.949** |
| The old "coverage" figure | 75–86% |
| Failing words that occur in training | 0 of 15 |
| Kept-aside vocabulary never seen in training | 52% |
| Danger phrases alone | recall 0.30 → **0.72**, precision 0.87 → 0.75 |
| Language, mixed sentences | rule 0.43 → model 0.98 |
| Smarter model vs ours, kept aside | 0.708 against 0.757 |

---

## What not to say

- Do not call 0.98 the headline result, and do not call 86% coverage the quality of the reading step. Both figures are honest, but both answer an easier question than they appear to. Lead with them and you will spend the rest of the talk retreating.
- Do not say "the system identifies the illness" — only "urgency and specialist".
- Do not present the smarter model losing as a failure. It is a measured negative result with an explained mechanism.
- Do not present alignment with the Ministry of Health as something already done.
