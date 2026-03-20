# Functional Specification: Image Text Row Component

## Overview

### Component Name
**Image Text Row**

### Description
The Image Text Row component is used to display a single row layout with an image and text content. The image can be positioned either on the left or right side of the text content, based on the selected layout variant. This component is typically used for content sections that require a visually appealing combination of imagery and descriptive content, such as feature highlights, promotional banners, or informative sections.

---

## Features

### Key Features
- Flexible layout: Image can be positioned on the left or right of the text.
- Includes custom field types for images, text, and links.
- Fully customizable and translatable content.
- Inline editable fields for rapid content updates.
- Predefined layout previews for quick visualization.

---

## Component Properties

### 1. Component Content

The `componentContent` object defines the primary content fields for the component.

#### Properties:
| **Field Name**   | **Type**       | **Title**       | **Description**                                | **Default Value** | **Required** |
|-------------------|----------------|-----------------|------------------------------------------------|-------------------|--------------|
| **title**         | `string`      | Section Title   | The title displayed above the section.         | "Section Title"   | No           |
| **image**         | `SquizImage`  | Image           | The image displayed in the section.            | N/A               | No           |
| **contentType**   | `string`      | Content Type    | A label displayed above the heading.           | "Content Type"    | No           |
| **heading**       | `string`      | Heading         | The main heading text displayed in the section.| "Heading"         | **Yes**      |
| **textContent**   | `FormattedText`| Text Content   | The main text content of the section.          | N/A               | **Yes**      |
| **link**          | `SquizLink`   | Link            | A clickable link displayed below the text.     | N/A               | No           |

### 2. Component Configuration

The `componentConfiguration` object controls the layout and behavioral settings for the component.

#### Properties:
| **Field Name**   | **Type** | **Title**  | **Description**                                        | **Default Value** | **Required** |
|-------------------|----------|------------|--------------------------------------------------------|-------------------|--------------|
| **variant**       | `string` | Variant    | Determines the layout: image left or image right.       | "text-left"       | **Yes**      |

#### Supported Options for `variant`:
- `text-left`: Image appears on the left, and text appears on the right.
- `text-right`: Image appears on the right, and text appears on the left.

---

## Custom Field Types

### SquizImage
The `SquizImage` type is used for selecting and displaying images. It provides an interface for users to upload or select an image from the Squiz Matrix media library.

- Supports drag-and-drop upload.
- Includes built-in support for responsive scaling.

### SquizLink
The `SquizLink` type is used for creating navigable links. This field allows users to define:
- The URL or page destination.
- Link text (if any).
- Optionally, whether the link opens in the same tab (_self) or a new tab (_blank).

### FormattedText
The `FormattedText` type is a rich text editor for creating and styling text content. It supports:
- Bold, italic, underline, and other formatting options.
- Lists, links, and embedded media.
- Inline editing for live previews.

---

## Conditional Logic

### Field Requirements
- **`heading` and `textContent` are required fields**. The component cannot render properly without these fields.
- Other fields, such as `title`, `image`, `contentType`, and `link`, are optional but can enhance the appearance and functionality of the component.

### Dependencies
- The `variant` field in `componentConfiguration` affects the layout of the `image` and `textContent`:
  - **`text-left`**: Displays the image on the left side and text on the right.
  - **`text-right`**: Displays the text on the left side and image on the right.

---

## Visual & Functional Variations

The component supports the following named previews:

### Default Preview
This is the standard configuration, showing the `text-left` variant. In this layout:
- The image appears on the left.
- The text content, heading, and link appear on the right.

### Switched Preview
This showcases the `text-right` variant. In this layout:
- The image appears on the right.
- The text content, heading, and link appear on the left.

Previews can be viewed in a browser from the provided `example.data.json` files using the specified `preview.html` wrapper. These previews assist developers and content creators in visualizing the component's appearance in different configurations before implementation.

---

## Implementation Details

### Version
2.1.0

### Namespace
`edge-dxp-comp-lib`

### Icon
- **ID**: `view_column`
- **Color**: Gray

### Entry Point
The component's main logic is defined in the `main.js` file located within the project structure's root directory.

---

## Usage Guidance

### When to Use
- Use the Image Text Row component to combine an image and descriptive text into a visually appealing layout for feature highlights, promotions, or content sections.
- Ideal for pages or layouts requiring a responsive, well-organized structure with optional links.

### When Not to Use
- Avoid the component for layouts that do not require image-text combinations.
- If complex formatting, multiple rows, or columns are needed, consider using other components designed for those specific purposes.

---

This specification provides a comprehensive guide for developers, designers, and content authors to implement and utilize the Image Text Row component effectively. For additional technical references or support, refer to the component's documentation or contact the development team.
