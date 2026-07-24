const pointCount = 600;
const xValues = Array.from(
  { length: pointCount },
  (_, index) => -2 * Math.PI + (4 * Math.PI * index) / (pointCount - 1)
);

const controls = document.createElement('div');
controls.style.display = 'grid';
controls.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
controls.style.gap = '12px 24px';
controls.style.margin = '0 0 16px';
controls.style.padding = '16px';
controls.style.border = '1px solid rgba(127, 127, 127, .25)';
controls.style.borderRadius = '8px';
controls.innerHTML = `
  <label>
    <span>振幅 A：<output data-value="amplitude">1.0</output></span>
    <input data-control="amplitude" type="range" min="0.1" max="3" step="0.1" value="1"
      style="display:block;width:100%;margin-top:8px">
  </label>
  <label>
    <span>频率 ω：<output data-value="frequency">1.0</output></span>
    <input data-control="frequency" type="range" min="0.1" max="5" step="0.1" value="1"
      style="display:block;width:100%;margin-top:8px">
  </label>
`;
target.before(controls);

const amplitudeInput = controls.querySelector('[data-control="amplitude"]');
const frequencyInput = controls.querySelector('[data-control="frequency"]');
const amplitudeValue = controls.querySelector('[data-value="amplitude"]');
const frequencyValue = controls.querySelector('[data-value="frequency"]');

function palette() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: dark ? '#d8d8d8' : '#363636',
    grid: dark ? 'rgba(255, 255, 255, .14)' : 'rgba(0, 0, 0, .12)',
    line: dark ? '#49b1f5' : '#1f77b4'
  };
}

function renderSineWave() {
  const amplitude = Number(amplitudeInput.value);
  const frequency = Number(frequencyInput.value);
  const colors = palette();
  const yLimit = Math.max(1, amplitude * 1.15);

  amplitudeValue.value = amplitude.toFixed(1);
  frequencyValue.value = frequency.toFixed(1);

  const trace = {
    x: xValues,
    y: xValues.map(x => amplitude * Math.sin(frequency * x)),
    type: 'scatter',
    mode: 'lines',
    name: 'y = A sin(ωx)',
    line: {
      color: colors.line,
      width: 3
    },
    hovertemplate: 'x=%{x:.3f}<br>y=%{y:.3f}<extra></extra>'
  };

  const layout = {
    title: {
      text: `y = ${amplitude.toFixed(1)} sin(${frequency.toFixed(1)}x)`
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    font: {
      color: colors.text
    },
    margin: {
      l: 55,
      r: 20,
      t: 55,
      b: 50
    },
    xaxis: {
      title: { text: 'x' },
      range: [-2 * Math.PI, 2 * Math.PI],
      gridcolor: colors.grid,
      zerolinecolor: colors.grid
    },
    yaxis: {
      title: { text: 'y' },
      range: [-yLimit, yLimit],
      gridcolor: colors.grid,
      zerolinecolor: colors.grid
    },
    showlegend: false
  };

  Plotly.react(target, [trace], layout, {
    responsive: true,
    displaylogo: false
  });
}

amplitudeInput.addEventListener('input', renderSineWave);
frequencyInput.addEventListener('input', renderSineWave);

const themeObserver = new MutationObserver(renderSineWave);
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});

renderSineWave();
