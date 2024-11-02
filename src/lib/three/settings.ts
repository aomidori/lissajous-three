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

const addGuiControls = () => {
  import ('dat.gui').then((dat) => {
    gui = new dat.GUI();
    gui.addFolder('FREQUENCY');
    gui.add(settings, 'xFrequency', 0, 1).name('X Frequency');
    gui.add(settings, 'yFrequency', 0, 1).name('Y Frequency');
    gui.add(settings, 'zFrequency', 0, 1).name('Z Frequency');

    gui.addFolder('mode');
    gui.add(settings, 'dimension', ['2D', '3D']).name('Dimension');
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
  addGuiControls,
  removeGuiControls,
  getSetting,
};
