# Functional Specification: HH - Block Quote Component

## Overview

The **HH - Block Quote** component is used to display a quote with the name of its author, optionally including a title above the quote content. This component is ideal for showcasing testimonials, notable sayings, or highlighted quotes in a visually distinct manner. It can be used within Squiz Matrix Edge environments and offers inline editing for easier customization.

## Available Properties/Fields

Below are the configurable fields for the component:

| Field             | Type            | Title                  | Description                           | Default Value        | Required |
|--------------------|-----------------|------------------------|---------------------------------------|----------------------|----------|
| `title`           | `string`        | Title                  | Displays a heading above the quote.  | "Section title"      | No       |
| `quote`           | `FormattedText` | Quote                  | The main text of the quote.           | None                | Yes      |
| `author`          | `string`        | Author                 | The name of the quote's author.       | "Author"            | No       |
| `favouriteCoffee` | `string`        | Favourite Coffee       | User's favourite coffee (optional).  | "Latte"             | No       |

### Custom Field Types

- **FormattedText**: Supports rich-text formatting, allowing bold, italic, links, and other text styles directly in the quote.
- **SquizImage**: Although unused in this component, this type allows selecting and displaying uploaded images (not applicable here).
- **SquizLink**: Provides functionality for adding internal/external hyperlinks (not applicable here).

## Conditional Logic

The `quote` field is required to display the component, as it contains the primary content. All other fields are optional and only appear if provided with a value. No dynamic conditional logic affects the visibility or requirements of additional fields.

## Visual/Functional Variations (Named Previews)

The component has one named preview, **Default**, which renders a sample quote with accompanying author and title using the `example.data.json` file. Previews are displayed within a wrapper defined in `preview.html`, showcasing its typical appearance and functionality in a standard layout.
