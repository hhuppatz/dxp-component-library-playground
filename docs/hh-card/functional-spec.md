# Functional Specification: HH - Card

## Overview
The **HH - Card** component is designed to display individual cards that can feature titles, supporting text, background images, and links. It is ideal for showcasing highlights, featured content, or compact pieces of information within a larger layout. The card supports inline editing for easy content management and can adapt visually based on content inclusion.

---

## Fields and Properties  

| Field Name      | Type           | Description                                          | Default Value      | Required |
|------------------|----------------|------------------------------------------------------|--------------------|----------|
| **Content Type** | `string`       | Displays a label above the card heading.            | `Content type`     | No       |
| **Heading**      | `string`       | The main title of the card.                         | `Heading`          | Yes      |
| **Supporting Text** | `FormattedText` | Text displayed below the heading, supporting HTML and rich formatting. | `Supporting text`  | No       |
| **Link**         | `SquizLink`    | A link associated with the card (clickable call-to-action). | None              | No       |
| **Image**        | `SquizImage`   | An image displayed in the card's background, supporting the Squiz image type for CMS integrations. | None | No |

### Custom Field Types  
- **FormattedText**: Allows rich text and HTML content for versatile styling and inline formatting.  
- **SquizLink**: A specialized field for defining URLs with CMS-level validation and inline edit capabilities.  
- **SquizImage**: Handles images with CMS-integrated asset management and ensures proper formatting and scaling.

---

## Functional Highlights  
The **Heading** field must always be specified, as it is critical for the card's purpose. While the **Supporting Text**, **Link**, and **Image** fields are optional, their inclusion allows for richer, more engaging designs.  

The component offers a **default preview** variation that illustrates how the card will render using example data (`example.data.json`). Conditional logic is minimal; fields do not depend on each other but dynamically adapt visual appearance based on the content provided (e.g., excluding an image simplifies the card layout). 

Use this component to create visually appealing, accessible, and content-rich cards in your Squiz Matrix implementations.
