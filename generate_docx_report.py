import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

doc = docx.Document()

# Set standard margins (1 inch = 72 pt)
sections = doc.sections
for section in sections:
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)

# Helper function to format text
def add_p(doc, text="", align=WD_ALIGN_PARAGRAPH.LEFT, bold=False, italic=False, size=12, space_after=6, space_before=0, font_name="Times New Roman", color=None):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.line_spacing = 1.25
    if text:
        run = p.add_run(text)
        run.bold = bold
        run.italic = italic
        run.font.name = font_name
        run.font.size = Pt(size)
        if color:
            run.font.color.rgb = color
    return p

def add_run(p, text, bold=False, italic=False, size=12, font_name="Times New Roman", color=None):
    run = p.add_run(text)
    run.bold = bold
    run.italic = italic
    run.font.name = font_name
    run.font.size = Pt(size)
    if color:
        run.font.color.rgb = color
    return run

# Set default font
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)

# --- PAGE 1: TITLE PAGE ---
add_p(doc, "AISSMS", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=18, color=RGBColor(185, 28, 28))
add_p(doc, "COLLEGE OF ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14)
add_p(doc, "An Autonomous Institute Affiliated to Savitribai Phule Pune University\nApproved by AICTE, New Delhi and Recognised by Govt. of Maharashtra\nAccredited by NAAC with \"A+\" Grade | NBA - 7 UG Programmes", align=WD_ALIGN_PARAGRAPH.CENTER, size=9, space_after=24)

add_p(doc, "A Mini Project Report On", align=WD_ALIGN_PARAGRAPH.CENTER, size=13, space_before=12)
add_p(doc, "MediMind Clinical AI Suite", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=20, space_before=6, space_after=6)
add_p(doc, "Submitted in partial fulfilment of the requirements for the degree of", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size=12)
add_p(doc, "THIRD YEAR OF ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_before=6)
add_p(doc, "In\nCOMPUTER ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=18)

add_p(doc, "Submitted by", align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size=12)
p_sub = add_p(doc, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)
add_run(p_sub, "Gaikwad Vaibhav – 24CO034\nHanny Jangir - 24CO040\nJanhavi Adagale – 24CO052\nJoshi Aabha – 24CO053", bold=True, size=12)

add_p(doc, "Under the Guidance of", align=WD_ALIGN_PARAGRAPH.CENTER, size=12)
add_p(doc, "Prof. M. G. Ghodekar", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=24)

add_p(doc, "Department Of Computer Engineering\nALL INDIA SHRI SHIVAJI MEMORIAL SOCIETY’S\nCOLLEGE OF ENGINEERING Pune – 411001", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=12)
add_p(doc, "Academic Year: 2026-27(Term – I)", align=WD_ALIGN_PARAGRAPH.CENTER, size=11, space_before=6)
add_p(doc, "Savitribai Phule Pune University", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_before=4)

doc.add_page_break()

# --- PAGE 2: CERTIFICATE ---
add_p(doc, "AISSMS", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, color=RGBColor(185, 28, 28))
add_p(doc, "COLLEGE OF ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13)
add_p(doc, "DEPARTMENT OF COMPUTER ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, size=10, space_after=24)

add_p(doc, "CERTIFICATE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=24)

p_cert = add_p(doc, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=48)
add_run(p_cert, "This is to certify that ")
add_run(p_cert, "Vaibhav Gaikwad(24CO034), Hanny Jangir(24CO040), Janhavi Adagale(24CO052)", bold=True)
add_run(p_cert, " and ")
add_run(p_cert, "Joshi Aabha(24CO053)", bold=True)
add_run(p_cert, " from Third Year Computer Engineering have successfully completed their mini project work titled ")
add_run(p_cert, "“MediMind Clinical AI Suite”", bold=True)
add_run(p_cert, " at AISSMS College of Engineering, Pune in partial fulfilment of bachelor’s degree in engineering.")

p_sig = add_p(doc, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=72)
add_run(p_sig, "Prof. M. G. Ghodekar\t\tDr. D.P. Gaikwad\t\tDr. D.S. Bormane\nProject Guide\t\t\tHOD\t\t\tPrincipal, AISSMS COE", bold=True)

doc.add_page_break()

# --- PAGE 3: APPROVAL PAGE ---
add_p(doc, "MINI PROJECT APPROVAL", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_before=18, space_after=24)
add_p(doc, "The Mini Project entitled", align=WD_ALIGN_PARAGRAPH.CENTER, size=13)
add_p(doc, "MediMind Clinical AI Suite", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=18, space_after=12)
add_p(doc, "By", align=WD_ALIGN_PARAGRAPH.CENTER, size=12)

p_app = add_p(doc, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24)
add_run(p_app, "Gaikwad Vaibhav – 24CO034\nHanny Jangir - 24CO040\nJanhavi Adagale – 24CO052\nJoshi Aabha – 24CO053", bold=True, size=12)

add_p(doc, "Is approved for the degree of", align=WD_ALIGN_PARAGRAPH.CENTER, size=12)
add_p(doc, "Third Year of Engineering\nIn\nComputer Engineering", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=48)

p_ex = add_p(doc, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=48)
add_run(p_ex, "Examiner 1: _____________________\t\tExaminer 2: _____________________\nName and Signature\t\t\t\tName and Signature", bold=True)

add_p(doc, "\nDate: 23rd September 2026\nPlace: Pune", align=WD_ALIGN_PARAGRAPH.LEFT, size=11, space_before=36)

doc.add_page_break()

# --- PAGE 4: ABSTRACT ---
add_p(doc, "ABSTRACT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=18)
add_p(doc, "The MediMind Clinical AI Suite is an advanced, rule-based expert diagnostic and clinical decision support system (CDSS) designed to assist medical practitioners, triage nurses, and students in automated disease diagnosis, symptom-driven inference, and patient vital monitoring. Traditional clinical diagnostic workflows often rely on manual observation across fragmented reference manuals, medical history records, laboratory tests, and differential diagnosis tables. This manual process can be time-consuming, prone to human error under high casualty pressure, and may lead to delayed medical interventions. The proposed MediMind system integrates these diagnostic workflows into a unified, interactive software suite.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
add_p(doc, "The application collects structured patient clinical data, including observed symptoms across multiple body systems (respiratory, cardiovascular, gastrointestinal, neurological, and systemic), physiological vitals (blood pressure, heart rate, body temperature, oxygen saturation SpO2), and patient risk factors. The core inference engine executes both Forward Chaining (data-driven reasoning from symptoms to disease diagnosis) and Backward Chaining (goal-driven hypothesis verification from suspected disease to required symptom evidence). The system evaluates disease probabilities, generates differential diagnoses, calculates patient triage acuity levels, and produces comprehensive Electronic Health Record (EHR) diagnostic reports.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
add_p(doc, "MediMind is designed as more than a basic symptom checker. It features an interactive Knowledge Base (KB) Editor that allows medical experts to add, modify, or audit production rules (IF-THEN clauses), adjust certainty factors (CF), and update clinical recommendation guidelines. The system retains complete working memory context, enabling clinicians to perform iterative diagnostic updates without re-entering patient data.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)

doc.add_page_break()

# --- PAGE 5: ACKNOWLEDGEMENT ---
add_p(doc, "ACKNOWLEDGEMENT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=18)
add_p(doc, "We express our sincere gratitude to our project guide, Prof. M. G. Ghodekar, for her valuable guidance, encouragement, and continuous support throughout the development of this mini project. Her insightful suggestions helped us understand the practical aspects of designing rule-based expert systems, knowledge representation, and preparing this academic report.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
add_p(doc, "We sincerely acknowledge the dedicated contributions, cooperation, and consistent efforts of all our team members: Hanny Jangir, Vaibhav Gaikwad, Janhavi Adagale, and Joshi Aabha. The successful completion of this project was possible because of the active participation, shared responsibility, and teamwork of every member.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
add_p(doc, "We are thankful to Dr. D. P. Gaikwad, Head of the Department of Computer Engineering, and Dr. D. S. Bormane, Principal of AISSMS College of Engineering, Pune, for providing us with the opportunity, facilities, and academic environment required to complete this work.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
add_p(doc, "\nAcademic Year: 2026-2027\nDate: 23rd September 2026", align=WD_ALIGN_PARAGRAPH.LEFT, size=11, space_before=24)

doc.add_page_break()

# --- PAGE 6: TABLE OF CONTENTS ---
add_p(doc, "TABLE OF CONTENTS", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=18)

toc_data = [
    ("1", "Abstract", "1"),
    ("2", "Acknowledgement", "2"),
    ("3", "Table of Contents", "3"),
    ("4", "Introduction", "4-5"),
    ("5", "Problem Statement and Objectives", "6-7"),
    ("6", "Software Requirement Specification (SRS)", "8-10"),
    ("7", "System Analysis and Design", "11-13"),
    ("8", "AI Based Clinical Diagnostic Systems & Rule Inference", "14-17"),
    ("9", "Database and User Preference Management", "18-21"),
    ("10", "API Integration and Backend Implementation", "22-25"),
    ("11", "Graphical User Interface", "26-27"),
    ("12", "Implementation Details", "28-31"),
    ("13", "Conclusion", "32"),
    ("14", "References", "33"),
]

table = doc.add_table(rows=1, cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = table.rows[0].cells
hdr_cells[0].text = 'Sr. No.'
hdr_cells[1].text = 'Chapter / Section'
hdr_cells[2].text = 'Page No.'
for cell in hdr_cells:
    for p in cell.paragraphs:
        p.runs[0].font.bold = True
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER

for sr, ch, pg in toc_data:
    row_cells = table.add_row().cells
    row_cells[0].text = sr
    row_cells[1].text = ch
    row_cells[2].text = pg
    row_cells[0].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    row_cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_page_break()

# --- CHAPTERS ---
add_p(doc, "CHAPTER 1: INTRODUCTION", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=14)
add_p(doc, "1.1 Overview of the Project", bold=True, size=13, space_before=10)
add_p(doc, "In modern healthcare systems, rapid and accurate clinical decision-making is vital for saving lives, optimizing hospital triage, and preventing diagnostic errors. Diagnostic decision-making requires analyzing a complex web of symptoms, physiological vitals, patient medical history, and risk factors. Traditional clinical workflows rely heavily on manual observation across fragmented reference manuals, medical history records, laboratory tests, and differential diagnosis tables. The MediMind Clinical AI Suite provides an interactive, rule-based expert diagnostic system that combines data-driven Forward Chaining inference and hypothesis-driven Backward Chaining inference.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)

add_p(doc, "1.2 Need for the System", bold=True, size=13, space_before=10)
add_p(doc, "Generic medical chatbots often provide general information, but fail to synthesize specific symptom combinations or physiological vitals into safe clinical decision support. MediMind addresses this critical gap by implementing structured clinical input, production rule validation, and dynamic inference engines.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)

doc.add_page_break()

add_p(doc, "CHAPTER 2: PROBLEM STATEMENT & OBJECTIVES", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=14)
add_p(doc, "2.1 Problem Statement", bold=True, size=13, space_before=10)
add_p(doc, "Planning and executing accurate clinical diagnostics involves evaluating multiple symptoms and vitals under time pressure. Traditional diagnostic processes suffer from cognitive overload during emergencies, lack of explainability in black-box AI models, and static diagnostic tools. MediMind solves this by implementing structured inputs, production rule validation, and dynamic dual inference engines.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)

add_p(doc, "2.2 Specific Objectives", bold=True, size=13, space_before=10)
objectives = [
    "1. Collect structured clinical symptoms across 5 body systems.",
    "2. Implement Forward Chaining inference for symptom-to-disease reasoning.",
    "3. Implement Backward Chaining inference for hypothesis verification.",
    "4. Design a Patient Vitals Triage Dashboard with anomaly alerts.",
    "5. Provide a Knowledge Base Editor for dynamic rule customization.",
    "6. Generate formal, printable EHR Diagnostic Reports formatted in Times New Roman."
]
for obj in objectives:
    add_p(doc, obj, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=4)

doc.add_page_break()

add_p(doc, "REFERENCES", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=14)
refs = [
    "1. Russell, S. and Norvig, P., Artificial Intelligence: A Modern Approach, 4th Edition, Pearson Education, 2021.",
    "2. Shortliffe, E. H., Computer-Based Medical Consultations: MYCIN, Elsevier, 1976.",
    "3. Giarratano, J. and Riley, G., Expert Systems: Principles and Programming, 4th Edition, Thomson Course Technology, 2004.",
    "4. World Health Organization (WHO), Digital Health Guidelines & Clinical Decision Support Systems, 2023.",
    "5. Savitribai Phule Pune University (SPPU), Computer Engineering AI Practical & Mini Project Guidelines 2024 Pattern."
]
for ref in refs:
    add_p(doc, ref, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6)

# Save docx
docx_path = r"C:\Users\lenovo\Desktop\IRONMAN\FULLSTACK\PROJECTS\FULLSTACK\NOVA.lab 2.0\nova-lab\NOVA_lab_Mini_Project_Report.docx"
doc.save(docx_path)
print(f"Successfully generated DOCX at {docx_path}")
