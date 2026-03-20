# Functional Specification: Cards - Matrix Web Component

## Overview

The **Cards - Matrix** web component displays a responsive, grid-style layout populated with information from Squiz Matrix assets. Each card in the grid represents one Matrix asset, showcasing its key details. This component is designed for use in building flexible and visually appealing content presentations.

### Use Cases
- Displaying curated content collections, such as a list of featured articles, products, or services, fetched from Matrix.
- Creating visually intuitive user experiences for browsing and engaging with organized content.

---

## Available Properties

The `Cards - Matrix` component exposes several configurable properties through its `main` function. These properties allow for highly customizable and user-friendly configurations.

### 1. **Title**
- **Type**: `string`
- **Title**: "Title"
- **Description**: The heading displayed above the cards grid.
- **Default Value**: `Section title`
- **Required**: No
- **Additional Details**: 
  - This field is translatable.
  - Inline editable through Squiz admin tools.

---

### 2. **Link**
- **Type**: `SquizLink`
- **Title**: "Link"
- **Description**: A hyperlink displayed next to the title (usually useful for linking to all related content).
- **Default Value**: None
- **Required**: No
- **Additional Details**:
  - Inline editable through Squiz admin tools.
  - Supports standard Squiz Link behavior, which includes linking to internal or external URLs.

---

### 3. **Cards**
- **Type**: `array`
- **Title**: "Cards"
- **Description**: A list of individual card data to populate the grid. Each card corresponds to a specific Squiz Matrix asset.
- **Required**: Yes (at least 1 item is required).
- **Min Items**: 1
- **Max Items**: 8
- **Default Value**: None
- **Structure of Items**:
  - `asset`:
    - **Type**: `string`
    - **Title**: "Card"
    - **Format**: `matrix-asset-uri`
    - **Description**: A reference to a Matrix asset selected by the user.
    - **Required**: Yes

---

## Custom Field Types

The `Cards - Matrix` component has several field types that offer specialized functionality:

### 1. **SquizImage**
Although not present in the current manifest, this custom field type typically represents an image asset managed in Squiz Matrix. It allows users to select and display images directly from the Matrix asset repository.

### 2. **SquizLink**
A custom link field type designed for Squiz Matrix. It enables users to configure URLs that can link to internal Matrix assets or external URLs, depending on the configuration.

### 3. **FormattedText**
Again not present in this manifest but commonly used in other components, this represents HTML-rich text input. This allows for styling such as bold, italic, or links within text fields.

---

## Conditional Logic

### Field Dependencies
- **Cards:** The `cards` property is required and must include at least one card object (with the `asset` field being mandatory within each card). Users cannot configure the component without selecting at least one Matrix asset as a card.

There are no additional dependencies or conditional fields in this component version.

---

## Visual/Functional Variations

### Default Preview
This component includes a predefined named preview:

- **Name**: `default`
- **Configuration**:
  - Loads a sample data set (`example.data.json`) to simulate a real-world card grid.
  - Wraps the rendered grid in an HTML structure defined in `preview.html` for visual testing within a controlled environment.
  
This preview ensures developers and content creators can preview the component's layout and behavior without connecting to a live data source.

---

## Notes on Implementation

- **Responsiveness**: The cards grid is visually responsive, automatically adjusting the number of columns based on the screen size and available width.
- **Performance**: The component fetches information dynamically from referenced Matrix assets, ensuring content stays up-to-date without manual updates.
- **Versioning**: Current version is `2.1.0`, and any updates to the manifest or feature set must follow Semantic Versioning principles.

--- 

This document outlines the complete functional specification of the `Cards - Matrix` web component and provides all necessary details to configure, use, and preview the component effectively.
