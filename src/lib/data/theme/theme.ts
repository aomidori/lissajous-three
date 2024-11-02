type Theme = {
  three: {
    backgroundColor: number;
    lineColor: number;
    gridColor: number;
  },
  colors: {
    primary: string;
    secondary: string;
  },
}

export const theme: Theme = {
  three: {
    backgroundColor: 0x000000,
    lineColor: 0x00BA88,
    gridColor: 0x644040
  },
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
};
