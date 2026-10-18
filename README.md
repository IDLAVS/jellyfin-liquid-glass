<div align="center">

# Liquid Glass for Jellyfin 12.2

**A translucent, frosted-glass theme for the Jellyfin web client.**
Floating glass header, blurred menus and dialogs, rounded glass cards, and ready-made styling for the plugins people actually run.

![Jellyfin 12.2](https://img.shields.io/badge/Jellyfin-12.2-00a4dc?style=flat-square&logo=jellyfin&logoColor=white)
![Pure CSS](https://img.shields.io/badge/pure-CSS-1572b6?style=flat-square&logo=css3&logoColor=white)
![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-ff5627?style=flat-square&logo=jsdelivr&logoColor=white)
![MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)

</div>

---

## What it looks like

Liquid Glass turns Jellyfin's flat surfaces into layered glass panes over your wallpaper:

- **Floating header.** The bar disappears. Your library buttons become one centred glass pill and the icons (sync, cast, search, avatar) a second pill on the right. Library pages get a tab pill and a flat row of sort/filter icons.
- **Frosted surfaces.** Menus, dialogs, action sheets, the mobile drawer, tooltips, toasts, the now-playing bar and the video OSD share one blurred pane with a thin specular edge.
- **Glass cards.** Rounded posters with a hairline edge that lift and glow on hover. Cast photos keep their native round shape.
- **Your wallpaper.** Bring any image; the theme dims and optionally blurs it, and hands over cleanly to Jellyfin's own backdrops on movie and show pages.
- **Everything tunable.** Blur, glass opacity, tint, accent colour and corner radius are plain CSS variables (see [Customisation](#customisation)).

No JavaScript, no web fonts, no images: one stylesheet.

## Install

1. Sign in to Jellyfin as an administrator.
2. Open **Dashboard → General → Custom CSS code**.
3. Paste:

   ```css
   @import url("https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/theme.css");
   ```

4. **Save**, then hard-refresh every open client (`Ctrl+Shift+R`, `Cmd+Shift+R` on macOS).

Prefer to apply it to one account only? Paste the same line into **User menu → Settings → Display → Custom CSS code**.

> **Updates and caching.** jsDelivr caches `@main` for up to 12 hours. To pull a change immediately, open
> `https://purge.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/theme.css` once, then hard-refresh.
> For a version that never changes under you, replace `@main` with a release tag from the
> [Releases](https://github.com/IDLAVS/jellyfin-liquid-glass/releases) page.

## Recommended client settings

| Where | Setting | Why |
| --- | --- | --- |
| Settings → Display | **Theme: Dark** | The glass palette is dark-only. In Light mode the theme still forces its dark palette, but Jellyfin's own light-mode assets can look out of place. |
| Settings → Display | **Backdrops: off** (if you use a wallpaper) | With Backdrops on, Jellyfin shows rotating artwork behind the home and library pages and that artwork takes priority over your wallpaper there. Off gives you your wallpaper on every page. Item pages draw their own banner either way. |
| Settings → Display | **Display mode: Auto** (or Desktop) | The header pills are designed for the Auto/Desktop/Mobile layouts. The legacy **TV** layout does not use the new header and is not styled. |
| Settings → Home | Remove sections you don't use | Fewer rows means fewer blurred layers and a smoother scroll. |
| Browser | Chrome / Edge **105+**, Firefox **121+**, Safari **16+** | The theme uses `:has()`. Everything else degrades gracefully; see [Compatibility](#browser-support). |
| Browser | Hardware acceleration **on** | `backdrop-filter` is GPU-composited. With it off, blur is slow in every browser. |

## Compatibility

| Component | Status | What the theme does |
| --- | --- | --- |
| **Jellyfin 12.2** (web client) | Supported | Targets the MUI header, drawer, menus and dialogs, the new card overlay buttons and the detail-page layout. Uses Jellyfin's `--jf-palette-*` variables instead of generated class names. |
| **[Media Bar](https://github.com/IAmParadox27/jellyfin-plugin-media-bar)** | Supported | Transparent to layout: the theme never changes the page's top spacing, so the plugin's own offset measurement lines the bar up with the header. A masked base layer stops the wallpaper showing through during slide cross-fades. Buttons, arrows and dots become glass. |
| **[Intro Skipper](https://github.com/intro-skipper/intro-skipper)** | Supported | Styles Jellyfin's native `.skip-button` (what current Intro Skipper relies on) and the legacy `#skipIntro` / `#skipCredits`. Position is untouched; the container is `overflow: visible` so the glow is never clipped. |
| **[In-Player Episode Preview](https://github.com/Namo2/InPlayerEpisodePreview)** | Supported | The popup panel gets a stronger glass pane. Its thumbnails are real Jellyfin cards, so they pick up the glass card style automatically. The dimmer behind it is deliberately not blurred, to keep video playback smooth. |
| **[Jellyfin Enhanced](https://github.com/n00bcodr/Jellyfin-Enhanced)** | Supported | Overrides the settings panel's inline paint (background, border, blur) without touching its inline positioning. Seerr/Arr link icons are left to the plugin. |
| **[Moonfin](https://github.com/Moonfin-Client/Plugin)** (Moonbase plugin) | Supported | Styles the header button the plugin adds to the stock web client. The Moonfin web app at `/Moonfin/Web/` is a separate page that this CSS is not loaded into, so there is no sidebar for the theme to collide with. |

**How "supported" was established.** Selectors were taken from each plugin's published source and from Jellyfin's `jellyfin-web` card markup, the stylesheet was parsed with three independent parsers (including Chromium's), and a mock of the Jellyfin 12 DOM was rendered in Chromium 152. It has **not** yet been run against a live Jellyfin 12.2 server with every plugin installed. If something looks off on your setup, please [open an issue](https://github.com/IDLAVS/jellyfin-liquid-glass/issues) with a screenshot and the element's class or ID from your browser's inspector.

### Browser support

| Engine | Blur | Notes |
| --- | --- | --- |
| Chromium (Chrome, Edge, Android WebView, Electron clients) | Yes | The reference engine. |
| Firefox | Yes (103+) | `:has()` features need 121+; on older versions only those enhancements are skipped. |
| Safari / iOS / the Jellyfin iOS app | Yes | Uses the `-webkit-backdrop-filter` prefix, which WebKit still requires. |
| Anything without `backdrop-filter` | No | Glass automatically becomes nearly opaque so text stays readable. |

Also respected: *Reduce transparency*, *Reduce motion* and high-contrast modes.

## Customisation

Add overrides **below** the `@import` line, in the same Custom CSS box:

```css
@import url("https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/theme.css");

:root {
  --lg-blur-radius: 32px;       /* stronger frost */
  --lg-glass-opacity: 0.4;      /* more see-through */
  --lg-accent-rgb: 255 159 10;  /* orange accent */
}
```

| Variable | Default | Meaning |
| --- | --- | --- |
| `--lg-accent-rgb` | `10 132 255` | Accent colour as an `R G B` triplet (spaces, no commas, no `rgb()`). |
| `--lg-glass-tint` | `20 20 26` | Colour of the glass, as `R G B`. |
| `--lg-glass-opacity` | `0.55` | How solid the glass is, `0` to `1`. Lower is clearer. |
| `--lg-blur-radius` | `24px` | Blur strength. |
| `--lg-blur-saturation` | `180%` | Colour boost of what shows through the glass. |
| `--lg-card-radius` | `16px` | Corner radius of cards and panes. |
| `--lg-button-radius` | `12px` | Corner radius of buttons and inputs. |
| `--lg-header-idle-opacity` | `0.85` | Header pill opacity on backdrop pages until hovered. |
| `--lg-header-icon-size` | `38px` | Size of the round header icons; the avatar matches it. |
| `--lg-mediabar-base` | `rgb(8 8 12)` | Solid layer behind Media Bar slides. `transparent` turns it off. |
| `--lg-wallpaper` | `none` | Wallpaper image. See below. |
| `--lg-wallpaper-brightness` | `0.65` | `1` is the original image, `0` is black. |
| `--lg-wallpaper-blur` | `0px` | Blur applied to the wallpaper itself. |

## Custom wallpaper

The theme ships without an image. Set one with `--lg-wallpaper`:

```css
@import url("https://cdn.jsdelivr.net/gh/IDLAVS/jellyfin-liquid-glass@main/theme.css");

:root {
  --lg-wallpaper: url("https://example.com/wallpapers/aurora.jpg");
  --lg-wallpaper-brightness: 0.55;   /* darker = more legible text */
  --lg-wallpaper-blur: 6px;          /* optional softening */
}
```

Tips:

- **Use a full `https://` URL.** Relative paths resolve against the stylesheet, not your server, and won't load.
- The image must be reachable from the *browser*, not just the server. A file on a LAN-only host will not show on other networks.
- Use a large (1920×1080 or bigger) image, ideally under 500 KB, so first paint is quick. JPEG or WebP.
- The wallpaper sits underneath everything Jellyfin draws, so it can never cover the video player. It shows wherever Jellyfin's own layers are clear. If Settings → Display → **Backdrops** is on, Jellyfin's backdrop artwork is drawn over the wallpaper on the pages that use it.
- Moving from v1? `--custom-bg` and `--bgImage` still work and are used when `--lg-wallpaper` is not set.

## Upgrading from v1

The theme was rewritten for Jellyfin 12.2. The old URL (`…/liquid-glass-12.2.css`) keeps working through a one-line shim, but a few variable names changed:

| v1 | Now |
| --- | --- |
| `--apple-accent: #0a84ff` | `--lg-accent-rgb: 10 132 255` |
| `--glass-base: rgba(…)` | `--lg-glass-tint` + `--lg-glass-opacity` |
| `--glass-blur: blur(24px) saturate(180%)` | `--lg-blur-radius` + `--lg-blur-saturation` |
| `--card-radius` | `--lg-card-radius` |
| `--custom-bg`, `--bgImage` | unchanged, or use `--lg-wallpaper` |

The full-screen item-page redesign from v1 (fixed-offset logo and poster positions) is gone. It depended on magic numbers that broke whenever Jellyfin changed the header height. Item pages now use Jellyfin's own layout with glass styling.

## What changed for Jellyfin 12

| Area | Jellyfin 10.x / 11.x | Jellyfin 12 | In this theme |
| --- | --- | --- | --- |
| Header | `.skinHeader` / `.headerTabs` | Fixed MUI `.MuiAppBar-root` with a spacer after it | Bar made invisible; its groups float as pills. Spacer kept. |
| Colours | Jellyfin CSS variables | MUI `--jf-palette-*` | Palette bridged in one block. |
| Drawer | `.mainDrawer` everywhere | `.MuiDrawer-paper` (narrow screens); `.mainDrawer` only in the dashboard | Both styled. |
| Menus / dialogs | `.dialog`, `.actionSheet` | `.MuiMenu-paper`, `.MuiPopover-paper`, `.MuiDialog-paper` | Both families share one pane. |
| Card buttons | `<button is="paper-icon-button-light">` | MUI icon buttons in `.cardOverlayButton-br` | Both styled. Resume bar: `.itemLinearProgress`. |
| Backdrop | Toggled with page state | `.backgroundContainer.withBackdrop` + `.backdropContainer` | Cross-fades; nothing keyed to page state. |
| Item details | Single column | Needs a two-column grid on desktop | Community fix from [GlassFin #35](https://github.com/KBH-Reeper/GlassFin/issues/35), made robust. |

### Regressions fixed

- **Card hover ghosting.** Jellyfin already scales a *focused* card; a mouse click left that scale stuck while our hover lift moved another card. Hover now uses the independent `translate` property, focus scaling is limited to keyboard/remote focus, per-card `backdrop-filter` is gone, only specific properties transition, and hover styles are limited to devices that can hover.
- **Backdrop flash on movie/show pages.** The flash came from rules keyed to `body:has(.itemDetailPage:not(.hide))`, which flips twice during a route change. The mask is now permanent and every change that follows `.withBackdrop` is a cross-fade.
- **Header hover shift** (reported in #35). Hover used to add a border to icon buttons, growing them and nudging the library grid down. Hover now only changes colour and shadow.
- **A-Z picker clipped at the bottom** (#35). Centred vertically and capped to the viewport.
- **Wallpaper covering the video / missing on the home page.** The first release painted the wallpaper inside `.backgroundContainer`. Jellyfin makes that container transparent during playback, but a layer inside it kept painting over the video. The wallpaper now lives underneath the whole UI (`html::before`, `z-index: -2`), so it cannot cover anything.
- **Avatar too small in the header.** Jellyfin's avatar is 40px in a padding-free button; the theme shrank it to 28px. All header icon buttons and the avatar now share one size (`--lg-header-icon-size`).
- **No blur on iPad / iOS.** Every blur ships both `backdrop-filter` and `-webkit-backdrop-filter`.
- **Fragile selectors.** No rule targets generated Emotion classes (`.css-1iogify` and friends), which change between Jellyfin builds. The audit script fails the build if one slips in.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Nothing changed | Hard-refresh; if using `@main`, purge the CDN (see Install). Check the Custom CSS box saved. |
| Header looks plain / not floating | Display mode is TV, or a very old browser without `:has()` (see Browser support). |
| No blur, boxes look flat | Hardware acceleration is off, or the engine lacks `backdrop-filter`. Glass falls back to opaque on purpose. |
| Wallpaper not showing | Check Settings → Display → **Backdrops** (on = Jellyfin's artwork replaces the wallpaper on home/library pages). Otherwise the URL isn't reachable from the browser, or isn't a full `https://` URL; try opening it in a new tab. |
| Text hard to read | Lower `--lg-wallpaper-brightness` or raise `--lg-glass-opacity`. |
| Scrolling is choppy | Lower `--lg-blur-radius` (e.g. `12px`) and remove unused home sections. |

## Development

```text
theme.css                 built, single-file entry point (what the CDN serves)
liquid-glass-12.2.css     one-line shim for the v1 filename
src/
  index.css               ordered @import manifest
  00-tokens.css           public settings and derived tokens
  01-base.css             palette bridge, typography, wallpaper
  02-backdrop.css         backdrop transitions
  03-surfaces.css         drawers, menus, dialogs, tooltips, toasts
  04-header.css           floating header, library toolbar, A-Z picker
  05-controls.css         buttons, inputs, badges, sliders
  06-cards.css            media cards
  07-detail.css           item pages
  08-player.css           now-playing bar and OSD
  plugins/                one commented file per plugin
  99-fallbacks.css        no-blur, reduced transparency / motion, high contrast
scripts/
  build.mjs               src/ -> theme.css
  audit.mjs               static CSS audit
```

```sh
npm run build   # regenerate theme.css (commit it; the CDN serves this file)
npm run audit   # static audit
npm test        # confirms theme.css is current, then audits
```

The audit has no dependencies. It checks for unclosed rules, comments and strings, malformed `@media` / `@supports`, vendor prefixes outside a small allow-list (each prefixed property must sit next to its standard form), undefined `var()` references, generated Emotion class selectors, and `:has()` mixed into comma lists, which would make older engines discard the whole rule.

To work on the partials live, serve the repo and import `src/index.css` instead of `theme.css`.

## Credits

- [GlassFin](https://github.com/KBH-Reeper/GlassFin) by KBH-Reeper set the look this theme follows, and its Jellyfin 12 work in [issue #35](https://github.com/KBH-Reeper/GlassFin/issues/35) (thanks to Rand0mB0y, Macleykun and KBH-Reeper) identified the main v12 layout problems. GlassFin has no published licence, so no code was copied; the CSS here is original.
- [ElegantFin](https://github.com/lscambo13/ElegantFin) by lscambo13, which GlassFin is built from, and [ElegantFin for Jellyfin 12](https://github.com/mihaif7/elegantfin-jf12) by mihaif7, whose public stylesheet was a useful reference for the Jellyfin 12 DOM. That project is GPL-2.0, so it was used for reading only.

## License

[MIT](LICENSE)
