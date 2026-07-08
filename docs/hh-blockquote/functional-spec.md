# Functional Specification: HH - Block Quote Web Component

## Overview
The `HH - Block Quote` component is designed to display a quote with an optional title and author attribution. This component is ideal for showcasing impactful statements, testimonials, or excerpts in a visually distinct block format. Use this component in sections where you want to highlight text prominently within your Squiz Matrix project.

## Properties and Fields
The component includes the following properties:

- **Title**
  - **Type**: `string`
  - **Description**: Displays a heading above the quote. Inline-editable and translatable.
  - **Default Value**: `"Section title"`
  - **Required**: No

- **Quote**
  - **Type**: `FormattedText`
  - **Description**: The text of the quote. Supports rich formatting, inline editing, and translation.
  - **Default Value**: None
  - **Required**: Yes

- **Author**
  - **Type**: `string`
  - **Description**: The name of the quote’s author, displayed below the quote. Inline-editable and translatable.
  - **Default Value**: `"Author"`
  - **Required**: No

- **Favourite Coffee** (Optional Field)
  - **Type**: `string`
  - **Description**: A non-critical field for specifying the user’s favorite coffee. May be used as metadata or ignored in design.
  - **Default Value**: `"Latte"`
  - **Required**: No

### Custom Field Types
1. **FormattedText**: Supports styled text, such as bold, italic, or lists. Ideal for fields requiring rich formatting.
2. **SquizImage**: Represents an image field (not used in this component).
3. **SquizLink**: Represents a link field (not used in this component).

### Conditional Logic
If the `Quote` field is left empty, the component cannot render properly, as this field is mandatory. Other fields are optional, and the component gracefully handles rendering without them.

## Previews and Variations
The component includes a default preview named `"Default"`, which demonstrates typical usage with sample content for the title, quote, and author. This preview ensures easy validation of design and content expectations.
