# Patient Management System

A layered **ASP.NET MVC 5 application** with **SQL Server** backend.  
Implements **N-Layer architecture** (DAL, BLL, EL, UI, UL), **front-end validations (jQuery, AJAX)**, and **secure SQL authentication**.  
Designed for maintainability, scalability, and clean separation of concerns.

---

## 📖 Overview

This system manages patient records in a structured and maintainable way.  
It demonstrates **N-Layer architecture** in ASP.NET MVC with **class library projects** for each layer.

---

## ✨ Features

- **CRUD Operations**: Add, edit, delete, and view patient records.  
- **Front-End Validations**: Using jQuery Validation, Parsley.js, and tooltips.  
- **Business Rules**:
  - Patient, Drug, and Dosage are required.
  - Drug must be unique per patient per day.
  - Dosage supports decimals up to 4 places (displayed as 2).
  - Rejects blank/whitespace-only inputs.
- **Search & Filter**: By date, dosage, patient, or drug.  
- **SQL Authentication**: Mixed mode with username & password.  
- **N-Layer Design** with proper separation of concerns.  

---

## 🛠️ Tech Stack

- **ASP.NET MVC 5** (.NET Framework 4.7.2)  
- **SQL Server 2017+** (tested with SQL Express)  
- **jQuery + AJAX** for UI interactions  
- **ADO.NET** (no Entity Framework)  
- **Visual Studio 2017+**  

---

## 📂 Project Structure

```
Solution: PatientManagement
│
├── BLL/   # Business Logic Layer (validations, rules)
├── DAL/   # Data Access Layer (ADO.NET queries)
├── EL/    # Entity Layer (model classes, e.g., Patient.cs)
├── UI/    # MVC Web Application (Controllers, Views, Scripts)
├── UL/    # Utility Layer (shared helpers, e.g., message handling)
│
└── PatientManagement.sln
```

---

## ⚙️ N-Layer MVC Design

- **EL (Entity Layer)**  
  Defines data models such as `Patient`, with properties like `Id`, `Patient`, `Drug`, `Dosage`, `ModifiedDate`.

- **DAL (Data Access Layer)**  
  Uses **ADO.NET** for direct SQL queries (no Entity Framework).  
  Responsible for CRUD operations and database access.

- **BLL (Business Logic Layer)**  
  Contains business rules and validation logic, e.g.:  
  - Prevents duplicate drug entries for the same patient/day.  
  - Ensures dosage > 0 and within decimal limits.  
  - Ensures required fields are not empty.  

- **UI (MVC Layer)**  
  The ASP.NET MVC Web Application:  
  - Controllers handle requests.  
  - Views (Razor) display forms and data.  
  - AJAX + jQuery handle front-end form submission and validations.  

- **UL (Utility Layer)**  
  General-purpose helper methods, such as:  
  - Displaying success/error messages.  
  - Reusable constants, formatting, and utilities shared across layers.  

---

## ⚙️ Prerequisites

- Visual Studio 2017 or higher  
- .NET Framework 4.7.2  
- SQL Server (Express or Standard)  
- SQL Server Management Studio (SSMS)  

---

## 🚀 Installation & Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/EdisonDotBit/PatientManagement.git
   cd PatientManagement
   ```

2. **Create Database**
   - Open SSMS.  
   - Run the script below (or use `/Database/PatientManagement.sql`).  

   ```sql
   CREATE DATABASE PatientManagement;
   GO

   USE PatientManagement;
   GO

   CREATE TABLE PatientDetails (
       ID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
       Dosage DECIMAL(7,4) NOT NULL,
       Drug VARCHAR(50) NOT NULL,
       Patient VARCHAR(50) NOT NULL,
       ModifiedDate DATETIME NOT NULL
   );
   ```

3. **Configure Connection String**
   - In `Web.config`, update the connection string under `<connectionStrings>`:
     ```xml
     <connectionStrings>
       <add name="PatientManagement"
            connectionString="Data Source=YOUR_SERVER;Initial Catalog=PatientManagement;User ID=YOUR_USER;Password=YOUR_PASSWORD;trustservercertificate=True;"
            providerName="System.Data.SqlClient" />
     </connectionStrings>
     ```
   - Replace `YOUR_SERVER`, `YOUR_USER`, and `YOUR_PASSWORD`.

4. **Run the Application**
   - Open `PatientManagement.sln` in Visual Studio.  
   - Set **UI** (ASP.NET MVC Project) as the startup project.  
   - Press **F5** (or Run).  

---

## 📊 Database Schema

**PatientDetails Table**

| Column       | Type           | Constraints / Rules                               |
|--------------|----------------|--------------------------------------------------|
| ID           | int            | Primary Key, Identity, Not Null                  |
| Dosage       | decimal(7,4)   | Required, >0, stored with 4 decimals, shown as 2 |
| Drug         | varchar(50)    | Required, unique per patient per day             |
| Patient      | varchar(50)    | Required, no blank-only inputs                   |
| ModifiedDate | datetime       | Required, defaults to current timestamp          |

---

## 🧑‍💻 Usage Flow

1. **Patient List**  
   - Shows all records by default.  
   - Supports filtering (by patient, drug, dosage, date).  
   - Reset button clears filters and errors.  

2. **Create Record**  
   - Enter patient details (Patient, Drug, Dosage).  
   - Validations check fields and uniqueness.  
   - Confirmation dialog before saving.  
   - On success, record appears in the list.  

3. **Update Record**  
   - Select a record → values load in the form.  
   - Edit and save → confirmation required.  
   - Updated record displayed with new `ModifiedDate`.  

4. **Delete Record**  
   - Select a record → confirm delete.  
   - On success → record removed from list.  

---

## 🧾 General Guidelines (Implemented)

- **No inline editing** or modal add/edit forms.  
- **Full row selection** for record updates/deletes.  
- Tooltips and tab order set correctly.  
- Client-side validation (jQuery).  
- Server-side business validation (BLL).  

---

## 🤝 Contributing

1. Fork repo  
2. Create feature branch (`git checkout -b feature/my-feature`)  
3. Commit changes (`git commit -m 'Added new feature'`)  
4. Push branch (`git push origin feature/my-feature`)  
5. Open Pull Request  
