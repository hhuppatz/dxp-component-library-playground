# Functional Specification: Block Quote Component

## Overview
The **Block Quote** component displays a quoted text with an optional title and author name. It is designed for situations where highlighted quotations or testimonials are needed, such as marketing pages, blog posts, or team introductions.

### Key Features
- Prominently showcases a quote, with optional metadata like the title and the author.
- Supports inline editing and translation for all text fields.
- Includes customizable visual styling and a default preview configuration.

---

## Component Fields

### **Title**
- **Type**: `string`
- **Description**: The optional title displayed above the quote (e.g., "Testimonial Section").
- **Default Value**: "Section title"
- **Required**: No
- **Notes**: Supports inline editing and translation.

### **Quote**
- **Type**: `FormattedText`
- **Description**: The main content of the quote to be displayed.
- **Default Value**: None
- **Required**: Yes
- **Notes**: A rich-text type for styled text. Inline-editable and translatable.

### **Author**
- **Type**: `string`
- **Description**: The name of the person who stated the quote.
- **Default Value**: "Author"
- **Required**: No
- **Notes**: Supports inline editing and translation.

### **Favourite Coffee**
- **Type**: `string`
- **Description**: An optional fun fact about the speaker, like their favorite coffee.
- **Default Value**: "Latte"
- **Required**: No
- **Notes**: Optional field for lighthearted personalization.

### Custom Field Types
- **FormattedText**: A customizable rich text field supporting styled content, ideal for multi-line quotes.

---

## Conditional Logic
There are no dynamic or conditional dependencies among fields.

---

## Previews
The component includes a **default preview** configured to render mocked data (`example.data.json`) within a styled wrapper (`preview.html`). This preview demonstrates the visual design and functionality of the Block Quote component in a typical use case. 
