# ============================================================
# HOPE — Database Seeder
# Save to: backend/ml/seed_db.py
#
# Seeds MongoDB with sample data for:
#   - Articles, Self-exam steps, Risk factors
#   - Medicines + pharmacies
#   - Hospitals across Sri Lanka
#   - Counsellors, Motivational content
#   - Admin user
#
# Run: python ml/seed_db.py
# ============================================================

import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient, GEOSPHERE
import bcrypt

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME   = os.getenv("DB_NAME",   "hope_dev")

client = MongoClient(MONGO_URI)
db     = client[DB_NAME]

NOW = datetime.now(timezone.utc)

def hash_pw(p): return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

# ── Drop existing data ──────────────────────────────────────
collections = ["users","articles","self_exam_steps","risk_factors",
                "medicines","hospitals","counsellors","motivational",
                "detections","posts","bookings"]
for c in collections:
    db[c].drop()
print("🗑️  Cleared existing collections.")


# ── 1. ADMIN USER ───────────────────────────────────────────
db.users.insert_one({
    "name":          "HOPE Admin",
    "email":         "admin@hope.lk",
    "password_hash": hash_pw("HopeAdmin@2026!"),
    "role":          "admin",
    "is_verified":   True,
    "is_active":     True,
    "created_at":    NOW,
    "updated_at":    NOW,
})
print("✅ Admin user seeded.")


