<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000000;">

# SAVITRIBAI PHULE PUNE UNIVERSITY

## A Mini Project Report On
# **NOVA.lab 2.0 — Interactive Artificial Intelligence Laboratory & Clinical Decision Support System Platform**

Submitted in partial fulfillment of the requirements for the degree of  
**THIRD YEAR OF ENGINEERING (TE Computer Engineering)**  
*SPPU 2024 Pattern (Term - I / Term - II)*

---

### **Submitted by:**
- GAIKWAD VAIBHAV – *24CO034*
- HANNY JANGIR – *24CO040*
- JANHAVI ADAGALE – *24CO052*
- JOSHI AABHA – *24CO053*

### **Under the Guidance of:**
**Prof. M. G. Ghodekar**  
Department of Computer Engineering  

**ALL INDIA SHRI SHIVAJI MEMORIAL SOCIETY’S**  
**COLLEGE OF ENGINEERING, PUNE – 411001**  
Academic Year: 2026-2027  

---

<div style="page-break-after: always;"></div>

## **ALL INDIA SHRI SHIVAJI MEMORIAL SOCIETY’S COLLEGE OF ENGINEERING**
### **DEPARTMENT OF COMPUTER ENGINEERING**

### **CERTIFICATE**

This is to certify that **Vaibhav Gaikwad (24CO034)**, **Hanny Jangir (24CO040)**, **Janhavi Adagale (24CO052)**, and **Joshi Aabha (24CO053)** from Third Year Computer Engineering have successfully completed their mini project work titled **“NOVA.lab 2.0 — Interactive Artificial Intelligence Laboratory & Clinical Decision Support System Platform”** at AISSMS College of Engineering, Pune, in partial fulfillment of the bachelor’s degree in Computer Engineering under Savitribai Phule Pune University.

<br/><br/>

__________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; __________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; __________________________  
**Prof. M. G. Ghodekar** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Dr. D. P. Gaikwad** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Dr. D. S. Bormane**  
*Project Guide* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; *Head of Department (HOD)* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; *Principal, AISSMS COE*

---

<div style="page-break-after: always;"></div>

## **MINI PROJECT APPROVAL**

The Mini Project entitled:  
### **NOVA.lab 2.0 — Interactive Artificial Intelligence Laboratory & Clinical Decision Support System Platform**

By:
- **Gaikwad Vaibhav** – 24CO034  
- **Hanny Jangir** – 24CO040  
- **Janhavi Adagale** – 24CO052  
- **Joshi Aabha** – 24CO053  

Is approved for the degree of **Third Year of Engineering in Computer Engineering**.

<br/><br/>

**Examiner 1:** __________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Examiner 2:** __________________________  
Name and Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Name and Signature  

**Date:**  
**Place:** AISSMS COE, Pune  

---

<div style="page-break-after: always;"></div>

## **ABSTRACT**

**NOVA.lab 2.0** is an interactive, full-stack web-based Artificial Intelligence simulation platform and Clinical Decision Support System (CDSS) designed specifically to meet the academic, practical, and experimental requirements of the Savitribai Phule Pune University (SPPU) 2024 Pattern AI Curriculum. Traditional computer engineering AI laboratories often rely on static code scripts or terminal executions that lack real-time visualization of agent state transitions, frontier memory queue expansion, heuristic evaluation functions, and rule deduction chains. This lack of visual feedback makes complex AI paradigms abstract and difficult to master.

The **NOVA.lab 2.0** platform bridges this gap by integrating five interactive simulation modules into a unified Google Labs-inspired web portal:
1. **Reflex Agent Vacuum Environment**: Simulates the PEAS framework, state perception tuples $\langle \text{Location}, \text{Status} \rangle$, and condition-action production rules with performance metrics.
2. **Tower of Hanoi State Space Graph**: Demonstrates divide-and-conquer recursion, stack activation frames, Sierpiński gasket state graphs, and optimal move proofs ($2^n - 1$).
3. **Breadth-First Search (BFS) Grid Pathfinder**: Illustrates FIFO queue frontier expansion, cycle detection via visited sets, and unweighted shortest-path optimality.
4. **A\* Search Algorithm for 8-Puzzle**: Visualizes heuristic evaluation $f(n) = g(n) + h(n)$, comparing Manhattan Distance dominance against Misplaced Tiles.
5. **Part C Mini-Project (MediMind Clinical AI Suite)**: A production-grade Rule-Based Expert System supporting Forward Chaining, Goal-Directed Backward Chaining, real-time patient vitals parsing, live Knowledge Base customization, and automated Electronic Health Record (EHR) prescription report generation.

