# Functional Specification for Squiz Matrix Web Component: Accordion

## Overview

### Component Purpose
The **Accordion** component displays a list of headings with associated hidden content that can be revealed or hidden by user interaction (clicking on the heading). It is useful for organizing and presenting content in a compact, interactive format, particularly when you need to display large amounts of information in an expandable/collapsible structure. 

### Use Cases
This component is ideal for:
- FAQs (Frequently Asked Questions)
- Product feature breakdowns
- Organizing hierarchical or grouped information
- Enhancing usability on long pages by showing/hiding content selectively

---

## Component Configuration

### General Information
- **Component Name:** Accordion  
- **Namespace:** `edge-dxp-comp-lib`  
- **Version:** 2.1.0  
- **Type:** `edge`  
- **Entry Point:** `main.js`  
- **Output:** HTML  

---

## Configuration Properties

### Properties Overview
The Accordion component has customizable fields to modify its behavior and appearance. Below is the complete list of available properties:

#### 1. **Title**
- **Type:** `string`
- **Field Title:** Title  
- **Description:** The title displayed above the Accordion component.
- **Default Value:** `"Section title"`  
- **Required:** No
- **Translatable:** Yes
- **Additional Behavior:** This field supports inline editing.

#### 2. **Accordion Items**
- **Type:** `array`
- **Field Title:** Accordion Items  
- **Description:** A list of expandable/collapsible items. Each item consists of a heading and content.  
- **Default Value:** N/A (User-defined)  
- **Required:** **Yes (at least one item is mandatory)**  
- **Minimum Items:** 1  
- **Maximum Items:** 20  

##### Properties for Each Accordion Item:
- **Heading**
  - **Type:** `string`
  - **Field Title:** Heading  
  - **Description:** The heading text visible on the closed accordion panel.  
  - **Default Value:** `"Heading content"`  
  - **Required:** **Yes**  
  - **Translatable:** Yes  
  - **Additional Behavior:** This field supports inline editing.
- **Content**
  - **Type:** `FormattedText`  
  - **Field Title:** Content  
  - **Description:** The detailed text shown inside the accordion item when expanded; hidden when collapsed.  
  - **Required:** **Yes**  
  - **Translatable:** Yes  
  - **Field Type Explained:**
    - **FormattedText:** A specialized Squiz Matrix field type that supports structured, styled content, including HTML, links, and embedded media.
  - **Additional Behavior:** This field supports inline editing.

---

## Custom Field Types
The Accordion component leverages several Squiz-specific field types:

1. **FormattedText**
   - Enables styled or formatted HTML content.
   - Can include text formatting, links, and other rich content.  
2. **SquizImage**
   - While not used in this component, it's another Squiz-specific field type for adding images.
3. **SquizLink**
   - Also not used here but supports the addition of dynamic or manually entered links.

---

## Conditional Logic
- **Accordion Items Validation:** At least **one Accordion Item** is required for the component to render properly.  
- **Heading and Content:** Within each accordion item:
  - Both the **heading** and **content** fields are **mandatory**. 
  - If either field is not provided, the item will not be displayed.

---

## Visual and Functional Variations

### Named Preview: Default
The default preview renders the Accordion component with sample data provided in `example.data.json`. This preview demonstrates a sample Accordion with multiple items, each featuring a heading and content.

- **Wrapper:** `preview.html`

### Behavior
The Accordion component's interaction involves:
1. Displaying all headings in a closed state by default.
2. Expanding the associated content when a user clicks on a heading.
3. Supporting only one expanded item at a time, or allowing multiple expanded items (dependent on implementation context).

---

## Notes
- **Customizable Styles:** Component uses a default icon (`toc`) with a gray theme. Alternate color options can be defined if expanded in future versions.
- **Responsiveness:** The Accordion content and interaction are fully responsive and optimized for mobile devices.

---

By following these specifications, the Accordion component can be implemented effectively across various use cases, ensuring clarity, flexibility, and a seamless user experience.
