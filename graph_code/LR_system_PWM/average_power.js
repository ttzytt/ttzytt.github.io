const { common, text } = chartI18n;
const frequencyMin = 0.01;
const frequencyMax = 100;
const pointCount = 500;

function oneMinusExpNegative(value) {
  return -Math.expm1(-value);
}

function averagePower(duty, frequency, tau, referencePower) {
  if (duty <= 0 || referencePower <= 0) return 0;
  if (duty >= 1) return referencePower;

  const frequencyTau = frequency * tau;
  const onFactor = oneMinusExpNegative(duty / frequencyTau);
  const offFactor = oneMinusExpNegative((1 - duty) / frequencyTau);
  const periodFactor = oneMinusExpNegative(1 / frequencyTau);
  const normalizedPower =
    duty -
    frequencyTau * onFactor * offFactor / periodFactor;

  return referencePower * Math.min(duty, Math.max(0, normalizedPower));
}

function logarithmicValues(minimum, maximum, count) {
  return Array.from(
    { length: count },
    (_, index) => (
      minimum *
      Math.pow(maximum / minimum, index / (count - 1))
    )
  );
}

function frequencyDigits(frequency) {
  if (frequency < 0.1) return 3;
  if (frequency < 10) return 2;
  return 1;
}

function formatFrequency(frequency) {
  return frequency.toFixed(frequencyDigits(frequency));
}

function createDutyChart() {
  const dutyValues = Array.from(
    { length: pointCount },
    (_, index) => index / (pointCount - 1)
  );
  const { container, inputs, outputs } = BlogPlotly.createRangeControls(target, [
    {
      key: 'frequency',
      label: text.frequency,
      mathLabel: 'f',
      ariaLabel: text.frequencyLogarithmicAria,
      unit: 'Hz',
      min: Math.log10(frequencyMin),
      max: Math.log10(frequencyMax),
      step: 0.05,
      value: 0,
      digits: 2
    },
    {
      key: 'tau',
      label: text.timeConstant,
      mathLabel: '\\tau',
      unit: 's',
      min: 0.05,
      max: 10,
      step: 0.05,
      value: 2,
      digits: 2
    },
    {
      key: 'referencePower',
      label: text.dcPower,
      mathLabel: 'P_{\\mathrm{ref}}',
      unit: 'W',
      min: 1,
      max: 100,
      step: 1,
      value: 10,
      digits: 1
    }
  ], {
    separator: common.controlSeparator
  });

  function render() {
    const frequency = Math.pow(10, Number(inputs.frequency.value));
    const tau = Number(inputs.tau.value);
    const referencePower = Number(inputs.referencePower.value);
    const colors = BlogPlotly.getColors();
    const powerValues = dutyValues.map(duty => (
      averagePower(duty, frequency, tau, referencePower)
    ));
    const linearReferenceValues = dutyValues.map(
      duty => referencePower * duty
    );
    const quadraticReferenceValues = dutyValues.map(
      duty => referencePower * duty * duty
    );

    BlogPlotly.setOutput(
      outputs,
      'frequency',
      frequency,
      frequencyDigits(frequency)
    );
    BlogPlotly.setOutput(outputs, 'tau', tau, 2);
    BlogPlotly.setOutput(outputs, 'referencePower', referencePower, 1);

    const trace = {
      x: dutyValues,
      y: powerValues,
      type: 'scatter',
      mode: 'lines',
      name: '$\\overline{P}(D)$',
      line: {
        color: colors.primary,
        width: 3
      },
      hovertemplate:
        `D=%{x:.3f}<br>${text.periodAveragePower}=%{y:.3f} W<extra></extra>`
    };

    const linearReferenceTrace = {
      x: dutyValues,
      y: linearReferenceValues,
      type: 'scatter',
      mode: 'lines',
      name: '$P_{\\mathrm{ref}}D$',
      line: {
        color: colors.warning,
        width: 2,
        dash: 'dash'
      },
      hovertemplate:
        `${text.linearReference}<br>D=%{x:.3f}<br>` +
        `${text.power}=%{y:.3f} W<extra></extra>`
    };

    const quadraticReferenceTrace = {
      x: dutyValues,
      y: quadraticReferenceValues,
      type: 'scatter',
      mode: 'lines',
      name: '$P_{\\mathrm{ref}}D^2$',
      line: {
        color: colors.accent,
        width: 2,
        dash: 'dot'
      },
      hovertemplate:
        `${text.quadraticReference}<br>D=%{x:.3f}<br>` +
        `${text.power}=%{y:.3f} W<extra></extra>`
    };

    const layout = {
      ...BlogPlotly.baseLayout(colors),
      title: {
        text:
          `$\\overline{P}(D),\\quad f=${formatFrequency(frequency)}\\,\\mathrm{Hz},` +
          `\\quad \\tau=${tau.toFixed(2)}\\,\\mathrm{s},` +
          `\\quad P_{\\mathrm{ref}}=${referencePower.toFixed(1)}\\,\\mathrm{W}$`
      },
      margin: {
        l: 65,
        r: 20,
        t: 90,
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
        '$\\overline{P}\\; (\\mathrm{W})$',
        {
          range: [0, Math.max(1, referencePower * 1.05)]
        },
        colors
      ),
      legend: {
        orientation: 'h',
        x: 0,
        y: 1.08
      }
    };

    return Plotly.react(
      target,
      [trace, linearReferenceTrace, quadraticReferenceTrace],
      layout,
      BlogPlotly.getPlotConfig()
    );
  }

  inputs.frequency.addEventListener('input', render);
  inputs.tau.addEventListener('input', render);
  inputs.referencePower.addEventListener('input', render);
  BlogPlotly.observeTheme(render, target);
  BlogPlotly.initializeMathChart(target, container, render);
}

