const pointCount = 600;
const xValues = Array.from(
  { length: pointCount },
  (_, index) => -2 * Math.PI + (4 * Math.PI * index) / (pointCount - 1)
);

const { container, inputs, outputs } = BlogPlotly.createRangeControls(target, [
  {
    key: 'amplitude',
    label: '振幅',
    mathLabel: 'A',
    min: 0.1,
    max: 3,
    step: 0.1,
    value: 1
  },
  {
    key: 'frequency',
    label: '频率',
    mathLabel: '\\omega',
    min: 0.1,
    max: 5,
    step: 0.1,
    value: 1
  }
]);

function renderSineWave() {
  const amplitude = Number(inputs.amplitude.value);
  const frequency = Number(inputs.frequency.value);
  const colors = BlogPlotly.getColors();
  const yLimit = Math.max(1, amplitude * 1.15);

  BlogPlotly.setOutput(outputs, 'amplitude', amplitude);
  BlogPlotly.setOutput(outputs, 'frequency', frequency);

  const trace = {
    x: xValues,
    y: xValues.map(x => amplitude * Math.sin(frequency * x)),
    type: 'scatter',
    mode: 'lines',
    name: '$y=A\\sin(\\omega x)$',
    line: {
      color: colors.primary,
      width: 3
    },
    hovertemplate: 'x=%{x:.3f}<br>y=%{y:.3f}<extra></extra>'
  };

  const layout = {
    ...BlogPlotly.baseLayout(colors),
    title: {
      text:
        `$y=${amplitude.toFixed(1)}\\sin` +
        `\\!\\left(${frequency.toFixed(1)}x\\right)$`
    },
    margin: {
      l: 55,
      r: 20,
      t: 55,
      b: 50
    },
    xaxis: BlogPlotly.axis(
      'x',
      { range: [-2 * Math.PI, 2 * Math.PI] },
      colors
    ),
    yaxis: BlogPlotly.axis('y', { range: [-yLimit, yLimit] }, colors),
    showlegend: false
  };

  return Plotly.react(target, [trace], layout, BlogPlotly.getPlotConfig());
}

inputs.amplitude.addEventListener('input', renderSineWave);
inputs.frequency.addEventListener('input', renderSineWave);

BlogPlotly.observeTheme(renderSineWave, target);
BlogPlotly.initializeMathChart(target, container, renderSineWave);
