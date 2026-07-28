const { common, text } = chartI18n;
const frequencyTauMin = 0.01;
const frequencyTauMax = 100;
const dutyPointCount = 121;
const contourFrequencyPointCount = 101;
const ribbonFrequencyTauValues = [
  0.01,
  0.03,
  0.1,
  0.3,
  1,
  3,
  10,
  30,
  100
];
const dutyValues = Array.from(
  { length: dutyPointCount },
  (_, index) => index / (dutyPointCount - 1)
);
const contourFrequencyTauValues = Array.from(
  { length: contourFrequencyPointCount },
  (_, index) => (
    frequencyTauMin *
    Math.pow(
      frequencyTauMax / frequencyTauMin,
      index / (contourFrequencyPointCount - 1)
    )
  )
);

function oneMinusExpNegativeLandscape(value) {
  return -Math.expm1(-value);
}

function normalizedAveragePower(duty, frequencyTau) {
  if (duty <= 0) return 0;
  if (duty >= 1) return 1;

  const onFactor = oneMinusExpNegativeLandscape(duty / frequencyTau);
  const offFactor = oneMinusExpNegativeLandscape(
    (1 - duty) / frequencyTau
  );
  const periodFactor = oneMinusExpNegativeLandscape(1 / frequencyTau);
  const normalizedPower =
    duty -
    frequencyTau * onFactor * offFactor / periodFactor;

  return Math.min(duty, Math.max(0, normalizedPower));
}

function landscapeColorscale(colors) {
  return [
    [0, colors.primary],
    [0.5, colors.accent],
    [1, colors.warning]
  ];
}

function frequencyTauTickText() {
  return ['0.01', '0.1', '1', '10', '100'];
}

function logarithmicFrequencyTauRange() {
  return [
    Math.log10(frequencyTauMin),
    Math.log10(frequencyTauMax)
  ];
}

function ribbonSurface(frequencyTau, index, colors) {
  const widthFactor = Math.pow(10, 0.035);
  const lowerFrequencyTau = Math.max(
    frequencyTauMin,
    frequencyTau / widthFactor
  );
  const upperFrequencyTau = Math.min(
    frequencyTauMax,
    frequencyTau * widthFactor
  );
  const powerValues = dutyValues.map(
    duty => normalizedAveragePower(duty, frequencyTau)
  );
  const colorValue = Math.log10(frequencyTau);
  const colorRow = dutyValues.map(() => colorValue);

  return {
    x: dutyValues,
    y: [lowerFrequencyTau, upperFrequencyTau],
    z: [powerValues, powerValues],
    surfacecolor: [colorRow, colorRow],
    type: 'surface',
    name: `$f\\tau=${frequencyTau}$`,
    cmin: Math.log10(frequencyTauMin),
    cmax: Math.log10(frequencyTauMax),
    colorscale: landscapeColorscale(colors),
    showscale: index === ribbonFrequencyTauValues.length - 1,
    colorbar: {
      title: {
        text: '$f\\tau$'
      },
      tickmode: 'array',
      tickvals: [-2, -1, 0, 1, 2],
      ticktext: frequencyTauTickText(),
      len: 0.75
    },
    hovertemplate:
      `D=%{x:.3f}<br>fτ=${frequencyTau}<br>` +
      'P̄/P<sub>ref</sub>=%{z:.4f}<extra></extra>',
    lighting: {
      ambient: 0.72,
      diffuse: 0.78,
      specular: 0.12,
      roughness: 0.9
    }
  };
}