function createFrequencyChart() {
  const frequencyValues = logarithmicValues(
    frequencyMin,
    frequencyMax,
    pointCount
  );
  const { container, inputs, outputs } = BlogPlotly.createRangeControls(target, [
    {
      key: 'duty',
      label: text.dutyCycle,
      mathLabel: 'D',
      min: 0,
      max: 1,
      step: 0.05,
      value: 0.5,
      digits: 2
    },
    {
      key: 'tau',
      label: text.timeConstant,
      mathLabel: '\\tau',
      unit: 's',
      min: 0.05,
      max: 10,
      step: 0.05,
      value: 2,
      digits: 2
    },
    {
      key: 'referencePower',
      label: text.dcPower,
      mathLabel: 'P_{\\mathrm{ref}}',
      unit: 'W',
      min: 1,
      max: 100,
      step: 1,
      value: 10,
      digits: 1
    }
  ], {
    separator: common.controlSeparator
  });

  function render() {
    const duty = Number(inputs.duty.value);
    const tau = Number(inputs.tau.value);
    const referencePower = Number(inputs.referencePower.value);
    const colors = BlogPlotly.getColors();
    const powerValues = frequencyValues.map(frequency => (
      averagePower(duty, frequency, tau, referencePower)
    ));
    const frequencyAxisType =
      target.layout?.xaxis?.type === 'linear' ? 'linear' : 'log';
    const frequencyAxisRange = frequencyAxisType === 'linear'
      ? [frequencyMin, frequencyMax]
      : [Math.log10(frequencyMin), Math.log10(frequencyMax)];

    BlogPlotly.setOutput(outputs, 'duty', duty, 2);
    BlogPlotly.setOutput(outputs, 'tau', tau, 2);
    BlogPlotly.setOutput(outputs, 'referencePower', referencePower, 1);

    const trace = {
      x: frequencyValues,
      y: powerValues,
      type: 'scatter',
      mode: 'lines',
      name: '$\\overline{P}$',
      line: {
        color: colors.warning,
        width: 3
      },
      hovertemplate:
        `f=%{x:.3g} Hz<br>${text.periodAveragePower}=%{y:.3f} W<extra></extra>`
    };

    const layout = {
      ...BlogPlotly.baseLayout(colors),
      title: {
        text:
          `$\\overline{P}(f),\\quad D=${duty.toFixed(2)},` +
          `\\quad \\tau=${tau.toFixed(2)}\\,\\mathrm{s},` +
          `\\quad P_{\\mathrm{ref}}=${referencePower.toFixed(1)}\\,\\mathrm{W}$`
      },
      margin: {
        l: 65,
        r: 20,
        t: 65,
        b: 70
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
        '$\\overline{P}\\; (\\mathrm{W})$',
        {
          range: [
            0,
            Math.max(1, referencePower * Math.max(duty, 0.05) * 1.1)
          ]
        },
        colors
      ),
      showlegend: false,
      updatemenus: BlogPlotly.axisScaleButtons({
        currentType: frequencyAxisType,
      logarithmicRange: [
        Math.log10(frequencyMin),
        Math.log10(frequencyMax)
      ],
      linearRange: [frequencyMin, frequencyMax],
      labels: {
        logarithmic: common.logarithmicScale,
        linear: common.linearScale
      }
    }, colors)
    };

    return Plotly.react(
      target,
      [trace],
      layout,
      BlogPlotly.getPlotConfig()
    );
  }

  inputs.duty.addEventListener('input', render);
  inputs.tau.addEventListener('input', render);
  inputs.referencePower.addEventListener('input', render);
  BlogPlotly.observeTheme(render, target);
  BlogPlotly.initializeMathChart(target, container, render);
}

if (target.id === 'pwm-average-power-duty') {
  createDutyChart();
} else if (target.id === 'pwm-average-power-frequency') {
  createFrequencyChart();
} else {
  throw new Error(`Unknown average-power chart target: ${target.id}`);
}