# ── 2. AWARENESS ARTICLES ───────────────────────────────────
articles = [
    {
        "title":        "Recognising Early Warning Signs of Breast Cancer",
        "category":     "symptoms",
        "summary":      "Learn the key signs that should prompt you to seek medical attention, including lumps, nipple changes, and skin texture differences.",
        "content":      """Breast cancer is most treatable when detected early. Knowing the warning signs can literally save your life.

**Key symptoms to watch for:**

**Lumps and thickening** — A new lump or hardened knot in the breast or underarm area is the most common sign. Not all lumps are cancer, but any new lump should be evaluated by a doctor.

**Changes in size or shape** — Any unexplained change in the size, shape or appearance of a breast warrants attention. This may be subtle.

**Skin changes** — Dimpling, puckering, redness, scaling or thickening of the breast skin or nipple area. The skin may resemble the texture of an orange peel.

**Nipple changes** — A nipple that turns inward (inverts) when it was previously pointing outward, or any discharge from the nipple (especially if bloody or clear).

**Pain** — Although most breast cancers are not painful, persistent pain in one area of the breast or nipple that does not go away should be investigated.

**What to do:** If you notice any of these symptoms, do not panic but do not delay — schedule an appointment with your doctor as soon as possible. Early detection leads to better outcomes.""",
        "image_url":    None,
        "read_time":    5,
        "tags":         ["early detection", "symptoms", "self-exam", "warning signs"],
        "published_at": NOW,
    },
    {
        "title":        "When and How Often Should You Get a Mammogram?",
        "category":     "screening",
        "summary":      "Sri Lanka screening guidelines, frequency recommendations, and what to expect during your mammogram procedure.",
        "content":      """A mammogram is an X-ray picture of the breast tissue, used to detect breast cancer early — often before symptoms appear.

**Who should get a mammogram?**

- **Ages 20–39:** Clinical breast exam every 1–3 years. Mammogram if you have risk factors (family history, genetic mutations).
- **Ages 40–49:** Annual mammogram recommended. Discuss with your doctor based on personal risk.
- **Ages 50+:** Annual or biennial mammogram strongly recommended by the Ministry of Health Sri Lanka.
- **High-risk women:** May begin annual mammograms as early as age 30, alongside MRI.

**Where to get a mammogram in Sri Lanka:**
- Apeksha Hospital, Maharagama (Free for government referrals)
- Lady Ridgeway Hospital, Colombo
- Lanka Hospitals, Narahenpita
- District General Hospitals across all provinces

**What to expect:**
The procedure takes about 20 minutes. You will stand in front of an X-ray machine and your breast will be compressed between two plates. This may cause brief discomfort. Results are usually available within 1–2 weeks.

**Preparation tips:**
- Do not use deodorant, lotion or powder on the day of the exam
- Wear a two-piece outfit for easy undressing
- Schedule after your period when breasts are less tender""",
        "image_url":    None,
        "read_time":    4,
        "tags":         ["mammogram", "screening", "women's health", "ministry of health"],
        "published_at": NOW,
    },
    {
        "title":        "Lifestyle Changes That Can Lower Your Breast Cancer Risk",
        "category":     "prevention",
        "summary":      "Evidence-based dietary, exercise, and lifestyle modifications proven to reduce breast cancer risk.",
        "content":      """While no lifestyle change guarantees cancer prevention, research strongly suggests that certain habits can meaningfully reduce your risk.

**1. Maintain a healthy weight**
Obesity — especially after menopause — increases breast cancer risk due to higher estrogen levels produced by fat tissue. Aim for a BMI of 18.5–24.9.

**2. Exercise regularly**
Studies show that 150–300 minutes of moderate aerobic activity per week (brisk walking, swimming, cycling) reduces breast cancer risk by 20–25%. Even 30 minutes of daily walking helps.

**3. Limit alcohol**
Even one alcoholic drink per day increases risk slightly. Women who drink 2–3 drinks daily have a 20% higher risk compared to non-drinkers.

**4. Breastfeed if possible**
Breastfeeding for more than one year cumulatively may reduce breast cancer risk, particularly for premenopausal cancer.

**5. Eat a plant-rich diet**
Foods rich in fibre, antioxidants, and phytoestrogens may be protective. Include: leafy greens, turmeric, garlic, soy foods, fruits, legumes, and whole grains. Traditional Sri Lankan diet with vegetables, lentils and fish is generally protective.

**6. Minimise hormone therapy use**
Long-term use of combined hormone replacement therapy (HRT) after menopause increases risk. Discuss alternatives with your doctor.

**7. Avoid smoking**
Smoking, particularly starting in adolescence or young adulthood, is linked to increased breast cancer risk.""",
        "image_url":    None,
        "read_time":    6,
        "tags":         ["prevention", "lifestyle", "diet", "exercise", "alcohol"],
        "published_at": NOW,
    },
    {
        "title":        "Understanding Breast Cancer Treatment Options in Sri Lanka",
        "category":     "treatment",
        "summary":      "An overview of surgery, chemotherapy, radiation, hormone therapy and targeted therapy available at hospitals across Sri Lanka.",
        "content":      """Being diagnosed with breast cancer can feel overwhelming. Understanding your treatment options helps you make informed decisions with your medical team.

**1. Surgery**
Most patients undergo some form of surgery:
- **Lumpectomy (breast-conserving surgery):** Removes only the tumour and a small margin of surrounding tissue. Usually followed by radiation.
- **Mastectomy:** Removal of one (unilateral) or both (bilateral) breasts. May include reconstruction.
Available at: Apeksha Hospital (free), Lanka Hospitals, Asiri Surgical Hospital, Durdans Hospital.

**2. Chemotherapy**
Uses drugs to kill cancer cells throughout the body. May be given before surgery (neoadjuvant) to shrink the tumour, or after (adjuvant) to kill remaining cells.
Common drugs: Cyclophosphamide, Doxorubicin, Paclitaxel, Docetaxel.
Free chemotherapy is available at Apeksha Hospital, Maharagama.

**3. Radiation Therapy**
High-energy rays target remaining cancer cells after surgery. Usually given 5 days a week for 3–6 weeks.
Available at: Apeksha Hospital, Lanka Hospitals Cancer Centre.

**4. Hormone (Endocrine) Therapy**
For hormone receptor-positive cancers (ER+ or PR+). Drugs include:
- Tamoxifen (for pre- and post-menopausal women)
- Letrozole, Anastrozole (for post-menopausal women)
These significantly reduce recurrence risk.

**5. Targeted Therapy**
For HER2-positive cancers: Trastuzumab (Herceptin), Pertuzumab.
These are expensive but partially available through government programmes.

**Financial assistance:** Samurdhi beneficiaries and those referred through government hospitals may access free or subsidised treatment at Apeksha Hospital.""",
        "image_url":    None,
        "read_time":    8,
        "tags":         ["treatment", "surgery", "chemotherapy", "radiation", "hospitals", "Sri Lanka"],
        "published_at": NOW,
    },
    {
        "title":        "Eating Well During Breast Cancer Treatment",
        "category":     "lifestyle",
        "summary":      "Nutritional guidance tailored for patients undergoing chemotherapy, radiation, or surgery — including local Sri Lankan food recommendations.",
        "content":      """Good nutrition during treatment helps your body tolerate side effects, heal faster, and maintain energy.

**Managing common side effects through diet:**

**Nausea (very common during chemo):**
- Eat small, frequent meals (6–8 small meals instead of 3 large ones)
- Try: Plain rice, plain roti, toast, bananas, coconut water (pol water)
- Avoid: Fried, oily, or strong-smelling foods
- Ginger tea (inguru te) is a natural anti-nausea remedy

**Fatigue:**
- Choose iron-rich foods: tempeh, dhal, gotukola, liver, egg yolk
- Stay hydrated — aim for 8–10 glasses of water daily
- Avoid sugary foods that cause energy crashes

**Mouth sores:**
- Eat soft, cool or room-temperature foods
- Try: curd rice, soft fruit (banana, papaya), smooth dhal soup
- Avoid spicy foods and very hot beverages temporarily

**Recommended Sri Lankan foods during treatment:**
🌿 Gotukola malluma — rich in antioxidants
🥥 Coconut water — excellent for hydration and electrolytes
🍛 Dhal curry — high in protein and fibre
🐟 Fish (seer fish, tuna) — omega-3 fatty acids
🍌 Bananas — easy to digest, rich in potassium
🫚 Turmeric (kurundu haldi) — anti-inflammatory properties

**Foods to moderate:**
- Processed meats and packaged foods
- Alcohol
- Excess sugar and refined carbohydrates""",
        "image_url":    None,
        "read_time":    5,
        "tags":         ["nutrition", "diet", "chemotherapy", "recovery", "Sri Lankan food"],
        "published_at": NOW,
    },
    {
        "title":        "Understanding Your Pathology Report",
        "category":     "treatment",
        "summary":      "A plain-language guide to decoding the medical terminology in your breast cancer pathology report.",
        "content":      """Receiving your pathology report can be confusing. Here is what the key terms mean.

**Hormone Receptor Status (ER/PR):**
- ER+ (Estrogen Receptor Positive): Cancer cells need estrogen to grow. Good news — hormone therapy works well.
- PR+ (Progesterone Receptor Positive): Similar to ER+. Often found together.
- Triple Negative: ER-, PR-, HER2-. Does not respond to hormone therapy; treated with chemotherapy.

**HER2 Status:**
- HER2+ (Positive): Cancer cells have too many copies of the HER2 gene. Treated with targeted therapy (Trastuzumab).
- HER2- (Negative): No overexpression.

**Grade (1, 2, 3):**
- Grade 1 (Low): Cancer cells look similar to normal cells; grow slowly.
- Grade 2 (Moderate): Intermediate.
- Grade 3 (High): Cells look very different; grow quickly. May respond better to chemotherapy.

**Margins:**
- Clear/Negative margins: No cancer cells at the edge of removed tissue — good outcome.
- Positive margins: Cancer cells found at the edge — may need more surgery.

**Stage (0–IV):**
- Stage 0: DCIS (non-invasive, very early)
- Stage I–II: Early invasive cancer
- Stage III: Locally advanced
- Stage IV: Metastatic (spread to other organs)

Always ask your oncologist to explain your specific report in full. You have the right to a second opinion.""",
        "image_url":    None,
        "read_time":    7,
        "tags":         ["pathology", "diagnosis", "staging", "HER2", "hormone receptor"],
        "published_at": NOW,
    },
]
db.articles.insert_many(articles)
print(f"✅ {len(articles)} articles seeded.")


