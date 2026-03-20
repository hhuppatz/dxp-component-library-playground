# Functional Specification: Banner Component

## Overview
The **Banner Component** is designed to display a visually impactful banner with a customizable background media, which can be a video, an image, or a flat background color. It is suitable for use on pages where an engaging header or promotional section is needed to highlight key content. This component ensures flexibility by supporting dynamic content and inline editing for text and media.

## Properties
| Property        | Title                     | Description                                                                 | Type         | Default Value      | Required | Notes                                                                                   |
|------------------|---------------------------|-----------------------------------------------------------------------------|--------------|--------------------|----------|-----------------------------------------------------------------------------------------|
| `mediaType`     | Media Type                | Defines the background type: "video", "image", or "none" (flat background). | `string`     | "none"             | Yes      | Options: "video", "image", "none". Determines additional fields required (see below).    |
| `heading`       | Heading                   | Text for the main heading.                                                  | `string`     | "Heading content" | Yes      | Translatable and inline editable.                                                      |
| `videoSource`   | Internal Video Source     | Link to the internal video asset.                                           | `SquizLink`  | -                  | Yes*     | Required only when `mediaType` is "video". Supports inline editing.                    |
| `image`         | Image                     | Image asset for the background.                                             | `SquizImage` | -                  | Yes*     | Required only when `mediaType` is "image". Supports inline editing.                    |

### Custom Field Types
- **SquizImage**: Selects and manages images from the Squiz Matrix asset repository.
- **SquizLink**: Links to internal assets, such as videos, within the Squiz Matrix system.
- **FormattedText**: Enables rich text editing with built-in formatting options (not used in this component).

### Conditional Logic
- If `mediaType` is set to **"video"**, the `videoSource` field becomes visible and mandatory.
- If `mediaType` is set to **"image"**, the `image` field becomes visible and mandatory.
- If `mediaType` is set to **"none"**, no additional fields appear.

## Previews (Visual Variations)
The component offers the following named previews:
1. **Default**: Flat background with the default heading.
2. **Video**: Banner with a video background, using example video data for reference.
