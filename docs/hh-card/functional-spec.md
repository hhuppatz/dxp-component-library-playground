# Functional Specification: Card Component (hh-card)

## Overview
The "Card" component (`hh-card`) is a reusable UI element used to display encapsulated content, such as headings, supporting text, images, and links. Ideal for showcasing information blocks in a structured and visually appealing format, cards work well in grid or list layouts. Use this component to highlight individual content pieces, such as articles, products, or promotional features.

## Properties/Fields

| **Field**           | **Type**        | **Description**                                                | **Default Value**    | **Required** |
|---------------------|-----------------|----------------------------------------------------------------|----------------------|--------------|
| `contentType`       | String          | Content type label displayed above the heading.               | `"Content type"`     | No           |
| `heading`           | String          | Main heading text of the card.                                | `"Heading"`          | Yes          |
| `supportingText`    | FormattedText   | Rich text displayed below the heading.                        | `"Supporting text"`  | No           |
| `link`              | SquizLink       | Hyperlink associated with the card (e.g., read more link).     | None                 | No           |
| `image`             | SquizImage      | Background image for the card.                               | None                 | No           |

### Custom Field Types
- **FormattedText**: Allows basic text formatting (e.g., bold, italic) and rendering of rich text content.
- **SquizLink**: Represents a link object supporting custom URLs or internal page links.
- **SquizImage**: Represents an image object for uploading or referencing via asset metadata.

## Conditional Logic
- The `heading` field is always required; the component cannot render without it.
- Fields such as `contentType`, `supportingText`, `link`, and `image` are optional and enhance the visual/functional richness of the card.

## Previews & Variations
The component includes a **default preview**, showcasing a basic card layout with sample data (`example.data.json`). This preview demonstrates the integration of all fields (content type, heading, supporting text, link, and image) for testing and visualization.