# ── 3. SELF-EXAM STEPS ──────────────────────────────────────
self_exam_steps = [
    {
        "step": 1,
        "title": "Visual Check — Arms at Sides",
        "description": "Stand undressed from the waist up in front of a large mirror in good lighting. Look at your breasts with your arms relaxed at your sides. Check for any changes in size, shape, colour, or symmetry. Look for dimpling, puckering, swelling, or redness.",
        "tip": "It is normal for one breast to be slightly larger than the other. Look for changes from your own normal.",
        "image_url": None,
    },
    {
        "step": 2,
        "title": "Visual Check — Arms Raised",
        "description": "Now raise both arms above your head and clasp your hands together. Look for the same changes. This position stretches the skin and can reveal dimpling or puckering not visible in the resting position. Check for any fluid leaking from one or both nipples.",
        "tip": "Fluid discharge (other than breast milk) — especially if bloody, clear, or only from one breast — should always be reported to a doctor.",
        "image_url": None,
    },
    {
        "step": 3,
        "title": "Feel — Lying Down",
        "description": "Lie on your back with your right arm behind your head. Use the pads (not tips) of your three middle fingers of your left hand to feel your right breast. Use small, firm circular motions about the size of a 5-rupee coin. Cover the entire breast from top to bottom, side to side — from armpit to sternum, and from collarbone to abdomen. Use three pressure levels: light (skin), medium (middle tissue), firm (deep tissue near ribs).",
        "tip": "Use the same pattern every time — either circles, up-and-down rows, or wedge sections. Consistency ensures you don't miss any area.",
        "image_url": None,
    },
    {
        "step": 4,
        "title": "Feel — Standing or in Shower",
        "description": "Repeat step 3 while standing. Many women find it easiest in the shower with soapy or wet skin. Raise your right arm and use your left hand to examine your right breast. Then switch sides. Make sure to feel all breast tissue including the area toward the armpit, which contains many lymph nodes.",
        "tip": "The shower method works well because wet skin allows your fingers to glide smoothly and feel tissue more accurately.",
        "image_url": None,
    },
    {
        "step": 5,
        "title": "Check Both Sides Completely",
        "description": "Repeat the entire examination for the left breast. Note any differences between the two sides. Also gently squeeze each nipple between your thumb and forefinger and note any discharge. Examine your armpits — feel for any swollen lymph nodes (firm, round bumps under the arm).",
        "tip": "Perform monthly, 3–5 days after your menstrual period ends when breasts are least tender and swollen. If postmenopausal, choose the same date each month.",
        "image_url": None,
    },
]
db.self_exam_steps.insert_many(self_exam_steps)
print(f"✅ {len(self_exam_steps)} self-exam steps seeded.")


