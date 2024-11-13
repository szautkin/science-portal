export interface ChartOptions {
  indexAxis: 'x' | 'y' | undefined;
  maintainAspectRatio: boolean;
  plugins: {
    title: {
      display: boolean;
    };
  };
  responsive: boolean;
  scales: {
    x: {
      stacked: boolean;
      grid: {
        display: boolean;
      };
      max: number;
    };
    y: {
      beginAtZero: boolean;
      stacked: boolean;
      grid: {};
      max: number;
    };
  };
  borderRadius: number;
  barThickness: number;
}
