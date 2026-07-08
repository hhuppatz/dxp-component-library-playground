```markdown
# Functional Specification: HH - Card Component

## Overview
The `HH - Card` component is a configurable card designed to display content in a visually appealing way. Best suited for showcasing individual pieces of content within a grid or standalone, the component features optional content type labels, headings, descriptions, background images, and attached links. It presents information in a concise, engaging format for end users and is ideal for use in modern web interfaces.

## Fields & Properties
The component provides the following configurable fields:

| Field                | Type          | Description                                | Default Value      | Required |
|----------------------|---------------|--------------------------------------------|--------------------|----------|
| **Content Type**     | `string`      | A label above the card heading to display the content category. It is translatable and inline-editable. | "Content type"     | No       |
| **Heading**          | `string`      | The main heading of the card. This is a required field, translatable, and inline-editable. | "Heading"          | Yes      |
| **Supporting Text**  | `FormattedText` | Additional descriptive text below the heading. Allows rich text formatting and is translatable and inline-editable. | "Supporting text"  | No       |
| **Link**             | `SquizLink`   | A hyperlink associated with the card, allows deep linking. It is inline-editable. | N/A                | No       |
| **Image**            | `SquizImage`  | A background image for the card, displayed behind its content. It is inline-editable. | N/A                | No       |

### Custom Field Types
- **FormattedText**: Supports rich text formatting, allowing customization such as bold, italic, lists, and hyperlinks.
- **SquizLink**: A field designed to capture URLs or internal links, ensuring compatibility with Squiz Matrix's linking features.
- **SquizImage**: Manages image uploads or references, supporting rendering optimization and inline editing.

## Conditional Logic
The **Heading** field is mandatory and must always be provided. All other fields are optional and can be customized or left blank depending on the design and content requirements. Conditional visibility or requirements are not explicitly defined in this specification.

## Previews
The component provides a named preview (`default`) for visual testing. This preview relies on sample data (`example.data.json`) to render the card within a pre-designed wrapper file (`preview.html`), showcasing the component's look and feel with populated content.

This component offers a modern, flexible card layout with customizable fields, allowing content creators to manage both functionality and aesthetic appeal in Squiz Matrix projects.
```
