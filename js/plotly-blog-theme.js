(() => {
  'use strict';

  if (window.BlogPlotly) return;

  const root = document.documentElement;

  function cssVariable(name, fallback) {
    return getComputedStyle(root).getPropertyValue(name).trim() || fallback;
  }

  function getColors() {
    return {
      text: cssVariable('--blog-plotly-text', '#363636'),
      grid: cssVariable('--blog-plotly-grid', 'rgba(0, 0, 0, 0.12)'),
      primary: cssVariable('--blog-plotly-primary', '#1f77b4'),
      warning: cssVariable('--blog-plotly-warning', '#d48806'),
      accent: cssVariable('--blog-plotly-accent', '#6f42c1')
    };
  }

  function baseLayout(colors = getColors()) {
    return {
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      font: {
        color: colors.text
      }
    };
  }

  function axis(title, overrides = {}, colors = getColors()) {
    return {
      title: { text: title },
      gridcolor: colors.grid,
      zerolinecolor: colors.grid,
      ...overrides
    };
  }

  function createRangeControls(target, definitions) {
    const container = document.createElement('div');
    const inputs = {};
    const outputs = {};

    container.className = 'plotly-controls';

    for (const definition of definitions) {
      const label = document.createElement('label');
      const caption = document.createElement('span');
      const output = document.createElement('output');
      const input = document.createElement('input');

      label.className = 'plotly-control';
      caption.className = 'plotly-control__label';
      caption.append(`${definition.label}：`);

      output.className = 'plotly-control__value';
      output.dataset.value = definition.key;
      output.value = Number(definition.value).toFixed(definition.digits ?? 1);
      caption.append(output);

      if (definition.unit) {
        caption.append(` ${definition.unit}`);
      }

      input.className = 'plotly-control__range';
      input.dataset.control = definition.key;
      input.type = 'range';
      input.min = String(definition.min);
      input.max = String(definition.max);
      input.step = String(definition.step);
      input.value = String(definition.value);
      input.setAttribute('aria-label', definition.ariaLabel || definition.label);
      // Butterfly's activate_power_mode listens for every bubbling input event.
      // Range sliders emit many of them while dragging, which would otherwise
      // create typing particles around Plotly controls.
      input.addEventListener('input', event => event.stopPropagation());

      label.append(caption, input);
      container.append(label);
      inputs[definition.key] = input;
      outputs[definition.key] = output;
    }

    target.before(container);
    return { container, inputs, outputs };
  }

  function setOutput(outputs, key, value, digits = 1) {
    outputs[key].value = Number(value).toFixed(digits);
  }

  function getPlotConfig() {
    return {
      responsive: true,
      displaylogo: false
    };
  }

  function observeTheme(callback, target) {
    const observer = new MutationObserver(() => {
      if (target && !target.isConnected) {
        observer.disconnect();
        return;
      }
      callback();
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    return observer;
  }

  window.BlogPlotly = Object.freeze({
    axis,
    baseLayout,
    createRangeControls,
    getColors,
    getPlotConfig,
    observeTheme,
    setOutput
  });
})();
