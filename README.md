<div align="center">

# 🪞 Liquid Glass for Jellyfin 12.2

**An Apple-inspired Liquid Glass theme: vibrancy, frosted glass and specular highlights, built for modern Jellyfin 12.2.**

![Jellyfin 12.2+](https://img.shields.io/badge/Jellyfin-12.2%2B-00a4dc?style=flat-square&logo=jellyfin&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-stylesheet-1572b6?style=flat-square&logo=css3&logoColor=white)
![jsDelivr CDN](https://img.shields.io/badge/CDN-jsDelivr-ff5627?style=flat-square&logo=jsdelivr&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## ✨ Features

- **Apple Liquid Glass aesthetic**: translucent surfaces, deep frosted blur, crisp 1px edge borders and inner specular highlights on the header, drawer, dialogs, cards and player.
- **12.x backdrop handling**: the dynamic backdrop is suppressed on the home screen and kept, softly masked, on item detail pages, so backdrops don't stack on top of your wallpaper.
- **High-blur media cards**: rounded glass cards that lift on hover with a glowing edge.
- **Custom background support**: the wallpaper is a single CSS variable. Point it at any image.
- **Layout-safe**: the theme only changes visuals. It does not touch `display`, `position`, `height` or margins of Jellyfin's page containers or the Media Bar.
- **System fonts only**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`. No web fonts are loaded.

## 🔌 Compatibility

| Plugin | Status | What the theme does |
| --- | --- | --- |
| [Media Bar](https://github.com/IAmParadox27/jellyfin-plugin-media-bar) | ✅ Styled | Preserved top flow: layout properties are untouched. Adds 18px rounded edges and soft side vignettes. |
| [Jellyfin Enhanced](https://github.com/n00bcodr/Jellyfin-Enhanced) | ✅ Styled | Panels, drawers and modals use the translucent glass palette. |
| [Moonfin](https://github.com/Moonfin-Client) | ✅ Styled | Sidebars and drawers use the translucent glass palette. |
| [Intro Skipper](https://github.com/intro-skipper/intro-skipper) | ✅ Styled | Floating glass pill skip buttons with a glowing hover border. |
| In-Player Episode Preview | ✅ Styled | Frosted scrubbing thumbnails with inner borders and high blur. |

> **Note:** plugin support is selector-based. Plugins change their markup between releases, so if one looks unstyled on your version, please [open an issue](https://github.com/IDLAVS/jellyfin-liquid-glass/issues) with the element's class or ID from your browser's inspector.

## 🚀 Quick Start

1. Open Jellyfin Web and log in as an administrator.
2. Go to **Dashboard → General → Custom CSS**.
3. Paste the following snippet:

   ```css
   @import url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/liquid-glass-12.2.css');
   ```

4. Click **Save**, then hard-refresh your browser (`Ctrl+Shift+R`, or `Cmd+Shift+R` on macOS).

## 🎛️ Customization

Override any variable in the same **Custom CSS** box, **after** the `@import` line. Later rules win, so your values replace the theme's defaults without editing the stylesheet.

```css
@import url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/liquid-glass-12.2.css');

:root {
    /* Override default background with your own image */
    --custom-bg: url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-assets@main/blackandwhite3840x2160.jpg');

    /* Optional: Adjust glass blur strength */
    --glass-blur: blur(28px) saturate(190%);
}
```

### Variables

| Variable | Default | Description |
| --- | --- | --- |
| `--custom-bg` | `url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-assets@main/blackandwhite3840x2160.jpg')` | Wallpaper image, rendered fixed and covering the viewport. |
| `--glass-blur` | `blur(24px) saturate(180%)` | The `backdrop-filter` applied to every glass surface. |
| `--card-radius` | `16px` | Corner radius of cards, dialogs and panels. Buttons (12px) and pills (9999px) are fixed. |
| `--apple-accent` | `#0a84ff` | Accent color for primary buttons, focus rings, progress bars and sliders. |
| `--glass-base` | `rgba(20, 20, 26, 0.55)` | Translucent base color of glass surfaces. Raise the alpha for more opaque panels. |

## 🧹 Clearing the jsDelivr cache

jsDelivr caches files from `@main` for a while. After you push a change to your own fork, purge the cache so clients get the new file right away:

```bash
curl -i https://purge.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/liquid-glass-12.2.css
```

Replace `IDLAVS/jellyfin-liquid-glass` with your own `user/repo` if you forked the theme. A response with `"status": "finished"` means the purge worked. Then hard-refresh Jellyfin. Pinning to a tag or commit (`@v1.0.0`, `@<sha>`) avoids the cache problem entirely.

## 📄 License

Released under the [MIT License](LICENSE).
