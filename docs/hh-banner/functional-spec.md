# Functional Specification: HH - Banner Component

## Overview

The **HH - Banner** component displays a customizable background media element, such as a video, image, or a flat background color, along with an optional heading. It is ideal for use in hero sections, promotional banners, or any area requiring a visually engaging backdrop with a key text heading.

---

## Component Properties

| Field         | Type          | Description                                                                   | Default Value     | Required |
|---------------|---------------|-------------------------------------------------------------------------------|-------------------|----------|
| **mediaType** | `string`      | Type of background media. Options: `video`, `image`, `none`.                  | `none`            | Yes      |
| **heading**   | `string`      | Text for the banner heading. Translatable and inline-editable.                | "Heading content" | Yes      |
| **videoSource** | `SquizLink` | Internal link to video asset. Field appears if `mediaType` is set to `video`. | N/A               | Yes (if `mediaType = "video"`) |
| **image**     | `SquizImage`  | Image asset for background. Field appears if `mediaType` is set to `image`.   | N/A               | Yes (if `mediaType = "image"`) |

### Custom Field Types
- **SquizImage**: Allows selection of an image asset from the Squiz Matrix system. Offers inline-editing capabilities.
- **SquizLink**: Allows internal linking to video resources within the Squiz platform.
- **FormattedText**: Not used in this component but may be available for rich text editing in similar cases.

---

## Conditional Logic

- If `mediaType` is set to `video`, the **videoSource** field becomes visible and required.
- If `mediaType` is set to `image`, the **image** field becomes visible and required.
- If `mediaType` is set to `none`, no additional fields are required beyond the mandatory **heading**.

---

## Previews

The component supports the following named previews:
- **Default**: Displays an example configuration with a placeholder heading and media type set to `none`.
- **Video**: Simulates the appearance of the banner with a video as the background.

Use the visual/functional variations to test configurations before publishing. Ensure that required fields are populated based on the selected media type.
