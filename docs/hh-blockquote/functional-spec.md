# Block Quote Component Functional Specification

## Overview
The **Block Quote** component is designed to display a highlighted quote along with the author's name. It provides an optional title to contextualize the quote. This component is ideal for prominently featuring testimonials, quotes, or key statements within a web page. It is customizable and translatable, ensuring seamless integration with various design requirements and content strategies.

## Component Properties
The Block Quote component supports the following properties:

| **Field**           | **Type**           | **Title**            | **Description**                                            | **Default Value** | **Required** |
|---------------------|--------------------|----------------------|------------------------------------------------------------|-------------------|--------------|
| `title`             | `string`          | Title                | The title displayed above the quote.                       | Section title     | No           |
| `quote`             | `FormattedText`   | Quote                | The text of the quote.                                      | None              | Yes          |
| `author`            | `string`          | Author               | The name of the quote's author.                            | Author            | No           |
| `favouriteCoffee`   | `string`          | Favourite Coffee     | (Optional field) User’s favourite coffee.                  | Latte             | No           |

### Custom Field Types
- **FormattedText**: This input type allows rich text formatting (e.g., bold, italics, links), making it ideal for stylized or emphasized quotes.
- **SquizImage** and **SquizLink** (not present in this configuration): These are specialized field types in Squiz Matrix for handling media assets and hyperlinks. They are not used in this component.

### Conditional Logic
The `quote` field is mandatory, and the component will not render without valid content. No additional conditional logic exists for other fields.

## Previews and Visual Variations
The component provides a default named preview, which renders the Block Quote within a pre-configured HTML wrapper (`preview.html`) using example content from `example.data.json`. This allows developers and designers to visualize the component's appearance and functionality during the design and development process.
