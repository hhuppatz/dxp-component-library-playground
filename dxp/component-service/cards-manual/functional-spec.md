# Functional Specification: Cards Component

## Component Overview
### Name:
**Cards**

### Description:
The Cards component displays a grid of visually styled cards, making it suitable for showcasing multiple pieces of information with supporting text, images, and links. It is an interactive and modular component designed for use in web pages built with Squiz Matrix, specifically within the Squiz Edge platform.

### Use Cases:
Use the Cards component when:
- Displaying content in a grid format with visually distinct cards.
- Highlighting several items, such as pieces of content, products, or services.
- Accompanying individual items with headings, descriptions, images, and clickable links.

## Component Configuration

### Fields and Properties
Below are the available fields, along with their details:

---

#### **Title**
- **Type:** `string`
- **Field Title:** Title
- **Description:** The title displayed above the cards section.
- **Default Value:** `"Section title"`
- **Required:** No
- **Notes:** 
  - Translatable to multiple languages for localization support.
  - Inline editable in Squiz Matrix.

---

#### **Link**
- **Type:** `SquizLink`
- **Field Title:** Link
- **Description:** A clickable link displayed next to the section title.
- **Required:** No
- **Notes:** 
  - Custom field type `SquizLink` represents a link object managed within Squiz Matrix. It typically includes attributes like URL, anchor text, and target behavior (e.g., open in a new tab).
  - Inline editable via Squiz Matrix admin interface.

---

#### **Cards**
- **Type:** `array`
- **Field Title:** Cards
- **Description:** A list of cards to display in the grid.
- **Required:** Yes (Minimum: 1, Maximum: 8)
- **Notes:** Each entry in the array is an individual card object defined by the following fields:

  ##### Card Properties:
  1. **Content Type**
     - **Type:** `string`
     - **Field Title:** Content Type
     - **Description:** The label displayed above the card's heading (e.g., "Blog Post," "Resource").
     - **Default Value:** `"Content type"`
     - **Required:** No
     - **Notes:**
       - Translatable for localization requirements.
       - Inline editable in Squiz Matrix.

  2. **Heading**
     - **Type:** `string`
     - **Field Title:** Heading
     - **Description:** The primary heading of the card.
     - **Default Value:** `"Heading"`
     - **Required:** **Yes**
     - **Notes:**
       - Translatable for localization requirements.
       - Inline editable via Squiz Matrix admin interface.

  3. **Supporting Text**
     - **Type:** `string`
     - **Field Title:** Supporting Text
     - **Description:** A brief description or supporting content displayed below the heading.
     - **Default Value:** `"Supporting text"`
     - **Required:** No
     - **Notes:** 
       - Translatable for localization requirements.
       - Inline editable via Squiz Matrix admin interface.

  4. **Link**
     - **Type:** `SquizLink`
     - **Field Title:** Link
     - **Description:** A clickable link provided in the card for additional context or action.
     - **Required:** **Yes**
     - **Notes:** 
       - Custom field type `SquizLink` represents a link object managed within Squiz Matrix.
       - Inline editable via Squiz Matrix admin interface.

  5. **Image**
     - **Type:** `SquizImage`
     - **Field Title:** Image
     - **Description:** A background image displayed on the card.
     - **Required:** No
     - **Notes:** 
       - Custom field type `SquizImage` represents an image asset managed within Squiz Matrix, supporting uploads and integration from image folders.
       - Inline editable via Squiz Matrix admin interface.

---

### Custom Field Types

#### SquizLink
The `SquizLink` field type is a specialized object representing a link within Squiz Matrix. It can include:
- URL (HTTP/HTTPS path to the destination).
- Anchor text to display the link.
- Optional attributes like target behavior (e.g., open in a new tab).

#### SquizImage
The `SquizImage` field type is a specialized object representing an image asset stored within Squiz Matrix. It includes:
- URL or asset reference for the image file.
- Image properties such as title, alternative text, and dimensions.

#### FormattedText
*Not explicitly included in the provided manifest.json.* If implemented, `FormattedText` supports rich text formatting, such as bold, italics, links, and lists.

---

### Conditional Logic
- **Cards Field:**
  - The `cards` field is required and must contain at least **1 card**.
  - The `heading` and `link` fields are **required** within each card. Without these, the card is invalid.
- **Minimum and Maximum Items:**
  - The component supports a **minimum of 1 card** and a **maximum of 8 cards** in the grid. Attempts to exceed these limits will result in validation errors.

---

### Visual and Functional Variations

#### Preview Variations:
1. **Default Preview**
   - Path: `preview.html`
   - Data Source: `example.data.json` (provides a pre-configured example with multiple cards).
   - Usage: Allows users to visualize component functionality and layout within a predefined design.

---

## Output and Rendering
- **Response Type:** `html`
- The Cards component renders a grid layout in HTML format, populated with the configured cards, each containing its content type, heading, supporting text, link, and background image (if provided).

---

## Versioning
- **Current Version:** `2.1.0`
- Ensure compatibility with updates by referencing this version in relevant projects.

---

## Notes
- The component is part of the `edge-dxp-comp-lib` namespace, designed specifically for Squiz Matrix's Edge DX platform.
- The metadata allows inline editing of translatable fields across supported languages, facilitating efficient content localization.

For additional support, refer to the Squiz Matrix documentation.
