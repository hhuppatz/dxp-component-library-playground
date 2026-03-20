# Functional Specification: Block Quote Component

---

## Component Overview

### Name:  
**Block Quote**

### Description:  
The Block Quote component displays a quote with the author's name, optionally accompanied by a title. This component is ideal for showcasing featured quotes, establishing emphasis on specific text, or highlighting testimonials within Squiz Matrix projects.

### Use Case:  
Use the Block Quote component when you need to present a visually appealing quote or citation, accompanied by contextual information such as an author’s name or section title.

---

## Component Properties

### General Overview  
The following properties control the appearance and content of the Block Quote component. Some fields are mandatory, while others are optional for customization.

### Fields:  

#### **Title**
- **Type**: `string`
- **Title**: Title
- **Description**: The title displayed above the quote, typically used to provide context or introduce the quote.
- **Default Value**: `"Section title"`
- **Translatable**: Yes
- **Required**: No
- **Additional UI Metadata**:  
  - Supports inline editing via the Matrix interface.

#### **Quote**  
- **Type**: `FormattedText`
- **Title**: Quote
- **Description**: The text of the quote to be displayed prominently within the component.
- **Translatable**: Yes
- **Required**: **Yes**
- **Additional UI Metadata**:  
  - Inline editable.
  - Supports rich text formatting including bold, italics, and hyperlinks.

#### **Author**  
- **Type**: `string`
- **Title**: Author
- **Description**: The name of the quoted individual or author, displayed below the quote text.
- **Default Value**: `"Author"`
- **Translatable**: Yes
- **Required**: No
- **Additional UI Metadata**:  
  - Supports inline editing via the Matrix interface.

---

## Field Types Explained

### **FormattedText**:  
A flexible rich text editor field that allows for advanced content customization, including support for formatting styles (e.g., bold, italics), rich media such as images and links, and inline HTML elements.

### **SquizImage**:  
*(Not defined in this component but applicable field type for other Squiz Matrix components)*  
A reference to an image asset within the Squiz Matrix system. Includes functionality such as resizing, captions, and alt text for accessibility.

### **SquizLink**:  
*(Not defined in this component but applicable field type for other Squiz Matrix components)*  
An interactive hyperlink field designed for linking pages, assets, or external URLs directly through the Matrix interface.

---

## Conditional Logic

### Required Fields:
- **Quote**: This field is mandatory. The Block Quote component cannot render without a quote.  
- **Title & Author**: These fields are optional. If left empty, their respective content areas will not be displayed in the rendered component.

---

## Previews and Variations

### Visual/Functional Variations:  
The Block Quote does not explicitly support named variations within the manifest, but it adheres to design principles set by custom CSS styling and layout configuration shared across Squiz Matrix components.

### Default Preview
- A preview configuration is included under the `previews` key in the manifest.  
  - **Wrapper File**: `preview.html` serves as the visual container for rendering the Block Quote in a controlled environment.  
  - **Data Source**: Example content (`example.data.json`) populates the component during preview to demonstrate rendering behavior.

---

## Version & Compatibility

### Version:  
**2.1.0**

### Compatibility:  
This component is designed for use within Squiz DXP and integrates seamlessly into the Matrix system. It adheres to the schema located at `http://localhost:3000/schemas/v1.json`.

---

## Notes

- **Inline Editing**: The component allows editors to modify content directly using Matrix’s inline editing tools, making content creation intuitive and efficient.
- **Flexible Design**: End-users can easily toggle between displaying or hiding optional properties (Title and Author) based on their needs. With rich text formatting enabled for the Quote field, there’s potential for creative expression with quote content.

--- 

End of Specification
