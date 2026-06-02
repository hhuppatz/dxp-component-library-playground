# Functional Specification: HH - Banner Component

## Overview

The **HH - Banner** web component is designed to display a customizable background media element, such as a **video**, **image**, or a **flat background color**. It is ideal for hero sections or promotional areas requiring visually engaging content combined with a text heading. The component dynamically adapts its behavior and fields based on the selected media type.

---

## Properties and Fields

| Field         | Type        | Title                   | Description                                                                 | Default Value     | Required | Notes                                                                 |
|---------------|-------------|-------------------------|-----------------------------------------------------------------------------|-------------------|----------|-----------------------------------------------------------------------|
| `mediaType`   | `string`    | Media Type              | Defines the type of background media: **video**, **image**, or **none**.    | `none`            | Yes      | Options: `"video"`, `"image"`, `"none"`. Determines appearance and required fields. |
| `heading`     | `string`    | Heading                 | Text displayed as the banner's title or heading.                            | `"Heading content"`| Yes      | Translatable and inline editable.                                    |
| `videoSource` | `SquizLink` | Internal Video Source   | A link to the selected internal video asset.                                | None              | Yes (if `mediaType` is `"video"`) | Supports inline editing.                                              |
| `image`       | `SquizImage`| Image                   | The image asset to display in the banner.                                   | None              | Yes (if `mediaType` is `"image"`) | Supports inline editing.                                              |

**Custom Field Types:**
- **SquizImage**: A file picker input to select an image from the library.
- **SquizLink**: A link picker for referencing internal assets within Squiz Matrix.
- **FormattedText**: Rich text-entry fields supporting limited HTML-like formatting (**no custom fields use this at present**).

---

## Conditional Logic

- If `mediaType` is set to `"video"`, the `videoSource` field becomes required and must reference an internal video asset.
- If `mediaType` is set to `"image"`, the `image` field becomes required, allowing selection of an image.
- If `mediaType` is `"none"`, no additional fields are required.

---

## Previews

The component supports multiple named previews for developers and content editors:
- **Default Preview**: Uses example content with no background media.
- **Video Preview**: Demonstrates the component with a sample video file as the background.

These previews allow stakeholders to visualize the component in different contexts and configurations.
