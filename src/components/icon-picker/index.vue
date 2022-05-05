<template>
  <a-select
    :options="icons"
    :placeholder="$t('iconPicker.placeholder')"
    unmount-on-close
  >
  </a-select>
</template>

<script lang="ts" setup>
  import { SelectOptionData } from '@arco-design/web-vue';
  import {
    IconApps,
    IconBarChart,
    IconBook,
    IconBookmark,
    IconBranch,
    IconBug,
    IconBulb,
    IconCalendar,
    IconCamera,
    IconCloud,
    IconCommand,
    IconCommon,
    IconCompass,
    IconComputer,
    IconCopyright,
    IconDashboard,
    IconDesktop,
    IconDice,
    IconEmail,
    IconExperiment,
    IconFire,
    IconLayers,
    IconLock,
    IconMobile,
    IconPublic,
    IconRelation,
    IconRobot,
    IconSafe,
    IconWifi,
  } from '@arco-design/web-vue/es/icon';
  import { h } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { SelectOptionValue } from '@arco-design/web-vue/es/select/interface';

  const { t } = useI18n();
  const icons = [
    {
      value: 'icon-apps',
      label: t('icon.apps'),
      render: () =>
        h('div', {}, [
          h(IconApps),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.apps')
          ),
        ]),
    },

    {
      value: 'icon-bar-chart',
      label: t('icon.bar-chart'),
      render: () =>
        h('div', {}, [
          h(IconBarChart),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.bar-chart')
          ),
        ]),
    },
    {
      value: 'icon-book',
      label: t('icon.book'),
      render: () =>
        h('div', {}, [
          h(IconBook),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.book')
          ),
        ]),
    },
    {
      value: 'icon-bookmark',
      label: t('icon.bookmark'),
      render: () =>
        h('div', {}, [
          h(IconBookmark),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.bookmark')
          ),
        ]),
    },
    {
      value: 'icon-branch',
      label: t('icon.branch'),
      render: () =>
        h('div', {}, [
          h(IconBranch),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.branch')
          ),
        ]),
    },
    {
      value: 'icon-bug',
      label: t('icon.bug'),
      render: () =>
        h('div', {}, [
          h(IconBug),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.bug')
          ),
        ]),
    },
    {
      value: 'icon-bulb',
      label: t('icon.bulb'),
      render: () =>
        h('div', {}, [
          h(IconBulb),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.bulb')
          ),
        ]),
    },
    {
      value: 'icon-calendar',
      label: t('icon.calendar'),
      render: () =>
        h('div', {}, [
          h(IconCalendar),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.calendar')
          ),
        ]),
    },
    {
      value: 'icon-camera',
      label: t('icon.camera'),
      render: () =>
        h('div', {}, [
          h(IconCamera),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.camera')
          ),
        ]),
    },
    {
      value: 'icon-cloud',
      label: t('icon.cloud'),
      render: () =>
        h('div', {}, [
          h(IconCloud),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.cloud')
          ),
        ]),
    },
    {
      value: 'icon-command',
      label: t('icon.command'),
      render: () =>
        h('div', {}, [
          h(IconCommand),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.command')
          ),
        ]),
    },
    {
      value: 'icon-common',
      label: t('icon.common'),
      render: () =>
        h('div', {}, [
          h(IconCommon),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.common')
          ),
        ]),
    },
    {
      value: 'icon-compass',
      label: t('icon.compass'),
      render: () =>
        h('div', {}, [
          h(IconCompass),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.compass')
          ),
        ]),
    },
    {
      value: 'icon-computer',
      label: t('icon.computer'),
      render: () =>
        h('div', {}, [
          h(IconComputer),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.computer')
          ),
        ]),
    },
    {
      value: 'icon-dashboard',
      label: t('icon.dashboard'),
      render: () =>
        h('div', {}, [
          h(IconDashboard),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.dashboard')
          ),
        ]),
    },
    {
      value: 'icon-copyright',
      label: t('icon.copyright'),
      render: () =>
        h('div', {}, [
          h(IconCopyright),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.copyright')
          ),
        ]),
    },
    {
      value: 'icon-desktop',
      label: t('icon.desktop'),
      render: () =>
        h('div', {}, [
          h(IconDesktop),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.desktop')
          ),
        ]),
    },
    {
      value: 'icon-dice',
      label: t('icon.dice'),
      render: () =>
        h('div', {}, [
          h(IconDice),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.dice')
          ),
        ]),
    },
    {
      value: 'icon-email',
      label: t('icon.email'),
      render: () =>
        h('div', {}, [
          h(IconEmail),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.email')
          ),
        ]),
    },
    {
      value: 'icon-experiment',
      label: t('icon.experiment'),
      render: () =>
        h('div', {}, [
          h(IconExperiment),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.experiment')
          ),
        ]),
    },
    {
      value: 'icon-layers',
      label: t('icon.layers'),
      render: () =>
        h('div', {}, [
          h(IconLayers),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.layers')
          ),
        ]),
    },
    {
      value: 'icon-fire',
      label: t('icon.fire'),
      render: () =>
        h('div', {}, [
          h(IconFire),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.fire')
          ),
        ]),
    },
    {
      value: 'icon-lock',
      label: t('icon.lock'),
      render: () =>
        h('div', {}, [
          h(IconLock),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.lock')
          ),
        ]),
    },
    {
      value: 'icon-mobile',
      label: t('icon.mobile'),
      render: () =>
        h('div', {}, [
          h(IconMobile),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.mobile')
          ),
        ]),
    },
    {
      value: 'icon-public',
      label: t('icon.public'),
      render: () =>
        h('div', {}, [
          h(IconPublic),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.public')
          ),
        ]),
    },
    {
      value: 'icon-relation',
      label: t('icon.relation'),
      render: () =>
        h('div', {}, [
          h(IconRelation),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.relation')
          ),
        ]),
    },
    {
      value: 'icon-robot',
      label: t('icon.robot'),
      render: () =>
        h('div', {}, [
          h(IconRobot),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.robot')
          ),
        ]),
    },
    {
      value: 'icon-wifi',
      label: t('icon.wifi'),
      render: () =>
        h('div', {}, [
          h(IconWifi),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.wifi')
          ),
        ]),
    },
    {
      value: 'icon-safe',
      label: t('icon.safe'),
      render: () =>
        h('div', {}, [
          h(IconSafe),
          h(
            'span',
            {
              style: {
                marginLeft: '10px',
              },
            },
            t('icon.safe')
          ),
        ]),
    },
  ];
</script>

<script lang="ts">
  export default {
    name: 'IconPicker',
  };
</script>

<style scoped></style>
