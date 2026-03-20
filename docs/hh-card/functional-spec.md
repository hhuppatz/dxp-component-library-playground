# Functional Specification: HH - Card Component

## Overview
The **HH - Card** component is designed to display individual content cards, commonly used to highlight information or serve as links to detailed content. Each card includes a content type label, heading, supporting text, a background image, and an optional associated link. Use this component when you need a visually distinct, compact way to summarize content while incorporating actionable links.

## Properties
The following fields are configured when creating an **HH - Card**:

| **Field Name**       | **Type**       | **Description**                               | **Default Value**      | **Required** |
|-----------------------|----------------|-----------------------------------------------|------------------------|--------------|
| **Content Type**      | `string`       | A label displayed prominently above the heading. This field is translatable and inline-editable. | `"Content type"`       | No           |
| **Heading**           | `string`       | The main title of the card, displayed prominently. This field is translatable and inline-editable. | `"Heading"`            | **Yes**      |
| **Supporting Text**   | `FormattedText`| Secondary text displayed below the heading, supporting rich text formatting. This field is translatable and inline-editable. | `"Supporting text"`     | No           |
| **Link**              | `SquizLink`    | A clickable link associated with the card, providing navigation to related content. | _None_                 | No           |
| **Image**             | `SquizImage`   | A background image for the card, enabling customization of the card's visual appearance. | _None_                 | No           |

### Custom Field Types
- **`FormattedText`**: Supports rich text formatting, allowing for enhanced text styling and formatting options within the content. 
- **`SquizLink`**: Provides internal or external hyperlinks, supporting anchor text, URLs, and target attributes.
- **`SquizImage`**: Enables the inclusion of images from library assets to enhance visual appeal and context.

## Conditional Logic
The **Heading** field is required, and it must always be set. The other fields are optional and independent of each other, with no additional conditional requirements.

## Named Previews
The component includes a **default preview**. This preview demonstrates an example configuration of the card, populated with placeholder data, allowing users to visualize the card's appearance and behavior. This preview uses the `example.data.json` file and wraps the output in a reference `preview.html` layout.
