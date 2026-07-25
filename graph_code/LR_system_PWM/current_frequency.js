const frequencyMin = 0.01;
const frequencyMax = 100;
const pointCount = 500;
const frequencyValues = Array.from(
  { length: pointCount },
  (_, index) => (
    frequencyMin *
    Math.pow(frequencyMax / frequencyMin, index / (pointCount - 1))
  )
);

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
    key: 'tau',
    label: '时间常数 τ',
    unit: 's',
    min: 0.05,
    max: 10,
    step: 0.05,
    value: 2,
    digits: 2
  },
  {
    key: 'final',
    label: '最终电流 i_f (V₀/R)',
    unit: 'A',
    min: 0,
    max: 10,
    step: 0.1,
    value: 5
  }
]);

function steadyStateCurrents(frequency, tau, finalCurrent, duty) {
  const k = 1 / (frequency * tau);
  const maximumCurrent =
    finalCurrent *
    (-Math.expm1(-duty * k)) /
    (-Math.expm1(-k));
  const minimumCurrent =
    maximumCurrent * Math.exp(-(1 - duty) * k);

  return {
    maximum: maximumCurrent,
    minimum: minimumCurrent
  };
}

function renderFrequencyResponse() {
  const duty = Number(inputs.duty.value);
  const tau = Number(inputs.tau.value);
  const finalCurrent = Number(inputs.final.value);
  const colors = BlogPlotly.getColors();
  const maximumValues = [];
  const minimumValues = [];

  for (const frequency of frequencyValues) {
    const currents = steadyStateCurrents(
      frequency,
      tau,
      finalCurrent,
      duty
    );
    maximumValues.push(currents.maximum);
    minimumValues.push(currents.minimum);
  }

  BlogPlotly.setOutput(outputs, 'duty', duty, 2);
  BlogPlotly.setOutput(outputs, 'tau', tau);
  BlogPlotly.setOutput(outputs, 'final', finalCurrent);

  const maximumTrace = {
    x: frequencyValues,
    y: maximumValues,
    type: 'scatter',
    mode: 'lines',
    name: 'i<sub>max</sub>',
    line: {
      color: colors.primary,
      width: 3
    },
    hovertemplate:
      'f=%{x:.3g} Hz<br>i<sub>max</sub>=%{y:.3f} A<extra></extra>'
  };

  const minimumTrace = {
    x: frequencyValues,
    y: minimumValues,
    type: 'scatter',
    mode: 'lines',
    name: 'i<sub>min</sub>',
    line: {
      color: colors.warning,
      width: 3
    },
    hovertemplate:
      'f=%{x:.3g} Hz<br>i<sub>min</sub>=%{y:.3f} A<extra></extra>'
  };

  const layout = {
    ...BlogPlotly.baseLayout(colors),
    title: {
      text:
        `PWM 稳态电流随频率的变化（D=${duty.toFixed(2)}，` +
        `τ=${tau.toFixed(2)} s，i<sub>f</sub>=${finalCurrent.toFixed(1)} A）`
    },
    margin: {
      l: 60,
      r: 20,
      t: 65,
      b: 65
    },
    xaxis: BlogPlotly.axis(
      '频率 f (Hz)',
      {
        type: 'log',
        range: [Math.log10(frequencyMin), Math.log10(frequencyMax)]
      },
      colors
    ),
    yaxis: BlogPlotly.axis(
      '稳态电流 (A)',
      {
        range: [0, Math.max(1, finalCurrent) * 1.1]
      },
      colors
    ),
    legend: {
      orientation: 'h',
      x: 0,
      y: 1.08
    }
  };

  Plotly.react(
    target,
    [maximumTrace, minimumTrace],
    layout,
    BlogPlotly.getPlotConfig()
  );
}

inputs.duty.addEventListener('input', renderFrequencyResponse);
inputs.tau.addEventListener('input', renderFrequencyResponse);
inputs.final.addEventListener('input', renderFrequencyResponse);

BlogPlotly.observeTheme(renderFrequencyResponse, target);
renderFrequencyResponse();
