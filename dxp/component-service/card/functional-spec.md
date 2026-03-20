# Functional Specification: Squiz Matrix Web Component - Card

## Overview

The **Card** component is designed to display structured information in a visually appealing and cohesive format. It combines a heading, supporting text, optional background imagery, and an optional link. The component is versatile, usable in a variety of layouts, and is translatable to support multi-language projects.

### Use Cases
- Displaying individual items such as featured services, products, or blog posts.
- Highlighting specific pieces of information within a grid or container layout.
- Linking users to a specific page or resource through a call-to-action link.

---

## Properties/Fields

The Card component supports the following properties. These fields configure its content and appearance.

| Property         | Title            | Description                                  | Type         | Default Value     | Required? | Notes                        |
| -----------------| ---------------- | -------------------------------------------- | ------------ | ----------------- | --------- | ---------------------------- |
| `contentType`    | Content Type     | Displays above the card's heading. Useful as a category or tag. | `string`      | "Content type"    | No        | Translatable. Inline editable. |
| `heading`        | Heading          | The primary, prominent text of the card.    | `string`      | "Heading"         | **Yes**   | Translatable. Inline editable. |
| `supportingText` | Supporting Text  | Additional descriptive text below the heading. | `FormattedText` | "Supporting text" | No        | Rich text format. Translatable. Inline editable. |
| `link`           | Link             | A hyperlink associated with the card, turning it into a clickable element. | `SquizLink`   | None              | No        | Inline editable.              |
| `image`          | Image            | Background image for the card.              | `SquizImage`  | None              | No        | Inline editable.              |

---

## Custom Field Types

The **Card** component utilizes the following custom field types for greater design flexibility:

1. **`FormattedText`**
   - Allows for rich text editing, such as bold, italics, lists, and links.
   - Useful for creating more detailed supporting content.

2. **`SquizLink`**
   - Represents a hyperlink. Allows the author to specify a URL and associated metadata like link text.
   - Provides intuitive linking to external or internal pages.

3. **`SquizImage`**
   - Represents an image resource.
   - Enables direct upload or selection of an image asset for use as the card background.

---

## Conditional Logic

- Although most fields are optional, the `heading` property is **always required**. The component will not render without a heading.
- If `link` is defined:
  - The entire card, including the image and text, becomes pressable and directs users to the specified URL.
- If `image` is defined:
  - The image will be displayed in the background of the card, creating a visually engaging element.

---

## Visual and Functional Variations (Previews)

The component supports the following preview configuration:

### Default Preview
- Demonstrates a generic example of the Card component with pre-defined data:
  - **Content Type:** "Example Type"
  - **Heading:** "Example Heading"
  - **Supporting Text:** "This is an example of supporting text."
  - **Link:** Not defined.
  - **Image:** Placeholder image.

- **Preview Sources:**
  - Input data is sourced from `example.data.json`.
  - Wrapped inside the file `preview.html`.

---

## Notes on Usage
- Inline editing is supported for all translatable fields (`contentType`, `heading`, `supportingText`, `link`, and `image`), enabling easier content updates.
- Be cautious when adding images to maintain visual clarity, especially when using lengthy text in the `supportingText` field.
- Ideal for bulletin boards, feature lists, blog previews, calls to action, and other structured layouts.

---

This document outlines the current functional specification for version **1.0.0** of the Card component. Future updates may introduce additional features or variations.