# ── 4. RISK FACTORS ─────────────────────────────────────────
risk_factors = [
    {"factor": "Age", "category": "non-modifiable", "description": "Risk increases with age. Most cases occur in women over 50.", "weight": 3},
    {"factor": "Family history", "category": "non-modifiable", "description": "First-degree relatives (mother, sister, daughter) with breast cancer double your risk.", "weight": 5},
    {"factor": "BRCA1/BRCA2 gene mutations", "category": "non-modifiable", "description": "These inherited mutations significantly increase lifetime risk (up to 72% for BRCA1).", "weight": 5},
    {"factor": "Early menstruation (before 12)", "category": "non-modifiable", "description": "More years of menstruation means longer hormone exposure.", "weight": 2},
    {"factor": "Late menopause (after 55)", "category": "non-modifiable", "description": "Extended lifetime exposure to estrogen and progesterone.", "weight": 2},
    {"factor": "Dense breast tissue", "category": "non-modifiable", "description": "Dense breasts have more glandular tissue relative to fatty tissue, increasing risk.", "weight": 3},
    {"factor": "Alcohol consumption", "category": "modifiable", "description": "Even one drink per day increases risk slightly. Risk grows with amount consumed.", "weight": 3},
    {"factor": "Obesity after menopause", "category": "modifiable", "description": "Fat tissue produces estrogen, increasing risk in postmenopausal women.", "weight": 3},
    {"factor": "Physical inactivity", "category": "modifiable", "description": "Regular exercise reduces risk by up to 25%.", "weight": 2},
    {"factor": "Hormone replacement therapy (HRT)", "category": "modifiable", "description": "Long-term combined HRT use after menopause increases risk.", "weight": 3},
    {"factor": "No previous pregnancies", "category": "modifiable", "description": "Women who have never been pregnant or had first child after 30 have slightly higher risk.", "weight": 2},
    {"factor": "Smoking", "category": "modifiable", "description": "Linked to increased risk, especially in women who begin smoking at a young age.", "weight": 2},
]
db.risk_factors.insert_many(risk_factors)
print(f"✅ {len(risk_factors)} risk factors seeded.")


