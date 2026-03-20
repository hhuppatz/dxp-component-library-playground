# Functional Specification: Banner Component

## Overview

The **Banner Component** (`hh-banner`) is a versatile web component designed to create visually appealing banners with a customizable media background. It allows users to integrate a video, image, or a flat background color as the banner's background, along with a customizable heading. This component is ideal for creating attention-grabbing sectional headers or hero areas on websites.

---

## Fields and Properties

| Field         | Type          | Title                  | Description                                                   | Default Value     | Required | Conditional Logic                                   |
|---------------|---------------|------------------------|---------------------------------------------------------------|-------------------|----------|---------------------------------------------------|
| `mediaType`   | `string`      | Media Type             | Select the type of background media: video, image, or none.   | `none`            | Yes      | Determines display of `videoSource` or `image`.   |
| `heading`     | `string`      | Heading                | Text for the main heading.                                    | "Heading content" | Yes      | -                                                 |
| `videoSource` | `SquizLink`   | Internal Video Source  | Link to the internal video asset.                            | -                 | Yes*     | Required when `mediaType` is "video".             |
| `image`       | `SquizImage`  | Image                  | Select an image to display in the banner.                    | -                 | Yes*     | Required when `mediaType` is "image".             |

### Custom Field Types
- **`SquizImage`**: Represents an image asset managed within Squiz Matrix. Users can browse and select an image for the banner.
- **`SquizLink`**: Represents a link to an internal asset (e.g., a video) managed within Squiz Matrix.
- **FormattedText**: (Not applicable in this component; listed for reference) used for rich-text inputs supporting styling and formatting.

---

## Conditional Logic

- If `mediaType` is set to **"video"**, the `videoSource` field becomes required, allowing users to link an internal video.
- If `mediaType` is set to **"image"**, the `image` field becomes required, enabling selection of a banner image.
- If `mediaType` is **"none"**, neither `videoSource` nor `image` will appear.

---

## Variations and Previews

The component supports named previews:
- **Default**: Displays a banner with no media background, showcasing only the text heading.
- **Video Preview**: Demonstrates the banner with a background video sourced from `videoSource`.

These previews assist in visualizing content and ensuring intended design outputs.
