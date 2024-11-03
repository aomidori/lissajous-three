import { writable } from 'svelte/store'
import type { GUI } from 'dat.gui';

let gui: GUI | null = null;

type Settings = {
  xFrequency: number;
  yFrequency: number;
  zFrequency: number;
  dimension: '2D' | '3D';
}

const settings: Settings = {
  xFrequency: 0,
  yFrequency: 0,
  zFrequency: 0,
  dimension: '3D',
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

    gui.addFolder('mode');
    gui.add(settings, 'dimension', ['2D', '3D']).name('Dimension').onChange((value) => {
      settingsStore.update((s) => { s.dimension = value; return s; });
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
