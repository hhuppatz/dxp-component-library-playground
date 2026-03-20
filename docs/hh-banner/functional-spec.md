# Functional Specification: Banner Component

## Overview  
The **Banner Component** (`hh-banner`) is designed to create visually striking banner elements for web pages, featuring configurable background media such as videos, images, or flat background colors. It is best suited for use in hero sections or prominent areas of a page to convey key information effectively. The component is highly customizable, with support for translatable text and inline editing of media content.  

---

## Configuration  

### Properties  
| Property Name | Type          | Title                  | Description                                                                 | Default Value     | Required   |
|---------------|---------------|------------------------|-----------------------------------------------------------------------------|-------------------|------------|
| `mediaType`   | `string`      | Media Type             | Select the type of background media: video, image, or none (flat color).    | `none`            | Yes        |
| `heading`     | `string`      | Heading                | Text for the main heading. Supports inline editing and translation.         | `Heading content` | Yes        |
| `videoSource` | `SquizLink`   | Internal Video Source  | URL to an internal video asset. Only required if `mediaType` is set to `video`. | N/A               | Conditionally |
| `image`       | `SquizImage`  | Image                  | Select an image file for the banner background. Only required if `mediaType` is set to `image`. | N/A               | Conditionally |

### Custom Field Types  
- **SquizImage**: Represents a reference to an image asset within the Squiz Matrix system. Inline editing is enabled for quick updates.  
- **SquizLink**: Specifies an internal link to a video asset stored in Squiz Matrix. Inline editing is available, allowing for direct updates.  
- **FormattedText**: Though not present in this component, supports advanced text formatting capabilities within Squiz Matrix.  

---

## Conditional Logic  
The following fields are conditionally required based on the value of `mediaType`:  
1. If `mediaType` is `video`, the `videoSource` (`SquizLink`) field becomes mandatory.  
2. If `mediaType` is `image`, the `image` (`SquizImage`) field becomes mandatory.  
If `mediaType` is `none`, only the `heading` is required, simplifying configuration.  

---

## Visual/Functional Variations  
Named previews allow content editors to visualize different configurations:  
- **Default Preview**: Displays a banner with the default heading and no media (flat background color).  
- **Video Preview**: Showcases a banner with sample video content using data from `example-video.data.json`.  

These previews provide a clear representation of expected output to ensure accuracy during implementation.