Built using React 19, Node.js/Express, MongoDB Mongoose, and REST APIs, NOVA.lab 2.0 provides students and faculty with an end-to-end sandbox, interactive quiz assessments, dual-language source code (Python & Java), and detailed academic theory manuals.

---

<div style="page-break-after: always;"></div>

## **ACKNOWLEDGEMENT**

We express our sincere gratitude to our project guide, **Prof. M. G. Ghodekar**, for her valuable guidance, constant encouragement, and insightful feedback throughout the conceptualization and development of **NOVA.lab 2.0**. Her technical direction helped us align our software architecture with SPPU AI lab guidelines.

We gratefully acknowledge **Dr. D. P. Gaikwad**, Head of the Department of Computer Engineering, and **Dr. D. S. Bormane**, Principal of AISSMS College of Engineering, Pune, for providing state-of-the-art laboratory facilities and an inspiring academic environment.

We extend our deep appreciation to all team members—**Hanny Jangir, Vaibhav Gaikwad, Janhavi Adagale, and Joshi Aabha**—for their collaborative work, code contributions, and dedication. Finally, we thank our classmates and families for their unwavering encouragement.

---

<div style="page-break-after: always;"></div>

## **TABLE OF CONTENTS**

| Sr. No. | Chapter / Section Title | Page No. |
| :---: | :--- | :---: |
| 1 | **Abstract** | i |
| 2 | **Acknowledgement** | ii |
| 3 | **List of Figures and Tables** | iv |
| 4 | **Chapter 1: Introduction** | 1 |
| | 1.1 Overview of the Project | 1 |
| | 1.2 Need for the System | 2 |
| | 1.3 Purpose of the Project | 2 |
| | 1.4 Scope of the Project | 3 |
| 5 | **Chapter 2: Problem Statement and Objectives** | 4 |
| | 2.1 Problem Statement | 4 |
| | 2.2 Objectives of the Project | 5 |
| | 2.3 Expected Outcomes | 5 |
| 6 | **Chapter 3: Software Requirement Specification (SRS)** | 6 |
| | 3.1 Functional Requirements | 6 |
| | 3.2 Non-Functional Requirements | 8 |
| | 3.3 Hardware Requirements | 9 |
| | 3.4 Software Requirements | 9 |
| 7 | **Chapter 4: System Analysis and Architecture Design** | 10 |
| | 4.1 High-Level Architecture | 10 |
| | 4.2 Major System Modules | 11 |
| 8 | **Chapter 5: AI Algorithms & Clinical Inference Engine** | 14 |
| | 5.1 Simple Reflex Agent & PEAS | 14 |
| | 5.2 Tower of Hanoi State Space Search | 16 |
| | 5.3 BFS Pathfinder with FIFO Frontier | 18 |
| | 5.4 A\* Informed Heuristic Search ($f(n) = g(n) + h(n)$) | 20 |
| | 5.5 MediMind Clinical Expert System (Part C Mini-Project) | 22 |
| 9 | **Chapter 6: Database and Knowledge Base Schema** | 25 |
| 10 | **Chapter 7: API Endpoints and Backend Architecture** | 28 |
| 11 | **Chapter 8: User Interface & Visual Workbench** | 30 |
| 12 | **Chapter 9: Implementation Details & Code Structure** | 32 |
| 13 | **Chapter 10: Conclusion and Future Scope** | 35 |
| 14 | **References** | 36 |

---

<div style="page-break-after: always;"></div>

# **CHAPTER 1: INTRODUCTION**

### **1.1 Overview of the Project**
Artificial Intelligence (AI) education in modern computer engineering curricula requires a balanced synthesis of theoretical rigor and hands-on simulation. Under the Savitribai Phule Pune University (SPPU) 2024 pattern for Third Year Computer Engineering, students study core AI paradigms including Intelligent Agents, State-Space Search, Uninformed Search, Informed Heuristic Search, and Rule-Based Expert Systems.

**NOVA.lab 2.0** is an interactive web-based AI laboratory workbench developed to provide intuitive visual simulations for these fundamental algorithms. Rather than reading abstract formulas or running headless command-line scripts, students can interactively control environment percepts, trigger state transitions, observe FIFO queues and priority min-heaps in real time, and test production rules.

