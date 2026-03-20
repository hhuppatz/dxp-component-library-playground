# Functional Specification: Key Statistics Component

## Overview

The **Key Statistics** web component is designed to display numeric statistics in a visually appealing format. It shows up to five statistics as individual cards, each with a prominent value and supporting text. This component is ideal for presenting key performance indicators, metrics, or summary data in sections of a webpage.

### When to Use It
- To highlight numeric data in a structured, card-based layout.
- For situations requiring up to five key statistics for clear communication of essential figures.

---

## Component Properties

The Key Statistics component supports the following properties:

### 1. **Title**  
- **Type**: `string`  
- **Description**: The title displayed above the group of statistic cards, acting as a section header.  
- **Default Value**: `"Section title"`  
- **Translatable**: Yes  
- **Inline Editable**: Yes  
- **Required**: No  

---

### 2. **Stats**  
- **Type**: `array`  
- **Description**: A list of statistics displayed in separate cards. Each entry in the array represents a single statistic.  
- **Required**: Yes (Minimum 3, Maximum 5 items)

Each statistic within the array includes the following fields:

#### a) **Value**
- **Type**: `string`  
- **Description**: The numeric value representing the statistic displayed prominently on the card.  
- **Default Value**: `"01"`  
- **Translatable**: Yes  
- **Inline Editable**: Yes  
- **Min Length**: 1 character  
- **Max Length**: 5 characters  
- **Required**: Yes  

#### b) **Supporting Text**
- **Type**: `string`  
- **Description**: A brief supporting text to provide additional context about the statistic.  
- **Default Value**: `"Supporting text"`  
- **Translatable**: Yes  
- **Inline Editable**: Yes  
- **Required**: No  

---

## Custom Field Types

### 1. **Translatable Fields**  
Fields marked as "translatable" (e.g., Title, Value, Supporting Text) mean their value can be adapted for multiple languages/locales. This supports internationalized content.  

### 2. **Inline Editable Fields**  
Fields marked as "inline editable" can be modified directly within the visual editor of the CMS, making it easier for editors to fine-tune the component without accessing the backend code.  

---

## Conditional Logic

1. **Stats Minimum and Maximum**  
   - The `stats` array must include a minimum of 3 statistics and a maximum of 5 statistics. If fewer than 3 or more than 5 statistics are provided, the component will not render properly.  
   - If a statistic is included in the array, the `value` field for that statistic is **required**. The `text` field is **optional**.

2. **Card Validation**  
   - Within any statistic card, the `value` field must have a length of **1–5 characters**. If this condition is not met, the component will raise a validation error during content creation.  

---

## Visual/Functional Variations

### Named Previews

The Key Statistics component includes pre-configured previews that allow users to visualize the component with example data.

- **Default Preview**:  
  Displays the Key Statistics component with example data supplied from the `example.data.json` file. This provides a basic understanding of how the component renders with typical content. The preview is wrapped in the `preview.html` template for accurate representation of layout and styling.

---

## Rendering Information

- **Response Type**: `html`  
  The component outputs structured HTML for the supported statistics and their styling, ensuring seamless integration into webpages.  

- **Icon**:  
  - Icon ID: `insert_chart`
  - Icon Color: `Gray`  

This icon is displayed in the CMS to represent the component in the component library.  

---

## Notes for Editors and Developers

- Avoid exceeding the maximum of 5 items in the `stats` array or providing fewer than 3 items, as this will cause rendering issues.  
- Consider using meaningful values and supporting text for each statistic for clearer communication.  
- Use the inline editing feature to adjust content during live previews for faster iteration.  