# ── 5. MEDICINES ────────────────────────────────────────────
medicines = [
    {
        "name":         "Tamoxifen",
        "generic_name": "Tamoxifen Citrate",
        "brand":        "Nolvadex / Tamofen",
        "category":     "hormone",
        "description":  "Selective estrogen receptor modulator (SERM) used for ER-positive breast cancer in pre- and post-menopausal women. Standard adjuvant therapy for 5–10 years.",
        "side_effects": ["Hot flushes", "Night sweats", "Vaginal dryness", "Mood changes", "Increased risk of blood clots", "Rare: uterine cancer"],
        "is_essential": True,
        "pharmacies": [
            {"pharmacy_id": "p001", "pharmacy_name": "Apeksha Hospital Pharmacy", "address": "Maharagama", "district": "Colombo", "phone": "+94114620000", "in_stock": True, "price": 850, "last_updated": NOW},
            {"pharmacy_id": "p002", "pharmacy_name": "Osu Sala – Borella", "address": "Borella, Colombo 8", "district": "Colombo", "phone": "+94112694532", "in_stock": True, "price": 800, "last_updated": NOW},
            {"pharmacy_id": "p003", "pharmacy_name": "Osu Sala – Kandy", "address": "Kandy Road, Kandy", "district": "Kandy", "phone": "+94812222845", "in_stock": True, "price": 820, "last_updated": NOW},
            {"pharmacy_id": "p004", "pharmacy_name": "City Pharmacy Galle", "address": "Main Street, Galle", "district": "Galle", "phone": "+94912222333", "in_stock": False, "price": 900, "last_updated": NOW},
            {"pharmacy_id": "p005", "pharmacy_name": "Keells Pharmacy Matara", "address": "Matara Town", "district": "Matara", "phone": "+94412222100", "in_stock": True, "price": 870, "last_updated": NOW},
        ]
    },
    {
        "name":         "Letrozole",
        "generic_name": "Letrozole",
        "brand":        "Femara",
        "category":     "hormone",
        "description":  "Aromatase inhibitor for hormone receptor-positive breast cancer in postmenopausal women. Reduces estrogen production in the body.",
        "side_effects": ["Joint pain", "Hot flushes", "Bone density loss", "Fatigue", "Nausea", "Increased cholesterol"],
        "is_essential": True,
        "pharmacies": [
            {"pharmacy_id": "p006", "pharmacy_name": "Lanka Hospitals Pharmacy", "address": "Narahenpita, Colombo 5", "district": "Colombo", "phone": "+94115430000", "in_stock": True, "price": 3200, "last_updated": NOW},
            {"pharmacy_id": "p007", "pharmacy_name": "Asiri Pharmacy", "address": "Kirula Rd, Colombo 5", "district": "Colombo", "phone": "+94114526200", "in_stock": True, "price": 3400, "last_updated": NOW},
            {"pharmacy_id": "p008", "pharmacy_name": "Osu Sala – Kandy Teaching Hospital", "address": "Kandy", "district": "Kandy", "phone": "+94812234540", "in_stock": False, "price": 3000, "last_updated": NOW},
        ]
    },
    {
        "name":         "Trastuzumab",
        "generic_name": "Trastuzumab",
        "brand":        "Herceptin / Biceltis",
        "category":     "targeted",
        "description":  "Monoclonal antibody targeting HER2-positive breast cancer. Given intravenously every 3 weeks for 1 year as adjuvant treatment.",
        "side_effects": ["Cardiac toxicity (monitor heart function)", "Infusion reactions", "Fatigue", "Diarrhea", "Headache"],
        "is_essential": True,
        "pharmacies": [
            {"pharmacy_id": "p009", "pharmacy_name": "Apeksha Hospital Pharmacy", "address": "Maharagama", "district": "Colombo", "phone": "+94114620000", "in_stock": True, "price": 85000, "last_updated": NOW},
            {"pharmacy_id": "p010", "pharmacy_name": "Lanka Hospitals Pharmacy", "address": "Narahenpita, Colombo 5", "district": "Colombo", "phone": "+94115430000", "in_stock": True, "price": 92000, "last_updated": NOW},
        ]
    },
    {
        "name":         "Cyclophosphamide",
        "generic_name": "Cyclophosphamide",
        "brand":        "Endoxan / Cytoxan",
        "category":     "chemotherapy",
        "description":  "Alkylating agent used in combination chemotherapy regimens (AC, CMF, FEC) for breast cancer. Available as tablet and IV injection.",
        "side_effects": ["Nausea/vomiting", "Hair loss (alopecia)", "Increased infection risk", "Bladder irritation", "Fatigue", "Rare: secondary leukemia"],
        "is_essential": True,
        "pharmacies": [
            {"pharmacy_id": "p011", "pharmacy_name": "Apeksha Hospital Pharmacy", "address": "Maharagama", "district": "Colombo", "phone": "+94114620000", "in_stock": True, "price": 1200, "last_updated": NOW},
            {"pharmacy_id": "p012", "pharmacy_name": "General Hospital Kandy", "address": "Kandy", "district": "Kandy", "phone": "+94812233337", "in_stock": True, "price": 1100, "last_updated": NOW},
        ]
    },
    {
        "name":         "Anastrozole",
        "generic_name": "Anastrozole",
        "brand":        "Arimidex",
        "category":     "hormone",
        "description":  "Aromatase inhibitor for postmenopausal ER-positive breast cancer. Alternative to Tamoxifen with different side-effect profile.",
        "side_effects": ["Joint and muscle pain", "Bone density loss", "Hot flushes", "Mood changes"],
        "is_essential": True,
        "pharmacies": [
            {"pharmacy_id": "p013", "pharmacy_name": "Lanka Hospitals Pharmacy", "address": "Narahenpita, Colombo 5", "district": "Colombo", "phone": "+94115430000", "in_stock": True, "price": 2800, "last_updated": NOW},
            {"pharmacy_id": "p014", "pharmacy_name": "Durdans Pharmacy", "address": "Duplication Rd, Colombo 3", "district": "Colombo", "phone": "+94113140000", "in_stock": True, "price": 3000, "last_updated": NOW},
        ]
    },
    {
        "name":         "Ondansetron",
        "generic_name": "Ondansetron HCl",
        "brand":        "Zofran / Emeset",
        "category":     "supportive",
        "description":  "Anti-nausea medication essential for managing chemotherapy-induced nausea and vomiting. Widely available across Sri Lanka.",
        "side_effects": ["Headache", "Constipation", "Dizziness"],
        "is_essential": True,
        "pharmacies": [
            {"pharmacy_id": "p015", "pharmacy_name": "Osu Sala – Borella", "address": "Borella, Colombo 8", "district": "Colombo", "phone": "+94112694532", "in_stock": True, "price": 120, "last_updated": NOW},
            {"pharmacy_id": "p016", "pharmacy_name": "Osu Sala – Kandy", "address": "Kandy", "district": "Kandy", "phone": "+94812222845", "in_stock": True, "price": 110, "last_updated": NOW},
            {"pharmacy_id": "p017", "pharmacy_name": "Osu Sala – Galle", "address": "Galle", "district": "Galle", "phone": "+94912233100", "in_stock": True, "price": 115, "last_updated": NOW},
            {"pharmacy_id": "p018", "pharmacy_name": "Any District Pharmacy", "address": "All Districts", "district": "Matara", "phone": "+94412200000", "in_stock": True, "price": 130, "last_updated": NOW},
        ]
    },
]
db.medicines.insert_many(medicines)
print(f"✅ {len(medicines)} medicines seeded.")