The system features five dedicated laboratory modules:
1. **Reflex Agent Vacuum Cleaner World**: Demonstrating rational action selection under the PEAS framework.
2. **Tower of Hanoi Recursive State Search**: Visualizing $3^n$ state spaces and call-stack frame execution.
3. **Breadth-First Search (BFS) Maze Pathfinder**: Demonstrating uniform level-by-level wave expansion and shortest-path guarantees.
4. **A\* Algorithm for 8-Puzzle**: Demonstrating heuristic admissibility and Manhattan distance calculation.
5. **Part C Mini-Project (MediMind Clinical AI Suite)**: A production-grade Rule-Based Expert System for clinical diagnosis featuring Forward Chaining, Goal-Directed Backward Chaining, Vitals integration, live Knowledge Base customization, and EHR Prescription Report generation.

### **1.2 Need for the System**
Traditional practical laboratory sessions present several challenges to engineering students:
- **Abstract State Spaces**: Algorithms like A\* or BFS operate on memory structures (Open/Closed lists, Queues) that are invisible during standard code execution.
- **Lack of Interactive Feedback**: Headless console prints fail to convey how changing a single tile or wall obstacle alters heuristic evaluation values $f(n) = g(n) + h(n)$.
- **Inconsistent Practical Preparation**: Students often lack access to structured academic manuals, algorithm pseudocode, dual-language implementations (Python & Java), and viva exam quizzes in a single platform.
- **Part C Mini-Project Complexity**: Developing a realistic Rule-Based Expert System for clinical diagnosis requires complex inference engine logic, conflict resolution, and user-friendly medical report generation.

**NOVA.lab 2.0** solves these issues by delivering an integrated, visual, and academically comprehensive platform accessible via any modern browser.

### **1.3 Purpose of the Project**
The primary purpose of **NOVA.lab 2.0** is to:
- Provide an open-source, full-stack practical workbench aligned with the SPPU 2024 AI syllabus.
- Enhance conceptual clarity through step-by-step graphical visualizers for all core AI search strategies.
- Demonstrate production-grade software engineering practices by building a Clinical Decision Support System (CDSS) for the Part C Mini-Project requirements.
- Offer dual-language code samples (Python 3 & Java) along with interactive viva assessment quizzes.

### **1.4 Scope of the Project**
The scope of **NOVA.lab 2.0** encompasses:
- Full client-side web application built with React 19 and Vite.
- Node.js/Express backend API connected to MongoDB Atlas for persistent assignment data, theory manuals, and viva quizzes.
- Five distinct simulation workbenches with real-time state telemetry.
- MediMind Clinical Suite featuring Forward/Backward Chaining, Vitals processing, live Knowledge Base editing, and downloadable EHR medical reports.

---

<div style="page-break-after: always;"></div>

# **CHAPTER 2: PROBLEM STATEMENT AND OBJECTIVES**

### **2.1 Problem Statement**
"To design, develop, and deploy an integrated, web-based interactive Artificial Intelligence laboratory simulator and Clinical Decision Support System (NOVA.lab 2.0) under the SPPU 2024 Computer Engineering Pattern that enables students to visually experiment with Intelligent Agents, State Space Traversal, BFS Pathfinder, A\* Heuristic Search, and Rule-Based Medical Expert Systems with automated EHR report generation."

### **2.2 Objectives of the Project**
1. **Intelligent Agent Simulation**: Implement a Simple Reflex Agent in a 2-room Vacuum Cleaner world operating on state tuples $\langle \text{Location}, \text{Status} \rangle$ to evaluate energy vs cleanliness metrics.
2. **Recursive State Traversal**: Model the $3^n$ legal state space of Tower of Hanoi and verify the optimal move lower bound ($2^n - 1$).
3. **Uninformed Search Execution**: Implement Breadth-First Search (BFS) using a FIFO queue frontier and demonstrate shortest-path optimality in grid mazes.
4. **Informed Heuristic Search**: Implement A\* search for the 8-Puzzle problem, demonstrating Manhattan Distance dominance over Misplaced Tiles.
5. **Clinical Expert Engine (Part C)**: Develop a production-grade Clinical Expert System (MediMind AI) supporting:
   - **Forward Chaining** (Data-driven diagnosis from symptoms).
   - **Backward Chaining** (Goal-driven hypothesis validation).
   - **Real-time Patient Vitals Parsing** (Temperature, HR, SpO2 auto-triggering symptoms).
   - **Knowledge Base Extensibility** (Live addition of custom IF-THEN rules).
   - **EHR Prescription Report Generation** (ICD-10 codes, lab test recommendations, and precautions).
