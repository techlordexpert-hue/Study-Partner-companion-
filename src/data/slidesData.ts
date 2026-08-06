import { LectureModule } from "../types";

export const lectureModules: LectureModule[] = [
  {
    id: "lesson-1",
    code: "ICTE 242 - Lesson 1",
    title: "Introduction to Databases & DBMS",
    subtitle: "Data Storage, Abstraction Levels & Enterprise Systems",
    description: "Explore how Facebook, banks, and WhatsApp manage millions of records instantly, the difference between databases and DBMS, and 3 levels of data abstraction.",
    iconName: "Database",
    slides: [
      {
        id: "l1-s1",
        slideNumber: 1,
        title: "HOW DO FACEBOOK, BANKS, AND WHATSAPP STORE YOUR DATA?",
        textContent: `### HOW DO FACEBOOK, BANKS, AND WHATSAPP STORE YOUR DATA?

* How do these systems store millions of users’ data and retrieve it instantly?
* What would happen if all this data disappeared today?
* Can these systems work effectively without databases?`,
        briefExplanation: "Introduces real-world enterprise data storage challenges and why software systems rely on robust database infrastructure rather than simple flat files.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/cz3WRR21vK4",
        youtubeQuery: "How databases work Facebook Banking WhatsApp DBMS introduction",
        researchTopics: ["Database vs Flat File Systems", "Enterprise Storage Architectures", "ACID Properties in Banking"]
      },
      {
        id: "l1-s2",
        slideNumber: 2,
        title: "THINK–PAIR–SHARE",
        textContent: `### THINK–PAIR–SHARE

**Discuss with your partner:**

* Which of these systems do you use most?
* What data about you is stored there?
* Why is that data important?`,
        briefExplanation: "A peer-learning activity prompting students to identify personal data footprint (messages, balances, profile media) and evaluate data privacy and value.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/3EJlovevfcA",
        youtubeQuery: "Types of data stored in web applications DBMS introduction",
        researchTopics: ["Personal Data Footprint", "Data Privacy & Governance", "User Session Management"]
      },
      {
        id: "l1-s3",
        slideNumber: 3,
        title: "LEARNING OUTCOMES",
        textContent: `### LEARNING OUTCOMES

* Explain the difference between a Database and DBMS
* Identify real-world database applications
* Explain why organizations need databases
* Describe data abstraction levels
* Explain the importance of data organization
* Collaboratively analyze database problems`,
        briefExplanation: "Sets explicit core competencies for Lesson 1: terminology distinction, architectural abstraction levels, and collaborative problem-solving.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/FR4QIvcIGMc",
        youtubeQuery: "Database management system core concepts learning outcomes",
        researchTopics: ["DBMS Core Objectives", "Database Administrator Roles", "Data Organization Strategies"]
      },
      {
        id: "l1-s4",
        slideNumber: 4,
        title: "DATABASES AROUND US",
        textContent: `### DATABASES AROUND US

**Mention systems around you that use databases**

**Discuss:**

* What data is stored?
* Who uses the data?
* Why is the data important?`,
        briefExplanation: "Contextualizes databases in daily environments such as university portals (UEW), hospitals, supermarkets, and mobile banking apps.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/wR0mH64pX5U",
        youtubeQuery: "Real world database applications examples",
        researchTopics: ["Real-world Database Use Cases", "Information Systems Architecture", "Database End Users"]
      },
      {
        id: "l1-s5",
        slideNumber: 5,
        title: "WHAT IS A DATABASE?",
        textContent: `### WHAT IS A DATABASE?

A database is an organized collection of structured information or data stored electronically in a computer system.

| Student ID | Name | Department |
| --- | --- | --- |
| 101 | Ama | ICT |
| 102 | Kojo | Science |
| 103 | Efua | Mathematics |

**Think About This:**

* Why should data be organized?`,
        briefExplanation: "Defines a database as an organized, structured data store, illustrating with a 3-row tabular structure containing Student ID, Name, and Department.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
        youtubeQuery: "What is a database structured data introduction",
        researchTopics: ["Structured vs Unstructured Data", "Relational Tables", "Electronic Data Storage History"]
      },
      {
        id: "l1-s6",
        slideNumber: 6,
        title: "WHAT IS A DBMS?",
        textContent: `### WHAT IS A DBMS?

A Database Management System (DBMS) is software designed to store, manage, secure, and retrieve data from databases.

**Examples:** MySQL, Microsoft Access, Oracle, SQL Server, PostgreSQL

**Think About This:**

* “Is WhatsApp itself a DBMS?”`,
        briefExplanation: "Differentiates DBMS software (MySQL, PostgreSQL, Oracle) from the underlying data, clarifying that application clients (like WhatsApp) communicate with a DBMS.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/1057v38slyI",
        youtubeQuery: "Difference between Database and DBMS explanation",
        researchTopics: ["DBMS Software Engines", "Relational Database Engines Comparison", "Application vs DBMS"]
      },
      {
        id: "l1-s7",
        slideNumber: 7,
        title: "GROUP ACTIVITY",
        textContent: `### GROUP ACTIVITY

**Each group investigates ONE system:**

* Banking system
* Hospital system
* University system
* Supermarket system

**Discuss:**

* What data is stored?
* Why is the database important?
* What problems occur without databases?
* Which data should be protected?

**Prepare a Short Presentation**
Present:
* your assigned system,
* data stored,
* importance of databases,
* and security concerns.`,
        briefExplanation: "Collaborative activity assigning students to analyze domain requirements, critical assets, failure modes, and security constraints for enterprise systems.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/hlGoQC332VM",
        youtubeQuery: "Database design analysis domain requirements",
        researchTopics: ["Domain Requirement Analysis", "Database Security Constraints", "Data Loss Consequences"]
      },
      {
        id: "l1-s8",
        slideNumber: 8,
        title: "WHY ARE DATABASES IMPORTANT?",
        textContent: `### WHY ARE DATABASES IMPORTANT?

* Keeps track of customers
* Conducts data analysis
* Improves decision-making
* Enhances security
* Centralized control
* Saves time and resources
* Efficient inventory tracking

**Discuss:**

* “Which of these advantages is most important for a bank?”`,
        briefExplanation: "Lists 7 pivotal organizational benefits of databases including centralized control, rapid querying, auditability, security, and decision-support analytics.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/OWS3p91SIsU",
        youtubeQuery: "Importance and advantages of database management system",
        researchTopics: ["Centralized Control in DBMS", "Data Integrity & Security", "Business Intelligence & Analytics"]
      },
      {
        id: "l1-s9",
        slideNumber: 9,
        title: "SCENARIO-BASED LEARNING",
        textContent: `### SCENARIO-BASED LEARNING

A school stores student records manually using notebooks and spreadsheets.

**Discuss:**

* What problems may occur?
* How can a DBMS help?
* What security risks exist?
* How can missing results be prevented?`,
        briefExplanation: "Presents a real school scenario transitioning from notebooks/Excel to a DBMS, emphasizing issues like data corruption, concurrent edit collisions, and missing records.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/8v_5YJ-X2mI",
        youtubeQuery: "File processing system vs DBMS problems",
        researchTopics: ["File-Based System Limitations", "Data Redundancy in Spreadsheets", "Concurrent Access Control"]
      },
      {
        id: "l1-s10",
        slideNumber: 10,
        title: "WHAT IS DATA ABSTRACTION?",
        textContent: `### WHAT IS DATA ABSTRACTION?

Data abstraction hides unnecessary details from users.

**Real-World Example:**
Students use WhatsApp daily but do not know:

* where the data is stored,
* how the data is stored,
* or which servers are used.

**Think About This:**

* “Why shouldn’t ordinary users access physical database storage?”`,
        briefExplanation: "Explains data abstraction—hiding physical storage complexity from end users to protect systems and simplify application development.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/0XpD0vM3GVs",
        youtubeQuery: "Data abstraction in DBMS explained simply",
        researchTopics: ["Data Abstraction Concept", "Data Independence", "Information Hiding in Software"]
      },
      {
        id: "l1-s11",
        slideNumber: 11,
        title: "THREE LEVELS OF DATA ABSTRACTION",
        textContent: `### THREE LEVELS OF DATA ABSTRACTION

* **View Level** – What users see (External Schema)
* **Conceptual Level** – Database structure (Tables, Entities, Relationships)
* **Physical Level** – Actual storage (Files, Indexes, Blocks on Disk)

\`\`\`
Physical Schema -> Conceptual Schema -> View 1 / View 2 / View 3 -> DB Users
\`\`\`

**Think About This:**

* “Which level do students normally interact with?”`,
        briefExplanation: "Details ANSI-SPARC 3-schema architecture: Physical Level (disk/files), Conceptual Level (tables/relationships), and View Level (customized user screens).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/2X_424X9C8s",
        youtubeQuery: "Three schema architecture data abstraction ANSI SPARC",
        researchTopics: ["ANSI-SPARC 3-Schema Architecture", "Physical vs Logical Data Independence", "View Level Security"]
      },
      {
        id: "l1-s12",
        slideNumber: 12,
        title: "ROLE-PLAY ACTIVITY",
        textContent: `### ROLE-PLAY ACTIVITY

* **Scenario:** UEW Student Management System
* **Roles:** Student, Lecturer, HOD, Database Administrator
* **Task:** Discuss:
* what information each role can access,
* what should be hidden,
* and why.`,
        briefExplanation: "Illustrates View Level security and Role-Based Access Control (RBAC): students view grades, lecturers enter grades, HOD approves, DBA manages schema.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U9s8o_zXf1k",
        youtubeQuery: "Role based access control DBMS view level",
        researchTopics: ["Role-Based Access Control (RBAC)", "Database Views & Authorization", "UEW Student Portal Case Study"]
      },
      {
        id: "l1-s13",
        slideNumber: 13,
        title: "WHAT ARE DATA MODELS?",
        textContent: `### WHAT ARE DATA MODELS?

A data model describes how data is structured, connected, stored, and accessed.

**Main Types of Data Models:**

* Object-Based Data Models
* Record-Based Logical Models (Relational, Network, Hierarchical)
* Physical Data Models

**Think About This:**

* “Why should developers plan databases before implementation?”`,
        briefExplanation: "Defines Data Models as structural blueprints governing entities, attributes, and relationships before code or database tables are created.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/fE_mS-FvW7A",
        youtubeQuery: "Data models in DBMS relational network hierarchical",
        researchTopics: ["Record-Based Logical Models", "Data Modeling Methodologies", "Object-Relational Mapping"]
      },
      {
        id: "l1-s14",
        slideNumber: 14,
        title: "QUICK KNOWLEDGE CHECK",
        textContent: `### QUICK KNOWLEDGE CHECK

1. What is a database?
2. What is a DBMS?
3. Mention one example of DBMS.
4. Why is data abstraction important?
5. Which abstraction level do users interact with?`,
        briefExplanation: "Quick review quiz testing core terminology (Database vs DBMS, MySQL/PostgreSQL examples, Data Abstraction, View Level).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/1057v38slyI",
        youtubeQuery: "DBMS quiz foundational questions review",
        researchTopics: ["DBMS Fundamentals Self-Assessment", "Exam Review Key Points"]
      },
      {
        id: "l1-s15",
        slideNumber: 15,
        title: "REFLECTION",
        textContent: `### REFLECTION

* What new thing did you learn today?
* Which database application interests you most?
* Why is database security important?
* What was difficult to understand?`,
        briefExplanation: "Metacognitive reflection prompting students to summarize key takeaways, address difficulty areas, and appreciate database security.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/FR4QIvcIGMc",
        youtubeQuery: "DBMS study guide summary reflection",
        researchTopics: ["Metacognition in CS Learning", "Database Security Fundamentals"]
      },
      {
        id: "l1-s16",
        slideNumber: 16,
        title: "EXIT TICKET",
        textContent: `### EXIT TICKET

Before you leave, write:

1. One thing you learned today
2. One question you still have
3. One real-world use of databases`,
        briefExplanation: "Formative assessment checking student mastery and identifying topics that require clarification in upcoming sessions.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/cz3WRR21vK4",
        youtubeQuery: "Database summary exit ticket ICT",
        researchTopics: ["Formative Feedback in Database Education"]
      },
      {
        id: "l1-s17",
        slideNumber: 17,
        title: "HOMEWORK",
        textContent: `### HOMEWORK

Identify **one** school, hospital, church, business, or shop that could benefit from a database system.

**Explain:**

* What data should be stored?
* Who will use the system?
* Why is a DBMS important?
* What problems can databases solve?`,
        briefExplanation: "Applied homework task requiring students to conduct a mini systems analysis for a local establishment.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/wR0mH64pX5U",
        youtubeQuery: "Database design homework requirement analysis",
        researchTopics: ["Systems Analysis & Design", "Database Requirements Specification"]
      }
    ]
  },
  {
    id: "lesson-2",
    code: "ICTE 242 - Lesson 2",
    title: "Relational Data Model & ER Diagrams",
    subtitle: "Entities, Attributes, Cardinalities & Crow's Foot Notation",
    description: "Learn the relational model structure (tables, tuples, attributes), key constraints, and step-by-step ERD design with Crow's Foot notation.",
    iconName: "GitFork",
    slides: [
      {
        id: "l2-s1",
        slideNumber: 1,
        title: "HOW ARE DATABASE TABLES CONNECTED?",
        textContent: `### HOW ARE DATABASE TABLES CONNECTED?

• How do schools connect students, courses, and lecturers?
• Why are relationships important in databases?`,
        briefExplanation: "Introduces relational modeling—how isolated data tables are linked logically to represent real-world relationships.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/v9q36XOfmGg",
        youtubeQuery: "Relational data model table connections database relationships",
        researchTopics: ["Relational Model Foundations", "Table Relationships", "Foreign Key Linking"]
      },
      {
        id: "l2-s2",
        slideNumber: 2,
        title: "THINK–PAIR–SHARE",
        textContent: `### THINK–PAIR–SHARE

Discuss with your partner:
• What information should be stored about students?
• How are courses linked to students?`,
        briefExplanation: "Activity asking students to identify student attributes (ID, Name, Program) and course enrollment link tables.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/QpdhBUYk7Kk",
        youtubeQuery: "Database entity attributes and links student course",
        researchTopics: ["Student Course Domain Model", "Junction Tables", "Attribute Selection"]
      },
      {
        id: "l2-s3",
        slideNumber: 3,
        title: "LEARNING OUTCOMES",
        textContent: `### LEARNING OUTCOMES

• Explain the Relational Data Model
• Differentiate between table, tuple, and attribute
• Explain relational integrity constraints
• Identify entities and relationships
• Explain cardinality and Crow’s Foot notation
• Design simple ER diagrams collaboratively`,
        briefExplanation: "Outlines technical goals: relational terminology (tuple, attribute, domain), integrity rules, and drawing ER diagrams with Crow's Foot notation.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/QpdhBUYk7Kk",
        youtubeQuery: "ER diagram and relational data model tutorial",
        researchTopics: ["Relational Model Theory", "ERD Design Rules", "Crow's Foot Notation"]
      },
      {
        id: "l2-s4",
        slideNumber: 4,
        title: "RELATIONAL DATA MODEL",
        textContent: `### RELATIONAL DATA MODEL

• Represents data using tables (relations)
• Rows represent records (tuples)
• Columns represent attributes
• Tables are linked using relationships

Example:

| StudentID | Name | Program |
| --- | --- | --- |
| 101 | Ama | ICT |
| 102 | Kojo | Science |`,
        briefExplanation: "Defines the Relational Data Model proposed by E.F. Codd: data stored in 2D tables with rows as records and columns as attributes.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/NvrpuB_013E",
        youtubeQuery: "Relational database model tables tuples attributes",
        researchTopics: ["E.F. Codd Relational Model", "Relation Instance vs Schema", "Tuple Structure"]
      },
      {
        id: "l2-s5",
        slideNumber: 5,
        title: "KEY CONCEPTS IN RELATIONAL MODEL",
        textContent: `### KEY CONCEPTS IN RELATIONAL MODEL

| Concept | Definition |
| --- | --- |
| **Table** | Collection of related records organized into rows and columns |
| **Tuple** | A single row or record in a table |
| **Attribute** | A column describing a property of an entity |
| **Relation Schema** | Structure of a table including attributes and constraints |
| **Relation Instance** | Actual data stored in a table at a given time |
| **Attribute Domain** | Set of permissible values for an attribute |`,
        briefExplanation: "Core reference table defining essential relational database terms: Table, Tuple (row), Attribute (column), Schema, Instance, and Domain.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/OqjJjpjDRLc",
        youtubeQuery: "Tuple attribute relation schema domain relational database terms",
        researchTopics: ["Relational Terminology", "Domain Constraints", "Relation Instance vs Schema"]
      },
      {
        id: "l2-s6",
        slideNumber: 6,
        title: "RELATIONAL INTEGRITY CONSTRAINTS",
        textContent: `### RELATIONAL INTEGRITY CONSTRAINTS

• Primary Key Constraint
• Domain Constraint
• Referential Integrity Constraint

These rules ensure consistency and accuracy in databases.`,
        briefExplanation: "Introduces the 3 fundamental rules that prevent invalid, duplicate, or orphan data from corrupting the database.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/wX21A-fGsc4",
        youtubeQuery: "Integrity constraints in DBMS primary key domain referential",
        researchTopics: ["Integrity Constraints", "Database Consistency Rules", "Data Corruption Prevention"]
      },
      {
        id: "l2-s7",
        slideNumber: 7,
        title: "PRIMARY KEY CONSTRAINT",
        textContent: `### PRIMARY KEY CONSTRAINT

A primary key uniquely identifies each record in a table.
• Cannot contain NULL values
• Must be unique

Examples:
• StudentID
• EmployeeID`,
        briefExplanation: "Details Primary Key (PK) rules: strict uniqueness and mandatory NOT NULL enforcement across all tuples.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/4b33A248z_E",
        youtubeQuery: "Primary key constraint rules unique not null",
        researchTopics: ["Primary Key Uniqueness", "NOT NULL Enforcement", "Surrogate vs Natural Keys"]
      },
      {
        id: "l2-s8",
        slideNumber: 8,
        title: "DOMAIN CONSTRAINTS",
        textContent: `### DOMAIN CONSTRAINTS

• Define acceptable values for attributes

Examples:
• Age cannot be negative
• Marks must be between 0–100
• Phone numbers must contain digits only`,
        briefExplanation: "Explains Domain Constraints (data types, ranges, CHECK constraints) restricting attribute values to valid domain ranges.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/A3X93w1XkKw",
        youtubeQuery: "Domain constraints CHECK constraint SQL DBMS",
        researchTopics: ["Domain Range Restrictions", "CHECK Constraints SQL", "Data Validation at Engine Level"]
      },
      {
        id: "l2-s9",
        slideNumber: 9,
        title: "REFERENTIAL INTEGRITY CONSTRAINTS",
        textContent: `### REFERENTIAL INTEGRITY CONSTRAINTS

• Ensures relationships remain valid
• Foreign keys must match existing primary keys

Example:
• StudentID in PAYMENT table must exist in STUDENT table (Parent-Child relationship)`,
        briefExplanation: "Explains Referential Integrity: Foreign Keys (FK) in child tables must reference valid Primary Keys (PK) in parent tables.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Referential integrity foreign key parent child table",
        researchTopics: ["Referential Integrity Rules", "Parent-Child Foreign Key Rules", "Cascading Updates & Deletes"]
      },
      {
        id: "l2-s10",
        slideNumber: 10,
        title: "WHAT IS AN ER DIAGRAM?",
        textContent: `### WHAT IS AN ER DIAGRAM?

• ERD means Entity Relationship Diagram
• Used to visually model database systems
• Shows entities, attributes, and relationships`,
        briefExplanation: "Introduces Entity-Relationship Diagrams (ERD)—the visual conceptual tool used by database architects prior to building SQL tables.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/QpdhBUYk7Kk",
        youtubeQuery: "Entity relationship diagram ERD introduction modeling",
        researchTopics: ["Conceptual Database Design", "Peter Chen ERD Notation", "Database Schematics"]
      },
      {
        id: "l2-s11",
        slideNumber: 11,
        title: "ENTITY",
        textContent: `### ENTITY

Entity – Real-world objects or conceptual items
• Examples: Student, Course, Lecturer, Transaction, Doctor, Order

**THINK–PAIR–SHARE:**
Discuss with your partner:
• Which of the example entities are conceptual, which are real-world objects?`,
        briefExplanation: "Defines Entities (represented as rectangles). Distinguishes physical entities (Student, Doctor) from conceptual entities (Order, Transaction).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/4Z9KEBaxzc8",
        youtubeQuery: "What is an entity in ER diagram conceptual physical",
        researchTopics: ["Entity Sets vs Instances", "Physical vs Conceptual Entities", "Strong vs Weak Entities"]
      },
      {
        id: "l2-s12",
        slideNumber: 12,
        title: "ATTRIBUTES",
        textContent: `### ATTRIBUTES

Attributes describe properties of entities
• Examples: Name, Age, Course Code

**THINK–PAIR–SHARE:**
Discuss with your partner:
• List 3 properties each of the following entities: Student, Doctor, Course, Order`,
        briefExplanation: "Explains Attributes (properties of entities). Guides students to identify key properties for core entities in domain modeling.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/9w_036_HjM8",
        youtubeQuery: "Attributes in ER diagrams types composite multivalued derived",
        researchTopics: ["Attribute Types in ERD", "Simple vs Composite Attributes", "Multivalued & Derived Attributes"]
      },
      {
        id: "l2-s13",
        slideNumber: 13,
        title: "RELATIONSHIP AND CARDINALITY",
        textContent: `### RELATIONSHIP AND CARDINALITY

• Relationship describes how entities are connected.
• Cardinality describes the number of participating instances.

**Maximum Cardinality:**
• One-to-One (1:1)
• One-to-Many (1:N)
• Many-to-Many (N:M)

**Minimum Cardinality:**
• 0 (optional) or 1 (mandatory)`,
        briefExplanation: "Covers Relationship Cardinality (1:1, 1:N, N:M) and Ordinality (minimum cardinality: optional 0 vs mandatory 1).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/34S9fU5z034",
        youtubeQuery: "Cardinality and ordinality in ER diagram one to many many to many",
        researchTopics: ["Maximum vs Minimum Cardinality", "Junction Tables for N:M Relationships", "Relationship Degree"]
      },
      {
        id: "l2-s14",
        slideNumber: 14,
        title: "CROW’S FOOT NOTATION",
        textContent: `### CROW’S FOOT NOTATION

• Used to represent cardinality visually:
  - Ring/Circle = 0 (Optional)
  - Single Pipe | = 1 (Mandatory / One)
  - Crow's Foot Symbol = Many`,
        briefExplanation: "Explains Crow's Foot Notation symbols: Circle (0), Single Bar (1), Three-pronged Crow's foot (Many).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/eY3I1v112bE",
        youtubeQuery: "Crows foot notation ERD symbols explained",
        researchTopics: ["Crow's Foot Notation Symbols", "Data Modeling Standards", "ERD Diagrams in Practice"]
      },
      {
        id: "l2-s15",
        slideNumber: 15,
        title: "CROW’S FOOT NOTATION EXAMPLES",
        textContent: `### CROW’S FOOT NOTATION EXAMPLES

• One-to-Many: Customer ||------|< Order
• Mandatory One to Mandatory Many: Department ||------|| Course
• Optional Many to Mandatory One: Student o|------|| Hostel`,
        briefExplanation: "Provides visual syntax examples for Crow's foot symbols in real database scenarios.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/eY3I1v112bE",
        youtubeQuery: "Crows foot notation examples database design",
        researchTopics: ["Crow's Foot Syntax Examples", "Cardinality Mapping Rules"]
      },
      {
        id: "l2-s16",
        slideNumber: 16,
        title: "GROUP ACTIVITY (20 Minutes)",
        textContent: `### GROUP ACTIVITY (20 Minutes)

Each group designs an ERD for ONE system:
• Hospital Management System
• School Management System
• Banking System
• Supermarket System
• Library Management System
• Online Food Delivery System
• Hotel Reservation System
• E-Commerce System

**Task:**
1. Identify Five Entities with four attributes each for your assigned system
2. Draw an ERD showing relationships and cardinalities among Entities`,
        briefExplanation: "Practical workshop assignment where student groups construct a 5-entity ERD with full attributes and cardinalities.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/QpdhBUYk7Kk",
        youtubeQuery: "How to draw ER diagram step by step tutorial",
        researchTopics: ["ERD Workshop Methodology", "Entity Discovery Techniques", "Cardinality Determination"]
      },
      {
        id: "l2-s17",
        slideNumber: 17,
        title: "SCENARIO-BASED LEARNING",
        textContent: `### SCENARIO-BASED LEARNING

**Scenario:** UEW Library Management System

**Discuss:**
• Which entities are needed? (e.g. Book, Borrower/Student, Librarian, Loan)
• Which relationships exist? (Student borrows Book)
• Which attributes should be stored?`,
        briefExplanation: "Applies ERD concepts directly to UEW Library management (Book, Borrower, Loan, Category).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/4Z9KEBaxzc8",
        youtubeQuery: "Library management system ER diagram database design",
        researchTopics: ["Library Management ERD Case Study", "Loan Tracking Database Schema"]
      },
      {
        id: "l2-s18",
        slideNumber: 18,
        title: "NO-SUBMISSION ASSIGNMENT",
        textContent: `### NO-SUBMISSION ASSIGNMENT

Use one of the following tools:
• Draw.io
• SmartDraw
• MySQL Workbench

**Task:**
• Create an ERD for a School Management System`,
        briefExplanation: "Hands-on software assignment guiding students to use industry tools (Draw.io, MySQL Workbench) to render school ERDs.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/0Jv_o9eD05Y",
        youtubeQuery: "Draw.io MySQL Workbench ER diagram tutorial",
        researchTopics: ["CASE Tools for Database Design", "MySQL Workbench Forward Engineering"]
      },
      {
        id: "l2-s19",
        slideNumber: 19,
        title: "QUICK KNOWLEDGE CHECK",
        textContent: `### QUICK KNOWLEDGE CHECK

• What is a tuple?
• What is an attribute?
• What is cardinality?
• Explain referential integrity`,
        briefExplanation: "Checks understanding of relational terms (Tuple = row, Attribute = column, Cardinality = instance count, Referential Integrity).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/OqjJjpjDRLc",
        youtubeQuery: "DBMS relational model revision check",
        researchTopics: ["Relational Model Quiz Prep"]
      },
      {
        id: "l2-s20",
        slideNumber: 20,
        title: "REFLECTION",
        textContent: `### REFLECTION

• What new concept did you learn today?
• Which ERD concept was difficult?
• Why are relationships important in databases?`,
        briefExplanation: "Self-assessment on ERD creation difficulties and structural relationship significance.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/QpdhBUYk7Kk",
        youtubeQuery: "Database ERD summary reflection",
        researchTopics: ["Conceptual ERD Reflection"]
      },
      {
        id: "l2-s21",
        slideNumber: 21,
        title: "EXIT TICKET",
        textContent: `### EXIT TICKET

Before you leave:
1. Write one thing you learned
2. Write one question you still have
3. Mention one real-world system using ERDs`,
        briefExplanation: "End-of-class exit survey summarizing ERD mastery.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/v9q36XOfmGg",
        youtubeQuery: "DBMS ERD summary exit ticket",
        researchTopics: ["Formative Learning Evaluation"]
      }
    ]
  },
  {
    id: "lecture-3",
    code: "ICTW 242 - Lecture 3",
    title: "Foreign Keys & Table Relationships",
    subtitle: "Parent-Child Table Dynamics & Integrity Constraints",
    description: "Master Foreign Keys step-by-step: Customer vs Order tables, Parent-Child dependencies, and critical thinking problem solving.",
    iconName: "Link",
    slides: [
      {
        id: "l3-s1",
        slideNumber: 1,
        title: "STEP 1: CUSTOMER TABLE (PRIMARY KEY)",
        textContent: `### STEP 1: CUSTOMER TABLE

| Customer ID (PK) | Customer Name | City |
| --- | --- | --- |
| C001 | Ama Mensah | Accra |
| C002 | Kwesi Asante | Kumasi |
| C003 | Akosua Owusu | Cape Coast |

**Question:** Which attribute uniquely identifies each customer?
**Answer:** Customer ID. That is why it is the Primary Key (PK).`,
        briefExplanation: "Establishes the Customer table with Customer ID as Primary Key (PK) uniquely identifying customer records.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Primary key foreign key step by step tutorial",
        researchTopics: ["Primary Key Selection", "Entity Key Constraints"]
      },
      {
        id: "l3-s2",
        slideNumber: 2,
        title: "STEP 2: ORDER TABLE (BEFORE FOREIGN KEY)",
        textContent: `### STEP 2: ORDER TABLE

| Order ID (PK) | Order Date | Total Amount |
| --- | --- | --- |
| O001 | 10-Jan-2026 | $450 |
| O002 | 11-Jan-2026 | $120 |
| O003 | 12-Jan-2026 | $85 |

For the Order table, Order ID is the Primary Key.
**Can this table tell us who placed Order O001?**
*NB: The Order table contains information about orders, but it doesn't tell us which customer placed each order.*`,
        briefExplanation: "Illustrates an isolated Order table without connection, showing the limitation of unlinked tables.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Why do we need foreign keys database tutorial",
        researchTopics: ["Unlinked Table Deficiencies", "Need for Relational Keys"]
      },
      {
        id: "l3-s3",
        slideNumber: 3,
        title: "STEP 3: CONNECTING TABLES WITH A FOREIGN KEY",
        textContent: `### STEP 3: UPDATED ORDER TABLE

What information should we add to the Order table so we know who placed each order?
It is the Customer ID from the Customer Table!

Now let's update the Order Table:

| Order ID (PK) | Customer ID (FK) | Order Date | Total Amount |
| --- | --- | --- | --- |
| O001 | C001 | 10-Jan-2026 | $450 |
| O002 | C002 | 11-Jan-2026 | $120 |
| O003 | C001 | 12-Jan-2026 | $85 |

*Since Customer ID already exists as the Primary Key in the Customer table, when we copy it into the Order table to connect the two tables, it becomes a Foreign Key (FK).*`,
        briefExplanation: "Demonstrates Foreign Key creation: placing Customer ID (PK of Customer) into Order table as FK creates the relationship.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Foreign key creation step by step example database",
        researchTopics: ["Foreign Key Placement Rules", "Referential Linking"]
      },
      {
        id: "l3-s4",
        slideNumber: 4,
        title: "PARENT-CHILD TABLE RELATIONSHIPS",
        textContent: `### PARENT-CHILD TABLE RELATIONSHIPS

**Which table existed first?**
• Customer

**Can an order exist if there is no customer?**
• No!

**Therefore:**
• The Customer table is the **Parent Table**.
• The Order table is the **Child Table**.

**Always ask these questions:**
1. Which table owns the original Primary Key?
2. Which table cannot exist without the other?`,
        briefExplanation: "Defines Parent vs Child table rules: Parent holds the original Primary Key; Child references it as Foreign Key.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Parent child table relationship foreign key rules",
        researchTopics: ["Parent-Child Table Identification", "Referential Integrity Rules", "Entity Dependency"]
      },
      {
        id: "l3-s5",
        slideNumber: 5,
        title: "CLASSROOM ACTIVITY: CUSTOMER & BANK ACCOUNT",
        textContent: `### CLASSROOM ACTIVITY

**Table 1: Customer**
| Customer ID (PK) | Customer Name | Phone Number |
| --- | --- | --- |
| C001 | Ama Mensah | 0241234567 |
| C002 | Kwesi Asante | 0209876543 |
| C003 | Akosua Owusu | 0554567890 |

**Table 2: Bank Account**
| Account Number (PK) | Account Type | Balance ($) |
| --- | --- | --- |
| A1001 | Savings | 5,200 |
| A1002 | Current | 12,500 |
| A1003 | Savings | 3,450 |`,
        briefExplanation: "Hands-on activity presenting unlinked Customer and Bank Account tables for student schema analysis.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Bank database schema foreign key example",
        researchTopics: ["Banking Database Schema", "Account Customer Linking"]
      },
      {
        id: "l3-s6",
        slideNumber: 6,
        title: "GROUP ACTIVITY QUESTIONS 1 – 3",
        textContent: `### GROUP ACTIVITY QUESTIONS 1 – 3

**Question 1:** Can you tell who owns Account A1001 from the Bank Account table?
*Answer:* No, because there is no customer identifier in the Bank Account table.

**Question 2:** What important information is missing from the Bank Account table?
*Answer:* Customer ID (or owner identifier).

**Question 3:** Which table should this information come from?
*Answer:* Customer Table.`,
        briefExplanation: "Step-by-step problem solver identifying missing foreign keys in financial accounts.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Database foreign key problem solving step by step",
        researchTopics: ["Foreign Key Analysis", "Schema Modification"]
      },
      {
        id: "l3-s7",
        slideNumber: 7,
        title: "GROUP ACTIVITY QUESTIONS 4 – 5",
        textContent: `### GROUP ACTIVITY QUESTIONS 4 – 5

**Question 4: Modify the Bank Account table by adding the missing column:**

| Account Number (PK) | Customer ID (FK) | Account Type | Balance ($) |
| --- | --- | --- | --- |
| A1001 | C001 | Savings | 5,200 |
| A1002 | C002 | Current | 12,500 |
| A1003 | C001 | Savings | 3,450 |

**Question 5:**
• What should it be called? -> Customer ID
• Should it be a Primary Key (PK) or a Foreign Key (FK)? -> Foreign Key (FK)
• *Explanation:* Customer ID is the PK in Customer Table; placing it in Bank Account connects the account to its owner.`,
        briefExplanation: "Shows corrected Bank Account table with Customer ID added as Foreign Key (FK).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "How to add foreign key to existing table example",
        researchTopics: ["Schema Alteration DDL", "Foreign Key Integration"]
      },
      {
        id: "l3-s8",
        slideNumber: 8,
        title: "FOREIGN KEY CRITICAL THINKING (QUESTIONS 6 – 8)",
        textContent: `### FOREIGN KEY CRITICAL THINKING

**Question 6:** Which table is the Parent Table?
• Customer Table (It holds the original Customer ID PK).

**Question 7:** Which table is the Child Table?
• Bank Account Table (It contains Customer ID as FK referencing Customer).

**Question 8 (Critical Thinking):**
A friend says: *"The Bank Account table should be the Parent table because it contains money."* Do you agree?
• **Answer:** No! Parent/Child status is determined by entity existence and Primary Key ownership, NOT by asset monetary value. A bank account cannot exist without a customer opening it!`,
        briefExplanation: "Deconstructs common student misconception about Parent/Child relationships, reinforcing that entity dependency and PK ownership determine parentage.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/U2AnmI9x8X8",
        youtubeQuery: "Parent child table common misconceptions database exam",
        researchTopics: ["Entity Dependency Rules", "DBMS Exam Common Pitfalls"]
      }
    ]
  },
  {
    id: "lecture-4",
    code: "ICTW 242 - Lecture 4",
    title: "Database Normalization (1NF to 3NF & BCNF)",
    subtitle: "Data Redundancy, Anomalies, FDs & Dependency Types",
    description: "Comprehensive guide to Database Normalization: Insertion/Update/Deletion anomalies, Functional Dependencies (X->Y), Partial & Transitive dependencies, and converting to 3NF.",
    iconName: "Layers",
    slides: [
      {
        id: "l4-s1",
        slideNumber: 1,
        title: "LEARNING OUTCOMES",
        textContent: `### LEARNING OUTCOMES

By the end of this lesson, you should be able to:
• Explain the purpose of database normalization.
• Identify data redundancy and database anomalies.
• Describe functional dependencies (X → Y).
• Distinguish between partial and transitive dependencies.
• Normalize database tables up to Third Normal Form (3NF) and explain BCNF.
• Design normalized tables using Primary Keys and Foreign Keys.`,
        briefExplanation: "Outlines core Normalization objectives: eliminating redundancy, preventing anomalies, mastering functional dependencies, and achieving 3NF/BCNF.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
        youtubeQuery: "Database normalization 1NF 2NF 3NF BCNF full tutorial",
        researchTopics: ["Database Normalization Goals", "1NF 2NF 3NF BCNF Rules", "Functional Dependency Theory"]
      },
      {
        id: "l4-s2",
        slideNumber: 2,
        title: "PREREQUISITE KNOWLEDGE",
        textContent: `### PREREQUISITE KNOWLEDGE

Before this lesson, you should understand:
• Relational databases
• Tables, rows (tuples), and columns (attributes)
• Primary Keys (PK)
• Foreign Keys (FK)
• Entity-Relationship (ER) Diagrams`,
        briefExplanation: "Reviews required foundational knowledge: tables, primary keys, foreign keys, and ER diagrams before tackling normalization math.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
        youtubeQuery: "Relational database basics before normalization",
        researchTopics: ["Prerequisite Database Concepts"]
      },
      {
        id: "l4-s3",
        slideNumber: 3,
        title: "THE SINGLE LARGE TABLE PROBLEM",
        textContent: `### THE SINGLE LARGE TABLE PROBLEM

Imagine the university stores all student, department, and lecturer information in one large table.

**Discuss with your partner:**
What problems might occur if the Head of Department changes or a department phone number is updated?

**Key Message:**
• A well-designed database stores each fact only once.
• Normalization helps us organize data efficiently, reduce redundancy, and maintain consistency.`,
        briefExplanation: "Illustrates the main issue of monolithic unnormalized tables: updating 1 department detail forces editing hundreds of student rows.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
        youtubeQuery: "Why do we need database normalization unnormalized table problems",
        researchTopics: ["Single Large Table Drawbacks", "Data Redundancy Impact"]
      },
      {
        id: "l4-s4",
        slideNumber: 4,
        title: "REAL-WORLD UNNORMALIZED STUDENT TABLE",
        textContent: `### REAL-WORLD UNNORMALIZED STUDENT TABLE

| Student ID | Student Name | Department | Head of Department | Department Phone |
| --- | --- | --- | --- | --- |
| ST001 | Ama Mensah | ICT | Prof. Yidana | 024-111111 |
| ST002 | Kwesi Asante | ICT | Prof. Yidana | 024-111111 |
| ST003 | Akosua Owusu | ICT | Prof. Yidana | 024-111111 |
| ST004 | Daniel Boateng | Mathematics | Dr. Owusu | 024-222222 |
| ST005 | Mary Osei | Mathematics | Dr. Owusu | 024-222222 |`,
        briefExplanation: "Presents an unnormalized Student table showing repeated ICT and Mathematics department details.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
        youtubeQuery: "Unnormalized table example database lecture",
        researchTopics: ["Unnormalized Relation Analysis", "Data Repetition Identification"]
      },
      {
        id: "l4-s5",
        slideNumber: 5,
        title: "OBSERVE REPEATED DATA",
        textContent: `### OBSERVE REPEATED DATA

| Repeated Data | Number of Times |
| --- | --- |
| ICT | 3 |
| Prof. Yidana | 3 |
| 024-111111 | 3 |
| Mathematics | 2 |
| Dr. Owusu | 2 |
| 024-222222 | 2 |

**Questions to consider:**
1. Which information is repeated the most?
2. Is storing the Head of Department three times necessary?
3. What happens if the ICT department changes its phone number?`,
        briefExplanation: "Quantifies data duplication: Prof. Yidana's name and phone number are needlessly repeated 3 times.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
        youtubeQuery: "Data redundancy in unnormalized tables",
        researchTopics: ["Data Redundancy Quantification", "Storage Overhead"]
      },
      {
        id: "l4-s6",
        slideNumber: 6,
        title: "PROBLEMS CAUSED BY DATA REDUNDANCY (ANOMALIES)",
        textContent: `### THREE COMMON DATABASE ANOMALIES

| Anomaly | Description | Example |
| --- | --- | --- |
| **Insertion Anomaly** | Unable to add new information without entering unrelated data. | A new Cyber Security department cannot be added because there is no student enrolled yet to create a row. |
| **Update Anomaly** | The same information must be updated in several rows. | If ICT phone changes, every ICT student's row must be updated. Missing 1 row causes inconsistent data. |
| **Deletion Anomaly** | Deleting one record unintentionally removes other important data. | If Daniel Boateng is deleted (only Math student), Mathematics department info is permanently lost! |`,
        briefExplanation: "Defines the 3 database anomalies: Insertion Anomaly, Update Anomaly, Deletion Anomaly.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/PX0InJ3m-o0",
        youtubeQuery: "Database anomalies insertion update deletion anomalies explained",
        researchTopics: ["Database Anomalies Definition", "Insertion Update Deletion Anomalies", "Data Inconsistency Prevention"]
      },
      {
        id: "l4-s7",
        slideNumber: 7,
        title: "WHAT IS DATABASE NORMALIZATION?",
        textContent: `### WHAT IS DATABASE NORMALIZATION?

Database Normalization is the formal process of organizing data to:
• Eliminate data redundancy
• Reduce data inconsistency
• Prevent database anomalies (Insert, Update, Delete)
• Improve data integrity
• Make the database easier to maintain and scale`,
        briefExplanation: "Formal definition of Database Normalization and its primary engineering goals.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
        youtubeQuery: "What is database normalization advantages",
        researchTopics: ["Normalization Engineering Goals", "Data Integrity Assurance"]
      },
      {
        id: "l4-s8",
        slideNumber: 8,
        title: "BEFORE AND AFTER NORMALIZATION",
        textContent: `### BEFORE AND AFTER NORMALIZATION

**BEFORE (1 Large Table):**
Student ID, Student Name, Department, HoD, Department Phone

---

**AFTER NORMALIZATION (Decomposed into 2 Tables):**

**Student Table:**
| Student ID (PK) | Student Name | Department ID (FK) |
| --- | --- | --- |
| ST001 | Ama Mensah | D01 |
| ST002 | Kwesi Asante | D01 |
| ST003 | Akosua Owusu | D01 |
| ST004 | Daniel Boateng | D02 |

**Department Table:**
| Department ID (PK) | Department Name | HoD | Department Phone |
| --- | --- | --- | --- |
| D01 | ICT | Prof. Yidana | 024-111111 |
| D02 | Mathematics | Dr. Owusu | 024-222222 |`,
        briefExplanation: "Compares before vs after normalization: splitting into Student and Department tables connected via Department ID FK eliminates redundancy.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
        youtubeQuery: "Normalization table decomposition student department example",
        researchTopics: ["Lossless Join Decomposition", "Foreign Key Linking in Normalization"]
      },
      {
        id: "l4-s9",
        slideNumber: 9,
        title: "CANDIDATE KEYS, PRIMARY KEYS, AND COMPOSITE KEYS",
        textContent: `### KEYS IN NORMALIZATION

| Key Type | Purpose | Example |
| --- | --- | --- |
| **Primary Key (PK)** | Uniquely identifies each record in a table. | Student ID |
| **Candidate Key** | Any attribute (or set) that could uniquely identify a record. | Student ID, National ID, Email |
| **Composite Key** | Two or more attributes combined together to uniquely identify a record. | (Student ID + Course ID) |`,
        briefExplanation: "Defines candidate keys, primary key selection, and composite keys required for normalization rules.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/4b33A248z_E",
        youtubeQuery: "Candidate key primary key composite key database normalization",
        researchTopics: ["Super Key vs Candidate Key", "Composite Candidate Keys", "Minimal Key Sets"]
      },
      {
        id: "l4-s10",
        slideNumber: 10,
        title: "COMPOSITE KEY EXAMPLE: STUDENT COURSE REGISTRATION",
        textContent: `### COMPOSITE KEY EXAMPLE

| Student ID | Course ID | Semester | Grade |
| --- | --- | --- | --- |
| ST001 | ICT241 | First | A |
| ST001 | ICT242 | First | B+ |
| ST002 | ICT241 | First | A- |
| ST002 | ICT243 | Second | B |

• Can Student ID alone identify a record? -> No (ST001 appears multiple times).
• Can Course ID alone identify a record? -> No (ICT241 appears multiple times).
• **Correct Primary Key:** Composite Key **(Student ID, Course ID)** uniquely identifies every row!`,
        briefExplanation: "Demonstrates composite candidate keys where combining (Student ID, Course ID) is necessary to uniquely identify grade records.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/4b33A248z_E",
        youtubeQuery: "Composite key example student course grade",
        researchTopics: ["Composite Primary Key Identification", "Junction Attributes"]
      },
      {
        id: "l4-s11",
        slideNumber: 11,
        title: "WHAT IS A FUNCTIONAL DEPENDENCY (X → Y)?",
        textContent: `### FUNCTIONAL DEPENDENCY (X → Y)

A Functional Dependency (FD) exists when the value of attribute **X** uniquely determines the value of attribute **Y**.

Represented as: **X → Y**
*(Read as: "X determines Y" or "Y is functionally dependent on X")*

**Example:**
• Student ID → Student Name (Knowing ST001 uniquely identifies Ama Mensah)
• Student ID → Programme
• Student ID → Department`,
        briefExplanation: "Defines Functional Dependency X -> Y: Knowing X gives exactly 1 unique value for Y.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/5_9I_T6l12s",
        youtubeQuery: "Functional dependency in database normalization explained",
        researchTopics: ["Functional Dependency Formal Definition", "Armstrong's Axioms", "Trivial vs Non-Trivial FDs"]
      },
      {
        id: "l4-s12",
        slideNumber: 12,
        title: "DETERMINANTS",
        textContent: `### DETERMINANTS

In a functional dependency **X → Y**:
• **X** is called the **Determinant** (the attribute on the left-hand side that controls Y).
• **Y** is the **Dependent** (the attribute on the right-hand side).

Determinants help us identify:
1. Which attribute controls another attribute.
2. Whether a dependency is full, partial, or transitive.
3. Whether a table satisfies 2NF, 3NF, or BCNF.`,
        briefExplanation: "Defines the Determinant (X on left-hand side of X -> Y) and its role in checking normal forms.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/5_9I_T6l12s",
        youtubeQuery: "What is a determinant functional dependency database",
        researchTopics: ["Determinants in FDs", "Left Hand Side Analysis"]
      },
      {
        id: "l4-s13",
        slideNumber: 13,
        title: "PRIME VS NON-PRIME ATTRIBUTES",
        textContent: `### PRIME VS NON-PRIME ATTRIBUTES

Before detecting partial or transitive dependencies, classify attributes:

1. **Prime Attribute:** An attribute that is part of ANY candidate key.
2. **Non-Prime Attribute:** An attribute that is NOT part of any candidate key.

**Example: Student Course Registration**
Candidate Key = **(Student ID, Course ID)**

| Attribute | Classification | Reason |
| --- | --- | --- |
| Student ID | Prime | Part of Candidate Key |
| Course ID | Prime | Part of Candidate Key |
| Student Name | Non-Prime | Not in Candidate Key |
| Course Name | Non-Prime | Not in Candidate Key |
| Grade | Non-Prime | Not in Candidate Key |`,
        briefExplanation: "Explains Prime Attributes (part of candidate key) vs Non-Prime Attributes (not in candidate key).",
        youtubeTutorialUrl: "https://www.youtube.com/embed/821T_I0Jp64",
        youtubeQuery: "Prime and non prime attributes normalization 2nf 3nf",
        researchTopics: ["Prime vs Non-Prime Attributes", "Candidate Key Membership"]
      },
      {
        id: "l4-s14",
        slideNumber: 14,
        title: "PARTIAL DEPENDENCY (VIOLATES 2NF)",
        textContent: `### PARTIAL DEPENDENCY (2NF RULE)

**Definition:** A Partial Dependency occurs when a non-prime attribute depends on ONLY PART of a Composite Candidate Key, instead of the ENTIRE key.

**Composite Candidate Key:** (Student ID, Course ID)

| Dependency | Partial Dependency? | Normal Form Impact |
| --- | --- | --- |
| Student ID → Student Name | YES (Partial!) | Violates 2NF! |
| Course ID → Course Name | YES (Partial!) | Violates 2NF! |
| (Student ID, Course ID) → Grade | NO (Full Dependency!) | Satisfies 2NF! |

**Second Normal Form (2NF) Rule:** Table must be in 1NF AND have NO Partial Dependencies!`,
        briefExplanation: "Explains Partial Dependency (non-prime attribute depending on only part of a composite key) and the 2NF rule.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/e7Pr1VwA7Xw",
        youtubeQuery: "Partial dependency second normal form 2NF example",
        researchTopics: ["Partial Dependency Definition", "2NF Normalization Process", "Full Functional Dependency"]
      },
      {
        id: "l4-s15",
        slideNumber: 15,
        title: "GROUP ACTIVITY: PATIENT CONSULTATION PARTIAL DEPENDENCY",
        textContent: `### GROUP ACTIVITY: PATIENT CONSULTATION

| Patient ID | Doctor ID | Patient Name | Doctor Name | Diagnosis |
| --- | --- | --- | --- | --- |
| P001 | D101 | John Mensah | Dr. Asare | Malaria |
| P001 | D102 | John Mensah | Dr. Owusu | Hypertension |
| P002 | D101 | Mary Mensah | Dr. Asare | Diabetes |

**Tasks:**
1. Composite Candidate Key = **(Patient ID, Doctor ID)**
2. Prime Attributes = Patient ID, Doctor ID
3. Non-Prime Attributes = Patient Name, Doctor Name, Diagnosis
4. **Partial Dependencies:**
   - Patient ID → Patient Name (Partial!)
   - Doctor ID → Doctor Name (Partial!)
   - (Patient ID, Doctor ID) → Diagnosis (Full Dependency)`,
        briefExplanation: "Deconstructs patient consultation table into partial dependencies for 2NF conversion.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/e7Pr1VwA7Xw",
        youtubeQuery: "Patient doctor partial dependency 2NF example",
        researchTopics: ["2NF Problem Solving Example"]
      },
      {
        id: "l4-s16",
        slideNumber: 16,
        title: "TRANSITIVE DEPENDENCY (VIOLATES 3NF)",
        textContent: `### TRANSITIVE DEPENDENCY (3NF RULE)

**Definition:** A Transitive Dependency occurs when a non-prime attribute depends on another non-prime attribute, instead of depending directly on the Primary Key.

**Chain Example:**
Primary Key: **Employee ID**
• Employee ID → Department ID
• Department ID → Department Name

**Therefore:** Employee ID → Department ID → Department Name (Transitive Dependency!)

**Third Normal Form (3NF) Rule:** Table must be in 2NF AND have NO Transitive Dependencies for non-prime attributes!`,
        briefExplanation: "Defines Transitive Dependency (X -> Y -> Z where Y is non-prime) and the 3NF rule.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/5_9I_T6l12s",
        youtubeQuery: "Transitive dependency third normal form 3NF example",
        researchTopics: ["Transitive Dependency Definition", "3NF Normalization Rules", "BCNF Differences"]
      },
      {
        id: "l4-s17",
        slideNumber: 17,
        title: "HOSPITAL ADMISSION TRANSITIVE DEPENDENCY TASK",
        textContent: `### HOSPITAL ADMISSION TRANSITIVE TASK

| Admission ID (PK) | Patient Name | Ward ID | Ward Name | Ward Telephone |
| --- | --- | --- | --- | --- |
| A001 | Ama Mensah | W01 | Medical Ward | 033-111111 |
| A002 | Kwesi Asante | W02 | Surgical Ward | 033-222222 |
| A003 | Akosua Owusu | W01 | Medical Ward | 033-111111 |

**Analysis:**
1. Primary Key = **Admission ID**
2. Non-Prime Attributes = Patient Name, Ward ID, Ward Name, Ward Telephone
3. **Dependencies:**
   - Admission ID → Patient Name, Ward ID
   - Ward ID → Ward Name, Ward Telephone
4. **Transitive Dependency Chain:** Admission ID → Ward ID → (Ward Name, Ward Telephone)
5. **3NF Fix:** Decompose into:
   - Admission Table: (Admission ID PK, Patient Name, Ward ID FK)
   - Ward Table: (Ward ID PK, Ward Name, Ward Telephone)`,
        briefExplanation: "Solves a real hospital admission scenario by removing transitive dependencies to achieve 3NF.",
        youtubeTutorialUrl: "https://www.youtube.com/embed/5_9I_T6l12s",
        youtubeQuery: "Hospital admission 3NF normalization transitive dependency step by step",
        researchTopics: ["3NF Table Decomposition Step-by-Step", "Ward Admission Database Schema"]
      }
    ]
  }
];
