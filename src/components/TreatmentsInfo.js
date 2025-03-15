import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// Treatment data
const treatmentsData = {
  ivf: {
    title: "IVF (In Vitro Fertilization) Treatments",
    description: "In vitro fertilization (IVF) is a fertility treatment where eggs and sperm are combined in a lab to create embryos. The healthiest embryo(s) are then transferred to the uterus to establish a pregnancy.",
    treatments: [
      {
        name: "Introduction to IVF",
        description: "IVF is often considered when other treatments (e.g., fertility drugs, IUI) fail, or for conditions like blocked fallopian tubes, low sperm count, or unexplained infertility.",
        procedure: [
          "Female Factors: Endometriosis, ovulation disorders, damaged/blocked fallopian tubes.",
          "Male Factors: Low sperm count, poor motility, or abnormal shape.",
          "Unexplained Infertility: When no cause is found after testing.",
          "Genetic Disorders: To avoid passing on inherited conditions.",
          "Same-Sex Couples/Single Parents: Using donor sperm/eggs."
        ]
      },
      {
        name: "Step-by-Step IVF Process",
        description: "The IVF process involves several key stages from initial consultation to pregnancy testing.",
        procedure: [
          "Initial Consultation & Testing: Ovarian reserve testing, semen analysis, and uterine examination.",
          "Ovarian Stimulation: Daily hormone injections to stimulate egg production with regular monitoring.",
          "Egg Retrieval: Under light sedation, eggs are removed from follicles (15-20 mins procedure).",
          "Sperm Collection: Via masturbation or surgical extraction if needed.",
          "Fertilization: Eggs and sperm combined in lab or using ICSI for male infertility.",
          "Embryo Development: Embryos grow for 3-6 days and are graded for quality.",
          "Embryo Transfer: 1-2 embryos placed into uterus using a catheter (painless, no sedation).",
          "Post-Transfer & Pregnancy Test: Blood test after 10-14 days to confirm pregnancy."
        ]
      },
      {
        name: "Conventional IVF",
        description: "Conventional IVF is the most common assisted reproductive technology. It involves stimulating the ovaries to produce multiple eggs, retrieving them, fertilizing them in a lab, and transferring the best embryos into the uterus.",
        procedure: [
          "Ovarian Stimulation: Daily hormone injections (FSH & LH) for 8–14 days to stimulate multiple egg production. Regular monitoring via blood tests and ultrasounds.",
          "Egg Retrieval (Oocyte Aspiration): Once eggs mature (18-22 mm), a trigger shot (hCG) is given. 34–36 hours later, eggs are retrieved using a transvaginal needle under mild sedation.",
          "Sperm Collection & Fertilization: A sperm sample is collected and processed. Eggs and sperm are combined in a culture dish for fertilization.",
          "Embryo Culture & Selection: Fertilized eggs (zygotes) are monitored for 3-5 days. The best-quality embryos are selected.",
          "Embryo Transfer (ET): 1 or 2 embryos are transferred into the uterus using a thin catheter.",
          "Pregnancy Test (Beta hCG): After 10–14 days, a blood test confirms pregnancy."
        ],
        recovery: "1–2 days after embryo transfer.",
        benefits: "Higher success rates, allows embryo screening, treats severe infertility cases.",
        risks: "Ovarian Hyperstimulation Syndrome (OHSS): Fluid buildup in abdomen due to excessive hormone response. Multiple Pregnancies: Higher chance of twins or triplets. Ectopic Pregnancy: Implantation outside the uterus."
      },
      {
        name: "ICSI (Intracytoplasmic Sperm Injection)",
        description: "A specialized form of IVF where a single sperm is injected directly into an egg to increase fertilization success. Used for male infertility (low sperm count, poor motility, DNA fragmentation).",
        procedure: [
          "Same as conventional IVF, except fertilization:",
          "A skilled embryologist selects a single sperm under a microscope.",
          "The sperm is injected into the egg using a microneedle."
        ],
        benefits: "Overcomes severe male infertility, improves fertilization rates.",
        risks: "Higher chance of genetic disorders, birth defects, and failed fertilization."
      },
      {
        name: "Frozen Embryo Transfer (FET)",
        description: "A previously frozen embryo from an earlier IVF cycle is thawed and transferred to the uterus.",
        procedure: [
          "The patient's uterine lining is prepared using hormones.",
          "The embryo is thawed and placed into the uterus."
        ],
        benefits: "Less stressful than fresh cycles, higher success rates in some cases.",
        risks: "Lower implantation rate compared to fresh embryos, embryo damage during thawing."
      },
      {
        name: "Mini IVF (Mild Stimulation IVF)",
        description: "A low-dose IVF approach using minimal stimulation to retrieve fewer but high-quality eggs.",
        procedure: [
          "Lower doses of hormone injections for controlled egg growth.",
          "Fewer eggs retrieved and fertilized using ICSI or IVF."
        ],
        benefits: "Fewer side effects, reduced cost.",
        risks: "Lower egg count, may require multiple cycles."
      },
      {
        name: "PGT (Preimplantation Genetic Testing)",
        description: "A genetic test to screen embryos for chromosomal abnormalities or inherited diseases before implantation.",
        procedure: [
          "A small biopsy is taken from a blastocyst (5-day-old embryo).",
          "DNA is analyzed for genetic defects."
        ],
        benefits: "Prevents genetic diseases, improves IVF success.",
        risks: "Embryo damage, misdiagnosis."
      },
      {
        name: "Success Rates & Factors",
        description: "IVF success rates vary based on several factors, with age being the most significant.",
        procedure: [
          "Age: Key factor for success. Live birth rates per cycle:",
          "Under 35: ~40–50%",
          "35–37: ~30–40%",
          "38–40: ~20–30%",
          "Over 40: ~5–15%"
        ],
        benefits: "Understanding success factors helps set realistic expectations.",
        risks: "Lifestyle factors like smoking, obesity, or alcohol can lower success rates."
      },
      {
        name: "FAQs & Tips",
        description: "Common questions and helpful advice for those considering or undergoing IVF treatment.",
        procedure: [
          "How long does IVF take? 4-6 weeks per cycle.",
          "Is IVF painful? Injections may cause discomfort; retrieval is done under sedation.",
          "Can we choose the embryo's gender? Only permitted for medical reasons.",
          "What if the first cycle fails? Many couples need 2-3 cycles; discuss adjustments with your doctor.",
          "Tips: Ask questions, stay organized with medications/appointments, prioritize self-care, and find a clinic you trust."
        ],
        benefits: "Being well-informed improves the IVF experience and reduces anxiety.",
        risks: "Emotional stress is common during treatment; seek support when needed."
      }
    ]
  },
  cosmetic: {
    title: "Cosmetic Procedures",
    description: "Cosmetic procedures include surgical and non-surgical treatments designed to enhance appearance by reshaping structures of the body, reducing signs of aging, or improving skin and hair quality. These treatments can be elective (purely for aesthetic purposes) or reconstructive (to correct deformities or injuries).",
    treatments: [
      {
        name: "Introduction to Cosmetic Procedures",
        description: "Cosmetic procedures can enhance self-confidence, reverse signs of aging, correct congenital deformities, repair damage from accidents or injuries, and improve body contouring and symmetry.",
        procedure: [
          "People of all ages and backgrounds consider cosmetic treatments, including:",
          "Aging Individuals: Seeking anti-aging treatments (Botox, fillers, facelifts).",
          "Post-Pregnancy: Mothers opting for 'mommy makeovers' (tummy tuck, breast lift).",
          "Weight Loss Patients: Addressing excess skin after significant weight loss.",
          "Reconstructive Needs: Burn victims, accident survivors, or those with genetic deformities.",
          "Beauty & Aesthetic Goals: Individuals desiring enhancements like lip augmentation or rhinoplasty."
        ]
      },
      {
        name: "Surgical Cosmetic Procedures",
        description: "Surgical cosmetic procedures involve incisions and typically require anesthesia, with longer recovery times but often more dramatic and long-lasting results.",
        procedure: [
          "Facelift (Rhytidectomy) – Tightens skin, reduces wrinkles.",
          "Rhinoplasty (Nose Job) – Reshapes the nose for aesthetic or breathing improvement.",
          "Liposuction – Removes stubborn fat from areas like abdomen, thighs, arms.",
          "Breast Augmentation – Enhances breast size using implants or fat transfer.",
          "Tummy Tuck (Abdominoplasty) – Tightens abdominal muscles and removes excess skin.",
          "Eyelid Surgery (Blepharoplasty) – Removes sagging eyelid skin for a youthful look.",
          "Hair Transplant – Moves hair follicles to balding areas for fuller hair."
        ],
        benefits: "Dramatic, long-lasting results; can address significant aesthetic concerns.",
        risks: "Infection, scarring, asymmetry, poor wound healing, excessive bleeding, anesthesia complications."
      },
      {
        name: "Non-Surgical Cosmetic Procedures",
        description: "Non-surgical procedures offer less invasive options with minimal downtime, though results may be more subtle and temporary compared to surgical alternatives.",
        procedure: [
          "Botox & Dysport – Smooths wrinkles by relaxing facial muscles.",
          "Dermal Fillers – Adds volume to lips, cheeks, and other facial areas.",
          "Laser Skin Resurfacing – Reduces scars, pigmentation, and fine lines.",
          "Chemical Peels – Removes damaged skin layers to reveal fresher skin.",
          "Microneedling – Stimulates collagen for skin rejuvenation.",
          "CoolSculpting (Cryolipolysis) – Freezes fat cells for non-invasive body contouring.",
          "Thread Lift – Lifts sagging skin using dissolvable sutures."
        ],
        benefits: "Minimal downtime, lower cost, less risk than surgery, gradual enhancement.",
        risks: "Temporary redness, swelling, bruising, allergic reactions, uneven results requiring touch-ups."
      },
      {
        name: "Botox and Dermal Fillers",
        description: "Botox (Botulinum Toxin): A purified neurotoxin that temporarily relaxes facial muscles to reduce wrinkles and fine lines. Dermal Fillers: Gel-like substances (commonly hyaluronic acid) injected under the skin to restore volume, plump lips, and smooth lines.",
        procedure: [
          "Procedure Time: 15–30 minutes.",
          "Botox: The targeted area (forehead, crow's feet, frown lines) is cleaned. Small amounts of Botox are injected into muscles using a fine needle.",
          "Dermal Fillers: A numbing cream is applied to the injection area. Fillers (hyaluronic acid, collagen, or fat) are injected into cheeks, lips, jawline, or under-eye hollows.",
          "Recovery: No downtime; minor bruising or swelling may occur.",
          "Duration of Results: Botox lasts 3–6 months, fillers 6–24 months."
        ],
        recovery: "Immediate return to normal activities; avoid strenuous exercise for 24 hours.",
        benefits: "Quick, non-invasive, no anesthesia required. Smooths wrinkles, restores facial volume. Prevents new wrinkles from forming.",
        risks: "Botox: Temporary bruising, headaches, drooping eyelids (if injected incorrectly). Fillers: Allergic reactions, overfilling, uneven results, rare risk of vascular occlusion (blocked blood vessels)."
      },
      {
        name: "Rhinoplasty (Nose Reshaping Surgery)",
        description: "Rhinoplasty (nose job) reshapes the nose for aesthetic or functional improvements, such as fixing a crooked nose, hump, wide nostrils, or breathing issues (deviated septum).",
        procedure: [
          "Initial Consultation & Planning: Surgeon evaluates medical history, expectations, and suitability. Some clinics offer 3D imaging to preview results.",
          "Anesthesia: General or local anesthesia with sedation.",
          "Incisions: Open rhinoplasty: A small cut between the nostrils. Closed rhinoplasty: Incisions inside the nose (leaves no visible scars).",
          "Reshaping the Structure: Cartilage and bone are adjusted or grafts are placed. In some cases, cartilage from the ear or rib is used.",
          "Nasal Tissues Are Repositioned & Sutured. A nasal splint is placed for support.",
          "Follow-up: Stitches removal usually after 7–14 days. Final results visible in weeks to months as swelling subsides."
        ],
        recovery: "Swelling & bruising: 2–4 weeks. Final results: 6 months–1 year as swelling gradually subsides.",
        benefits: "Enhances facial symmetry and improves breathing. Permanent results.",
        risks: "Difficulty breathing, infection, scarring, dissatisfaction with results (revision surgery may be needed)."
      },
      {
        name: "Liposuction",
        description: "Liposuction is a fat removal surgery that contours the body by suctioning out excess fat from areas like abdomen, thighs, arms, and chin.",
        procedure: [
          "Initial Consultation: Surgeon assesses fat deposits and discusses goals.",
          "Anesthesia: General or local anesthesia.",
          "Tumescent Solution Injection: A saline + lidocaine + epinephrine solution is injected to reduce bleeding and pain.",
          "Fat Removal: A cannula (thin tube) is inserted through small incisions, and fat is suctioned out.",
          "Incisions Are Closed & Bandaged.",
          "Compression Garments: Worn for 6 weeks to reduce swelling."
        ],
        recovery: "Swelling & bruising: 2–4 weeks. Final results: Visible in 3–6 months.",
        benefits: "Permanent fat removal (if weight is maintained). Improves body proportions.",
        risks: "Lumpy skin, asymmetry, fluid buildup. Blood clots (rare but serious). Skin necrosis (tissue death in the treated area)."
      },
      {
        name: "Laser Skin Resurfacing",
        description: "A treatment that uses focused light beams to remove damaged skin layers, stimulate collagen production, and reveal smoother, younger-looking skin.",
        procedure: [
          "Procedure Time: 30–90 minutes.",
          "Preparation: Face is cleansed and numbing cream is applied.",
          "Treatment: Laser passes over targeted areas, removing outer skin layers.",
          "Cooling: Treated areas are cooled to reduce discomfort.",
          "Recovery: 5–7 days of redness and peeling.",
          "Results: Gradual improvement over weeks as collagen rebuilds."
        ],
        recovery: "Redness for 1-2 weeks; sun protection essential for several months.",
        benefits: "Reduces fine lines, scars, sun damage, and uneven skin tone. Stimulates natural collagen production.",
        risks: "Prolonged redness, hyperpigmentation, scarring (rare), infection (uncommon)."
      },
      {
        name: "CoolSculpting (Cryolipolysis)",
        description: "A non-invasive fat reduction procedure that freezes and eliminates stubborn fat cells without surgery or downtime.",
        procedure: [
          "Procedure Time: 35–60 minutes per area.",
          "Application: Cooling panels are placed on target areas.",
          "Freezing Process: Fat cells are crystallized (frozen) at specific temperatures.",
          "Massage: Area is massaged after panel removal to break up frozen fat cells.",
          "Natural Elimination: Body naturally processes and removes dead fat cells over time.",
          "Results: Visible fat reduction in 2–3 months."
        ],
        recovery: "No downtime; temporary redness, swelling, or numbness possible.",
        benefits: "No surgery or anesthesia required. Permanent fat cell elimination. Resume normal activities immediately.",
        risks: "Temporary numbness, redness, or bruising. Paradoxical adipose hyperplasia (rare condition where fat cells grow larger instead of smaller)."
      },
      {
        name: "Costs & FAQs",
        description: "Information about pricing factors and common questions about cosmetic procedures.",
        procedure: [
          "Factors influencing cost: Type of procedure (non-surgical options are generally cheaper), surgeon's expertise & location, facility fees & aftercare.",
          "Estimated prices: Botox ($200–$800 per session), Rhinoplasty ($4,000–$15,000), Breast Augmentation ($5,000–$10,000), Liposuction ($3,000–$7,000).",
          "Are cosmetic procedures painful? Surgical procedures require anesthesia, while non-surgical treatments involve minimal discomfort.",
          "How long do results last? Botox lasts 3–6 months, while surgical enhancements can last a lifetime with proper care.",
          "Can men get cosmetic procedures? Yes, popular treatments for men include rhinoplasty, Botox, and liposuction."
        ],
        benefits: "Understanding costs helps with financial planning for cosmetic care.",
        risks: "Insurance typically doesn't cover cosmetic procedures; financing options may have high interest rates."
      },
      {
        name: "Tips & Next Steps",
        description: "Guidance for those considering cosmetic procedures.",
        procedure: [
          "Choose a Board-Certified Surgeon: Ensure safety and quality.",
          "Set Realistic Expectations: Understand what's achievable.",
          "Prioritize Aftercare: Follow post-op instructions for best results.",
          "Consult Multiple Clinics: Compare procedures, prices, and reviews.",
          "Follow-Up Appointments: Attend all scheduled check-ups to monitor healing.",
          "Avoid Strenuous Activity: For at least 2–6 weeks post-surgery.",
          "Sun Protection: Essential after laser treatments or chemical peels.",
          "Patience: Some results take months to fully appear."
        ],
        benefits: "Proper planning and aftercare significantly improve outcomes and satisfaction.",
        risks: "Rushing decisions or choosing providers based solely on cost can lead to complications or unsatisfactory results."
      }
    ]
  },
  hair: {
    title: "Hair Transplant & Hair Restoration",
    description: "Hair transplant is a surgical procedure that involves extracting hair follicles from one part of the body (usually the back of the scalp) and implanting them into areas affected by hair loss. It is a permanent solution for baldness and thinning hair, providing natural-looking results with minimal maintenance.",
    treatments: [
      {
        name: "Introduction to Hair Transplant & Hair Restoration",
        description: "Hair transplants provide a natural-looking solution for hair loss with minimal maintenance. Unlike temporary treatments, transplanted hair continues to grow naturally for a lifetime.",
        procedure: [
          "People who experience the following conditions may benefit from a hair transplant:",
          "Male Pattern Baldness (Androgenetic Alopecia): The most common cause of hair loss in men. Hair recedes from the temples and crown, leading to a horseshoe-shaped pattern.",
          "Female Pattern Baldness: Thinning on the crown or parting line without complete baldness. Can be caused by hormones, genetics, or stress.",
          "Alopecia Areata: An autoimmune disorder causing patchy hair loss.",
          "Scarring from Injuries or Surgery: Hair transplants can restore hair in areas affected by burns, scars, or previous surgeries.",
          "Hair Loss Due to Medical Conditions: Some people experience hair loss due to conditions like thyroid disorders, iron deficiency, or lupus.",
          "Unsuccessful Previous Hair Transplant: Some patients seek corrective hair transplants after poor results from an earlier procedure."
        ]
      },
      {
        name: "Types of Hair Transplant Procedures",
        description: "Several techniques are available for hair transplantation, each with its own advantages and considerations.",
        procedure: [
          "Follicular Unit Transplantation (FUT): A strip of scalp with healthy hair follicles is removed from the donor area, dissected into grafts, and implanted in the bald area. Leaves a linear scar on the donor site. Suitable for large areas of baldness.",
          "Follicular Unit Extraction (FUE): Individual hair follicles are extracted from the donor area and transplanted one by one. No visible scarring, shorter recovery time. Ideal for people who prefer short hair.",
          "Direct Hair Implantation (DHI): A modified version of FUE using a specialized tool for direct implantation. Faster recovery, more precise placement. Higher cost than traditional FUE.",
          "Robotic Hair Transplant: Uses AI-assisted robotic technology to extract and implant follicles with high accuracy. Minimally invasive with excellent precision. Limited availability and expensive.",
          "Synthetic Hair Transplant: Artificial hair fibers are implanted into the scalp. Suitable for people with insufficient donor hair. Requires periodic maintenance and may cause allergic reactions."
        ],
        benefits: "Permanent solution for hair loss, natural-looking results, minimal maintenance required after healing.",
        risks: "Infection, scarring, unnatural appearance if poorly performed, temporary shock loss (shedding before regrowth)."
      },
      {
        name: "Step-by-Step Hair Transplant Process",
        description: "The hair transplant procedure follows a systematic process to ensure optimal results.",
        procedure: [
          "Initial Consultation & Evaluation: Scalp analysis to determine the cause and extent of hair loss. Discussion of expectations, available techniques, and cost. Blood tests may be required to rule out medical causes of hair loss.",
          "Donor Area Preparation: Hair in the donor area (back of the scalp) is trimmed. Local anesthesia is administered for a painless experience.",
          "Extraction of Hair Follicles: FUE: Hair follicles are extracted individually using a micropunch tool. FUT: A strip of skin with hair follicles is removed and dissected into grafts.",
          "Recipient Area Preparation: Tiny incisions are made in the bald area for implanting hair follicles. The doctor designs the hairline to ensure a natural look.",
          "Implantation of Hair Grafts: Hair follicles are carefully placed into the incisions in a natural growth pattern.",
          "Post-Procedure Care & Recovery: Bandages may be applied. Pain medication and antibiotics may be prescribed. Mild swelling and redness are common for a few days."
        ],
        recovery: "First Week: Redness, swelling, and mild discomfort. 2-3 Weeks: Transplanted hair sheds (shock loss). 3-4 Months: New hair begins to grow. 6-12 Months: Significant growth, final results appear.",
        benefits: "Permanent solution with natural-looking results. Once healed, transplanted hair requires no special care.",
        risks: "Infection, scarring, unnatural hairline if poorly designed, temporary shock loss (initial shedding before regrowth)."
      },
      {
        name: "Non-Surgical Hair Restoration Treatments",
        description: "For those who aren't ready for surgery or have early-stage hair loss, several non-surgical options can help restore hair or slow hair loss.",
        procedure: [
          "PRP (Platelet-Rich Plasma) Therapy: A patient's own blood is processed to extract growth factors and injected into the scalp. Stimulates hair growth, improves thickness.",
          "Low-Level Laser Therapy (LLLT): Uses red light lasers to stimulate hair follicles. Painless, non-invasive, and effective for early-stage hair loss.",
          "Hair Growth Medications: Minoxidil (Rogaine): Topical solution that slows hair loss and stimulates new growth. Finasteride (Propecia): Oral medication that prevents further hair loss in men.",
          "Scalp Micropigmentation (SMP): Tattooing technique that creates the illusion of a shaved head or fuller hair."
        ],
        recovery: "Most non-surgical treatments require no downtime. Results may take 3-6 months to become noticeable.",
        benefits: "No surgery or anesthesia required, minimal to no downtime, lower cost than surgery, can be combined with surgical options for enhanced results.",
        risks: "Results may be temporary and require ongoing treatments, some medications may have side effects, results vary significantly between individuals."
      },
      {
        name: "Risks, Side Effects, and Recovery",
        description: "Understanding the potential risks and recovery process helps set realistic expectations for hair transplant procedures.",
        procedure: [
          "Common Side Effects: Swelling & Redness: Lasts a few days. Itching & Scabbing: Avoid scratching to prevent infection. Temporary Shedding (Shock Loss): Transplanted hair may fall out before regrowth begins.",
          "Possible Complications: Infection: Rare, but possible if aftercare is not followed. Unnatural Hair Growth: Poorly performed transplants may result in an unnatural look. Scarring: More common with FUT.",
          "Recovery Timeline: First Week: Redness, swelling, and mild discomfort. 2-3 Weeks: Transplanted hair sheds (shock loss). 3-4 Months: New hair begins to grow. 6-12 Months: Significant growth, final results appear."
        ],
        recovery: "Most patients return to work within 1-7 days depending on the procedure type. Avoid strenuous activity for 2 weeks. Protect the scalp from sun exposure for at least 4 weeks.",
        benefits: "Understanding the recovery process helps manage expectations and ensures optimal healing.",
        risks: "Not following post-procedure care instructions can lead to complications and suboptimal results."
      },
      {
        name: "Success Rates & Factors Affecting Results",
        description: "Hair transplant success depends on various factors including technique, surgeon expertise, and patient characteristics.",
        procedure: [
          "Success Rate: FUT & FUE: 85–95% graft survival rate. PRP Therapy: 60–70% improvement in hair thickness.",
          "Factors Affecting Success: Age: Younger patients may respond better. Donor Hair Quality: Thick, healthy donor hair leads to better results. Post-Surgery Care: Following aftercare guidelines ensures optimal growth."
        ],
        benefits: "High success rates with modern techniques when performed by experienced surgeons.",
        risks: "Results may vary based on individual factors like age, hair type, and extent of hair loss."
      },
      {
        name: "FAQs & Glossary",
        description: "Common questions about hair transplant procedures and terminology explained.",
        procedure: [
          "How long does a hair transplant take? 4–8 hours, depending on the number of grafts.",
          "Is the procedure painful? Local anesthesia prevents pain, but mild discomfort may occur post-surgery.",
          "How soon can I see results? Noticeable growth starts around 3–6 months, full results in 12 months.",
          "Will I need another transplant? In some cases, multiple sessions are required for full coverage.",
          "Glossary: FUE: Follicular Unit Extraction. FUT: Follicular Unit Transplantation. PRP: Platelet-Rich Plasma therapy. Shock Loss: Temporary shedding of transplanted hair."
        ],
        benefits: "Understanding the procedure timeline and terminology helps set realistic expectations.",
        risks: "Unrealistic expectations can lead to disappointment, even with technically successful procedures."
      },
      {
        name: "Final Tips & Next Steps",
        description: "Guidance for those considering hair transplant or restoration treatments.",
        procedure: [
          "Choose a Reputable Clinic: Ensure experienced surgeons and good reviews.",
          "Follow Post-Op Instructions: Avoid exercise, sun exposure, and smoking for better results.",
          "Be Patient: Hair regrowth is a slow process.",
          "Consider Non-Surgical Options: PRP, medications, or laser therapy may be effective alternatives.",
          "Remember: A hair transplant is a long-term investment in your appearance and confidence!"
        ],
        benefits: "Proper planning and aftercare significantly improve outcomes and satisfaction.",
        risks: "Rushing decisions or choosing providers based solely on cost can lead to complications or unsatisfactory results."
      }
    ]
  },
  dental: {
    title: "Dental Procedures",
    description: "Dental procedures cover a wide range of treatments aimed at improving oral health, function, and appearance. They include preventive care, restorative treatments, cosmetic enhancements, and surgical interventions.",
    treatments: [
      {
        name: "Introduction to Dental Procedures",
        description: "Dental procedures are important to maintain oral hygiene, prevent infections, restore functionality for chewing and speaking, enhance aesthetic appearance, and prevent long-term complications like gum disease and tooth loss.",
        procedure: [
          "Anyone can benefit from dental procedures, especially those with tooth decay, missing teeth, gum disease, misaligned teeth, or seeking cosmetic improvements."
        ]
      },
      {
        name: "Preventive Dental Procedures",
        description: "Procedures focused on preventing dental problems before they occur.",
        procedure: [
          "Dental Cleaning (Scaling & Polishing) – Removes plaque, tartar, and stains.",
          "Fluoride Treatment – Strengthens enamel and prevents cavities.",
          "Dental Sealants – Protective coating applied to prevent decay.",
          "Oral Cancer Screening – Early detection of abnormal growths."
        ],
        benefits: "Prevents cavities, gum disease, and more serious dental issues.",
        risks: "Minimal risks; temporary sensitivity possible."
      },
      {
        name: "Restorative Dental Procedures",
        description: "Treatments that repair or replace damaged teeth and restore oral function.",
        procedure: [
          "Dental Fillings – Repairs cavities using composite resin, amalgam, or porcelain.",
          "Root Canal Treatment (Endodontics) – Saves infected or damaged teeth.",
          "Dental Crowns – Caps placed over weak or broken teeth.",
          "Dental Bridges – Fixed replacements for missing teeth.",
          "Dentures (Partial/Complete) – Removable replacements for missing teeth.",
          "Dental Implants – Permanent solution for missing teeth using titanium posts."
        ],
        benefits: "Restores function and appearance, prevents further damage.",
        risks: "Infection, sensitivity, potential for retreatment in some cases."
      },
      {
        name: "Cosmetic Dental Procedures",
        description: "Treatments designed primarily to improve the appearance of teeth and smile.",
        procedure: [
          "Teeth Whitening (Bleaching) – Lightens stains for a brighter smile.",
          "Dental Veneers – Thin porcelain covers for an improved appearance.",
          "Gum Contouring – Reshapes gums for better symmetry.",
          "Composite Bonding – Fixes chipped or discolored teeth with resin."
        ],
        benefits: "Enhanced appearance, increased confidence, minimal recovery time.",
        risks: "Tooth sensitivity, uneven results, potential damage to enamel with some treatments."
      },
      {
        name: "Orthodontic Procedures",
        description: "Treatments that correct the alignment of teeth and jaws for improved function and appearance.",
        procedure: [
          "Traditional Braces – Metal brackets and wires to align teeth.",
          "Invisalign (Clear Aligners) – Discreet teeth-straightening solution.",
          "Retainers – Maintains alignment after braces.",
          "Palatal Expanders – Widens upper jaw in children."
        ],
        benefits: "Improved bite, easier cleaning, enhanced appearance.",
        risks: "Discomfort, temporary speech changes, potential relapse without retainer use."
      },
      {
        name: "Surgical Dental Procedures",
        description: "More invasive treatments that require surgical intervention for complex dental issues.",
        procedure: [
          "Tooth Extraction – Removal of decayed, impacted, or infected teeth.",
          "Wisdom Tooth Removal – Extraction of problematic wisdom teeth.",
          "Bone Grafting – Strengthens jawbone for implants.",
          "Gum Surgery (Periodontal Surgery) – Treats severe gum disease."
        ],
        benefits: "Resolves serious dental issues, prevents spread of infection, prepares for restorative work.",
        risks: "Bleeding, swelling, infection, nerve damage in rare cases."
      },
      {
        name: "Procedure Details: Cavity Filling",
        description: "A common procedure to repair teeth affected by decay.",
        procedure: [
          "Local Anesthesia – Numbs the tooth.",
          "Decay Removal – Dentist drills out infected part.",
          "Filling Application – Composite resin or amalgam is applied.",
          "Hardening & Polishing – Filling is shaped and hardened with light."
        ],
        recovery: "Immediate return to normal activities, avoid hard foods for 24 hours.",
        benefits: "Stops decay progression, restores tooth function, prevents pain.",
        risks: "Tooth sensitivity, potential need for replacement over time."
      },
      {
        name: "Procedure Details: Root Canal",
        description: "A treatment to save severely infected or damaged teeth by removing the infected pulp.",
        procedure: [
          "Anesthesia & Isolation – The tooth is numbed and isolated.",
          "Removal of Infection – Pulp is cleaned out.",
          "Sealing – Canals are filled with a biocompatible material.",
          "Crown Placement – A crown is added for protection."
        ],
        recovery: "1-2 weeks for full recovery, mild discomfort for a few days.",
        benefits: "Saves natural teeth, eliminates pain, prevents extraction.",
        risks: "Reinfection, tooth fracture, need for retreatment in some cases."
      },
      {
        name: "Procedure Details: Dental Implant",
        description: "A permanent solution for replacing missing teeth using titanium posts that fuse with the jawbone.",
        procedure: [
          "Consultation & X-rays – Dentist assesses jawbone health.",
          "Implant Placement – Titanium post is surgically inserted.",
          "Healing (Osseointegration) – Bone fuses with the implant over months.",
          "Abutment & Crown Placement – The final artificial tooth is attached."
        ],
        recovery: "3-6 months for complete integration, initial healing within 1-2 weeks.",
        benefits: "Looks and functions like natural teeth, prevents bone loss, doesn't affect adjacent teeth.",
        risks: "Infection, implant failure, nerve damage, sinus issues (for upper implants)."
      },
      {
        name: "Costs & FAQs",
        description: "Information about pricing factors and common questions about dental procedures.",
        procedure: [
          "Cost factors include: type of procedure, location, materials used, and dentist's expertise.",
          "Estimated prices: Cleaning ($50-$200), Fillings ($100-$500), Root Canal ($500-$1,500), Whitening ($300-$1,000), Implants ($3,000-$6,000).",
          "Visit dentist every 6 months for routine checkups.",
          "Most treatments use anesthesia, making them painless.",
          "Teeth whitening typically lasts 6 months to 2 years, depending on lifestyle."
        ],
        benefits: "Understanding costs helps with financial planning for dental care.",
        risks: "Insurance coverage varies widely; out-of-pocket expenses may be significant for some procedures."
      },
      {
        name: "Aftercare & Tips",
        description: "Guidance for recovery and maintaining results after dental procedures.",
        procedure: [
          "Maintain oral hygiene: Brush twice daily and floss regularly.",
          "Avoid hard foods after procedures to prevent damage.",
          "Use prescribed medications (antibiotics/pain relievers) as directed.",
          "Attend regular dental visits to ensure long-term oral health.",
          "Prioritize preventive care to avoid costly treatments.",
          "Choose skilled dentists for complex procedures.",
          "Get multiple consultations before major treatments.",
          "Follow aftercare instructions for faster healing and better results."
        ],
        benefits: "Proper aftercare extends the lifespan of dental work and prevents complications.",
        risks: "Neglecting aftercare can lead to treatment failure and additional procedures."
      }
    ]
  }
};

