# Jellyfin Liquid Glass

A dark, translucent Jellyfin web theme inspired by Apple's iOS "Liquid Glass" design: a floating glass header capsule, squircle poster cards with specular edges, a floating player OSD, and glass dialogs and menus. It also covers popular plugins.

Tested against Jellyfin **12.4** (React/MUI layout) on desktop Chromium, phone-sized screens (390×844) and a 1920×1080 TV layout with keyboard/D-pad focus. The classic `.skinHeader` layout is covered too.

## Install (production)

Jellyfin → **Dashboard → General → Custom CSS**, paste:

```css
@import url("https://idlavs.github.io/jellyfin-liquid-glass/theme.css");
```

Save, then hard-reload the web client (Ctrl+Shift+R). This URL works once the repo is pushed to `IDLAVS/jellyfin-liquid-glass` and GitHub Pages is enabled (**Settings → Pages → Deploy from a branch → `main` / root**).

## Custom background (one line)

The wallpaper behind every page without movie/show fanart comes from `--custom-bg-url`. By default it loads from your `IDLAVS/jellyfin-assets` repo through jsDelivr:

```
https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-assets@main/blackandwhite3840x2160.jpg
```

To use a different image, add **one line** under the `@import` in Custom CSS:

```css
@import url("https://idlavs.github.io/jellyfin-liquid-glass/theme.css");
:root { --custom-bg-url: url("https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-assets@main/matebook4120x4120.png"); }
```

Any file in `jellyfin-assets` works with the same pattern: `https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-assets@main/<filename>`. You can also use any other full image URL, or `none` for a plain dark background.

| Variable | Default | What it controls |
| --- | --- | --- |
| `--custom-bg-url` | `blackandwhite3840x2160.jpg` via jsDelivr | The wallpaper image. |
| `--custom-bg-overlay-opacity` | `0.45` | Darkening over the wallpaper (0 = raw image, 1 = solid dark). |
| `--custom-bg-blur` | `0px` | Frosted wallpaper, e.g. `12px`. Turned off automatically on TV/Xbox to save GPU. |

The wallpaper cross-fades away whenever fanart is showing (movie/show pages, Media Bar page backdrops) and is never drawn behind the video player.

jsDelivr caches `@main` for up to 12 hours. After replacing an image *with the same filename*, either wait or pin a commit (`@<commit-sha>` instead of `@main`).

## Local development

Serve this folder with CORS enabled and point Custom CSS at it:

```css
@import url("http://192.168.1.181:8000/theme.css");
```

`theme.css` imports the other files by relative path, so the same entry point works locally and on GitHub Pages.

## Files

| File | Contents |
| --- | --- |
| `theme.css` | Entry point. Imports the files below, plus a commented example for swapping the background. |
| `variables.css` | Custom background variables (top of file), then all design tokens (colors, blur, borders, radii, motion, focus, TV safe area, z-index). |
| `core.css` | Header (classic and MUI), drawer, cards, buttons, inputs, search, detail pages, dialogs, action sheets, MUI menus. |
| `player.css` | Floating OSD capsule, OSD header, scrubber and volume sliders, trickplay bubble, Up Next, native skip-segment button, now-playing bar. |
| `plugins.css` | Media Bar, Intro Skipper, In-Player Episode Preview, Jellyfin Enhanced, Moonfin header button. |
| `responsive.css` | Keyboard/D-pad focus rings, touch devices, phones (≤ 768px, safe areas), TV/Xbox 10-foot layout. |
| `backgrounds/` | Two optional bundled wallpapers (`abstract-blur.jpg`, `abstract-dark.jpg`). |

## Customizing

Override any variable **after** the `@import` line in Custom CSS:

```css
@import url("https://idlavs.github.io/jellyfin-liquid-glass/theme.css");

:root {
  --lg-accent: 255 159 10;   /* orange accent (space-separated RGB) */
  --lg-blur: 28px;
  --lg-radius: 14px;
}
```