# ── 6. HOSPITALS ────────────────────────────────────────────
hospitals = [
    {
        "name":                "Apeksha Hospital (National Cancer Hospital)",
        "type":                "government",
        "address":             "Maharagama, Western Province",
        "district":            "Colombo",
        "province":            "Western",
        "phone":               ["+94 11 4620000", "+94 11 4620001"],
        "email":               "info@apeksha.health.gov.lk",
        "website":             "https://www.health.gov.lk",
        "location":            {"type": "Point", "coordinates": [79.9968, 6.8485]},
        "lat":                 6.8485,
        "lng":                 79.9968,
        "specialties":         ["Medical Oncology", "Radiation Oncology", "Surgical Oncology", "Chemotherapy", "Palliative Care"],
        "has_cancer_unit":     True,
        "has_oncologist":      True,
        "emergency_available": True,
        "rating":              4.5,
        "notes":               "Sri Lanka's primary dedicated cancer hospital. Free treatment for government referrals including chemotherapy and radiation.",
    },
    {
        "name":                "Lanka Hospitals Cancer Centre",
        "type":                "private",
        "address":             "578 Elvitigala Mawatha, Narahenpita, Colombo 5",
        "district":            "Colombo",
        "province":            "Western",
        "phone":               ["+94 11 5430000"],
        "email":               "cancer@lankahospitals.com",
        "website":             "https://www.lankahospitals.com",
        "location":            {"type": "Point", "coordinates": [79.8697, 6.8948]},
        "lat":                 6.8948,
        "lng":                 79.8697,
        "specialties":         ["Medical Oncology", "Breast Surgery", "Mammography", "Genetic Counselling", "Targeted Therapy"],
        "has_cancer_unit":     True,
        "has_oncologist":      True,
        "emergency_available": True,
        "rating":              4.8,
        "notes":               "State-of-the-art private cancer centre with advanced imaging and multidisciplinary team.",
    },
    {
        "name":                "Asiri Surgical Hospital",
        "type":                "private",
        "address":             "21 Kirimandala Mawatha, Colombo 5",
        "district":            "Colombo",
        "province":            "Western",
        "phone":               ["+94 11 4526200"],
        "website":             "https://www.asirihealth.com",
        "location":            {"type": "Point", "coordinates": [79.8681, 6.8989]},
        "lat":                 6.8989,
        "lng":                 79.8681,
        "specialties":         ["Breast Surgery", "Mammography", "Oncology", "Pathology"],
        "has_cancer_unit":     True,
        "has_oncologist":      True,
        "emergency_available": True,
        "rating":              4.7,
        "notes":               "Specialist breast surgery unit with same-day mammography results available.",
    },
    {
        "name":                "Teaching Hospital Karapitiya",
        "type":                "teaching",
        "address":             "Karapitiya, Galle",
        "district":            "Galle",
        "province":            "Southern",
        "phone":               ["+94 91 2234540"],
        "location":            {"type": "Point", "coordinates": [80.2113, 6.0534]},
        "lat":                 6.0534,
        "lng":                 80.2113,
        "specialties":         ["Oncology", "General Surgery", "Radiology"],
        "has_cancer_unit":     True,
        "has_oncologist":      True,
        "emergency_available": True,
        "rating":              4.1,
        "notes":               "Main cancer referral centre for Southern Province.",
    },
    {
        "name":                "Teaching Hospital Kandy",
        "type":                "teaching",
        "address":             "Kandy",
        "district":            "Kandy",
        "province":            "Central",
        "phone":               ["+94 81 2223337"],
        "location":            {"type": "Point", "coordinates": [80.6337, 7.2906]},
        "lat":                 7.2906,
        "lng":                 80.6337,
        "specialties":         ["Oncology", "Surgery", "Radiation Therapy", "Pathology"],
        "has_cancer_unit":     True,
        "has_oncologist":      True,
        "emergency_available": True,
        "rating":              4.2,
        "notes":               "Main referral hospital for Central Province with full oncology services.",
    },
    {
        "name":                "Teaching Hospital Jaffna",
        "type":                "teaching",
        "address":             "Jaffna",
        "district":            "Jaffna",
        "province":            "Northern",
        "phone":               ["+94 21 2222261"],
        "location":            {"type": "Point", "coordinates": [80.0158, 9.6615]},
        "lat":                 9.6615,
        "lng":                 80.0158,
        "specialties":         ["Oncology", "Surgery", "Radiology"],
        "has_cancer_unit":     True,
        "has_oncologist":      True,
        "emergency_available": True,
        "rating":              4.0,
        "notes":               "Main cancer referral centre for Northern Province.",
    },
    {
        "name":                "District General Hospital Badulla",
        "type":                "government",
        "address":             "Badulla",
        "district":            "Badulla",
        "province":            "Uva",
        "phone":               ["+94 55 2222261"],
        "location":            {"type": "Point", "coordinates": [81.0550, 6.9934]},
        "lat":                 6.9934,
        "lng":                 81.0550,
        "specialties":         ["Surgery", "Radiology", "Oncology referral"],
        "has_cancer_unit":     False,
        "has_oncologist":      False,
        "emergency_available": True,
        "rating":              3.8,
        "notes":               "For specialist oncology treatment, refer to Apeksha Hospital or Teaching Hospital Kandy.",
    },
]
db.hospitals.insert_many(hospitals)
# Create geospatial index for nearby search
db.hospitals.create_index([("location", GEOSPHERE)])
print(f"✅ {len(hospitals)} hospitals seeded + 2dsphere index created.")


