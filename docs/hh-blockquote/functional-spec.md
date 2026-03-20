# Functional Specification: HH - Block Quote

## Overview
The **HH - Block Quote** web component is designed to display a styled quotation along with the author's name and an optional title. It is ideal for use in cases where you want to highlight a quote for emphasis, such as testimonials, key statements, or inspirational messages. This component facilitates enriched content presentation with customizable fields and translatable options.

## Fields and Properties
The component accepts the following configurable fields:
- **Title**  
  - **Type**: `string`  
  - **Description**: Displays a header above the quote.  
  - **Default Value**: `"Section title"`  
  - **Required**: No  
  - **Custom Features**: Supports inline editing and translation.

- **Quote**  
  - **Type**: `FormattedText`  
  - **Description**: The main text of the quote.  
  - **Default Value**: None (must be provided by the user).  
  - **Required**: Yes  
  - **Custom Features**: Supports formatted rich text, inline editing, and translation.

- **Author**  
  - **Type**: `string`  
  - **Description**: The name of the quote's author.  
  - **Default Value**: `"Author"`  
  - **Required**: No  
  - **Custom Features**: Supports inline editing and translation.

- **Favourite Coffee**  
  - **Type**: `string`  
  - **Description**: An unrelated field for illustrative purposes, allowing the user to input their preferred coffee type.  
  - **Default Value**: `"Latte"`  
  - **Required**: No  
  - **Custom Features**: Supports inline editing and translation.

### Custom Field Types Explained
- **FormattedText**: A rich text field allowing options for formatting such as bold, italic, links, or lists. It enhances the display of the quote content.  
- **SquizImage**: Handles image uploads. *(Note: Not utilized in this component.)*  
- **SquizLink**: Manages hyperlink inputs. *(Note: Not utilized in this component.)*

### Conditional Logic
The `quote` field is required and must always be populated for the component to render correctly. No additional fields become required or appear conditionally based on other inputs.

## Previews and Visual Variations
A single **default preview** is available. It uses example data (`example.data.json`) and a preview wrapper file (`preview.html`) to display the component's standard layout. The default preview highlights the field configurations in a responsive and styled block quote format with the title, quote, and author shown prominently.
