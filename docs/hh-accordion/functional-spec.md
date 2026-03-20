# Functional Specification: HH - Accordion Web Component

## Overview

The **HH - Accordion** component is a user interface element that displays a list of expandable headings, each paired with hidden content. Users can click on a heading to reveal the corresponding content, which collapses again when the heading is clicked a second time. This component is ideal for FAQs, content categorization, or any scenario where vertical space needs to be conserved while presenting multiple content items.

## Fields and Configuration

### Component Fields

| **Field**       | **Type**      | **Description**                                                 | **Default Value**  | **Required** |
|------------------|---------------|-----------------------------------------------------------------|--------------------|--------------|
| `title`          | `string`      | The title displayed above the accordion.                       | "Section title"    | No           |
| `accordion`      | `array`       | A list of accordion items, each with `heading` and `content`.  | None               | Yes          |
| **Accordion Item Fields** |          |                                                                 |                    |              |
| `heading`        | `string`      | The title of the individual accordion item.                    | "Heading content"  | Yes          |
| `content`        | `FormattedText` | The text displayed inside the accordion panel.                 | None               | Yes          |

### Custom Field Types

- **FormattedText**: Allows fully formatted content such as HTML or rich text. Supports inline editing in the Squiz Matrix interface.  
- **SquizImage**: Allows uploading and managing images. *(Not used in this component.)*  
- **SquizLink**: Enables linking to internal or external resources. *(Not used in this component.)*

## Conditional Logic

- The `accordion` field requires at least one item (`minItems: 1`) and can contain a maximum of 20 items (`maxItems: 20`).
- Within an accordion item, both the `heading` and `content` fields are mandatory, ensuring each item is properly structured.

## Previews and Variations

A default preview is available for this component, showcasing a sample accordion with mock content. This preview uses the `example.data.json` file for populated data and is rendered using the `preview.html` wrapper. Currently, the component only supports a standard single-column layout with expandable panels and no named visual variations.