function renderRibbonPlot() {
  const colors = BlogPlotly.getColors();
  const frequencyAxisType =
    target.layout?.scene?.yaxis?.type === 'linear' ? 'linear' : 'log';
  const frequencyAxisRange = frequencyAxisType === 'linear'
    ? [frequencyTauMin, frequencyTauMax]
    : logarithmicFrequencyTauRange();
  const ribbons = ribbonFrequencyTauValues.map(
    (frequencyTau, index) => ribbonSurface(
      frequencyTau,
      index,
      colors
    )
  );

  const linearLimit = {
    x: dutyValues,
    y: dutyValues.map(() => frequencyTauMin),
    z: dutyValues,
    type: 'scatter3d',
    mode: 'lines',
    name: '$D$',
    line: {
      color: colors.warning,
      width: 7
    },
    hovertemplate:
      `${text.lowFrequencyLinearLimit}<br>D=%{x:.3f}<br>` +
      'P̄/P<sub>ref</sub>=%{z:.4f}<extra></extra>'
  };

  const quadraticLimit = {
    x: dutyValues,
    y: dutyValues.map(() => frequencyTauMax),
    z: dutyValues.map(duty => duty * duty),
    type: 'scatter3d',
    mode: 'lines',
    name: '$D^2$',
    line: {
      color: colors.accent,
      width: 7
    },
    hovertemplate:
      `${text.highFrequencyQuadraticLimit}<br>D=%{x:.3f}<br>` +
      'P̄/P<sub>ref</sub>=%{z:.4f}<extra></extra>'
  };

  const layout = {
    ...BlogPlotly.baseLayout(colors),
    title: {
      text:
        '$\\frac{\\overline P}{P_{\\mathrm{ref}}}=F(D,f\\tau)' +
        `\\quad\\text{${text.ribbonPlot}}$`
    },
    margin: {
      l: 10,
      r: 10,
      t: 70,
      b: 10
    },
    scene: {
      xaxis: BlogPlotly.axis('$D$', {
        range: [0, 1],
        color: colors.text
      }, colors),
      yaxis: BlogPlotly.axis('$f\\tau$', {
        type: frequencyAxisType,
        range: frequencyAxisRange,
        color: colors.text
      }, colors),
      zaxis: BlogPlotly.axis(
        '$\\frac{\\overline P}{P_{\\mathrm{ref}}}$',
        {
          range: [0, 1],
          color: colors.text
        },
        colors
      ),
      camera: {
        eye: {
          x: 1.55,
          y: -1.65,
          z: 1.05
        }
      },
      aspectratio: {
        x: 1.25,
        y: 1.2,
        z: 0.8
      }
    },
    legend: {
      orientation: 'h',
      x: 0,
      y: 1.02
    },
    updatemenus: BlogPlotly.axisScaleButtons({
      axisName: 'scene.yaxis',
      currentType: frequencyAxisType,
      logarithmicRange: logarithmicFrequencyTauRange(),
      linearRange: [frequencyTauMin, frequencyTauMax],
      labels: {
        logarithmic: common.logarithmicScale,
        linear: common.linearScale
      }
    }, colors),
    uirevision: 'pwm-average-power-ribbon'
  };

  return Plotly.react(
    target,
    [...ribbons, linearLimit, quadraticLimit],
    layout,
    BlogPlotly.getPlotConfig()
  );
}

const contourPowerValues = contourFrequencyTauValues.map(
  frequencyTau => dutyValues.map(
    duty => normalizedAveragePower(duty, frequencyTau)
  )
);

function renderContourPlot() {
  const colors = BlogPlotly.getColors();
  const frequencyAxisType =
    target.layout?.yaxis?.type === 'linear' ? 'linear' : 'log';
  const frequencyAxisRange = frequencyAxisType === 'linear'
    ? [frequencyTauMin, frequencyTauMax]
    : logarithmicFrequencyTauRange();
  const trace = {
    x: dutyValues,
    y: contourFrequencyTauValues,
    z: contourPowerValues,
    type: 'contour',
    zmin: 0,
    zmax: 1,
    colorscale: landscapeColorscale(colors),
    autocontour: false,
    contours: {
      start: 0,
      end: 1,
      size: 0.05,
      coloring: 'heatmap',
      showlabels: true,
      labelfont: {
        color: colors.text,
        size: 11
      }
    },
    line: {
      color: colors.grid,
      width: 1,
      smoothing: 0.85
    },
    colorbar: {
      title: {
        text: '$\\frac{\\overline P}{P_{\\mathrm{ref}}}$'
      }
    },
    hovertemplate:
      'D=%{x:.3f}<br>fτ=%{y:.4g}<br>' +
      'P̄/P<sub>ref</sub>=%{z:.4f}<extra></extra>'
  };

  const layout = {
    ...BlogPlotly.baseLayout(colors),
    title: {
      text:
        '$\\frac{\\overline P}{P_{\\mathrm{ref}}}=F(D,f\\tau)' +
        `\\quad\\text{${text.contourPlot}}$`
    },
    margin: {
      l: 70,
      r: 30,
      t: 65,
      b: 70
    },
    xaxis: BlogPlotly.axis(
      '$D$',
      {
        range: [0, 1],
        tick0: 0,
        dtick: 0.1
      },
      colors
    ),
    yaxis: BlogPlotly.axis(
      '$f\\tau$',
      {
        type: frequencyAxisType,
        range: frequencyAxisRange
      },
      colors
    ),
    updatemenus: BlogPlotly.axisScaleButtons({
      axisName: 'yaxis',
      currentType: frequencyAxisType,
      logarithmicRange: logarithmicFrequencyTauRange(),
      linearRange: [frequencyTauMin, frequencyTauMax],
      labels: {
        logarithmic: common.logarithmicScale,
        linear: common.linearScale
      }
    }, colors),
    uirevision: 'pwm-average-power-contour'
  };

  return Plotly.react(
    target,
    [trace],
    layout,
    BlogPlotly.getPlotConfig()
  );
}

if (target.id === 'pwm-average-power-ribbon') {
  BlogPlotly.observeTheme(renderRibbonPlot, target);
  BlogPlotly.initializeMathChart(target, null, renderRibbonPlot);
} else if (target.id === 'pwm-average-power-contour') {
  BlogPlotly.observeTheme(renderContourPlot, target);
  BlogPlotly.initializeMathChart(target, null, renderContourPlot);
} else {
  throw new Error(`Unknown power-landscape chart target: ${target.id}`);
}
