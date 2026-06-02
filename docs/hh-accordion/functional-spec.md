# Functional Specification: HH - Accordion

## Overview
The **HH - Accordion** component is a collapsible content display designed to show a list of headings with hidden related content. Users can expand each heading to view its associated content. This component is ideal for structuring content-rich pages, FAQs, or cases where selective content visibility enhances user experience.

## Properties/Fields
### General Properties
1. **`title`**  
   - **Type**: `string`  
   - **Description**: The title displayed above the accordion component.  
   - **Default Value**: `"Section title"`  
   - **Required**: No  
   - **Translatable**: Yes  

2. **`accordion`**  
   - **Type**: `array`  
   - **Description**: A list of accordion items, each containing a heading and content.  
   - **Default Value**: None  
   - **Required**: Yes  
   - **Min/Max Items**: Minimum 1, Maximum 20  

### Accordion Item Properties
Each accordion item has two required fields:  
1. **`heading`**  
   - **Type**: `string`  
   - **Description**: The heading of the accordion item.  
   - **Default Value**: `"Heading content"`  
   - **Required**: Yes  
   - **Translatable**: Yes

2. **`content`**  
   - **Type**: `FormattedText`  
   - **Description**: Hidden content displayed when the accordion item is expanded.  
   - **Required**: Yes  
   - **Translatable**: Yes  
   - **Details**: `FormattedText` is a rich text field supporting HTML and inline editing within the Squiz Matrix interface.

## Conditional Logic
The `accordion` field is a required group. Each accordion item must include both the `heading` and `content` fields. The component requires at least one item to render, and a maximum of 20 items can be specified.

## Named Previews
The HH - Accordion includes a default preview titled "example.data.json," allowing users to see the component as rendered in a demo layout. It uses "preview.html" as its wrapper.

This component offers a versatile layout for displaying expandable content, with customizable fields and inline editing options for seamless content creation.
