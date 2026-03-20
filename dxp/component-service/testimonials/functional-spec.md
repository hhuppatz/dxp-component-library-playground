# Functional Specification for Squiz Matrix Web Component: Testimonials

## Overview

### Component Name:
**Testimonials**  

### Description:
The Testimonials component displays user testimonials in a slider format. This component is ideal for showcasing customer feedback, user stories, or other client quotes in a visually engaging manner. It can be used on landing pages, product pages, or any content page where user-generated endorsements are likely to enhance audience trust.

### Namespace:
`edge-dxp-comp-lib`

### Version:
2.1.0

### Type:
Edge (`type: "edge"`)

### Core Functionality:
- Renders a slider containing one or more testimonial slides.
- Each slide contains testimonial text and an author name.
- A section title can optionally be added at the top of the component.

### Use Case:
Use this component to emphasize testimonials in a structured slider layout. It is particularly suitable for enhancing credibility and building trust on pages related to products, services, or brand identity.

---

## Properties and Fields

### **1. Section Title**
- **Title**: Section Title  
- **Type**: `string`  
- **Description**: The title displayed above the testimonials slider to introduce the section.  
- **Default Value**: `"Section Title"`  
- **Required**: No  
- **Translatable**: Yes  
- **Notes**:  
  - Inline editable in the content editor.  

### **2. Testimonials**
- **Title**: Testimonial Items  
- **Type**: `array`  
- **Description**: A list of testimonials to display in the slider, each represented as an object containing text content and author details.  
- **Min Items**: 1  
- **Max Items**: 20  
- **Required**: Yes  

#### Nested Fields (`Testimonial`):
Each testimonial includes the following properties:

##### **a. Text Content**
- **Title**: Text Content  
- **Type**: `FormattedText`  
- **Description**: The main testimonial text displayed inside a slide.  
- **Required**: Yes  
- **Translatable**: Yes  
- **Notes**:  
  - Supports rich text formatting (e.g., bold, italic, hyperlinks, etc.).
  - Inline editable in the content editor.

##### **b. Author**  
- **Title**: Author  
- **Type**: `string`  
- **Description**: Represents the name of the person or entity giving the testimonial.  
- **Default Value**: `"Author"`  
- **Required**: Yes  
- **Translatable**: Yes  
- **Notes**:  
  - Inline editable in the content editor.

---

## Understanding Custom Field Types

1. **FormattedText**:  
   A text field that supports rich formatting options such as bold, italic, hyperlinks, lists, and other styling elements. This field allows content editors to input structured text directly or edit content inline.

2. **SquizImage**:  
   This type refers to an image object in Squiz Matrix, enabling image selection from the asset library. *(Note: Not used in this component.)*

3. **SquizLink**:  
   Represents a link object in Squiz Matrix, allowing the selection of internal or external links via the asset library. *(Note: Not used in this component.)*

---

## Conditional Logic

1. The **Testimonials** field:  
   - This property is required and must include **at least one testimonial object** (`minItems: 1`).  
   - Failure to provide at least one testimonial will render the component invalid.

2. Each **Testimonial object**:  
   - Both fields **text** and **author** are required. If either field is missing, the testimonial object itself is considered invalid and will not render.

---

## Previews and Variations

### Named Previews:
- **Default Preview**:  
  Provides a simulated display of the Testimonials slider using predefined example data loaded from a file (`example.data.json`).  
  - The preview wrapper is defined in the file `preview.html` for consistent styling and layout approximation.

### Visual/Functional Variations:
The component does not explicitly define named variations apart from the default configuration. However, variations can be created programmatically by customizing:
- The section title text (`title`).
- The number and content of testimonials (`testimonials` array).
- The styling and layout, as controlled by external CSS and slider configuration settings.

---

## Output

### Response Type:
- **HTML**:  
The component outputs an HTML structure designed for web rendering, encompassing a slider element and nested testimonial items.

---

## Notes
- Content editors are encouraged to check the length of the testimonial text and author name to ensure readability and usability.
- Testimonials are placed in a slider format, but customization options for slider behavior (e.g., autoplay, slide duration) are not specified in the functional specification and must be implemented externally through CSS or JavaScript configurations.
