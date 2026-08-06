import { PastQuestion } from "../types";

export const pastQuestionsData: PastQuestion[] = [
  // ----------------2020/2021 ICTE 242 MCQs----------------
  {
    id: "2021-mcq-1",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 1,
    questionText: "Which SQL CREATE command helps in efficient searching of columns?",
    options: ["Index", "Decimal", "Table", "Database"],
    correctAnswer: "Index",
    explanation: "An INDEX in SQL creates a data structure (like B-Tree) that enables the database engine to search and locate rows quickly without scanning the entire table.",
    topic: "SQL & DDL/DML"
  },
  {
    id: "2021-mcq-2",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 2,
    questionText: "JOIN SQL command is also referred to as:",
    options: ["LEFT JOIN", "FULL JOIN", "INNER JOIN", "RIGHT JOIN"],
    correctAnswer: "INNER JOIN",
    explanation: "In standard SQL, specifying just 'JOIN' without keywords defaults directly to an INNER JOIN.",
    topic: "SQL & DDL/DML"
  },
  {
    id: "2021-mcq-3",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 3,
    questionText: "How many types of data independence exist in DBMS?",
    options: ["Three", "Four", "One", "Two"],
    correctAnswer: "Two",
    explanation: "There are two types of data independence: Logical Data Independence (modifying logical schema without changing view level) and Physical Data Independence (modifying physical schema without changing logical schema).",
    topic: "Data Abstraction"
  },
  {
    id: "2021-mcq-4",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 4,
    questionText: "At what level in data abstraction does data encapsulation exist?",
    options: ["Physical", "Logical", "View", "Data Model"],
    correctAnswer: "Physical",
    explanation: "Data encapsulation hides complex physical storage structures (file layout, block indexing) at the Physical level of data abstraction.",
    topic: "Data Abstraction"
  },
  {
    id: "2021-mcq-5",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 5,
    questionText: "Transitive dependencies are normally removed during:",
    options: ["1NF", "3NF", "2NF", "BCNF"],
    correctAnswer: "3NF",
    explanation: "Third Normal Form (3NF) requires a relation to be in 2NF and have no transitive dependencies (where a non-prime attribute determines another non-prime attribute).",
    topic: "Normalization & FDs"
  },
  {
    id: "2021-mcq-6",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 6,
    questionText: "Given the relation R (K, M, D). If KD are composite keys, then:",
    options: ["M is prime", "M is the factor", "KD is non-prime", "KD is prime"],
    correctAnswer: "KD is prime",
    explanation: "By definition, any attribute that belongs to a candidate key (composite or single) is classified as a Prime attribute.",
    topic: "Normalization & FDs"
  },
  {
    id: "2021-mcq-7",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 7,
    questionText: "Which DML command helps to permanently save data changes?",
    options: ["UPDATE", "INSERT", "ROLLBACK", "COMMIT"],
    correctAnswer: "COMMIT",
    explanation: "The COMMIT command saves all transaction changes permanently to the database disk storage.",
    topic: "SQL & DDL/DML"
  },
  {
    id: "2021-mcq-8",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 8,
    questionText: "In DBMS, the SQL procedure that initiates an action automatically is called:",
    options: ["TRACER", "SAVE", "ALTER", "TRIGGERS"],
    correctAnswer: "TRIGGERS",
    explanation: "A TRIGGER is a stored procedure that automatically executes in response to database events like INSERT, UPDATE, or DELETE.",
    topic: "SQL & DDL/DML"
  },
  {
    id: "2021-mcq-10",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 10,
    questionText: "The most important schema in data abstraction is the:",
    options: ["Logical", "Physical", "View", "Model"],
    correctAnswer: "Logical",
    explanation: "The Logical Schema describes what data is stored and the relationships among data; it serves as the foundation for the entire application architecture.",
    topic: "Data Abstraction"
  },
  {
    id: "2021-mcq-14",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 14,
    questionText: "Which SQL constraint ensures that a column will not have duplicate values?",
    options: ["NOT NULL", "DEFAULT", "UNIQUE", "CHECK"],
    correctAnswer: "UNIQUE",
    explanation: "The UNIQUE constraint prevents duplicate entries across rows in a specific column.",
    topic: "SQL & DDL/DML"
  },
  {
    id: "2021-mcq-15",
    year: "2020/2021",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 15,
    questionText: "The attribute in an E-R diagram is normally represented by a:",
    options: ["Square shape", "Rectangular shape", "Pyramid shape", "Oval shape"],
    correctAnswer: "Oval shape",
    explanation: "In standard Chen ERD notation, Oval/Ellipse represents Attributes, Rectangles represent Entities, and Diamonds represent Relationships.",
    topic: "ERD & Relational Model"
  },

  // ----------------2021/2022 ICTW 242 MCQs----------------
  {
    id: "2022-mcq-2",
    year: "2021/2022",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 2,
    questionText: "AGE is a typical example of a:",
    options: ["Derived Attribute", "Date of Birth Attribute", "Multivalued Attribute", "Composite Attribute"],
    correctAnswer: "Derived Attribute",
    explanation: "Age is a Derived Attribute because it can be computed mathematically from Date of Birth (Current Date - Date of Birth).",
    topic: "ERD & Relational Model"
  },
  {
    id: "2022-mcq-3",
    year: "2021/2022",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 3,
    questionText: "Minimum Cardinality is also referred to as:",
    options: ["Many-to-Many relationship", "Crows foot", "ERD Notation", "Ordinality"],
    correctAnswer: "Ordinality",
    explanation: "Minimum cardinality specifies whether participation is mandatory (1) or optional (0), which is termed Ordinality.",
    topic: "ERD & Relational Model"
  },
  {
    id: "2022-mcq-5",
    year: "2021/2022",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 5,
    questionText: "In 2nd Normal Form (2NF), there should be no:",
    options: ["Repeating Groups", "Transitive Dependencies", "Partial Dependencies", "Multivalued Attributes"],
    correctAnswer: "Partial Dependencies",
    explanation: "2NF requires the table to be in 1NF and ensure every non-prime attribute is fully functionally dependent on the entire primary key (no Partial Dependencies).",
    topic: "Normalization & FDs"
  },
  {
    id: "2022-mcq-17",
    year: "2021/2022",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 17,
    questionText: "In addition to removing undesirable characteristics, normalization also eliminates which anomalies?",
    options: ["Insert", "Update", "Delete", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "Normalization is specifically designed to eliminate Insertion, Update, and Deletion anomalies caused by data redundancy.",
    topic: "Normalization & FDs"
  },
  {
    id: "2022-mcq-27",
    year: "2021/2022",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 27,
    questionText: "A functional dependency is a relationship between or among:",
    options: ["Entities", "Rows", "Attributes", "Tables"],
    correctAnswer: "Attributes",
    explanation: "Functional dependency X -> Y expresses a structural mapping between attributes in a relational table.",
    topic: "Normalization & FDs"
  },

  // ----------------2023/2024 ICTW 242 MCQs----------------
  {
    id: "2024-mcq-4",
    year: "2023/2024",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 4,
    questionText: "A column header in a relational table is also referred to as a(n):",
    options: ["table", "attribute", "relation", "domain"],
    correctAnswer: "attribute",
    explanation: "Each column header in a table represents a named property or attribute of the entity.",
    topic: "DBMS Fundamentals"
  },
  {
    id: "2024-mcq-15",
    year: "2023/2024",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 15,
    questionText: "Which of the following is NOT an example of a DBMS software?",
    options: ["PostgreSQL", "MySQL", "IBM DB2", "Google DB1"],
    correctAnswer: "Google DB1",
    explanation: "Google DB1 is not a standard commercial DBMS engine. PostgreSQL, MySQL, and IBM DB2 are well-known database engines.",
    topic: "DBMS Fundamentals"
  },
  {
    id: "2024-mcq-17",
    year: "2023/2024",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 17,
    questionText: "Information about data stored in the database is called:",
    options: ["Hyperdata", "Metadata", "Relation", "Tera data"],
    correctAnswer: "Metadata",
    explanation: "Metadata is 'data about data', storing schema details, column types, constraints, and index definitions in the system catalog.",
    topic: "DBMS Fundamentals"
  },
  {
    id: "2024-mcq-18",
    year: "2023/2024",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 18,
    questionText: "A weak entity needs a __________ from a strong entity to constitute a unique identifier.",
    options: ["1NF", "Candidate key", "Foreign key", "Strong key"],
    correctAnswer: "Foreign key",
    explanation: "A weak entity lacks sufficient attributes to form a primary key on its own; it combines a partial key (discriminator) with the Foreign Key of its identifying strong entity.",
    topic: "ERD & Relational Model"
  },
  {
    id: "2024-mcq-20",
    year: "2023/2024",
    courseCode: "ICTW 242",
    courseTitle: "Database Management System",
    section: "Section A (MCQ)",
    questionNumber: 20,
    questionText: "Which SQL command is used to remove a relation (table structure) permanently from a database?",
    options: ["Delete", "Purge", "Remove", "Drop"],
    correctAnswer: "Drop",
    explanation: "The DROP TABLE command permanently deletes both the table schema and all stored records from the database catalog.",
    topic: "SQL & DDL/DML"
  },

  // ----------------2025 SIR JOHN EXAM PROBLEMS & SOLUTIONS----------------
  {
    id: "2025-sirjohn-sec-a-q1",
    year: "2025 (Sir John)",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section C (Problem/Project)",
    questionNumber: "1.1 Question 1",
    questionText: "Draw a unique Database table of any sector containing four attributes and four records to analyze the existence of anomalies. Explain the anomalies in the table: (a) Update Anomaly, (b) Insert Anomaly, (c) Delete Anomaly.",
    topic: "Normalization & FDs",
    tableContext: {
      headers: ["Emp_ID", "Emp_Name", "Dept_Name", "Dept_Head"],
      rows: [
        ["E101", "Ama Mensah", "ICT", "Prof. Yidana"],
        ["E102", "Kojo Asante", "ICT", "Prof. Yidana"],
        ["E103", "Efua Owusu", "ICT", "Prof. Yidana"],
        ["E104", "Daniel Boateng", "Science", "Dr. Owusu"]
      ]
    },
    explanation: "Step-by-step breakdown of Update, Insert, and Delete anomalies on unnormalized employee/department data.",
    sampleSolutionMarkdown: `### Sample Table: Employee_Dept

| Emp_ID (PK) | Emp_Name | Dept_Name | Dept_Head |
| --- | --- | --- | --- |
| E101 | Ama Mensah | ICT | Prof. Yidana |
| E102 | Kojo Asante | ICT | Prof. Yidana |
| E103 | Efua Owusu | ICT | Prof. Yidana |
| E104 | Daniel Boateng | Science | Dr. Owusu |

---

### Anomaly Analysis & Explanations:

#### a. Update Anomaly
If **Prof. Yidana** steps down and **Dr. Addo** becomes Head of ICT, the database must update **3 separate rows**. If only row 1 and row 2 are updated, the database enters an **inconsistent state** where E103 still reports Prof. Yidana as HoD.

#### b. Insert Anomaly
If a new department **"Cyber Security"** with HoD **Dr. Kwarteng** is formed, we **cannot add it** into the table unless we hire a new employee first, because \`Emp_ID\` is the Primary Key and cannot be NULL!

#### c. Delete Anomaly
If **Daniel Boateng** (E104) resigns and we delete his record, we **unintentionally delete all record** that the Science department exists and that Dr. Owusu is its HoD!`
  },
  {
    id: "2025-sirjohn-sec-a-q2",
    year: "2025 (Sir John)",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section C (Problem/Project)",
    questionNumber: "1.2 Question 2a & 2b",
    questionText: "a. Convert the table below to 3NF given composite candidate keys (Doctors_Hobby, Hospital).\n\nb. Write MySQL DDL queries to create the normalized database schema showing Foreign Key occurrences.",
    topic: "Normalization & FDs",
    tableContext: {
      headers: ["Allowance", "Salary", "Doctors_Hobby", "Hospital"],
      rows: [
        ["20.00", "1000.00", "Tennis, Hockey", "M-Tech"],
        ["40.00", "800.00", "Tennis, TV", "K-Tech"],
        ["25.00", "1000.00", "Radio, Reading", "R-Tech"]
      ]
    },
    explanation: "Steps to achieve 1NF (atomicity of hobbies), 2NF (removing partial dependencies), and 3NF, followed by MySQL DDL statements.",
    sampleSolutionMarkdown: `### Step 1: 1NF (Ensure Atomic Values)
Split multi-valued hobbies so each cell has a single value.

### Step 2: Decomposition to 3NF

**Table 1: Hospital_Info (Parent)**
\`\`\`sql
CREATE TABLE Hospital_Info (
    Hospital_ID VARCHAR(20) PRIMARY KEY,
    Salary DECIMAL(10,2) NOT NULL,
    Allowance DECIMAL(10,2) NOT NULL
);
\`\`\`

**Table 2: Doctor_Hobby (Child)**
\`\`\`sql
CREATE TABLE Doctor_Hobby (
    Doctor_Hobby_ID INT AUTO_INCREMENT PRIMARY KEY,
    Hobby_Name VARCHAR(50) NOT NULL,
    Hospital_ID VARCHAR(20) NOT NULL,
    CONSTRAINT fk_hospital FOREIGN KEY (Hospital_ID) 
        REFERENCES Hospital_Info(Hospital_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);
\`\`\``
  },
  {
    id: "2025-sirjohn-mini-project-trauma",
    year: "2025 (Sir John)",
    courseCode: "ICTE 242",
    courseTitle: "Database Management System",
    section: "Section C (Problem/Project)",
    questionNumber: "Section C: Mini-Project",
    questionText: "Restructure Database named 'Trauma' for Trauma Hospital in Winneba Ghana. Requirements: 4 entities with 5 attributes each, proper Foreign Key rules with Parent-Child relationships, DML record insertions, and DML LEFT JOIN, INNER JOIN, RIGHT JOIN queries.",
    topic: "SQL & DDL/DML",
    explanation: "Complete MySQL DDL & DML script including JOIN statements for a Hospital system.",
    sampleSolutionMarkdown: `\`\`\`sql
-- Create Database
CREATE DATABASE IF NOT EXISTS Trauma;
USE Trauma;

-- 1. Parent Entity: Doctor
CREATE TABLE Doctor (
    Doctor_ID VARCHAR(10) PRIMARY KEY,
    Doctor_Name VARCHAR(50) NOT NULL,
    Specialty VARCHAR(50),
    Phone_Number VARCHAR(15),
    Salary DECIMAL(10,2)
);

-- 2. Parent Entity: Ward
CREATE TABLE Ward (
    Ward_ID VARCHAR(10) PRIMARY KEY,
    Ward_Name VARCHAR(50) NOT NULL,
    Capacity INT,
    Floor_Number INT,
    Telephone VARCHAR(15)
);

-- 3. Child Entity: Patient (References Ward)
CREATE TABLE Patient (
    Patient_ID VARCHAR(10) PRIMARY KEY,
    Patient_Name VARCHAR(50) NOT NULL,
    Age INT,
    Gender CHAR(1),
    Ward_ID VARCHAR(10),
    CONSTRAINT fk_patient_ward FOREIGN KEY (Ward_ID) REFERENCES Ward(Ward_ID)
);

-- 4. Child Entity: Appointment (References Doctor & Patient)
CREATE TABLE Appointment (
    Appointment_ID VARCHAR(10) PRIMARY KEY,
    Doctor_ID VARCHAR(10) NOT NULL,
    Patient_ID VARCHAR(10) NOT NULL,
    Appointment_Date DATE,
    Fee DECIMAL(8,2),
    CONSTRAINT fk_app_doc FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID),
    CONSTRAINT fk_app_pat FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);

-- Sample Data Insertion (DML)
INSERT INTO Doctor VALUES ('D01', 'Dr. Kofi Mensah', 'Cardiology', '0241112223', 8500.00);
INSERT INTO Ward VALUES ('W01', 'Surgical Ward', 20, 1, '033221144');
INSERT INTO Patient VALUES ('P01', 'Ama Owusu', 34, 'F', 'W01');
INSERT INTO Appointment VALUES ('A01', 'D01', 'P01', '2026-08-10', 150.00);

-- DML JOIN Demonstrations
-- 1. INNER JOIN
SELECT p.Patient_Name, w.Ward_Name, w.Floor_Number 
FROM Patient p 
INNER JOIN Ward w ON p.Ward_ID = w.Ward_ID;

-- 2. LEFT JOIN
SELECT d.Doctor_Name, a.Appointment_ID, a.Appointment_Date 
FROM Doctor d 
LEFT JOIN Appointment a ON d.Doctor_ID = a.Doctor_ID;

-- 3. RIGHT JOIN
SELECT a.Appointment_ID, p.Patient_Name 
FROM Appointment a 
RIGHT JOIN Patient p ON a.Patient_ID = p.Patient_ID;
\`\`\``
  }
];
