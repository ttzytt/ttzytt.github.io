(() => {
  'use strict';

  if (window.HexoPlotly) return;

  const root = document.documentElement;
  const state = {
    bootPromise: null,
    locale: 'en',
    stopInputPropagation: false
  };
  const scriptLoads = new Map();
  let mathTypesetQueue = Promise.resolve();
  let initialChartQueue = Promise.resolve();

  function cssVariable(name, fallback) {
    const element = document.body || root;
    return getComputedStyle(element).getPropertyValue(name).trim() || fallback;
  }

  function getColors() {
    return {
      text: cssVariable('--hexo-plotly-text', '#363636'),
      grid: cssVariable('--hexo-plotly-grid', 'rgba(0, 0, 0, 0.12)'),
      primary: cssVariable('--hexo-plotly-primary', '#1f77b4'),
      warning: cssVariable('--hexo-plotly-warning', '#d48806'),
      accent: cssVariable('--hexo-plotly-accent', '#6f42c1'),
      controlBackground: cssVariable(
        '--hexo-plotly-control-bg',
        'rgba(255, 255, 255, 0.82)'
      ),
      controlBorder: cssVariable(
        '--hexo-plotly-control-border',
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
          label: labels.logarithmic || 'Log',
          method: 'relayout',
          args: [{
            [typeKey]: 'log',
            [rangeKey]: logarithmicRange
          }]
        },
        {
          label: labels.linear || 'Linear',
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
        console.warn('[Hexo Plotly] Failed to typeset chart controls.', error);
      });

    return mathTypesetQueue;
  }

  function initializeMathChart(target, controls, render) {
    const initialization = initialChartQueue
      .then(() => typesetMath(controls))
      .then(() => render());

    initialChartQueue = initialization.catch(error => {
      console.error('[Hexo Plotly] Failed to initialize a MathJax chart.', error);
    });
    target.plotlyRenderReady = initialization;
    return initialization;
  }

  function createRangeControls(target, definitions, options = {}) {
    const container = document.createElement('div');
    const inputs = {};
    const outputs = {};
    const separator = options.separator ?? ': ';

    container.className = 'hexo-plotly-controls plotly-controls';

    for (const definition of definitions) {
      const label = document.createElement('label');
      const caption = document.createElement('span');
      const output = document.createElement('output');
      const input = document.createElement('input');

      label.className = 'hexo-plotly-control plotly-control';
      caption.className =
        'hexo-plotly-control__label plotly-control__label';
      caption.append(definition.label);

      if (definition.mathLabel) {
        const mathLabel = document.createElement('span');
        mathLabel.className =
          'hexo-plotly-control__math plotly-control__math';
        mathLabel.textContent = `\\(${definition.mathLabel}\\)`;
        caption.append(' ', mathLabel);
      }

      caption.append(separator);

      output.className =
        'hexo-plotly-control__value plotly-control__value';
      output.dataset.value = definition.key;
      output.value = Number(definition.value).toFixed(definition.digits ?? 1);
      caption.append(output);

      if (definition.unit) {
        caption.append(` ${definition.unit}`);
      }

      input.className =
        'hexo-plotly-control__range plotly-control__range';
      input.dataset.control = definition.key;
      input.type = 'range';
      input.min = String(definition.min);
      input.max = String(definition.max);
      input.step = String(definition.step);
      input.value = String(definition.value);
      input.setAttribute('aria-label', definition.ariaLabel || definition.label);

      if (options.stopInputPropagation ?? state.stopInputPropagation) {
        input.addEventListener('input', event => event.stopPropagation());
      }

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

  function getPlotConfig(overrides = {}) {
    return {
      responsive: true,
      displaylogo: false,
      locale: state.locale,
      ...overrides
    };
  }

  function observeTheme(callback, target) {
    let scheduled = false;
    const notify = () => {
      if (target && !target.isConnected) {
        disconnect();
        return;
      }
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        callback();
      });
    };
    const observer = new MutationObserver(notify);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const observerOptions = {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-color-mode', 'data-scheme']
    };

    observer.observe(root, observerOptions);
    if (document.body) observer.observe(document.body, observerOptions);
    media.addEventListener?.('change', notify);

    function disconnect() {
      observer.disconnect();
      media.removeEventListener?.('change', notify);
    }

    return { disconnect };
  }

  function loadScript(source, timeout, isReady, label) {
    if (isReady?.()) return Promise.resolve();
    if (!source) return Promise.reject(new Error(`No ${label} URL configured`));
    if (scriptLoads.has(source)) return scriptLoads.get(source);

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const hasTimeout = Number.isFinite(timeout) && timeout > 0;
      let settled = false;
      let timer = null;

      const cleanUp = () => {
        if (timer !== null) window.clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
      };
      const succeed = () => {
        if (settled) return;
        settled = true;
        cleanUp();
        resolve();
      };
      const fail = message => {
        if (settled) return;
        settled = true;
        cleanUp();
        script.remove();
        reject(new Error(message));
      };

      script.src = source;
      script.async = true;
      script.dataset.hexoPlotlySource = source;
      script.onload = () => {
        if (!isReady || isReady()) {
          succeed();
        } else {
          fail(`${label} loaded without exposing its browser API: ${source}`);
        }
      };
      script.onerror = () => fail(`Failed to load ${label}: ${source}`);
      document.head.appendChild(script);

      if (hasTimeout) {
        timer = window.setTimeout(
          () => fail(`Timed out loading ${label} after ${timeout}ms: ${source}`),
          timeout
        );
      }
    }).catch(error => {
      scriptLoads.delete(source);
      throw error;
    });

    scriptLoads.set(source, promise);
    return promise;
  }

  function loadWithFallback(
    cdnSource,
    localSource,
    timeout,
    isReady,
    label,
    retryCdnWithoutTimeout = false
  ) {
    return loadScript(cdnSource, timeout, isReady, label).catch(cdnError => {
      console.warn(
        `[Hexo Plotly] ${label} CDN unavailable or slow; trying local fallback.`,
        cdnError
      );
      return loadScript(localSource, timeout, isReady, label).catch(localError => {
        if (!retryCdnWithoutTimeout) throw localError;
        console.warn(
          `[Hexo Plotly] ${label} local fallback unavailable; retrying CDN without a timeout.`,
          localError
        );
        return loadScript(cdnSource, null, isReady, label);
      });
    });
  }

  function configureMathJax() {
    if (window.MathJax && window.MathJax.version) return;
    const existing = window.MathJax || {};
    window.MathJax = {
      ...existing,
      tex: {
        ...existing.tex,
        inlineMath: [['$', '$'], ['\\(', '\\)']]
      },
      svg: {
        ...existing.svg,
        fontCache: 'local'
      }
    };
  }

  function boot(options) {
    if (state.bootPromise) return state.bootPromise;

    state.locale = options.locale || 'en';
    state.stopInputPropagation = options.stopInputPropagation === true;
    const timeout = options.timeoutMs;
    const plotlyIsReady = () => Boolean(window.Plotly);
    const mathJaxIsReady = () => {
      const version = window.MathJax && window.MathJax.version;
      const major = Number.parseInt((version || '').split('.')[0], 10);
      return major === 3 && typeof window.MathJax.typesetPromise === 'function';
    };

    let plotlyReady = loadWithFallback(
      options.plotlyCdnUrl,
      options.plotlyLocalUrl,
      timeout,
      plotlyIsReady,
      'Plotly',
      true
    ).then(() => window.Plotly);

    if (state.locale !== 'en' && options.localeCdnUrl && options.localeLocalUrl) {
      plotlyReady = plotlyReady.then(plotly =>
        loadWithFallback(
          options.localeCdnUrl,
          options.localeLocalUrl,
          timeout,
          null,
          `Plotly locale ${state.locale}`
        ).then(
          () => plotly,
          error => {
            console.warn(
              `[Hexo Plotly] Locale ${state.locale} could not be loaded; using English modebar text.`,
              error
            );
            state.locale = 'en';
            return plotly;
          }
        )
      );
    }

    window.plotlyReady = plotlyReady;

    let mathJaxReady = Promise.resolve(null);
    if (options.mathJaxEnabled) {
      configureMathJax();
      mathJaxReady = loadWithFallback(
        options.mathJaxCdnUrl,
        options.mathJaxLocalUrl,
        timeout,
        mathJaxIsReady,
        'MathJax'
      )
        .then(() => window.MathJax.startup.promise)
        .then(() => window.MathJax);
    }
    window.mathJaxReady = mathJaxReady;

    state.bootPromise = Promise.all([plotlyReady, mathJaxReady])
      .then(([plotly]) => plotly);
    window.hexoPlotlyReady = state.bootPromise;
    window.plotlyMathReady = state.bootPromise;
    return state.bootPromise;
  }

  const api = Object.freeze({
    axis,
    axisScaleButtons,
    baseLayout,
    boot,
    createRangeControls,
    getColors,
    getPlotConfig,
    initializeMathChart,
    observeTheme,
    setOutput,
    typesetMath
  });

  window.HexoPlotly = api;
  window.BlogPlotly = window.BlogPlotly || api;
})();
