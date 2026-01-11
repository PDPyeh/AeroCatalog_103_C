# Architecture Diagrams

PlantUML diagram files untuk visualisasi AeroCatalog architecture.

## Files

### 1. `general.puml` - General System Architecture
Diagram keseluruhan aliran data dari client hingga database:
- Client Layer (Web Browser)
- Presentation Layer (React Frontend)
- Network Layer (HTTP/REST)
- Business Logic Layer (Express.js Backend)
- Data Persistence Layer (MySQL)

**How to view:**
1. Install PlantUML extension di VS Code (jamsolutions.plantuml)
2. Open `general.puml`
3. Right-click → "PlantUML: Preview Current Diagram"

### 2. `3tier.puml` - 3-Tier Architecture Detail
Breakdown detail dari 3 tier architecture:

#### Tier 1: Presentation Layer
- React UI components
- Page components (Home, Login, Register, Dashboard, etc.)
- Zustand state management
- Axios HTTP client

#### Tier 2: Business Logic Layer
- Express.js server
- Middleware stack (parser, JWT, API key, error handler)
- Route handlers
- Business logic services (Admin, User, Aircraft, API Key, Auth)

#### Tier 3: Data Layer
- Sequelize ORM
- MySQL database
- 8 tables with relationships

**How to view:**
Same as above, open `3tier.puml` dan preview

## Online Viewers

Kalau tidak punya PlantUML di VS Code:
1. Buka https://www.plantuml.com/plantuml/uml/
2. Copy isi file .puml
3. Paste ke textarea
4. Diagram akan render otomatis

## Editing Diagrams

Edit file `.puml` dengan text editor (VS Code recommended).

PlantUML Syntax basics:
```
@startuml
component [Component Name] as comp_id
rectangle "Container" {
    component [Child] as child
}
comp_id --> child : relationship
@enduml
```

## Generate PNG/SVG

Via command line (if PlantUML installed):
```bash
plantuml -Tpng general.puml
plantuml -Tsvg 3tier.puml
```

---

**Updated:** January 11, 2026
