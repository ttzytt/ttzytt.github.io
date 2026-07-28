(() => {
  'use strict';

  if (window.BlogPlotly) return;

  const root = document.documentElement;
  let mathTypesetQueue = Promise.resolve();
  let initialChartQueue = Promise.resolve();

  function cssVariable(name, fallback) {
    return getComputedStyle(root).getPropertyValue(name).trim() || fallback;
  }

  function getColors() {
    return {
      text: cssVariable('--blog-plotly-text', '#363636'),
      grid: cssVariable('--blog-plotly-grid', 'rgba(0, 0, 0, 0.12)'),
      primary: cssVariable('--blog-plotly-primary', '#1f77b4'),
      warning: cssVariable('--blog-plotly-warning', '#d48806'),
      accent: cssVariable('--blog-plotly-accent', '#6f42c1'),
      controlBackground: cssVariable(
        '--blog-plotly-control-bg',
        'rgba(255, 255, 255, 0.82)'
      ),
      controlBorder: cssVariable(
        '--blog-plotly-control-border',
        'rgba(0, 0, 0, 0.16)'
      )
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

  function axisScaleButtons(options, colors = getColors()) {
    const {
      axisName = 'xaxis',
      currentType = 'log',
      logarithmicRange,
      linearRange,
      labels = {}
    } = options;
    const typeKey = `${axisName}.type`;
    const rangeKey = `${axisName}.range`;

    return [{
      type: 'buttons',
      direction: 'right',
      active: currentType === 'linear' ? 1 : 0,
      showactive: true,
      x: 1,
      y: 1,
      xanchor: 'right',
      yanchor: 'top',
      bgcolor: colors.controlBackground,
      bordercolor: colors.controlBorder,
      font: {
        color: colors.text
      },
      buttons: [
        {
          label: labels.logarithmic || '对数坐标',
          method: 'relayout',
          args: [{
            [typeKey]: 'log',
            [rangeKey]: logarithmicRange
          }]
        },
        {
          label: labels.linear || '线性坐标',
          method: 'relayout',
          args: [{
            [typeKey]: 'linear',
            [rangeKey]: linearRange
          }]
        }
      ]
    }];
  }

  function typesetMath(elements) {
    const targets = (Array.isArray(elements) ? elements : [elements])
      .filter(Boolean);

    if (targets.length === 0) return Promise.resolve();

    const ready = window.mathJaxReady || Promise.resolve(window.MathJax);
    mathTypesetQueue = mathTypesetQueue
      .then(() => ready)
      .then(mathJax => {
        if (!mathJax || typeof mathJax.typesetPromise !== 'function') {
          throw new Error('MathJax is unavailable');
        }
        return mathJax.typesetPromise(targets);
      })
      .catch(error => {
        console.warn('[Plotly] Failed to typeset external chart controls.', error);
      });

    return mathTypesetQueue;
  }

  function initializeMathChart(target, controls, render) {
    const initialization = initialChartQueue
      .then(() => typesetMath(controls))
      .then(() => render());

    initialChartQueue = initialization.catch(error => {
      console.error('[Plotly] Failed to initialize a MathJax chart.', error);
    });
    target.plotlyRenderReady = initialization;
    return initialization;
  }

  function createRangeControls(target, definitions, options = {}) {
    const container = document.createElement('div');
    const inputs = {};
    const outputs = {};
    const separator = options.separator ?? '：';

    container.className = 'plotly-controls';

    for (const definition of definitions) {
      const label = document.createElement('label');
      const caption = document.createElement('span');
      const output = document.createElement('output');
      const input = document.createElement('input');

      label.className = 'plotly-control';
      caption.className = 'plotly-control__label';
      caption.append(definition.label);

      if (definition.mathLabel) {
        const mathLabel = document.createElement('span');
        mathLabel.className = 'plotly-control__math';
        mathLabel.textContent = `\\(${definition.mathLabel}\\)`;
        caption.append(' ', mathLabel);
      }

      caption.append(separator);

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
    axisScaleButtons,
    baseLayout,
    createRangeControls,
    getColors,
    getPlotConfig,
    initializeMathChart,
    observeTheme,
    setOutput,
    typesetMath
  });
})();