# ── 7. COUNSELLORS ──────────────────────────────────────────
counsellors = [
    {
        "name":             "Dr. Priyanthi Jayasinghe",
        "qualifications":   ["PhD Clinical Psychology (University of Kelaniya)", "MSc Oncology Counselling (UK)", "Certified Grief Therapist"],
        "specialty":        "Cancer patient counselling, grief therapy, and post-treatment psychological recovery",
        "languages":        ["Sinhala", "English"],
        "available_days":   ["Monday", "Wednesday", "Friday"],
        "session_types":    ["online", "in-person"],
        "hospital":         "Apeksha Hospital, Maharagama",
        "contact_email":    "priyanthi.j@hope.lk",
        "avatar":           None,
        "bio":              "Dr. Priyanthi has 12 years of experience supporting cancer patients through diagnosis, treatment, and survivorship. She leads group therapy sessions at Apeksha Hospital.",
        "fee_lkr":          0,
        "is_volunteer":     True,
    },
    {
        "name":             "Mr. Kasun Bandara",
        "qualifications":   ["MA Counselling Psychology (University of Colombo)", "Certified Oncology Social Worker (IPOS)"],
        "specialty":        "Family and caregiver support, caregiver burnout, and financial distress counselling",
        "languages":        ["Sinhala", "English", "Tamil"],
        "available_days":   ["Tuesday", "Thursday", "Saturday"],
        "session_types":    ["online"],
        "hospital":         "NIMH, Angoda",
        "contact_email":    "kasun.b@hope.lk",
        "avatar":           None,
        "bio":              "Kasun specialises in supporting the families and caregivers of breast cancer patients, helping them manage stress, burnout and practical challenges.",
        "fee_lkr":          0,
        "is_volunteer":     True,
    },
    {
        "name":             "Dr. Nirmala Cooray",
        "qualifications":   ["MD Psychiatry (University of Peradeniya)", "Diploma in Palliative Care", "MRCP (Oncology)"],
        "specialty":        "Anxiety, depression, end-of-life counselling, and psychiatric support for cancer patients",
        "languages":        ["Sinhala", "Tamil", "English"],
        "available_days":   ["Monday", "Tuesday", "Thursday"],
        "session_types":    ["online", "in-person"],
        "hospital":         "General Hospital Kandy",
        "contact_email":    "nirmala.c@hope.lk",
        "avatar":           None,
        "bio":              "Dr. Nirmala is a consultant psychiatrist with 18 years of experience, with a subspeciality in psycho-oncology.",
        "fee_lkr":          0,
        "is_volunteer":     True,
    },
    {
        "name":             "Ms. Thanuja Perera",
        "qualifications":   ["BSc Nursing", "Diploma Oncology Nursing", "Certificate in Psychological First Aid"],
        "specialty":        "Practical coping skills, medication side effects management, and patient education",
        "languages":        ["Sinhala"],
        "available_days":   ["Wednesday", "Friday", "Saturday"],
        "session_types":    ["online"],
        "hospital":         "Apeksha Hospital, Maharagama",
        "contact_email":    "thanuja.p@hope.lk",
        "avatar":           None,
        "bio":              "Thanuja is an oncology nurse who has transitioned to counselling to help patients navigate the practical and emotional challenges of treatment.",
        "fee_lkr":          0,
        "is_volunteer":     True,
    },
]
db.counsellors.insert_many(counsellors)
print(f"✅ {len(counsellors)} counsellors seeded.")


