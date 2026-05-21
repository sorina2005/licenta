import spacy
from fastapi import FastAPI
from pydantic import BaseModel
from spacy.pipeline import EntityRuler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import numpy as np
import re

app = FastAPI()
nlp = spacy.load("ro_core_news_sm")

if "entity_ruler" in nlp.pipe_names:
    nlp.remove_pipe("entity_ruler")

ruler = nlp.add_pipe("entity_ruler", before="ner")

piese_auto = ["far", "stop", "portiera", "aripa", "parbriz", "luneta", "oglinda", "radiator", "capota", "grila",
              "janta", "bara"]
patterns = []
for piesa in piese_auto:
    patterns.append({"label": "PIESA_AUTO", "pattern": [{"LOWER": piesa}]})
    patterns.append({"label": "PIESA_AUTO", "pattern": [{"LEMMA": piesa}]})

patterns.append({"label": "PIESA_AUTO", "pattern": [{"LOWER": "bara"}, {"LOWER": "fata"}]})
patterns.append({"label": "PIESA_AUTO", "pattern": [{"LOWER": "bara"}, {"LOWER": "spate"}]})
ruler.add_patterns(patterns)

texts = [
    "vreau sa creez un dosar nou", "inregistrez o dauna noua", "raportez accident", "am lovit masina", "dauna noua",
    "creare dosar", "deschide dosar nou", "am avut un accident grav", "masina lovita in parcare",
    "vreau sa verific un dosar", "stadiu dosar existent", "status reparatie", "unde este dosarul meu",
    "interogare status", "numar dosar", "verificare dosar", "am deja un numar de dosar", "status dosar",
    "numarul 10", "dosarul 5", "id 7", "numarul meu este 123", "cod 44", "10", "20",
    "da", "exact", "corect", "sigur", "confirm", "vrea", "da te rog", "da sunt sigur",
    "nu", "nu vreau", "anuleaza", "negativ", "incorect", "nu mai vreau", "anulare",
    "salut", "buna ziua", "buna", "hey", "salutare",
    "multumesc", "mersi", "e bine", "perfect", "ajutor",
    "vreau sa vorbesc cu un om", "operator", "agent", "persoana", "nu cu un robot", "asistenta umana", "cu cineva"
]
labels = [
    "report_damage", "report_damage", "report_damage", "report_damage", "report_damage", "report_damage",
    "report_damage", "report_damage", "report_damage",
    "check_status", "check_status", "check_status", "check_status", "check_status", "check_status", "check_status",
    "check_status", "check_status",
    "check_status", "check_status", "check_status", "check_status", "check_status", "check_status", "check_status",
    "confirmation", "confirmation", "confirmation", "confirmation", "confirmation", "confirmation", "confirmation",
    "confirmation",
    "negation", "negation", "negation", "negation", "negation", "negation", "negation",
    "greeting", "greeting", "greeting", "greeting", "greeting",
    "thanks", "thanks", "thanks", "thanks", "thanks",
    "human_support", "human_support", "human_support", "human_support", "human_support", "human_support",
    "human_support"
]

vectorizer = TfidfVectorizer(ngram_range=(1, 2))
X = vectorizer.fit_transform(texts)
model = LogisticRegression()
model.fit(X, labels)


class ChatInput(BaseModel):
    text: str


def generate_bot_response(intent, confidence, piese, locatii, has_number):
    if intent == "unknown":
        return "Sunt un asistent specializat doar in daune auto. Nu te pot ajuta cu informatii externe, dar pot inregistra un accident sau verifica un dosar."

    if confidence < 0.35:
        return "Nu sunt sigur ca am inteles corect. Doresti sa raportezi o dauna sau sa verifici un dosar existent?"

    if intent == "check_status":
        if has_number:
            return "Am identificat solicitarea pentru dosarul mentionat. Caut acum detaliile in baza de date..."
        return "Pentru a verifica stadiul unui dosar existent, te rog sa introduci numarul acestuia."

    elif intent == "report_damage":
        msg = "Am inteles ca doresti sa deschizi un dosar de dauna nou. "
        if piese: msg += f"Am identificat daune la: {', '.join(piese)}. "
        if locatii: msg += f"Locatie mentionata: {', '.join(locatii)}. "
        return msg + "Sa trimitem cererea spre procesare?"

    elif intent == "human_support":
        return "Te pun in legatura cu un operator uman pentru asistenta personalizata. Te rog sa astepti."
    elif intent == "confirmation":
        return "Perfect! Am salvat datele in sistem."
    elif intent == "negation":
        return "Am anulat operatiunea curenta. Cu ce te mai pot ajuta?"
    elif intent == "greeting":
        return "Salut! Sunt asistentul tau virtual specializat in daune auto. Cum te pot ajuta astazi?"
    elif intent == "thanks":
        return "Cu mare placere! Drumuri bune!"

    return "Te rog sa imi oferi mai multe detalii."


@app.post("/analyze")
async def analyze(input_data: ChatInput):
    raw_text = input_data.text
    text_low = raw_text.lower().strip()
    doc = nlp(raw_text)

    has_number = bool(re.search(r'\d+', text_low))

    blacklist_locatii = ["vreau", "buna", "salut", "da", "nu", "cum", "cineva", "comanda"]
    locatii = [ent.text for ent in doc.ents if ent.label_ == "GPE" and ent.text.lower() not in blacklist_locatii]

    piese = list(set([ent.text.lower() for ent in doc.ents if ent.label_ == "PIESA_AUTO"]))

    x_vec = vectorizer.transform([text_low])
    intent = model.predict(x_vec)[0]
    probabilities = model.predict_proba(x_vec)[0]
    confidence = float(np.max(probabilities))

    if confidence < 0.35 and len(piese) == 0 and not has_number:
        intent = "unknown"

    human_keywords = ["persoana", "operator", "om", "agent", "cineva", "asistenta", "robot", "vb"]
    if any(k in text_low for k in human_keywords) and intent != "greeting":
        intent = "human_support"
        confidence = 0.95

    if has_number and intent not in ["report_damage", "human_support", "greeting"]:
        intent = "check_status"
        confidence = max(confidence, 0.90)

    if len(piese) > 0 and intent not in ["check_status", "human_support"]:
        intent = "report_damage"
        confidence = max(confidence, 0.85)

    if text_low in ["da", "nu", "ok", "da te rog", "nu il gasesc"]:
        confidence = 0.95

    urgenta = "ridicata" if any(
        k in text_low for k in ["urgent", "grav", "fum", "foc", "rau", "sparte", "lovit"]) else "normala"
    response_text = generate_bot_response(intent, confidence, piese, locatii, has_number)

    return {
        "intent": intent,
        "confidence": round(confidence, 2),
        "piese_detectate": piese,
        "locatii": locatii,
        "urgenta": urgenta,
        "has_number": has_number,
        "response": response_text
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)