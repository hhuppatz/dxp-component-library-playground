# Functional Specification: Card Component

## Overview
The **Card** component is a flexible web element used for presenting structured content, such as a heading, description, and related imagery or links. It is well-suited for scenarios where uniform, visually appealing content blocks are needed, such as feature grids, product displays, or promotional calls to action. The Card offers customizable content and appearance, with options for inline editing to enhance usability.

## Properties and Fields

| **Field**         | **Type**         | **Description**                                      | **Default Value**     | **Required** |
|--------------------|------------------|------------------------------------------------------|-----------------------|--------------|
| `contentType`     | String           | Text displayed above the heading, indicating the card's type or category. | "Content type"       | No           |
| `heading`         | String           | The primary heading for the card.                   | "Heading"            | Yes          |
| `supportingText`  | FormattedText    | Descriptive text displayed below the heading. Allows rich text formatting. | "Supporting text"    | No           |
| `link`            | SquizLink        | A hyperlink associated with the card, enabling navigation to a related page or resource. | None                  | No           |
| `image`           | SquizImage       | Background image displayed for the card.            | None                  | No           |

### Custom Field Types
- **FormattedText**: Allows content creators to add formatted text (e.g., bold, italic, lists).
- **SquizLink**: Enables the selection or creation of links within Squiz Matrix, providing customizable link text and target URLs.
- **SquizImage**: Allows the selection or upload of images directly through Squiz Matrix's image management tools.

## Conditional Logic
- The `heading` field is required for the Card component to render.
- The `contentType`, `supportingText`, `link`, and `image` fields are optional, enabling flexibility in defining the card's content. If not provided, these fields will not be displayed but will not break the component's functionality.

## Previews and Variations
The component features a **default preview**, which renders a sample Card using placeholder values (e.g., "Heading," "Supporting text") to help users visualize its layout and functionality. Visual or functional variations can be achieved by populating optional fields differently, such as including or excluding the image, link, or supporting text, or by styling the card's background image through CSS.
