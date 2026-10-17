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
- **Bring your own wallpaper**: the theme ships without a background image. You add a short snippet with a link to your favorite image (see below).
- **Floating glass header**: no full-width bar. The nav is a centered glass pill and the icon buttons are a joined pill on the right.
- **Tab pill on library pages**: on screens 1200px and wider, the Movies/TV views (Suggestions, Favorites, Collections, Genres) appear as a centered tab pill with a flat icon row underneath.
- **Movies, TV and detail pages**: rounded bordered posters with centered captions, a slim glass A-Z pill, and a full-screen backdrop on item pages with a centered logo, info, buttons and overview (desktop).
- **Layout-safe**: the theme only changes visuals. It does not touch `display`, `position`, `height` or margins of Jellyfin's page containers, and it does not style the Media Bar at all.
- **System fonts only**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`. No web fonts are loaded.

## 🔌 Compatibility

| Plugin | Status | What the theme does |
| --- | --- | --- |
| [Media Bar](https://github.com/IAmParadox27/jellyfin-plugin-media-bar) | ✅ Left alone | Preserved top flow: the theme adds no rules for `#slides-container`, so the plugin controls its own layout. |
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
   @import url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@v1.3.1/liquid-glass-12.2.css');
   ```

4. Click **Save**, then hard-refresh your browser (`Ctrl+Shift+R`, or `Cmd+Shift+R` on macOS).

Without a wallpaper you get a plain dark background. To add your own, continue below.

## 🖼️ Add your own wallpaper

The wallpaper is not part of the theme. Copy this small snippet **below** the `@import` line and replace the link with your image:

```css
@import url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@v1.3.1/liquid-glass-12.2.css');

:root {
    --custom-bg: url('https://cdn.jsdelivr.net/gh/YOUR-USER/YOUR-REPO@main/your-image.jpg');
}
```

### Getting a link from a GitHub repo

Use a direct image link, not the normal GitHub page link (`github.com/.../blob/...` is an HTML page and will not load as a background).

| Link type | Format |
| --- | --- |
| jsDelivr (recommended) | `https://cdn.jsdelivr.net/gh/USER/REPO@BRANCH/path/to/image.jpg` |
| GitHub raw | `https://raw.githubusercontent.com/USER/REPO/BRANCH/path/to/image.jpg` |

Example: an image at `github.com/IDLAVS/jellyfin-assets/blob/main/blackandwhite3840x2160.jpg` becomes

```css
--custom-bg: url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-assets@main/blackandwhite3840x2160.jpg');
```

jsDelivr serves files up to 50 MB. A 3840×2160 JPEG at roughly 80% quality is usually well under that and looks sharp on 4K screens.

## 🎛️ Customization

Override any variable in the same **Custom CSS** box. Put your overrides **after** the `@import` line so they take precedence.

```css
@import url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@v1.3.1/liquid-glass-12.2.css');

:root {
    /* Your wallpaper */
    --custom-bg: url('https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-assets@main/blackandwhite3840x2160.jpg');

    /* Optional: Adjust glass blur strength */
    --glass-blur: blur(28px) saturate(190%);
}
```

### Variables

| Variable | Default | Description |
| --- | --- | --- |
| `--custom-bg` | not set (Jellyfin's default background) | Wallpaper image, rendered fixed and covering the viewport. Use `url('...')`. `--bgImage` is accepted as an alias. |
| `--glass-blur` | `blur(24px) saturate(180%)` | The `backdrop-filter` applied to every glass surface. |
| `--card-radius` | `16px` | Corner radius of cards, dialogs and panels. Buttons (12px) and pills (9999px) are fixed. |
| `--apple-accent` | `#0a84ff` | Accent color for primary buttons, focus rings, progress bars and sliders. |
| `--glass-base` | `rgba(20, 20, 26, 0.55)` | Translucent base color of glass surfaces. Raise the alpha for more opaque panels. |

## 📝 Notes on the Jellyfin 12.2 layout

- In Jellyfin 12.2 the library views (Suggestions, Favorites, Collections, Genres) are a dropdown menu. On screens 1200px and wider the theme reveals that menu in place as a tab pill (it is the same menu, so clicking works as normal). Below 1200px the header wraps and the dropdown button is shown as a pill instead.
- On desktop item pages the poster is hidden and the logo replaces the title (episodes keep their title). The wallpaper is replaced by solid dark on item pages so the backdrop fades out cleanly.
- The header and page design is inspired by [GlassFin](https://github.com/KBH-Reeper/GlassFin). No GlassFin code is used here.

## 🛠️ Troubleshooting

**The Media Bar is in the middle of the page and I have to scroll to see it.**
The theme does not style or position the Media Bar, so first find out whether the theme is involved:

1. Temporarily remove the `@import` line from Custom CSS, save, and hard-refresh. If the Media Bar is still low, the cause is the plugin or another Custom CSS block. Check for leftover Media Bar CSS (for example `#slides-container { margin-top: -50vw; }` or `.homeSectionsContainer { top: ... }`) and remove it. Recent plugin versions load their own CSS and need none of that.
2. If the Media Bar is fine without the theme, [open an issue](https://github.com/IDLAVS/jellyfin-liquid-glass/issues) and include the output of this snippet, run in the browser console on the home page:

   ```js
   const c = document.querySelector('#slides-container');
   console.log(getComputedStyle(c).position, c.getBoundingClientRect().top, getComputedStyle(c).marginTop, innerHeight);
   ```

## 🧹 Clearing the jsDelivr cache

jsDelivr caches `@main` for up to 12 hours, and **browsers cache it for up to 7 days**, so a purge alone won't update a browser that already has the old file. After you push a change to your own fork, purge the cache so clients get the new file right away:

```bash
curl -i https://purge.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/liquid-glass-12.2.css
```

Replace `IDLAVS/jellyfin-liquid-glass` with your own `user/repo` if you forked the theme. A response with `"status": "finished"` means the purge worked. Then hard-refresh Jellyfin. That is why the install snippet pins a release tag (`@v1.3.1`): a tag never changes, so you always get exactly that version. To update, change the tag in your snippet to the newest one under [Releases](https://github.com/IDLAVS/jellyfin-liquid-glass/tags).

## 📄 License

Released under the [MIT License](LICENSE).
