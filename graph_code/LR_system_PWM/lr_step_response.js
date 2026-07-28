const pointCount = 500;
const timeMin = -5;
const timeMax = 20;
const timeValues = Array.from(
  { length: pointCount },
  (_, index) => timeMin + ((timeMax - timeMin) * index) / (pointCount - 1)
);

const { container, inputs, outputs } = BlogPlotly.createRangeControls(target, [
  {
    key: 'tau',
    label: '时间常数',
    mathLabel: '\\tau',
    unit: 's',
    min: 0.2,
    max: 10,
    step: 0.1,
    value: 2
  },
  {
    key: 'initial',
    label: '初始电流',
    mathLabel: 'i_0',
    unit: 'A',
    min: 0,
    max: 10,
    step: 0.1,
    value: 0
  },
  {
    key: 'final',
    label: '直流稳态电流',
    mathLabel: 'i_f\\,(V_0/R)',
    unit: 'A',
    min: 0,
    max: 10,
    step: 0.1,
    value: 5
  }
]);

function renderResponse() {
  const tau = Number(inputs.tau.value);
  const initialCurrent = Number(inputs.initial.value);
  const finalCurrent = Number(inputs.final.value);
  const colors = BlogPlotly.getColors();
  const currentMax = Math.max(1, initialCurrent, finalCurrent) * 1.15;

  BlogPlotly.setOutput(outputs, 'tau', tau);
  BlogPlotly.setOutput(outputs, 'initial', initialCurrent);
  BlogPlotly.setOutput(outputs, 'final', finalCurrent);

  const currentValues = timeValues.map(time => (
    time < 0
      ? initialCurrent
      : finalCurrent + (initialCurrent - finalCurrent) * Math.exp(-time / tau)
  ));
  const currentAtTau =
    finalCurrent + (initialCurrent - finalCurrent) * Math.exp(-1);

  const responseTrace = {
    x: timeValues,
    y: currentValues,
    type: 'scatter',
    mode: 'lines',
    name: '$i(t)$',
    line: {
      color: colors.primary,
      width: 3
    },
    hovertemplate: 't=%{x:.2f} s<br>i(t)=%{y:.3f} A<extra></extra>'
  };

  const tauMarker = {
    x: [tau],
    y: [currentAtTau],
    type: 'scatter',
    mode: 'markers',
    name: '$t=\\tau$',
    marker: {
      color: colors.accent,
      size: 9
    },
    hovertemplate: 't=τ=%{x:.1f} s<br>i(τ)=%{y:.3f} A<extra></extra>'
  };

  const layout = {
    ...BlogPlotly.baseLayout(colors),
    title: {
      text: '$i(t)=i_f+(i_0-i_f)e^{-t/\\tau}$'
    },
    margin: {
      l: 60,
      r: 20,
      t: 65,
      b: 55
    },
    xaxis: BlogPlotly.axis('$t\\; (\\mathrm{s})$', {
      range: [timeMin, timeMax],
    }, colors),
    yaxis: BlogPlotly.axis(
      '$i(t)\\; (\\mathrm{A})$',
      { range: [0, currentMax] },
      colors
    ),
    shapes: [
      {
        type: 'line',
        x0: 0,
        x1: timeMax,
        y0: finalCurrent,
        y1: finalCurrent,
        line: {
          color: colors.warning,
          width: 2,
          dash: 'dash'
        }
      },
      {
        type: 'line',
        x0: tau,
        x1: tau,
        y0: Math.min(initialCurrent, currentAtTau),
        y1: Math.max(initialCurrent, currentAtTau),
        line: {
          color: colors.accent,
          width: 1,
          dash: 'dot'
        }
      }
    ],
    annotations: [
      {
        x: timeMax,
        y: finalCurrent,
        xanchor: 'right',
        yanchor: finalCurrent >= initialCurrent ? 'bottom' : 'top',
        text: `$i_f=\\frac{V_0}{R}=${finalCurrent.toFixed(1)}\\,\\mathrm{A}$`,
        showarrow: false,
        font: { color: colors.warning }
      }
    ],
    legend: {
      orientation: 'h',
      x: 0,
      y: 1.08
    }
  };

  return Plotly.react(
    target,
    [responseTrace, tauMarker],
    layout,
    BlogPlotly.getPlotConfig()
  );
}

inputs.tau.addEventListener('input', renderResponse);
inputs.initial.addEventListener('input', renderResponse);
inputs.final.addEventListener('input', renderResponse);

BlogPlotly.observeTheme(renderResponse, target);
BlogPlotly.initializeMathChart(target, container, renderResponse);