6. **Academic Enrichment**: Include formatted markdown manuals, algorithm breakdowns, time/space complexity profiles, dual Python/Java code scripts, and interactive viva quizzes.

---

<div style="page-break-after: always;"></div>

# **CHAPTER 3: SOFTWARE REQUIREMENT SPECIFICATION (SRS)**

### **3.1 Functional Requirements**

| Req ID | Functional Requirement Description | Target Module |
| :---: | :--- | :--- |
| **FR-01** | The system shall display all 5 SPPU laboratory assignment cards on a responsive home dashboard. | Home Dashboard |
| **FR-02** | The system shall provide an interactive 2-room Vacuum Reflex Agent sandbox allowing users to drop dirt and run reflex loops. | Vacuum Sandbox |
| **FR-03** | The system shall simulate Tower of Hanoi disk moves both manually and via recursive auto-solver. | Hanoi Sandbox |
| **FR-04** | The system shall visualize BFS maze pathfinding level-by-level using an exposed FIFO queue buffer. | BFS Sandbox |
| **FR-05** | The system shall evaluate A\* 8-Puzzle tile sliding using $f(n) = g(n) + h(n)$ with live Manhattan distance feedback. | 8-Puzzle Sandbox |
| **FR-06** | The MediMind AI module shall parse patient temperature, heart rate, and SpO2 vitals into working memory symptoms. | MediMind Suite |
| **FR-07** | The MediMind AI module shall execute Forward Chaining inference and compute dynamic rule confidence percentages. | MediMind Suite |
| **FR-08** | The MediMind AI module shall execute Backward Chaining to prove or disprove clinical hypotheses. | MediMind Suite |
| **FR-09** | The system shall allow users to add custom production rules $\text{IF } \{S_1, S_2\} \rightarrow \text{Disease}$ live into the Knowledge Base. | KB Editor |
| **FR-10** | The system shall generate printable EHR Diagnostic Prescription reports with triage badges and ICD-10 codes. | EHR Module |
| **FR-11** | The system shall render academic theory using `react-markdown` without exposing raw syntax. | Theory Reader |
| **FR-12** | The system shall allow copying Python and Java implementation code with a single click. | Code Tab |
| **FR-13** | The system shall score interactive viva quizzes and display detailed academic explanations upon answer submission. | Quiz Tab |

### **3.2 Non-Functional Requirements**

| Attribute | Specification |
| :--- | :--- |
| **Usability** | Minimalist Google Labs aesthetic, Times New Roman academic typography. |
| **Performance** | Instant state transition updates (< 16ms render latency using React 19). |
| **Reliability** | Includes client-side fallback assignment data so cards render smoothly even when offline. |
| **Maintainability** | Modular React component architecture separating visualizers, pages, and API hooks. |

---

<div style="page-break-after: always;"></div>

# **CHAPTER 10: CONCLUSION AND FUTURE SCOPE**

### **10.1 Conclusion**
**NOVA.lab 2.0** successfully delivers a comprehensive, interactive AI laboratory platform tailored for the SPPU 2024 Computer Engineering pattern. By combining visual sandbox execution, formal theory manuals, dual-language source code, and an advanced Clinical Decision Support System (MediMind AI), the system converts complex theoretical concepts into an intuitive educational experience.

### **10.2 Future Scope**
1. **LLM API Integration**: Connect MediMind AI directly with OpenAI GPT-4o / Gemini 1.5 Pro APIs for natural language medical consultations.
2. **3D Visualizers**: Implement Three.js 3D renderings for 8-Puzzle and Hanoi environments.
3. **Cloud Deployment**: Host the platform on Vercel (Frontend) and Render/AWS (Backend MongoDB).

---

# **REFERENCES**

1. Russell, S. and Norvig, P., *Artificial Intelligence: A Modern Approach*, 4th Edition, Pearson Education, 2021.
2. Savitribai Phule Pune University (SPPU), *B.E. Computer Engineering Syllabus (2024 Pattern)*, Artificial Intelligence Laboratory (310243).
3. React Documentation, *React 19 & Hooks Specification*, Available at: https://react.dev/
4. Node.js Foundation, *Express.js Server Framework*, Available at: https://expressjs.com/
5. MongoDB Inc., *Mongoose ODM Reference Documentation*, Available at: https://mongoosejs.com/
6. Shortliffe, E. H., *Computer-Based Medical Consultations: MYCIN*, Elsevier, 1976.

</div>
