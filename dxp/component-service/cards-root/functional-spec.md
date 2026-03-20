# Functional Specification: Cards - Matrix Root Node

## Overview

### Component Summary
The **Cards - Matrix Root Node** component displays child assets from a selected Squiz Matrix node as a grid of cards. Each card may represent individual child pages or assets under the selected Matrix node. This component is particularly useful for creating dynamic grids of content, such as blog posts, product listings, or service options.

### When to Use
Use the Cards - Matrix Root Node component when:
- You need to display a grid layout of subordinate assets from a parent Matrix node.
- The displayed assets should be easily customizable and linked back to their original Matrix pages.
- You wish to include titles and optional supporting links for better section organization.

---

## Properties

### Main Input Fields

#### 1. **title**
- **Type**: `string`
- **Title**: Title
- **Description**: The title displayed above the grid of cards. This can act as a section header.
- **Default Value**: `Section title`
- **Required**: No
- **Additional Notes**: 
  - The `title` field supports inline editing, meaning content managers can update it directly within the context of the component's visual editor.
  - The `title` is translatable, ensuring compatibility with multilingual implementations.

#### 2. **link**
- **Type**: `SquizLink`
- **Title**: Link
- **Description**: A link displayed next to the title, typically used as a navigation aid or "See More" option.
- **Required**: No
- **Additional Notes**: 
  - The `SquizLink` type handles external or internal links and includes metadata for inline editing. Content managers can quickly update link details without delving into code.

#### 3. **rootnode**
- **Type**: `string`
- **Title**: Cards
- **Format**: `matrix-asset-uri`
- **Description**: The Matrix node from which child pages/assets will be retrieved and displayed as cards.
- **Required**: Yes
- **Additional Notes**:
  - Users must define a valid Matrix asset URI. If no `rootnode` is provided, the component will not function.
  - This field determines the content of the displayed cards and forms the foundation of the component.

---

## Custom Field Types

### 1. **SquizImage**
While not explicitly defined in the manifest for this component, SquizImage fields are often used in Squiz components to manage asset images. These fields allow users to select image assets directly from Matrix and provide configurable options like size, alt text, or cropping.

### 2. **SquizLink**
The `link` field utilizes the SquizLink type, enabling easy management of external or internal links from the Squiz Matrix asset hierarchy. SquizLink fields include options for custom link text, URL definitions, and link attributes such as opening in a new tab.

### 3. **FormattedText**
Another common metadata field type in Squiz, `FormattedText` fields enable rich text content (e.g., HTML markup, bold/italic styles, or embedded media). These fields are ideal for creating stylized textual outputs.

---

## Conditional Logic

### Required Fields
- The `rootnode` field is **required**. Without a valid Matrix URI, the component will not render any cards.

### Field Dependencies
- The `title` and `link` fields are **optional**. If omitted, the grid of cards will still display but without a section title or accompanying link. 

---

## Visual and Functional Variations

### Named Preview
The component provides a **default preview** configuration:
- Preview configuration is defined in the `"previews"` key of the manifest.
- Sample data (`example.data.json`) renders child assets of a test Matrix node, simulating the card layout in a sandbox environment.
- The preview wrapper file (`preview.html`) ensures a styled and functional output resembling how the component will appear on the live site.

### Functional Behavior
- The component renders its cards dynamically based on the child assets of the selected Matrix root node. These cards may vary visually depending on the asset metadata (e.g., thumbnail images, custom descriptions).
- Cards are displayed in a visually appealing grid layout, optimized for both desktop and mobile screens.
- Content managers have control over section-level elements like titles and navigation links for organizing grids.

---

## Notes on Performance
While the component supports rendering data directly from Squiz Matrix, performance may be impacted if the selected Matrix node contains a very large number of child assets. Implementers should consider limiting the quantity of assets per node or enabling pagination as appropriate.

---

## Version Information
- **Component Version**: 2.1.0
- **Last Updated**: 2023-10
- **Type**: Edge Component
- **Namespace**: `edge-dxp-comp-lib`

---

## Summary
The Cards - Matrix Root Node component enables visually engaging and customizable grid layouts of Squiz Matrix child assets. With support for inline editing, dynamic previews, and multilingual compatibility, this component serves as a flexible option for displaying categorized content in a scalable and efficient manner. Content managers should ensure the required `rootnode` field is specified for accurate functionality.
