# Functional Specification: Single Image Component

## Overview

### Component Purpose
The **Single Image** component is designed to display a single static image within a Squiz Matrix project. It allows content authors to easily upload, select, and display an image, making it suitable for use in scenarios where a solitary image is needed for visual communication, such as:
- Highlighting a product or feature
- Displaying a promotional banner
- Enhancing the visual appeal of a webpage section

### When to Use
Use the Single Image component when:
- You have a standalone image to display.
- Inline edits for the image are required directly on the webpage.
- Minimal configurable options are sufficient for your use case.
For more complex configurations (e.g., images with captions or groups of images), other components should be considered.

---

## Component Properties and Fields

The Single Image component has a minimal set of properties designed for simplicity. Below are detailed descriptions of each property:

### Component Root: `componentContent`

| Property           | Type         | Title       | Description                              | Default Value | Required |
|--------------------|--------------|-------------|------------------------------------------|---------------|----------|
| **image**          | `SquizImage` | Image       | Defines the single image to be displayed.| None          | Yes      |

---

## Fields Details

### Custom Field Types
Some fields use Squiz-specific custom field types. Here is an explanation of each:

- **`SquizImage`**:
  - Represents an image field supporting image upload or selection from the asset library.
  - Allows basic metadata (e.g., alt text) and inline editing capabilities.
  - Inline editing (`ui:metadata.inlineEditable`) is enabled, meaning content authors can replace/update the image directly from the displayed component.

---

## Conditional Logic

This component has minimal conditional logic:
- The **`image`** field must be defined for the component to function. It is a required field.
- If **`image`** is not provided, the component will return an empty or placeholder output.

---

## Output and Behavior

### Output Type
This component outputs **HTML**, rendering the selected image in a responsive format. CSS styling is applied to ensure the image adapts to various layouts.

### Visual/Functional Variations

#### Previews
The component comes with a **default preview**, allowing developers to see a sample image without needing to configure the component manually. The example data for the preview is housed in a file named `example.data.json`, and the HTML preview layout is defined in `preview.html`.

No additional named variations or styles are predefined; this component maintains a single, consistent visual behavior.

---

## Summary

The Single Image component is a lightweight, straightforward tool for displaying one image. It focuses on simplicity and ease of content editing, making it perfect for single-use visuals. The inline editing support enhances user experience for authors. Configuration requirements are minimal, with the mandatory image field ensuring correct functionality.

For advanced requirements, developers can extend or customize this base component as needed.