| Variable | Default | What it controls |
| --- | --- | --- |
| `--lg-accent` | `10 132 255` | Accent color as RGB triplet (selected items, progress, submit buttons). |
| `--lg-bg` | `#07080b` | Page background behind backdrops. |
| `--lg-text` / `--lg-text-dim` / `--lg-text-faint` | white at 96 / 68 / 42% | Text levels. |
| `--lg-tint` | `rgba(28,28,32,.42)` | Floating chrome (header). |
| `--lg-tint-strong` | `rgba(22,22,26,.66)` | Dialogs, menus, drawer (text-heavy surfaces). |
| `--lg-tint-osd` | `rgba(18,18,22,.56)` | Player controls over live video (stays legible on bright frames). |
| `--lg-detail-dim-start` / `--lg-detail-dim-end` | black at 34% / 58% | How dark the full-page backdrop on movie/show pages is at the top of the page and once scrolled. |
| `--lg-tint-light` / `--lg-tint-hover` / `--lg-tint-active` | white at 8 / 16 / 24% | Buttons, chips, inputs and their states. |
| `--lg-tint-card` | white at 4% | Poster card fill (no blur). |
| `--lg-blur` / `--lg-blur-strong` / `--lg-blur-sm` | `24px` / `40px` / `12px` | Backdrop blur strengths. |
| `--lg-saturate` | `180%` | Vibrancy boost behind glass. |
| `--lg-border` / `--lg-border-strong` | 1px white at 14 / 22% | Specular hairline edges. |
| `--lg-highlight` / `--lg-highlight-soft` | inset top-edge glints | Simulated glass thickness. |
| `--lg-shadow-sm` / `--lg-shadow` / `--lg-shadow-lg` | soft drop shadows | Elevation. |
| `--lg-radius-xs` … `--lg-radius-lg` | `8` / `12` / `18` / `24px` | Corner radii (`--lg-radius` is cards). |
| `--lg-radius-pill` | `9999px` | Capsules. |
| `--lg-header-inset` | `10px` (`6px` on narrow screens) | Gap between the floating header and the window edge. |
| `--lg-spring` / `--lg-ease` | cubic-beziers | Springy overshoot / smooth deceleration. |
| `--lg-dur-fast` / `--lg-dur` / `--lg-dur-slow` | `160` / `280` / `460ms` | Animation durations. These are 0 with `prefers-reduced-motion`. |
| `--lg-focus-ring` | white + accent glow | Focus indicator for keyboard, remote and controller navigation. |
| `--lg-focus-scale` | `1.04` (`1.07` on TV) | How much a focused item grows. |
| `--lg-tv-safe-x` / `--lg-tv-safe-y` | `3vw` / `3vh` | Overscan margin in TV layout. |
| `--lg-z-header` / `--lg-z-osd` / `--lg-z-dialog` / `--lg-z-toast` | `1000`–`1200` | Stacking layers. |

## Performance notes

- `backdrop-filter` is used only on floating layers: header, drawer, OSD, dialogs, menus, toasts and a few small buttons.
- Poster cards use a flat translucent fill, a hairline border and a gradient specular overlay, with no blur, so long grids scroll smoothly.
- Hover lift is limited to fine-pointer devices.

## Phones, TVs and Xbox

- **Phones** (≤ 768px wide, or touch screens in landscape): the header capsule clears the notch (`env(safe-area-inset-top)`), the nav pills scroll sideways, search is a full-width pill, and the player capsule spans the screen above the home indicator. The volume slider is hidden because phones use hardware buttons.
- **Touch screens** (`hover: none`): hover effects that would stick after a tap are turned off. A short press-in scale is used instead.
- **TV / Xbox**: Jellyfin's Xbox app and **Settings → Display → Display mode: TV** add `.layout-tv`. That turns on 3% overscan margins, a larger glowing focus ring with a 1.07× lift for D-pad navigation, and lighter blur. Blur is also removed from small and scrolling elements so Xbox Edge WebView2 stays smooth.
- **Keyboard** on any device: Tab and arrow navigation show the same focus ring (`:focus-visible`), but mouse clicks don't.

## Bundled wallpapers

Two extra backgrounds ship in `backgrounds/`. To use one, set `--custom-bg-url` to its GitHub Pages URL:

```css
:root { --custom-bg-url: url("https://idlavs.github.io/jellyfin-liquid-glass/backgrounds/abstract-dark.jpg"); }
```

## Movie & show pages

The item's backdrop fills the whole window and stays fixed while you scroll, darkening a little as you go. This uses Jellyfin's own backdrop layer, so **Settings → Display → Backdrops** must be on in each browser. (That setting is stored per device.)

## Plugin notes

- **Media Bar**: glass badge, buttons, arrows and a capsule page indicator. The Play button is solid white. The dots are spread evenly across all items: with the default 50 items and 5 dots, each dot covers 10 slides. Set **Max dots** equal to **Max items** in the Media Bar settings if you want one dot per slide.
- **Intro Skipper / native media segments**: dark glass pill, raised above the floating OSD.
- **In-Player Episode Preview**: inherits glass from the action-sheet styling and is lifted so it never overlaps the OSD.
- **Jellyfin Enhanced**: launcher panel (moved below the floating header), modals, pause-screen controls and toasts.
- **Moonfin**: only the header button inside Jellyfin is styled. Moonfin's own web UI is a separate Flutter app drawn on a canvas, so CSS can't theme it.
