# Functional Specification: Cards Component

## Description
The **Cards** web component displays a grid of up to eight customizable cards. Each card includes a heading, optional content type, supporting text, link, and background image. The component can be used to visually organize related information, promote content, or offer navigational links. A section title and an optional link can be displayed above the card grid for added context.

## Available Properties

### Top-Level Properties
- **`title`**: (*string*, required, default: "Section title")  
  The title displayed above the card grid. Translatable and inline-editable.  
- **`link`**: (*SquizLink*, optional)  
  An optional link displayed next to the section title. Supports dynamic linking options compatible with Squiz Matrix.  
- **`cards`**: (*array*, required, minItems: 1, maxItems: 8)  
  A list of cards to display. Each card requires `heading` and `link`. See card-specific fields below.

### Card-Specific Properties
- **`contentType`**: (*string*, optional, default: "Content type")  
  Text displayed above the card’s heading. Translatable and inline-editable.  
- **`heading`**: (*string*, required, default: "Heading")  
  The main heading of the card. Translatable and inline-editable.  
- **`supportingText`**: (*string*, optional, default: "Supporting text")  
  Additional text displayed below the card heading. Translatable and inline-editable.  
- **`link`**: (*SquizLink*, required)  
  A link associated with the card. Supports dynamic linking options compatible with Squiz Matrix.  
- **`image`**: (*SquizImage*, optional)  
  An image displayed in the card's background. Supports the Squiz Matrix Image field type for dynamic or static image content.

## Field Types
- **SquizImage**: Enables selection of images stored within the Squiz Matrix image asset library, supporting advanced configurations such as dynamic paths.  
- **SquizLink**: Facilitates linking to internal or external resources using the Squiz Matrix link field type, with support for dynamic links.  
- **FormattedText**: Allows rich text formatting, including bold, italics, lists, and hyperlinks, for UI/contextual purposes.  

## Conditional Logic
- The `cards` array must contain at least one item and no more than eight items.  
- Each card requires the fields `heading` and `link` to be defined. Other card fields are optional.  
- The `link` field appears conditionally and is only required if one or more cards are defined.

## Previews
The component includes a default preview accessible via the `example.data.json` file and `preview.html` wrapper. This preview demonstrates a typical card grid layout, showcasing possible combinations of titles, links, and card content.
