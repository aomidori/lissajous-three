import { writable } from 'svelte/store';
import { Pane } from 'tweakpane';
import { theme } from './theme/theme';

let pane: Pane | null = null;

export type Settings = {
  xFrequency: number;
  yFrequency: number;
  zFrequency: number;
  dimension: '2D' | '3D';
  color: number;
};

const settings: Settings = {
  xFrequency: 1,
  yFrequency: 0.4,
  zFrequency: 0.5,
  dimension: '3D',
  color: theme.three.lineColor,
};

const settingsStore = writable<Settings>({ ...settings });

const addGuiControls = () => {
  if (pane) {
    removeGuiControls();
  }

  pane = new Pane();
  pane
    .addBinding(settings, 'xFrequency', {
      label: 'xFrequency',
      min: 0,
      max: 1,
      step: 0.1,
    })
    .on('change', (event) => {
      settingsStore.update((s) => {
        s.xFrequency = event.value;
        return s;
      });
    });

  pane
    .addBinding(settings, 'yFrequency', {
      label: 'yFrequency',
      min: 0,
      max: 1,
      step: 0.1,
    })
    .on('change', (event) => {
      settingsStore.update((s) => {
        s.yFrequency = event.value;
        return s;
      });
    });

  pane
    .addBinding(settings, 'zFrequency', {
      label: 'zFrequency',
      min: 0,
      max: 1,
      step: 0.1,
    })
    .on('change', (event) => {
      settingsStore.update((s) => {
        s.zFrequency = event.value;
        return s;
      });
    });

  const themeDir = pane.addFolder({ title: 'theme', expanded: true });
  themeDir
    .addBinding(settings, 'color', {
      label: 'color',
      view: 'color',
    })
    .on('change', (event) => {
      settingsStore.update((s) => {
        s.color = event.value;
        return s;
      });
    });
};

const removeGuiControls = () => {
  if (pane) {
    pane.dispose();
    pane = null;
  }
};

const setGuiControlsVisibility = (visible: boolean) => {
  if (pane) {
    pane.hidden = !visible;
  }
};

const getSetting = (k: keyof Settings) => settings[k];

export {
  settings,
  settingsStore,
  addGuiControls,
  removeGuiControls,
  getSetting,
  setGuiControlsVisibility,
};
