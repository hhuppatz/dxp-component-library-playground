# Functional Specification: HH - Card

## Overview
The **HH - Card** component is a reusable web element designed to display individual content cards within Squiz Matrix. It presents structured information with an optional image, a main heading, supporting text, and a link, making it suitable for showcasing concise, visually engaging content such as article previews, product highlights, or promotional sections.

---

## Properties and Fields

| **Field**          | **Type**        | **Description**                                              | **Default Value**  | **Required**   |
|--------------------|----------------|--------------------------------------------------------------|--------------------|----------------|
| `contentType`      | `string`       | Displays a label above the card's heading to denote context. | `"Content type"`   | No             |
| `heading`          | `string`       | The main heading text of the card.                           | `"Heading"`        | Yes            |
| `supportingText`   | `FormattedText`| A rich text field for additional descriptive content.        | `"Supporting text"`| No             |
| `link`             | `SquizLink`    | A hyperlink associated with the card (optional).             | `null`             | No             |
| `image`            | `SquizImage`   | A background image for the card (optional).                  | `null`             | No             |

### Custom Field Types
- **`FormattedText`**: Allows rich text input, enabling styles such as bold, italic, links, and basic HTML.
- **`SquizLink`**: A specialized field for defining URLs with additional metadata like tracking and accessibility options.
- **`SquizImage`**: A managed field for adding images that integrate with the Squiz DAM, allowing image modifications like cropping and resizing.

---

## Behavior and Logic

The *Heading* field is required for the card to render correctly. All other fields are optional, offering flexibility in content design. There is no conditional logic between properties—each can be used independently. For a complete layout, providing an image, heading, and link is recommended, though not mandatory.

---

## Visual and Functional Variations

The component supports a **default preview** available in the Squiz Matrix editor. This preview uses a predefined example data file (`example.data.json`) and a corresponding wrapper template (`preview.html`) to display how the card will render.
