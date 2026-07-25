const timeMin = 0;
const timeMax = 20;

const { inputs, outputs } = BlogPlotly.createRangeControls(target, [
  {
    key: 'duty',
    label: '占空比 D',
    min: 0,
    max: 1,
    step: 0.05,
    value: 0.5,
    digits: 2
  },
  {
    key: 'period',
    label: '周期 T',
    unit: 's',
    min: 0.5,
    max: 10,
    step: 0.1,
    value: 4
  },
  {
    key: 'voltage',
    label: '高电平电压 V₀',
    unit: 'V',
    min: 0,
    max: 20,
    step: 0.5,
    value: 10
  }
]);

function pwmPoints(duty, period, voltage) {
  if (duty === 0 || voltage === 0) {
    return {
      x: [timeMin, timeMax],
      y: [0, 0]
    };
  }

  if (duty === 1) {
    return {
      x: [timeMin, timeMax],
      y: [voltage, voltage]
    };
  }

  const x = [timeMin];
  const y = [voltage];
  const periodCount = Math.ceil(timeMax / period);

  for (let index = 0; index < periodCount; index += 1) {
    const periodStart = index * period;
    const fallingEdge = periodStart + duty * period;
    const risingEdge = periodStart + period;

    if (fallingEdge <= timeMax) {
      x.push(fallingEdge);
      y.push(0);
    }

    if (risingEdge <= timeMax) {
      x.push(risingEdge);
      y.push(voltage);
    }
  }

  if (x.at(-1) < timeMax) {
    const phaseAtEnd = timeMax % period;
    x.push(timeMax);
    y.push(phaseAtEnd < duty * period ? voltage : 0);
  }

  return { x, y };
}

function renderPwm() {
  const duty = Number(inputs.duty.value);
  const period = Number(inputs.period.value);
  const voltage = Number(inputs.voltage.value);
  const colors = BlogPlotly.getColors();
  const points = pwmPoints(duty, period, voltage);

  BlogPlotly.setOutput(outputs, 'duty', duty, 2);
  BlogPlotly.setOutput(outputs, 'period', period);
  BlogPlotly.setOutput(outputs, 'voltage', voltage);

  const trace = {
    x: points.x,
    y: points.y,
    type: 'scatter',
    mode: 'lines',
    name: 'V(t)',
    line: {
      color: colors.primary,
      width: 3,
      shape: 'hv'
    },
    hovertemplate: 't=%{x:.2f} s<br>V(t)=%{y:.2f} V<extra></extra>'
  };

  const layout = {
    ...BlogPlotly.baseLayout(colors),
    title: {
      text:
        `PWM：D=${duty.toFixed(2)}，` +
        `T=${period.toFixed(1)} s，` +
        `V<sub>0</sub>=${voltage.toFixed(1)} V`
    },
    margin: {
      l: 60,
      r: 20,
      t: 55,
      b: 55
    },
    xaxis: BlogPlotly.axis(
      '时间 t (s)',
      { range: [timeMin, timeMax] },
      colors
    ),
    yaxis: BlogPlotly.axis(
      '电压 V(t) (V)',
      { range: [0, Math.max(1, voltage) * 1.15] },
      colors
    ),
    showlegend: false
  };

  Plotly.react(target, [trace], layout, BlogPlotly.getPlotConfig());
}

inputs.duty.addEventListener('input', renderPwm);
inputs.period.addEventListener('input', renderPwm);
inputs.voltage.addEventListener('input', renderPwm);

BlogPlotly.observeTheme(renderPwm, target);
renderPwm();
