# A Mini Project Report On
# MediMind Clinical AI Suite

**Submitted in partial fulfilment of the requirements for the degree of**
### THIRD YEAR OF ENGINEERING
**In**
### COMPUTER ENGINEERING

**Submitted by**
- Gaikwad Vaibhav – 24CO034
- Hanny Jangir - 24CO040
- Janhavi Adagale – 24CO052
- Joshi Aabha – 24CO053

**Under the Guidance of**
**Prof. M. G. Ghodekar**

**Department Of Computer Engineering**
**ALL INDIA SHRI SHIVAJI MEMORIAL SOCIETY’S COLLEGE OF ENGINEERING Pune – 411001**
**Academic Year: 2026-27 (Term – I)**
**Savitribai Phule Pune University**

---

## CERTIFICATE

This is to certify that **Vaibhav Gaikwad (24CO034)**, **Hanny Jangir (24CO040)**, **Janhavi Adagale (24CO052)** and **Joshi Aabha (24CO053)** from Third Year Computer Engineering have successfully completed their mini project work titled **“MediMind Clinical AI Suite”** at AISSMS College of Engineering, Pune in partial fulfilment of bachelor’s degree in engineering.

- **Prof. M. G. Ghodekar** (Project Guide)
- **Dr. D. P. Gaikwad** (HOD)
- **Dr. D. S. Bormane** (Principal, AISSMS COE Pune)

---

## ABSTRACT

The **MediMind Clinical AI Suite** is an advanced, rule-based expert diagnostic and clinical decision support system (CDSS) designed to assist medical practitioners, triage nurses, and students in automated disease diagnosis, symptom-driven inference, and patient vital monitoring. Traditional clinical diagnostic workflows often rely on manual observation across fragmented reference manuals, medical history records, laboratory tests, and differential diagnosis tables. This manual process can be time-consuming, prone to human error under high casualty pressure, and may lead to delayed medical interventions. The proposed MediMind system integrates these diagnostic workflows into a unified, interactive software suite.

The application collects structured patient clinical data, including observed symptoms across multiple body systems (respiratory, cardiovascular, gastrointestinal, neurological, and systemic), physiological vitals (blood pressure, heart rate, body temperature, oxygen saturation SpO2), and patient risk factors. The core inference engine executes both **Forward Chaining** (data-driven reasoning from symptoms to disease diagnosis) and **Backward Chaining** (goal-driven hypothesis verification from suspected disease to required symptom evidence). The system evaluates disease probabilities, generates differential diagnoses, calculates patient triage acuity levels, and produces comprehensive Electronic Health Record (EHR) diagnostic reports.

---

## ACKNOWLEDGEMENT

We express our sincere gratitude to our project guide, **Prof. M. G. Ghodekar**, for her valuable guidance, encouragement, and continuous support throughout the development of this mini project. Her insightful suggestions helped us understand the practical aspects of designing rule-based expert systems, knowledge representation, and preparing this academic report.

We sincerely acknowledge the dedicated contributions, cooperation, and consistent efforts of all our team members: **Vaibhav Gaikwad, Hanny Jangir, Janhavi Adagale, and Joshi Aabha**. The successful completion of this project was possible because of the active participation, shared responsibility, and effective teamwork of every member.

We are thankful to **Dr. D. P. Gaikwad**, Head of the Department of Computer Engineering, and **Dr. D. S. Bormane**, Principal of AISSMS College of Engineering, Pune, for providing us with the necessary departmental facilities and academic environment.

---

## TABLE OF CONTENTS

| Sr. No. | Chapter / Section | Page No. |
| :---: | :--- | :---: |
| 1 | Abstract | 1 |
| 2 | Acknowledgement | 2 |
| 3 | Table of Contents | 3 |
| 4 | Introduction | 4-5 |
| 5 | Problem Statement and Objectives | 6-7 |
| 6 | Software Requirement Specification (SRS) | 8-10 |
| 7 | System Analysis and Design | 11-13 |
| 8 | AI Based Clinical Diagnostic Systems & Rule Inference | 14-17 |
| 9 | Knowledge Base & Working Memory Management | 18-21 |
| 10 | API Integration and Backend Implementation | 22-25 |
| 11 | Graphical User Interface & Clinical Visualizer | 26-27 |
| 12 | System Implementation & Testing | 28-31 |
| 13 | Conclusion & Future Scope | 32 |
| 14 | References | 33 |

