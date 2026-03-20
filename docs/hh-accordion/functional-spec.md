```markdown
# Functional Specification: HH - Accordion

## Component Overview
The **HH - Accordion** component displays a list of collapsible headings with hidden content that users can reveal by clicking. Use this component to present information in a compact, organized manner, such as FAQs, features, or categorized content. Its interaction-driven format improves the user experience by reducing visual clutter and focusing attention on specific sections.

## Available Properties/Fields

### `title`
- **Type**: `string`
- **Description**: The section title displayed above the accordion.
- **Default Value**: "Section title"
- **Required**: No
- **Notes**: Supports inline editing and text translation.

### `accordion`
- **Type**: `array`
- **Description**: Defines the content for multiple accordion items, each containing a heading and associated content.
- **Default Value**: None
- **Required**: Yes (must contain at least one item)
  - **Item Properties**:
    - **`heading`**
      - **Type**: `string`
      - **Description**: The title for each accordion item.
      - **Default Value**: "Heading content"
      - **Required**: Yes
      - **Notes**: Supports inline editing and text translation.
    - **`content`**
      - **Type**: `FormattedText`
      - **Description**: Text displayed inside the accordion panel when expanded.
      - **Required**: Yes
      - **Notes**: Allows rich text formatting and supports inline editing.

## Custom Field Types
- **FormattedText**: A field supporting rich text content (e.g., bold, links, lists), allowing for visually-rich and formatted output.
- **SquizImage** and **SquizLink**: Not used in this component.

## Conditional Logic
The `accordion` field is required and must have at least one item. Each item in the array must include valid `heading` and `content`. No additional conditional logic is applied.

## Visual/Functional Variations
The component includes a single named preview (`default`) for visual and functional testing. This preview uses a predefined `example.data.json` file as input and is wrapped in a custom `preview.html` template for consistent display in testing environments.
```