const TreatmentsInfo = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('ivf');
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        pb: 1
      }}>
        <Typography variant="h5" component="div" fontWeight={700}>
          Know Your Treatment
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab label="IVF" value="ivf" />
          <Tab label="Cosmetic" value="cosmetic" />
          <Tab label="Hair" value="hair" />
          <Tab label="Dental" value="dental" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ p: 0 }}>
        {Object.keys(treatmentsData).map((category) => (
          <Box 
            key={category} 
            sx={{ 
              display: activeTab === category ? 'block' : 'none',
              p: 3
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600} color={theme.palette.primary.main}>
              {treatmentsData[category].title}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {treatmentsData[category].description}
            </Typography>
            
            {treatmentsData[category].treatments.map((treatment, index) => (
              <Accordion 
                key={index} 
                sx={{ 
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  borderRadius: '8px !important',
                  '&:before': {
                    display: 'none',
                  },
                  boxShadow: 'none'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    borderRadius: '8px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {treatment.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography variant="body1" paragraph>
                    {treatment.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    {treatment.procedure?.map((step, i) => (
                      <Typography component="li" variant="body2" key={i} sx={{ mb: 1 }}>
                        {step}
                      </Typography>
                    ))}
                  </Box>
                  
                  {treatment.recovery && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Recovery Time
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {treatment.recovery}
                      </Typography>
                    </>
                  )}
                  
                  {treatment.benefits && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Benefits
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {treatment.benefits}
                      </Typography>
                    </>
                  )}
                  
                  {treatment.risks && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Risks & Complications
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {treatment.risks}
                      </Typography>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}
      </DialogContent>
      
      <DialogActions sx={{ borderTop: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreatmentsInfo;