---

## CHAPTER 1: INTRODUCTION

### 1.1 Overview of the Project
In modern healthcare systems, rapid and accurate clinical decision-making is vital for saving lives, optimizing hospital triage, and preventing diagnostic errors. Diagnostic decision-making requires analyzing a complex web of symptoms, physiological vitals, patient medical history, and risk factors. The **MediMind Clinical AI Suite** provides an interactive, rule-based expert diagnostic system that combines data-driven **Forward Chaining inference** and hypothesis-driven **Backward Chaining inference**.

### 1.2 Purpose of the Project
- To build a robust rule-based expert system capable of evaluating complex medical production rules.
- To implement dual inference engines: Forward Chaining for data-driven diagnosis and Backward Chaining for hypothesis verification.
- To integrate patient vital sign monitoring with automated alert thresholding.
- To provide an interactive Knowledge Base Editor that enables medical experts to add, modify, and audit clinical diagnostic rules.

---

## CHAPTER 2: PROBLEM STATEMENT & OBJECTIVES

### 2.1 Problem Statement
Planning and executing accurate clinical diagnostics involves evaluating multiple symptoms and vitals. Traditional diagnostic processes suffer from cognitive overload during emergencies, lack of explainability in black-box AI models, and static diagnostic tools. MediMind solves this by implementing structured inputs, production rule validation, and dynamic dual inference engines.

### 2.2 Specific Objectives
1. Collect structured clinical symptoms across 5 body systems.
2. Implement Forward Chaining inference for symptom-to-disease reasoning.
3. Implement Backward Chaining inference for hypothesis verification.
4. Design a Patient Vitals Triage Dashboard with anomaly alerts.
5. Provide a Knowledge Base Editor for dynamic rule customization.
6. Generate formal, printable EHR Diagnostic Reports formatted in Times New Roman.

---

## CHAPTER 3: SOFTWARE REQUIREMENT SPECIFICATION (SRS)

### Functional Requirements
| Req ID | Description |
| :---: | :--- |
| **FR-01** | The system shall allow users to select observed symptoms from structured categories. |
| **FR-02** | The system shall execute Forward Chaining inference to deduce disease conclusions. |
| **FR-03** | The system shall calculate certainty factors (CF) for matched disease rules. |
| **FR-04** | The system shall execute Backward Chaining by asking targeted diagnostic questions. |
| **FR-05** | The system shall monitor physiological vitals (BP, HR, Temp, SpO2) and alert anomalies. |
| **FR-06** | The system shall provide Knowledge Base CRUD capabilities for medical rules. |
| **FR-07** | The system shall generate printable Electronic Health Record (EHR) reports. |

---

## CHAPTER 4: SYSTEM ARCHITECTURE & DESIGN

```
+-----------------------------------------------------------------------+
|                       WEB GRAPHICAL USER INTERFACE                     |
|  [Forward Chaining] [Backward Chaining] [Vitals] [KB Editor] [EHR]   |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                        CLINICAL INFERENCE ENGINE                      |
|  - Working Memory Manager (Symptom Facts & Patient Vitals)            |
|  - Production Rule Matcher (IF-THEN Clause Evaluator)                 |
|  - Certainty Factor Calculator & Diagnostic Ranker                   |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                     KNOWLEDGE BASE & PERSISTENCE                      |
|  - Disease Rules Array (Malaria, Typhoid, Dengue, Pneumonia, COVID)   |
|  - Symptom Catalog & Medical Guidelines                               |
+-----------------------------------------------------------------------+
```

---

## CHAPTER 5: CONCLUSION & REFERENCES

### Conclusion
The **MediMind Clinical AI Suite** successfully demonstrates the application of Artificial Intelligence in medical diagnostics through production rules, dual inference engines, physiological triage monitoring, and knowledge base editing.

### References
1. Russell, S. and Norvig, P., *Artificial Intelligence: A Modern Approach*, 4th Edition, Pearson Education, 2021.
2. Shortliffe, E. H., *Computer-Based Medical Consultations: MYCIN*, Elsevier, 1976.
3. Giarratano, J. and Riley, G., *Expert Systems: Principles and Programming*, 4th Edition, Thomson Course Technology, 2004.
4. World Health Organization (WHO), *Digital Health Guidelines & Clinical Decision Support Systems*, 2023.
