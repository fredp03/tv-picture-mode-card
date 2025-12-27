const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

console.info(
  `%c TV-PICTURE-MODE-CARD %c v1.0.3 `,
  "color: white; background: #555; font-weight: bold;",
  "color: white; background: #007acc; font-weight: bold;"
);

class TvPictureModeCard extends LitElement {
  static properties = {
    hass: {},
    config: {},
  };

  constructor() {
    super();
    this._optimisticMode = null;
    this._optimisticTimeout = null;
  }

  static styles = css`
    :host {
      --text-color: #53514b;
      --underline-color: #53514b;
    }

    .picture-mode-container {
      display: flex;
      gap: 27px;
      align-items: center;
      justify-content: center;
      padding: 10px;
      width: 100%;
    }

    .mode-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mode-item:hover {
      opacity: 0.7;
    }

    .mode-name {
      font-family: "Jaldi", sans-serif;
      font-size: 24px;
      font-weight: 400;
      color: var(--text-color);
      text-align: center;
      white-space: nowrap;
      line-height: normal;
    }

    .mode-item.selected {
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.02),
        0px 2px 4px 0px rgba(0, 0, 0, 0.08);
    }

    .underline {
      width: 100%;
      height: 0;
      position: relative;
      margin-top: 7px;
    }

    .underline::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: -1px;
      height: 2px;
      background-color: var(--underline-color);
    }

    .error-message {
      color: #d32f2f;
      padding: 20px;
      border-radius: 4px;
      background: #ffebee;
      font-family: Roboto, sans-serif;
    }
  `;

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = {
      attribute: "picture_mode",
      scale: 100,
      ...config,
    };
  }

  render() {
    if (!this.hass) {
      return html`<div class="error-message">
        Home Assistant is not available
      </div>`;
    }

    const entity = this.hass.states[this.config.entity];

    if (!entity) {
      return html`<div class="error-message">
        Entity not found: ${this.config.entity}
      </div>`;
    }

    const actualMode = entity.attributes[this.config.attribute];
    // Use optimistic mode for instant UI feedback, fallback to actual mode
    const currentMode = this._optimisticMode || actualMode;
    const modeList = entity.attributes.picture_mode_list || [
      "Dynamic",
      "Standard",
      "Natural",
      "Movie",
    ];
    const scale = this.config.scale / 100;

    return html`
      <div class="picture-mode-container" style="zoom: ${scale};">
        ${modeList.map(
          (mode) => html`
            <div
              class="mode-item ${currentMode === mode ? "selected" : ""}"
              @click=${() => this._selectMode(mode)}
            >
              <span class="mode-name">${mode}</span>
              ${currentMode === mode
                ? html`<div class="underline"></div>`
                : ""}
            </div>
          `
        )}
      </div>
    `;
  }

  _selectMode(mode) {
    const entity = this.config.entity;
    const currentMode = this._optimisticMode || 
      this.hass.states[entity].attributes[this.config.attribute];

    if (mode === currentMode) {
      return;
    }

    // Clear any existing timeout
    if (this._optimisticTimeout) {
      clearTimeout(this._optimisticTimeout);
    }

    // Set optimistic mode immediately for instant UI feedback
    this._optimisticMode = mode;
    this.requestUpdate();

    // Keep optimistic mode for 45 seconds to outlast HA state delays
    this._optimisticTimeout = setTimeout(() => {
      this._optimisticMode = null;
      this.requestUpdate();
    }, 45000);

    this.hass.callService("samsungtv_smart", "select_picture_mode", {
      entity_id: entity,
      picture_mode: mode,
    });
  }

  getCardSize() {
    return 1;
  }

  static getConfigElement() {
    return document.createElement("tv-picture-mode-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      attribute: "picture_mode",
      scale: 100,
    };
  }
}

if (!customElements.get("tv-picture-mode-card")) {
  customElements.define("tv-picture-mode-card", TvPictureModeCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "tv-picture-mode-card",
  name: "TV Picture Mode Card",
  description:
    "A custom card to display and switch Samsung TV picture modes",
  preview: true,
});
