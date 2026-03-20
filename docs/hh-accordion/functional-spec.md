# Functional Specification for 'Accordion' Web Component

## Overview
The **Accordion** component displays a vertically stacked list of expandable headings with hidden content. Users can click on a heading to reveal or hide its associated content. It is ideal for organizing information in a compact format, such as FAQs, guidelines, or other structured content, where only one section is visible at a time.

---

## Properties/Fields

### General Settings:
1. **Title**  
   - **Type**: `string`  
   - **Description**: The title displayed above the accordion component.  
   - **Default Value**: "Section title"  
   - **Required**: No  
   - **Custom Behavior**: Inline-editable and translatable.

2. **Accordion Items**  
   - **Type**: `array`  
   - **Description**: A required list of accordion items each containing a heading and associated content. Minimum 1 and maximum 20 items are allowed.  
   - **Default Value**: None  
   - **Required**: Yes

### Accordion Item Fields:
- **Heading**  
  - **Type**: `string`  
  - **Description**: The title of the individual accordion item, displayed as a clickable heading.  
  - **Default Value**: "Heading content"  
  - **Required**: Yes  
  - **Custom Behavior**: Inline-editable and translatable.

- **Content**  
  - **Type**: `FormattedText`  
  - **Description**: The text content revealed when the accordion item is expanded. Supports rich text formatting.  
  - **Required**: Yes  
  - **Custom Behavior**: Inline-editable and translatable.

---

## Custom Field Types
- **FormattedText**: A rich text field type allowing advanced text formatting (e.g., bold, italics, hyperlinks). Ideal for creating visually rich content in the accordion panels.

---

## Conditional Logic
The field **Accordion Items** must include at least one and no more than 20 items. For each item, both "Heading" and "Content" fields are required; the component will not render without them.

---

## Previews
This component includes a named preview:
- **Default**: Displays a fully populated accordion in a browser-based preview format using data from `example.data.json` and styled via `preview.html`. Developers and content creators can use this preview to verify appearance and functionality.

--- 
