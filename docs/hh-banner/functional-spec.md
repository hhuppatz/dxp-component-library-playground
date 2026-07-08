```markdown
# Functional Specification: HH - Banner Component

## Overview
The **HH - Banner** component displays a customizable banner with a background media element (video, image, or a flat background color) and a prominent heading. It is ideal for drawing attention to key content, providing visual context, or enhancing the aesthetics of a page. The component dynamically adjusts its fields based on the chosen media type.

---

## Available Properties/Fields

| **Property**   | **Title**              | **Description**                                              | **Type**       | **Default Value** | **Required** |
|-----------------|------------------------|--------------------------------------------------------------|----------------|-------------------|--------------|
| `mediaType`    | Media Type             | The type of background media: `video`, `image`, or `none`.   | `enum`         | `none`            | Yes          |
| `heading`      | Heading                | Text for the main heading.                                   | `string`       | "Heading content" | Yes          |
| `videoSource`  | Internal Video Source  | Link to the video asset (required if `mediaType` is `video`). | `SquizLink`    | None              | Conditional  |
| `image`        | Image                  | Image asset (required if `mediaType` is `image`).            | `SquizImage`   | None              | Conditional  |

### Field Types:
- **SquizImage**: Allows users to select an image from the asset library.
- **SquizLink**: Allows users to add a link to an internal video asset.
- **FormattedText** (not directly included): Custom text editor for adding formatted content.

---

## Conditional Logic
- If `mediaType` is set to `video`, the `videoSource` field becomes required, allowing users to specify an internal video asset.
- If `mediaType` is set to `image`, the `image` field becomes required to select an asset.
- If `mediaType` is `none`, no additional fields are needed.

---

## Component Variations
- **Default**: Displays a banner with a heading and no background media.
- **Video Preview**: Demonstrates the banner configuration with a video as the background.

These variations are available in the Squiz preview environment for testing and design purposes.
```
