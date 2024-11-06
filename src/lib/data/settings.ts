import { writable } from 'svelte/store'
import type { GUI } from 'dat.gui';
import { theme } from './theme/theme';

let gui: GUI | null = null;

export type Settings = {
  xFrequency: number;
  yFrequency: number;
  zFrequency: number;
  dimension: '2D' | '3D';
  color: number;
}

const settings: Settings = {
  xFrequency: 1,
  yFrequency: 0.25,
  zFrequency: 0.5,
  dimension: '3D',
  color: theme.three.lineColor,
};

const settingsStore = writable<Settings>({...settings});

const addGuiControls = () => {
  if (gui) {
    removeGuiControls();
  }
  import ('dat.gui').then((dat) => {
    gui = new dat.GUI();
    gui.addFolder('FREQUENCY');
    gui.add(settings, 'xFrequency', 0, 1).name('X Frequency').step(0.1).onChange((value) => {
      settingsStore.update((s) => { s.xFrequency = value; return s; });
    });
    gui.add(settings, 'yFrequency', 0, 1).name('Y Frequency').step(0.1).onChange((value) => {
      settingsStore.update((s) => { s.yFrequency = value; return s; });
    });
    gui.add(settings, 'zFrequency', 0, 1).name('Z Frequency').step(0.1).onChange((value) => {
      settingsStore.update((s) => { s.zFrequency = value; return s; });
    });
    gui.addColor(settings, 'color').name('Line Color').onChange((value) => {
      settingsStore.update((s) => { s.color = value; return s; });
    });
    gui.show();
  });
}

const removeGuiControls = () => {
  if (gui) {
    gui.destroy();
    gui = null;
  }
}

const getSetting = (k: keyof Settings) => settings[k];

export {
  gui,
  settings,
  settingsStore,
  addGuiControls,
  removeGuiControls,
  getSetting,
};
