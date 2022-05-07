<template>
  <a-select
    :placeholder="$t('iconPicker.placeholder')"
    unmount-on-close
    allow-clear
  >
    <a-option value="icon-apps" :label="$t('icon.apps')">
      <a-space
        ><icon-apps /> <span>{{ $t('icon.apps') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-bar-chart" :label="$t('icon.bar-chart')">
      <a-space
        ><icon-bar-chart /> <span>{{ $t('icon.bar-chart') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-book" :label="$t('icon.book')">
      <a-space
        ><icon-book /> <span>{{ $t('icon.book') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-bookmark" :label="$t('icon.bookmark')">
      <a-space
        ><icon-bookmark /> <span>{{ $t('icon.bookmark') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-branch" :label="$t('icon.branch')">
      <a-space
        ><icon-branch /> <span>{{ $t('icon.branch') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-bug" :label="$t('icon.bug')">
      <a-space
        ><icon-bug /> <span>{{ $t('icon.bug') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-bulb" :label="$t('icon.bulb')">
      <a-space
        ><icon-bulb /> <span>{{ $t('icon.bulb') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-calendar" :label="$t('icon.calendar')">
      <a-space
        ><icon-calendar /> <span>{{ $t('icon.calendar') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-camera" :label="$t('icon.camera')">
      <a-space
        ><icon-camera /> <span>{{ $t('icon.camera') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-cloud" :label="$t('icon.cloud')">
      <a-space
        ><icon-cloud /> <span>{{ $t('icon.cloud') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-command" :label="$t('icon.command')">
      <a-space
        ><icon-command /> <span>{{ $t('icon.command') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-common" :label="$t('icon.common')">
      <a-space
        ><icon-common /> <span>{{ $t('icon.common') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-computer" :label="$t('icon.computer')">
      <a-space
        ><icon-computer /> <span>{{ $t('icon.computer') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-dashboard" :label="$t('icon.dashboard')">
      <a-space
        ><icon-dashboard /> <span>{{ $t('icon.dashboard') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-copyright" :label="$t('icon.copyright')">
      <a-space
        ><icon-copyright /> <span>{{ $t('icon.copyright') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-desktop" :label="$t('icon.desktop')">
      <a-space
        ><icon-desktop /> <span>{{ $t('icon.desktop') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-dice" :label="$t('icon.dice')">
      <a-space
        ><icon-dice /> <span>{{ $t('icon.dice') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-email" :label="$t('icon.email')">
      <a-space
        ><icon-email /> <span>{{ $t('icon.email') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-experiment" :label="$t('icon.experiment')">
      <a-space
        ><icon-experiment /> <span>{{ $t('icon.experiment') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-layers" :label="$t('icon.layers')">
      <a-space
        ><icon-layers /> <span>{{ $t('icon.layers') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-fire" :label="$t('icon.fire')">
      <a-space
        ><icon-fire /> <span>{{ $t('icon.fire') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-lock" :label="$t('icon.lock')">
      <a-space
        ><icon-lock /> <span>{{ $t('icon.lock') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-mobile" :label="$t('icon.mobile')">
      <a-space
        ><icon-mobile /> <span>{{ $t('icon.mobile') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-public" :label="$t('icon.public')">
      <a-space
        ><icon-public /> <span>{{ $t('icon.public') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-relation" :label="$t('icon.relation')">
      <a-space
        ><icon-relation /> <span>{{ $t('icon.lock') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-robot" :label="$t('icon.robot')">
      <a-space
        ><icon-robot /> <span>{{ $t('icon.robot') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-wifi" :label="$t('icon.wifi')">
      <a-space
        ><icon-wifi /> <span>{{ $t('icon.wifi') }}</span></a-space
      >
    </a-option>
    <a-option value="icon-safe" :label="$t('icon.safe')">
      <a-space
        ><icon-safe /> <span>{{ $t('icon.safe') }}</span></a-space
      >
    </a-option>
  </a-select>
</template>

<script lang="ts" setup></script>

<script lang="ts">
  export default {
    name: 'IconPicker',
  };
</script>

<style scoped></style>
