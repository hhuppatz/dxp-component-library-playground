```markdown
# Functional Specification: HH - Banner

## Overview
The **HH - Banner** component displays a visually compelling background element (video, image, or flat color) with a customizable heading. It is ideal for use in web pages requiring a headline combined with engaging media. Users can configure the background type and its associated details (e.g., video source or image) as well as provide a translatable heading. This component ensures flexibility by adapting its configuration options based on the selected media type.

## Properties/Fields

| **Field**      | **Title**               | **Description**                                                                   | **Type**        | **Default Value**   | **Required** | **Notes**                                                                 |
|-----------------|-------------------------|-----------------------------------------------------------------------------------|-----------------|---------------------|--------------|---------------------------------------------------------------------------|
| `mediaType`    | Media Type              | Select the type of background media: `video`, `image`, or `none`.                 | string          | `none`              | Yes          | Customizes the available background options.                                                                      |
| `heading`      | Heading                 | Enter text for the main heading.                                                  | string          | `Heading content`   | Yes          | Inline editable and translatable.                                                                                |
| `videoSource`  | Internal Video Source   | Link to the internal video asset.                                                 | SquizLink       | N/A                 | If `mediaType` = `video` | Must be provided only when `mediaType` is set to `video`.                                         |
| `image`        | Image                   | Select the image to display in the banner.                                        | SquizImage      | N/A                 | If `mediaType` = `image` | Must be provided only when `mediaType` is set to `image`.                                         |

### Custom Field Types
- **SquizImage**: Allows selection of an image asset from the system.
- **SquizLink**: Enables linking to internal system assets, such as a video file.
- **FormattedText**: Handles content with formatting options, although not utilized in this component.

## Conditional Logic
- If `mediaType` is set to `video`, the field `videoSource` (SquizLink) appears and becomes required.
- If `mediaType` is set to `image`, the field `image` (SquizImage) appears and becomes required.
- If `mediaType` is set to `none`, no additional fields appear, and only the heading is displayed with a flat background color.

## Visual/Functional Variations
This component includes two named previews:
- **Default Preview**: Displays a basic configuration using placeholder text and no media.
- **Video Preview**: Demonstrates the banner using a video background, with specified example content.

The HH - Banner component is flexible and suited for a variety of use cases, ensuring dynamic media presentation while maintaining a clean and customizable interface.
```
