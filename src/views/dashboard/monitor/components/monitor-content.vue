<template>
  <a-card class="general-card" :title="$t('monitor.overview')">
    <a-row justify="space-between">
      <a-col
        v-for="(item, idx) in renderData"
        :key="idx"
        :xs="24"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
        :xxl="6"
      >
        <a-statistic
          :title="item.title"
          :value="item.value"
          show-group-separator
          :precision="item.precision"
        >
          <template #prefix>
            <span
              class="statistic-prefix"
              :style="{ background: item.prefix.background }"
            >
              <component
                :is="item.prefix.icon"
                :style="{ color: item.prefix.iconColor }"
              />
            </span>
          </template>
          <template #suffix>{{ item.suffix }}</template>
        </a-statistic>
      </a-col>
    </a-row>

    <Chart
      v-if="chartType === 'cpu'"
      style="height: 328px; margin-top: 20px"
      :option="cpuChart"
    />
    <Chart
      v-else-if="chartType === 'memory'"
      style="height: 328px; margin-top: 20px"
      :option="ramChart"
    />
    <Chart
      v-else-if="chartType === 'latency'"
      style="height: 328px; margin-top: 20px"
      :option="latencyChart"
    />
    <template #actions>
      <a-radio-group v-model="chartType" type="button">
        <a-radio value="cpu">{{ $t('monitor.cpu') }}</a-radio>
        <a-radio value="memory">{{ $t('monitor.memory') }}</a-radio>
        <a-radio value="latency">{{ $t('monitor.latency') }}</a-radio>
      </a-radio-group>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
  import { useRequest } from 'vue-request';
  import { getMonitorInfo } from '@/api/monitor';
  import { useI18n } from 'vue-i18n';
  import { computed, ref } from 'vue';
  import dayjs from 'dayjs';
  import { MonitorReply } from '@/api/model/monitor';
  import useThemes from '@/hooks/themes';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { graphic, LineSeriesOption } from 'echarts';
  import { AnyObject } from '@/types/global';

  function graphicFactory(side: AnyObject) {
    return {
      type: 'text',
      bottom: '8',
      ...side,
      style: {
        text: '',
        textAlign: 'center',
        fill: '#4E5969',
        fontSize: 12,
      },
    };
  }
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return [0, 'Bytes'];
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return [parseFloat((bytes / k ** i).toFixed(dm)), sizes[i]];
  }
  const chartType = ref<string>('cpu');
  const { t } = useI18n();
  const { isDark } = useThemes();
  const performance = ref({
    before: 0,
    after: 0,
    duration: 0,
  });
  const graphicElements = ref([
    graphicFactory({ left: '2.6%' }),
    graphicFactory({ right: 0 }),
  ]);
  const tooltipItemsHtmlString = (
    items: ToolTipFormatterParams[],
    suffix: string
  ) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span><span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">${el.value.toLocaleString()}${suffix}</span>
      </div>`
      )
      .reverse()
      .join('');
  };
  const generateSeries = (
    name: string,
    lineColor: string,
    itemBorderColor: string,
    data: number[]
  ): LineSeriesOption => {
    return {
      name,
      data,
      stack: 'Total',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        color: lineColor,
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: lineColor,
          borderWidth: 2,
          borderColor: itemBorderColor,
        },
      },
      lineStyle: {
        width: 2,
        color: lineColor,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.1,
        color: lineColor,
      },
    };
  };
  const xAxis = ref<string[]>([]);
  const latencyData = ref<number[]>([]);
  const procRamData = ref<number[]>([]);
  const procCpuData = ref<number[]>([]);
  const cpuData = ref<number[]>([]);
  const { data } = useRequest<MonitorReply>(getMonitorInfo, {
    pollingInterval: 1000,
    pollingWhenHidden: true,
    onBefore: () => {
      performance.value.before = dayjs().valueOf();
    },
    onSuccess: (resp: MonitorReply) => {
      performance.value.after = dayjs().valueOf();
      performance.value.duration =
        performance.value.after - performance.value.before;
      xAxis.value.push(dayjs().format('HH:mm:ss'));
      latencyData.value.push(performance.value.duration);
      procRamData.value.push(formatBytes(resp?.pid?.ram)[0] as number);
      procCpuData.value.push(parseFloat(resp?.pid?.cpu.toFixed(2)));
      cpuData.value.push(parseFloat(resp?.os?.cpu.toFixed(2)));
      const limit = 8;
      while (xAxis.value.length > limit) {
        xAxis.value.shift();
        latencyData.value.shift();
        procRamData.value.shift();
        procCpuData.value.shift();
        cpuData.value.shift();
      }
    },
  });
  const { chartOption: latencyChart } = useChartOption(() => {
    return {
      grid: {
        left: '3.6%',
        right: '0',
        top: '10',
        bottom: '30',
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: xAxis.value,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === xAxis.value.length - 1) return '';
            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: (idx: number) => {
            if (idx === 0) return false;
            return idx !== xAxis.value.length - 1;
          },
          lineStyle: {
            color: '#E5E8EF',
          },
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#23ADFF',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value: any, idx: number) {
            if (idx === 0) return value;
            return `${value}ms`;
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#E5E8EF',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span>响应时间</span><span class="tooltip-value">${firstElement.value.toLocaleString()}ms</span></div>
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      graphic: {
        elements: graphicElements.value,
      },
      series: [
        {
          data: latencyData.value,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 12,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
            },
          },
          lineStyle: {
            width: 3,
            color: new graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: 'rgba(30, 231, 255, 1)',
              },
              {
                offset: 0.5,
                color: 'rgba(36, 154, 255, 1)',
              },
              {
                offset: 1,
                color: 'rgba(111, 66, 251, 1)',
              },
            ]),
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(17, 126, 255, 0.16)',
              },
              {
                offset: 1,
                color: 'rgba(17, 128, 255, 0)',
              },
            ]),
          },
        },
      ],
    };
  });
  const { chartOption: ramChart } = useChartOption(() => {
    return {
      grid: {
        left: '3.6%',
        right: '0',
        top: '10',
        bottom: '30',
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: xAxis.value,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === xAxis.value.length - 1) return '';
            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: (idx: number) => {
            if (idx === 0) return false;
            return idx !== xAxis.value.length - 1;
          },
          lineStyle: {
            color: '#E5E8EF',
          },
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#43f0d3',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value: any, idx: number) {
            if (idx === 0) return value;
            return `${value}MB`;
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#E5E8EF',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span>内存占用</span><span class="tooltip-value">${firstElement.value.toLocaleString()}MB</span></div>
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      graphic: {
        elements: graphicElements.value,
      },
      series: [
        {
          data: procRamData.value,
          type: 'line',
          smooth: true,
          symbolSize: 12,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
            },
          },
          lineStyle: {
            width: 3,
            color: new graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: 'rgba(105, 240, 174, 1)',
              },
              {
                offset: 0.5,
                color: 'rgba(0, 230, 118, 1)',
              },
              {
                offset: 1,
                color: 'rgba(116, 184, 22, 1)',
              },
            ]),
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(62, 163, 93, 0.16)',
              },
              {
                offset: 1,
                color: 'rgba(17, 128, 255, 0)',
              },
            ]),
          },
        },
      ],
    };
  });
  const { chartOption: cpuChart } = useChartOption((dark) => {
    return {
      grid: {
        left: '4.6%',
        right: '4',
        top: '40',
        bottom: '40',
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: xAxis.value,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === xAxis.value.length - 1) return '';
            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#d9480f',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value: number, idx: number) {
            if (idx === 0) return String(value);
            return `${value}%`;
          },
        },
        splitLine: {
          lineStyle: {
            color: dark ? '#2E2E30' : '#F2F3F5',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[], '%')}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      graphic: {
        elements: graphicElements.value,
      },
      series: [
        generateSeries(
          t('monitor.process.cpu'),
          '#ffd43b',
          '#E8FFFB',
          procCpuData.value
        ),
        generateSeries(
          t('monitor.os.cpu'),
          '#f08c00',
          '#E8F3FF',
          cpuData.value
        ),
      ],
    };
  });
  const procRam = computed(() => {
    const bytes = data.value?.pid?.ram || 0;
    return formatBytes(bytes);
  });
  const renderData = computed(() => [
    {
      title: t('monitor.cpu'),
      value: 10 * parseFloat(data.value?.pid?.cpu.toFixed(2) as string),
      prefix: {
        icon: 'icon-computer',
        background: isDark.value ? '#593E2F' : '#FFE4BA',
        iconColor: isDark.value ? '#F29A43' : '#F77234',
      },
      precision: 2,
      suffix: `‰`,
    },
    {
      title: t('monitor.memory'),
      value: procRam.value[0],
      prefix: {
        icon: 'icon-dashboard',
        background: isDark.value ? '#3D5A62' : '#E8FFFB',
        iconColor: isDark.value ? '#6ED1CE' : '#33D1C9',
      },
      suffix: procRam.value[1],
      precision: 2,
    },
    {
      title: t('monitor.latency'),
      value: performance.value.duration,
      prefix: {
        icon: 'icon-wifi',
        background: isDark.value ? '#354276' : '#E8F3FF',
        iconColor: isDark.value ? '#4A7FF7' : '#165DFF',
      },
      suffix: 'ms',
      precision: 0,
    },
    {
      title: t('monitor.conns'),
      value: data.value?.pid?.conns,
      prefix: {
        icon: 'icon-cloud',
        background: isDark.value ? '#3F385E' : '#F5E8FF',
        iconColor: isDark.value ? '#8558D3' : '#722ED1',
      },
      suffix: '',
      precision: 0,
    },
  ]);
</script>

<style scoped lang="less">
  :deep(.arco-statistic) {
    .arco-statistic-title {
      color: rgb(var(--gray-10));
      font-weight: bold;
    }

    .arco-statistic-value {
      display: flex;
      align-items: center;
    }
  }

  .statistic-prefix {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    color: var(--color-white);
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    border-radius: 6px;
  }
</style>
