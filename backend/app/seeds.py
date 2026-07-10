from werkzeug.security import generate_password_hash


def seed_defaults(store):
    if store.count("users") == 0:
        users = [
            {"name": "Hope Patient", "email": "patient@hope.local", "role": "patient", "password": "Patient123!"},
            {"name": "Dr. Hope Demo", "email": "doctor@hope.local", "role": "doctor", "password": "Doctor123!"},
            {"name": "Hope Pharmacist", "email": "pharmacist@hope.local", "role": "pharmacist", "password": "Pharmacist123!"},
            {"name": "Hope Admin", "email": "admin@hope.local", "role": "admin", "password": "HopeAdmin123!"},
        ]
        for user in users:
            password = user.pop("password")
            user["passwordHash"] = generate_password_hash(password)
            user["isActive"] = True
            store.insert("users", user)

    if store.count("articles") == 0:
        articles = [
            {
                "slug": "warning-signs",
                "title": "Warning signs that need medical review",
                "category": "Awareness",
                "summary": "Learn changes that should be discussed with a healthcare professional.",
                "readingMinutes": 4,
                "lastReviewed": "2026-04-15",
                "nextReviewDate": "2026-10-15",
                "sources": ["WHO breast cancer fact sheet", "CDC breast cancer symptoms"],
                "reviewStatus": "published",
                "countryApplicability": "Sri Lanka",
                "clinicalDisclaimer": "Educational support only. Not diagnostic advice.",
                "version": "1.0",
                "reviewedBy": "Hope Clinical Reviewer",
                "reviewerRole": "doctor",
                "content": [
                    "Breast changes can have many causes. Some are harmless, but a new or persistent change should be checked by a healthcare professional.",
                    "Important changes include a new breast or underarm lump, thickening, swelling, dimpling, redness, nipple pulling, nipple pain, discharge that is not breast milk, or a change in size or shape.",
                    "This information is for awareness only. It cannot confirm or rule out cancer. Seek professional care for symptoms that worry you.",
                ],
            },
            {
                "slug": "risk-factors",
                "title": "Risk factors and protective habits",
                "category": "Prevention",
                "summary": "Understand personal risk factors and healthy habits to discuss with a clinician.",
                "readingMinutes": 5,
                "lastReviewed": "2026-04-15",
                "nextReviewDate": "2026-10-15",
                "sources": ["WHO breast cancer fact sheet"],
                "reviewStatus": "published",
                "countryApplicability": "Sri Lanka",
                "clinicalDisclaimer": "Educational support only. Not diagnostic advice.",
                "version": "1.0",
                "reviewedBy": "Hope Clinical Reviewer",
                "reviewerRole": "doctor",
                "content": [
                    "Age, sex, family history, inherited gene changes, prior radiation exposure, reproductive history, alcohol use, tobacco use, obesity, and hormone therapy can affect risk.",
                    "Having no family history does not mean a person has no risk. Many people diagnosed with breast cancer do not have a known family history.",
                    "A clinician can help decide whether genetic counselling, earlier screening, or extra imaging is appropriate.",
                ],
            },
            {
                "slug": "screening-pathways",
                "title": "Screening and early detection pathways",
                "category": "Screening",
                "summary": "Know what screening is and when to ask for a personalized plan.",
                "readingMinutes": 6,
                "lastReviewed": "2026-04-15",
                "nextReviewDate": "2026-10-15",
                "sources": ["American Cancer Society screening guidelines", "WHO early detection guidance"],
                "reviewStatus": "published",
                "countryApplicability": "Sri Lanka",
                "clinicalDisclaimer": "Educational support only. Not diagnostic advice.",
                "version": "1.0",
                "reviewedBy": "Hope Clinical Reviewer",
                "reviewerRole": "doctor",
                "content": [
                    "Screening looks for cancer before symptoms appear. Mammography is the main screening tool used in many health systems.",
                    "Screening schedules depend on age, risk level, country guidelines, access, and clinician advice.",
                    "People with a strong family history, known gene mutation, previous chest radiation, or other high-risk factors should ask for a personalized screening plan.",
                ],
            },
            {
                "slug": "emotional-support",
                "title": "Emotional support during uncertainty",
                "category": "Support",
                "summary": "Practical steps for anxiety, waiting periods, and caregiver support.",
                "readingMinutes": 4,
                "lastReviewed": "2026-03-01",
                "nextReviewDate": "2026-09-01",
                "sources": ["Project counsellor review recommended"],
                "reviewStatus": "published",
                "countryApplicability": "Sri Lanka",
                "clinicalDisclaimer": "Educational support only. Not diagnostic advice.",
                "version": "1.0",
                "reviewedBy": "Hope Clinical Reviewer",
                "reviewerRole": "doctor",
                "content": [
                    "Waiting for appointments or results can be stressful. It can help to write down questions, bring a trusted person, and keep a record of symptoms and dates.",
                    "Breathing exercises, short walks, prayer or meditation, journaling, and speaking with a counsellor can support mental well-being.",
                    "Seek urgent support if distress feels overwhelming or if you feel unsafe.",
                ],
            },
            {
                "slug": "treatment-navigation",
                "title": "Navigating treatment and recovery",
                "category": "Recovery",
                "summary": "Use care teams, medicine tracking, and support networks during recovery.",
                "readingMinutes": 5,
                "lastReviewed": "2026-03-01",
                "nextReviewDate": "2026-09-01",
                "sources": ["WHO multidisciplinary care guidance"],
                "reviewStatus": "published",
                "countryApplicability": "Sri Lanka",
                "clinicalDisclaimer": "Educational support only. Not diagnostic advice.",
                "version": "1.0",
                "reviewedBy": "Hope Clinical Reviewer",
                "reviewerRole": "doctor",
                "content": [
                    "Breast cancer care may involve surgery, radiotherapy, medicines, rehabilitation, nutrition, and mental health support depending on the diagnosis.",
                    "Patient navigation helps people move through appointments, tests, treatment, medicines, and recovery support.",
                    "Use HOPE to organize questions, find support resources, and request help from providers or pharmacies.",
                ],
            },
        ]
        for article in articles:
            store.insert("articles", article)

    if store.count("self_exam_steps") == 0:
        steps = [
            {"order": 1, "title": "Know your normal", "detail": "Notice how your breasts usually look and feel across the month. Normal can be different for every person."},
            {"order": 2, "title": "Look in the mirror", "detail": "Check shape, size, skin texture, redness, dimpling, swelling, or nipple changes with arms relaxed and raised."},
            {"order": 3, "title": "Use finger pads", "detail": "Use the pads of three fingers to feel in small circles. Cover the whole breast area and underarm."},
            {"order": 4, "title": "Change pressure", "detail": "Use light, medium, and firm pressure so you can feel tissue near the skin and deeper tissue."},
            {"order": 5, "title": "Check nipples", "detail": "Look for new pulling in, rash, pain, or discharge that is not breast milk."},
            {"order": 6, "title": "Record and act", "detail": "Write down new changes and dates. Contact a healthcare professional for changes that are new, persistent, or worrying."},
        ]
        for step in steps:
            store.insert("self_exam_steps", step)

    if store.count("medicines") == 0:
        medicines = [
            {"name": "Tamoxifen", "type": "Hormone therapy", "strength": "20 mg", "pharmacy": "Hope Demo Pharmacy - Colombo", "city": "Colombo", "status": "Available", "quantity": 36, "updatedBy": "pharmacist@hope.local", "note": "Demo stock. Verify before purchase.", "isActive": True},
            {"name": "Anastrozole", "type": "Hormone therapy", "strength": "1 mg", "pharmacy": "CareLink Pharmacy - Kandy", "city": "Kandy", "status": "Low stock", "quantity": 8, "updatedBy": "pharmacist@hope.local", "note": "Demo stock. Prescription medicine.", "isActive": True},
            {"name": "Letrozole", "type": "Hormone therapy", "strength": "2.5 mg", "pharmacy": "Hope Demo Pharmacy - Galle", "city": "Galle", "status": "Available", "quantity": 22, "updatedBy": "pharmacist@hope.local", "note": "Demo stock. Prescription medicine.", "isActive": True},
            {"name": "Trastuzumab", "type": "Targeted therapy", "strength": "150 mg vial", "pharmacy": "Oncology Partner Pharmacy - Colombo", "city": "Colombo", "status": "Request required", "quantity": 0, "updatedBy": "pharmacist@hope.local", "note": "Specialist prescription and cold chain required.", "isActive": True},
            {"name": "Ondansetron", "type": "Supportive medicine", "strength": "4 mg", "pharmacy": "CareLink Pharmacy - Matara", "city": "Matara", "status": "Available", "quantity": 50, "updatedBy": "pharmacist@hope.local", "note": "Use only as prescribed.", "isActive": True},
        ]
        for medicine in medicines:
            store.insert("medicines", medicine)

    if store.count("providers") == 0:
        providers = [
            {"name": "Hope Oncology Navigation Desk", "type": "Cancer support", "city": "Colombo", "phone": "+94 11 000 0001", "email": "navigation@hope.local", "services": ["screening guidance", "appointment navigation", "support group referrals"], "acceptingAppointments": True, "isDemo": True, "isActive": True, "verifiedBy": "Hope Admin", "verificationSource": "seed"},
            {"name": "Pink Ribbon Counselling Unit", "type": "Counselling", "city": "Kandy", "phone": "+94 81 000 0002", "email": "counselling@hope.local", "services": ["emotional support", "caregiver support", "recovery planning"], "acceptingAppointments": True, "isDemo": True, "isActive": True, "verifiedBy": "Hope Admin", "verificationSource": "seed"},
            {"name": "Community Screening Partner", "type": "Screening center", "city": "Galle", "phone": "+94 91 000 0003", "email": "screening@hope.local", "services": ["clinical breast exam", "mammography referral", "risk review"], "acceptingAppointments": True, "isDemo": True, "isActive": True, "verifiedBy": "Hope Admin", "verificationSource": "seed"},
            {"name": "Hope Telehealth Doctor", "type": "Telehealth", "city": "Online", "phone": "+94 70 000 0004", "email": "doctor@hope.local", "services": ["first consultation", "report discussion", "referral planning"], "acceptingAppointments": True, "isDemo": True, "isActive": True, "verifiedBy": "Hope Admin", "verificationSource": "seed"},
        ]
        for provider in providers:
            store.insert("providers", provider)

    if store.count("support_resources") == 0:
        resources = [
            {"title": "Breathing reset", "type": "Exercise", "description": "Inhale for 4 counts, hold for 2, exhale for 6. Repeat five times before appointments or scans."},
            {"title": "Question list for appointments", "type": "Preparation", "description": "Write symptoms, dates, medicines, allergies, family history, and the top three questions you need answered."},
            {"title": "Caregiver check-in", "type": "Caregiver", "description": "Ask: What do you need today? What can I take off your list? Who should we contact next?"},
            {"title": "Urgent help reminder", "type": "Safety", "description": "If you feel unsafe, severely distressed, or at risk of self-harm, contact local emergency services or a trusted person immediately."},
        ]
        for item in resources:
            store.insert("support_resources", item)

    if store.count("community_posts") == 0:
        posts = [
            {"authorName": "Hope Team", "authorRole": "admin", "title": "Welcome to the HOPE community", "body": "This space is for encouragement, questions, reminders, and sharing support. Please avoid giving medical diagnoses and always encourage professional care.", "tags": ["welcome", "support"], "moderationStatus": "approved"},
            {"authorName": "Hope Patient", "authorRole": "patient", "title": "Preparing for a screening appointment", "body": "I found it helpful to write symptoms and questions before going. What do you usually take with you?", "tags": ["screening", "questions"], "moderationStatus": "approved"},
        ]
        for post in posts:
            store.insert("community_posts", post)
