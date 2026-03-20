# Functional Specification: Icon Cards Component

## Overview

### Component Name
**Icon Cards**

### Description
The Icon Cards component is a web component designed to display a collection of cards, each containing an icon, a heading, text content, and an optional link. It is suitable for showcasing features, benefits, or any categorized content in a visually appealing manner. The component is customizable to display the cards in two, three, or four columns, making it flexible for different design needs.

### When to Use
Use this component when you need to:
- Enhance the presentation of key features or services.
- Group information into visually distinct cards with icons.
- Create a responsive, column-based card layout.

---

## Component Properties

The Icon Cards component requires configuration for content and layout. Its properties are divided into two main categories: `componentContent` and `componentConfiguration`. 

### 1. `componentContent`
This defines the cards' content to be displayed, including the section title and individual cards.

#### Properties

| Field               | Type            | Description                                                                            | Required | Default Value       |
|---------------------|-----------------|----------------------------------------------------------------------------------------|----------|---------------------|
| **title**           | `string`        | The title displayed above the icon cards section.                                      | No       | "Section title"     |
| **cards**           | `array` of objects | A list of individual cards. Each card contains the following properties:                | Yes      | N/A                 |

- **Cards (Array) Properties**  
  | Field               | Type               | Description                                                           | Required | Default Value       |
  |---------------------|--------------------|-----------------------------------------------------------------------|----------|---------------------|
  | **icon**            | `enum`             | The icon displayed on the card. Choose from: `paintBucket`, `pen`, `printer`, `tools`. | No       | N/A                 |
  | **heading**         | `string`           | The heading text of the card.                                         | No       | "Card heading"      |
  | **textContent**     | `FormattedText`    | The main body text content of the card (rich-text formatting supported). | Yes      | N/A                 |
  | **link**            | `SquizLink`        | A link associated with the card (e.g., for navigation).               | No       | N/A                 |

---

### 2. `componentConfiguration`
This defines the visual layout and configuration of the Icon Cards component.

| Field                | Type             | Description                                                        | Required | Default Value       |
|----------------------|------------------|--------------------------------------------------------------------|----------|---------------------|
| **numberOfColumns**  | `string` (enum)  | The number of columns for displaying the cards. Select from: `2 Columns`, `3 Columns`, `4 Columns`. | Yes      | "2 Columns"         |

---

## Custom Field Types

1. **FormattedText**  
   This field type allows rich-text editing, supporting basic text formatting (e.g., bold, italics, links). Text inside this field is translatable and can be edited inline via the Squiz Matrix interface. It is used for `textContent` in cards.

2. **SquizLink**  
   This field represents a hyperlink within the Squiz Matrix ecosystem. It can include external URLs or internal links within the site. Used for the `link` property in cards.

3. **SquizImage**  
   _Note: This field type is not used in the current implementation, but it can support image selection in other components._

---

## Conditional Logic

- **Card Fields**  
  - The `textContent` field is **required** for each card. If this field is not provided, the card will not render properly.
  - The other fields within a card (`icon`, `heading`, `link`) are **optional** and can be omitted based on design requirements.

---

## Previews and Variations

### Default Variation
- A default preview is provided in the Squiz Matrix editor. It uses an example dataset (`example.data.json`) to render the component in a standard layout defined by `preview.html`.

### Column Variations
Three visual variations are available based on column count:
1. **2 Columns**: Displays cards in two columns.
2. **3 Columns**: Displays cards in three columns.
3. **4 Columns**: Displays cards in four columns.

The variation can be selected via the `numberOfColumns` property.

---

## Output
The component renders its output as an HTML block, which includes the configured cards, styling, and layout for the specified number of columns.

---

## Version History
- **Version 2.1.0**: Current implementation with customizable columns and inline-editable fields.

---

By following this functional specification, developers and content authors can effectively configure the Icon Cards component to create visually engaging and content-rich web sections within the Squiz Matrix platform.
