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

const { container, inputs, outputs } = BlogPlotly.createRangeControls(target, [
  {
    key: 'duty',
    label: '占空比',
    mathLabel: 'D',
    min: 0,
    max: 1,
    step: 0.05,
    value: 0.5,
    digits: 2
  },
  {
    key: 'tau',
    label: '时间常数',
    mathLabel: '\\tau',
    unit: 's',
    min: 0.05,
    max: 10,
    step: 0.05,
    value: 2,
    digits: 2
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
  const frequencyAxisType =
    target.layout?.xaxis?.type === 'linear' ? 'linear' : 'log';
  const frequencyAxisRange = frequencyAxisType === 'linear'
    ? [frequencyMin, frequencyMax]
    : [Math.log10(frequencyMin), Math.log10(frequencyMax)];

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
  BlogPlotly.setOutput(outputs, 'tau', tau, 2);
  BlogPlotly.setOutput(outputs, 'final', finalCurrent);

  const maximumTrace = {
    x: frequencyValues,
    y: maximumValues,
    type: 'scatter',
    mode: 'lines',
    name: '$i_{\\max}\\;\\text{周期峰值电流}$',
    line: {
      color: colors.primary,
      width: 3
    },
    hovertemplate:
      'f=%{x:.3g} Hz<br>周期峰值电流=%{y:.3f} A<extra></extra>'
  };

  const minimumTrace = {
    x: frequencyValues,
    y: minimumValues,
    type: 'scatter',
    mode: 'lines',
    name: '$i_{\\min}\\;\\text{周期谷值电流}$',
    line: {
      color: colors.warning,
      width: 3
    },
    hovertemplate:
      'f=%{x:.3g} Hz<br>周期谷值电流=%{y:.3f} A<extra></extra>'
  };

  const layout = {
    ...BlogPlotly.baseLayout(colors),
    title: {
      text:
        `$i_{\\max}(f),\\ i_{\\min}(f),\\quad D=${duty.toFixed(2)},` +
        `\\quad \\tau=${tau.toFixed(2)}\\,\\mathrm{s},` +
        `\\quad i_f=${finalCurrent.toFixed(1)}\\,\\mathrm{A}$`
    },
    margin: {
      l: 60,
      r: 20,
      t: 65,
      b: 65
    },
    xaxis: BlogPlotly.axis(
      '$f\\; (\\mathrm{Hz})$',
      {
        type: frequencyAxisType,
        range: frequencyAxisRange
      },
      colors
    ),
    yaxis: BlogPlotly.axis(
      '$i\\; (\\mathrm{A})$',
      {
        range: [0, Math.max(1, finalCurrent) * 1.1]
      },
      colors
    ),
    legend: {
      orientation: 'h',
      x: 0,
      y: 1.08
    },
    updatemenus: BlogPlotly.axisScaleButtons({
      currentType: frequencyAxisType,
      logarithmicRange: [
        Math.log10(frequencyMin),
        Math.log10(frequencyMax)
      ],
      linearRange: [frequencyMin, frequencyMax]
    }, colors)
  };

  return Plotly.react(
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
BlogPlotly.initializeMathChart(target, container, renderFrequencyResponse);
