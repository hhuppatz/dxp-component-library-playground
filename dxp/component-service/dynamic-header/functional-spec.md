# Functional Specification: Dynamic Header Component

## Overview
The `Dynamic Header` is a Squiz Matrix web component designed to display a section heading and optional descriptive content. It offers full flexibility in selecting the header level (e.g., `h1`, `h2`, etc.) for semantic and accessibility purposes, as well as a customizable body of supporting text. The component is ideal for structuring web pages with clearly defined section titles and additional explanatory text.

---

## Key Features
- Displays a customizable heading with a user-defined level (`h1` to `h6`).
- Includes an optional, translatable supporting text area below the heading.
- Allows inline editing of both the heading (`title`) and supporting text (`content`).
- Suitable for design systems where semantic heading levels must be strictly followed.

---

## Properties and Fields

### 1. **`title`**
- **Type:** `string`
- **Title:** Title
- **Description:** The heading text to display.
- **Default Value:** `"Section title"`
- **Required:** ✅ **Yes**
- **Translatable:** ✅ Yes
- **Other Requirements:** Inline editing enabled.

### 2. **`titleLevel`**
- **Type:** `string`
- **Title:** Title Level
- **Description:** Select the heading level from `h1` to `h6`.
- **Options (enum):** `["h1", "h2", "h3", "h4", "h5", "h6"]`
- **Default Value:** `"h2"`
- **Required:** ✅ **Yes**
- **Other Requirements:** Available as a quick option for editing.

### 3. **`content`**
- **Type:** `FormattedText` (Custom Field)
- **Title:** Content
- **Description:** A block of text displayed below the heading.
- **Default Value:** `null` (empty by default)
- **Required:** ❌ **No (optional field)**
- **Translatable:** ✅ Yes
- **Other Requirements:** Inline editing enabled.

---

## Custom Field Types

### 1. **`FormattedText`**
This field type is used for rich text content. It supports advanced formatting such as bold, italics, bullet lists, links, and more. It allows for inline editing in the Squiz Matrix editor, providing a user-friendly experience for content authors. 

---

## Conditional Logic
- The **`content`** field is optional, and leaving it empty results in a heading without descriptive text.
- The **`titleLevel`** defaults to `h2`. While other heading levels (`h1, h3–h6`) are optional, users should choose them based on the document’s hierarchy for semantic correctness.

---

## Visual and Functional Variations

### 1. **Default Preview**
- **Description:** Displays a sample implementation of the `Dynamic Header` component with placeholder content and the default `titleLevel` (`h2`).
- **File Source:** `example.data.json`
- **Wrapper Template:** `preview.html`

### 2. **Named Variants:**
This component has no named preview variants configured. However, users can create variations by adjusting field values for unique visual results (e.g., different heading levels or supporting text designs).

---

## Usage Guidelines
Use the `Dynamic Header` component to:
1. Define hierarchical page sections with clear headings.
2. Supplement headings with descriptive content to provide additional context.
3. Ensure semantic structure and accessibility by selecting appropriate heading levels.

---

## Example Rendering
### Input Data
```json
{
  "title": "About Us",
  "titleLevel": "h1",
  "content": "Learn more about our mission, values, and history below."
}
```

### Rendered Output
#### `<h1>About Us</h1>`
##### `Learn more about our mission, values, and history below.`

---

## Notes on Compatibility
- Version: **2.1.0**
- **Response Type:** HTML output, optimized for embedding within both static and dynamic templates.
- **Icon:** Features a gray-colored title symbol for easy identification in the Squiz Matrix editor.
