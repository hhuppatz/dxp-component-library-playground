# Functional Specification: Content Summary Web Component

## Overview

The **Content Summary** web component is designed to display a concise summary of content. It provides users with a structured layout containing:
- A content type label,
- A heading,
- A block of text content, and
- A link.

This component is particularly useful for summarizing key pieces of information on a webpage, such as in landing pages, blog previews, or content overviews, where brief yet informative content presentations are needed.

### Key Features
- Displays structured content with a label, heading, text, and actionable link.
- Easily configurable via Squiz Matrix.
- Inline-editable properties for quick customization.

---

## Component Properties

### `componentContent` (required)
The `componentContent` property houses the main configuration for the Content Summary. It is an object containing the following fields:

| Field            | Title            | Type          | Description                                                                                 | Default Value  | Required |
|-------------------|------------------|---------------|---------------------------------------------------------------------------------------------|----------------|----------|
| `contentType`     | Content Type     | `string`       | The content type label displayed above the heading. This helps categorize or group content. | "Content Type" | No       |
| `heading`         | Heading          | `string`       | The main heading text. This is the primary title of the content summary.                   | "Heading"      | Yes      |
| `textContent`     | Text Content     | `FormattedText`| The main text content displayed in the section. Allows for rich text formatting, including links, bold, and italic. | *(None)*       | Yes      |
| `link`            | Link             | `SquizLink`   | The link displayed below the text content. Can be used to guide users to detailed pages.   | *(None)*       | No       |

---

### Custom Field Types

#### `FormattedText`
The `FormattedText` type is a rich-text field that supports advanced text formatting. Content creators can:
- Include hyperlinks,
- Apply bold, italic, or other styling options, and
- Customize the structure of text.

This field is ideal for presenting detailed descriptions or summaries with enhanced readability.

#### `SquizLink`
The `SquizLink` type allows for defining clickable links within the component. This type supports external, internal, or anchor links within the same page and includes additional metadata such as:
- Hyperlink URL (absolute or relative),
- Link text, and
- Target behavior (e.g., open in the same tab or new tab).

Inline editing is fully supported for easy updates.

---

## Conditional Logic
- **`heading` and `textContent` Fields**: These fields are required for the component to function correctly. If these are not provided, the component will not render.
- **`link` Field**: This field is optional. If not provided, the component will not display a link.

---

## Visual/Functional Variations

The `Content Summary` component includes a default preview configuration. It can be rendered in various visual styles based on the use case or interface design, but out of the box, it includes the following named preview:

### Default Preview
- **File-Based Input Data**: The example data file (`example.data.json`) provides mock content for testing and preview purposes.
- **HTML Wrapper**: The preview renders within a predefined HTML structure (`preview.html`).

The default preview demonstrates the component as it would appear with populated content and a visible link.

---

## Usage Summary
When to use:
- To highlight key summaries of content with a structured layout.
- On landing pages or sections of a website where compact, visually engaging content is necessary.
- When presenting teaser content with a 'read more' or navigation link.

Configuration:
- Populate the required fields `heading` and `textContent` for the component to display.
- Use optional fields `contentType` and `link` as needed to enhance functionality and categorization.

This functional specification ensures the consistent implementation and usage of the Content Summary component within Squiz Matrix projects.
