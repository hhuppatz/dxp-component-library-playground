```markdown
# Functional Specification: Block Quote Component

## Overview
The **Block Quote** web component displays a stylized quote with an optional title and author name. It is designed for showcasing testimonials, impactful statements, or featured quotes. Use this component to highlight short, standalone text in a visually distinct format. The Block Quote supports inline editing and translations, making it suitable for multilingual websites.

## Available Properties
| Property         | Type           | Title              | Description                           | Default         | Required |
|-------------------|----------------|--------------------|---------------------------------------|-----------------|----------|
| `title`          | string         | Title              | Text displayed above the quote.       | "Section title" | No       |
| `quote`          | FormattedText  | Quote              | The main quote text.                  | N/A             | Yes      |
| `author`         | string         | Author             | Name of the quote’s author.           | "Author"        | No       |
| `favouriteCoffee`| string         | Favourite Coffee   | Placeholder for the user's coffee preference (non-functional). | "Latte" | No |

### Explanation of Field Types
- **FormattedText**: This field allows rich text formatting, such as bold, italics, and links, designed for the main quote text.
- **SquizImage**: Not applicable in this component.
- **SquizLink**: Not applicable in this component.

## Conditional Logic
- The `quote` field is always required; it determines the component's core functionality. Other fields are optional and appear even if left blank.

## Variations and Previews
The Block Quote component includes a **default preview** template, showcased with sample data (stored in `example.data.json`). This preview visually represents the title, quote, and author fields with their default values or custom user inputs. This helps content editors understand how their content will appear on the final webpage.
```
