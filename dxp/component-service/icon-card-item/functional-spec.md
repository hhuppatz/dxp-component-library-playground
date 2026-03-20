# Functional Specification: Icon Card – Single

## Overview

### Purpose
The **Icon Card – Single** web component is used to display a single, full-width card with an optional icon, a heading, descriptive text, and an optional link. This component is designed to visually highlight a single item of focus, such as a service, feature, or key information, and can be embedded inside layouts.

### When to Use
Use the **Icon Card – Single** component when you need to:
- Present standalone information visually, in a structured layout.
- Pair an icon with a heading and descriptive content for emphasis.
- Provide a clear, actionable link for navigation.

## Component Properties/Fields

### 1. `componentContent`
This is the main property that contains all the content for the Icon Card. It is an **object type** and is required for the component to render. It contains the following properties:

#### a) `icon`
- **Type:** `string`
- **Title:** "Icon"
- **Description:** A key from the predefined `iconMap`. Used to select and display an icon representing the content. Options include:
  - `paintBucket`
  - `pen`
  - `printer`
  - `tools`
- **Default Value:** None
- **Required:** No
- **Conditional Logic:** If an icon is not specified, no icon is displayed on the card.

#### b) `heading`
- **Type:** `string`
- **Title:** "Heading"
- **Description:** The title text for the card.
- **Default Value:** "Card heading"
- **Required:** No
- **Additional Properties:**
  - This field is translatable, allowing for multi-language support.
  - Inline editing is supported via UI.

#### c) `textContent`
- **Type:** `FormattedText`
- **Title:** "Content"
- **Description:** The main descriptive text for the card.
- **Required:** Yes
- **Additional Properties:**
  - This field uses the `FormattedText` data type, which allows support for customized text formatting (e.g., bold, italic, and links) to enhance readability.
  - The field is translatable, enabling localized content for global audiences.
  - Inline editing is supported via UI.

#### d) `link`
- **Type:** `SquizLink`
- **Title:** "Link"
- **Description:** An optional link that transforms the card into a clickable element for navigation.
- **Default Value:** None
- **Required:** No
- **Additional Properties:**
  - Uses the `SquizLink` field type, which is designed to integrate links within the Squiz Matrix system. It can include attributes like URL, text labels, and behavior options.
  - Inline editing is supported via UI.
  - Conditional Logic: If provided, the entire card becomes clickable, and styling may adjust to indicate the presence of a link (e.g., hover effects).

### Custom Field Types
The component utilizes the following specialized field types for improved functionality:

1. **SquizImage:**
   This field type is for selecting or uploading images within the Squiz ecosystem. While not used directly in this component, similar properties such as `SquizLink` and `FormattedText` share tailored functionalities.

2. **SquizLink:**
   Designed for managing links, this allows users to connect the card to internal or external URLs. It supports additional attributes such as open-in-new-tab behavior and custom accessibility labels.
   
3. **FormattedText:**
   Allows a rich text editing experience, enabling users to format text with bolding, italicizing, and adding inline links, while maintaining compatibility with translations and inline editing.

## Conditional Logic

1. The `icon` field is optional. If left unset, the card will display other elements (heading, textContent, and/or link) without an icon.
2. The `link` field is optional. If supplied, the entire card becomes clickable, and hover effects may apply.

## Visual and Functional Variations

The component follows a responsive design, ensuring that it displays correctly on various screen sizes. The **default named preview** included in the manifest.json provides a visual demonstration of the component layout and styling, which includes a sample icon, heading, content, and a link.

### Named Preview: Default
- Uses the file `example.data.json` to populate the card with sample content.
- Preview will be rendered using the `preview.html` wrapper for a realistic visual representation during development and testing.

## Default Behavior and Styling
- If no `icon` is specified, the card will render without an icon but retain the heading, textContent, and link (if present).
- Default icon color is set to `gray`.
- The `heading` field defaults to "Card heading" if no value is provided.
- The `textContent` field is mandatory, ensuring every card has at least some descriptive text.
  
## Output
The component outputs **HTML** code, which can be seamlessly rendered within Squiz Matrix layouts.

---

This functional specification outlines the capabilities, configuration, and behavior of the **Icon Card – Single** component, ensuring proper implementation and usage.
