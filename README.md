# TV Picture Mode Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

A custom Home Assistant Lovelace card for displaying and switching Samsung TV picture modes.

## Features

- Display available picture modes (Dynamic, Standard, Natural, Movie)
- Visual indicator for the currently selected mode with underline
- Click to switch between picture modes
- Configurable entity, attribute, and scale

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to **Frontend** section
3. Click the three-dot menu (top right) → **Custom repositories**
4. Add repository URL: `https://github.com/YOUR_USERNAME/tv-picture-mode-card`
5. Category: **Dashboard**
6. Click **Add**
7. Find "TV Picture Mode Card" and click **Download**
8. Restart Home Assistant

### Manual Installation

1. Download `tv-picture-mode-card.js` from the latest release
2. Copy to `/config/www/tv-picture-mode-card.js`
3. Add resource in Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources**
   - Add `/local/tv-picture-mode-card.js` as JavaScript Module

## Configuration

Add the card to your dashboard:

```yaml
type: custom:tv-picture-mode-card
entity: media_player.samsung_tv
attribute: picture_mode
scale: 100
```

### Options

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `entity` | Yes | - | The media_player entity for your Samsung TV |
| `attribute` | No | `picture_mode` | The attribute that contains the current picture mode |
| `scale` | No | `100` | Scale percentage for the card (50-200) |

## Requirements

- Home Assistant with a Samsung TV integration
- The TV entity must have `picture_mode` and `picture_mode_list` attributes
- Compatible Samsung TV integrations:
  - [Samsung Smart TV](https://www.home-assistant.io/integrations/samsungtv/)
  - [SamsungTV Smart](https://github.com/ollo69/ha-samsungtv-smart)

## Screenshots

The card displays picture modes horizontally with the selected mode underlined:

```
Dynamic    Standard    Natural    Movie
              ‾‾‾‾‾‾‾‾
```

## Troubleshooting

### Picture mode doesn't change

The card uses `media_player.select_source` service by default. If this doesn't work for your Samsung TV integration, you may need to modify the service call in the JavaScript file to match your integration's service.

### Entity not found

Make sure you're using the correct entity ID for your Samsung TV. Check **Developer Tools** → **States** to find your TV's entity ID.

## License

MIT License - see [LICENSE](LICENSE) file for details.
