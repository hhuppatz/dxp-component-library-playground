```markdown
# Functional Specification: Banner Component

## Overview
### Component Purpose
The **Banner Component** is a customizable web component designed to display a visually impactful banner with a background media element. This can include a video, an image, or a flat background color. The component is used to highlight key content or messages on a webpage, such as promotional announcements, headers, or hero sections.

The **Banner Component** offers flexibility with conditional properties, allowing content editors to tailor the visual presentation based on the selected `mediaType`. It is simple to configure and supports inline editing for certain fields.

### When to Use
Use the **Banner Component** when you need to:
- Highlight key content with a prominent banner.
- Display dynamic or static background media, such as videos or images.
- Customize the banner layout and content based on specific needs (e.g., media-driven theme).

---

## Component Properties: Fields and Descriptions

The component's input properties are detailed below, describing their types, default values, and whether they are required.

### Common Fields
| **Property**      | **Title**          | **Description**                                                   | **Type**      | **Default Value**    | **Required** |
|--------------------|--------------------|-------------------------------------------------------------------|---------------|-----------------------|--------------|
| `mediaType`       | Media Type         | Select the type of background media: video, image, or none.       | string        | `none`               | Yes          |
| `heading`         | Heading            | Specifies the heading text to display on the banner. Can be localized and edited inline. | string | `"Heading content"` | Yes |

### Conditional Fields
The following fields become available and/or required based on the chosen `mediaType`. 

#### When `mediaType` is `video`
| **Property**      | **Title**                | **Description**                                               | **Type**      | **Default Value**    | **Required** |
|--------------------|--------------------------|---------------------------------------------------------------|---------------|-----------------------|--------------|
| `videoSource`     | Internal Video Source    | Provide a link to the internal video asset to display in the background. Supports inline editing. | SquizLink | N/A                   | Yes          |

#### When `mediaType` is `image`
| **Property**      | **Title**      | **Description**                                                   | **Type**      | **Default Value**    | **Required** |
|--------------------|----------------|-------------------------------------------------------------------|---------------|-----------------------|--------------|
| `image`           | Image          | Select an image to display in the banner. Supports inline editing. | SquizImage   | N/A                   | Yes          |

---

## Custom Field Types

The Banner Component uses the following custom field types for enhanced functionality and integration:

### 1. `SquizImage`
   - Represents an image field that allows users to choose an image asset from the Squiz Matrix Digital Experience Platform (DXP).
   - Supports inline editing, enabling users to update the image within the content editing interface.

### 2. `SquizLink`
   - Represents a link field that allows users to link to an internal video or other assets within the Squiz platform.
   - Supports inline editing for convenient updates directly in the content editing interface.

### 3. `FormattedText`
   - Although not used in this manifest, this field type allows for rich text formatting, such as bold, italic, and hyperlinks. It is useful for larger text fields requiring more styling flexibility.

---

## Conditional Logic

The behavior of the Banner Component changes depending on the value of the `mediaType` property:
- **Media Type: `video`**
  - The `videoSource` field appears and becomes required.
- **Media Type: `image`**
  - The `image` field appears and becomes required.
- **Media Type: `none`**
  - Neither `videoSource` nor `image` fields are displayed or required. The banner will display with a flat background color.

---

## Visual and Functional Variations (Named Previews)

The Banner Component supports named previews to visualize its functionality in various states during development and testing:

### 1. **Default Preview**
- **Description:** Displays the banner with the default configuration, using a heading and flat background color.
- **Preview Config:** Loaded from `./example-data/example.data.json`.

### 2. **Video Preview**
- **Description:** Displays the banner with a video background, including a provided sample video source.
- **Preview Config:** Loaded from `./example-data/example-video.data.json`.

---

## Summary

The **Banner Component** provides a flexible solution for creating visually striking banners with customizable background media. Its conditional logic ensures a streamlined editing experience, presenting only the options relevant to the selected `mediaType`. Inline editing for key fields further simplifies content updates. By leveraging Squiz-specific field types, this component ensures tight integration and ease of configuration within the Squiz Matrix platform.

This component is suitable for a variety of use cases, from simple banners with headings to complex designs incorporating video or image backgrounds.
```