# ── 8. MOTIVATIONAL CONTENT ─────────────────────────────────
motivational = [
    {"type": "quote", "title": "Fight Together", "content": "You are not fighting alone. Every woman who has walked this path before you has lit a candle in the dark.", "author": "HOPE Community", "tags": ["strength", "community"]},
    {"type": "quote", "title": "Courage", "content": "Strength is not the absence of fear — it is choosing to face it, one day at a time.", "author": "Survivor, Colombo", "tags": ["courage", "fear"]},
    {"type": "tip",   "title": "Morning Walk Tip", "content": "Gentle 10-minute morning walks can significantly reduce fatigue during chemotherapy and boost your mood. Even on difficult days, small movement helps.", "author": "Dr. Priyanthi Jayasinghe", "tags": ["exercise", "chemo", "energy"]},
    {"type": "story", "title": "Nimesha's Story", "content": "Nimesha was diagnosed at Stage II at age 38. After 6 months of chemotherapy and surgery, she is now 2 years cancer-free. 'I thought my life was over. But it was just a new chapter beginning,' she says.", "author": "Nimesha, 38, Gampaha", "tags": ["survivor", "hope", "recovery"]},
    {"type": "quote", "title": "The Ribbon", "content": "The pink ribbon is not just a symbol. It is a promise — that no woman faces this alone.", "author": "HOPE Team", "tags": ["awareness", "solidarity"]},
    {"type": "tip",   "title": "Symptom Diary", "content": "Keep a symptom diary during treatment — note side effects, pain levels, and mood daily. Bring it to every oncology appointment. It helps your team adjust your care plan precisely.", "author": "Dr. Kamani Silva, Oncologist", "tags": ["treatment", "tips", "medical"]},
    {"type": "quote", "title": "One Day at a Time", "content": "You don't have to conquer cancer today. You just have to get through today. That is enough.", "author": "Survivor, Kandy", "tags": ["mindfulness", "strength"]},
    {"type": "story", "title": "Sanduni's Family Journey", "content": "When Sanduni's mother was diagnosed, she became her primary caregiver while working full-time. 'HOPE helped me find a counsellor who spoke Tamil, which meant everything to our family.' Her mother completed treatment 6 months ago.", "author": "Sanduni, 32, Jaffna", "tags": ["caregiver", "family", "tamil"]},
    {"type": "tip",   "title": "Nutrition During Chemo", "content": "Coconut water (pol water) is excellent during chemotherapy — it replenishes electrolytes naturally, is gentle on the stomach, and is widely available in Sri Lanka. Drink chilled for nausea relief.", "author": "HOPE Nutrition Team", "tags": ["nutrition", "chemo", "nausea"]},
    {"type": "quote", "title": "Roots and Wings", "content": "A tree does not fear the storm because it trusts its roots. Trust your strength — it runs deeper than you know.", "author": "HOPE Community", "tags": ["strength", "faith"]},
]
db.motivational.insert_many(motivational)
print(f"✅ {len(motivational)} motivational items seeded.")


# ── 9. SAMPLE FORUM POSTS ───────────────────────────────────
sample_posts = [
    {
        "author_id":    "admin",
        "author_name":  "HOPE Admin",
        "author_role":  "admin",
        "title":        "Welcome to the HOPE Community Forum 🎀",
        "content":      "Welcome to our safe, supportive community. This forum is a space for patients, survivors, caregivers and healthcare professionals to share, ask questions, and find strength. Please be kind, be honest, and remember — you are never alone on this journey. Community guidelines: Be respectful. Do not share personal medical advice. All posts are moderated.",
        "category":     "general",
        "tags":         ["welcome", "guidelines", "community"],
        "likes":        24,
        "liked_by":     [],
        "comments":     [],
        "is_pinned":    True,
        "is_flagged":   False,
        "created_at":   NOW,
        "updated_at":   NOW,
    },
]
db.posts.insert_many(sample_posts)
print(f"✅ {len(sample_posts)} sample posts seeded.")


# ── Final summary ────────────────────────────────────────────
print("\n" + "="*50)
print("✅ HOPE database seeded successfully!")
print(f"   DB: {DB_NAME}")
print(f"   Users:           {db.users.count_documents({})}")
print(f"   Articles:        {db.articles.count_documents({})}")
print(f"   Self-exam steps: {db.self_exam_steps.count_documents({})}")
print(f"   Risk factors:    {db.risk_factors.count_documents({})}")
print(f"   Medicines:       {db.medicines.count_documents({})}")
print(f"   Hospitals:       {db.hospitals.count_documents({})}")
print(f"   Counsellors:     {db.counsellors.count_documents({})}")
print(f"   Motivational:    {db.motivational.count_documents({})}")
print(f"   Forum posts:     {db.posts.count_documents({})}")
print("="*50)
client.close()
