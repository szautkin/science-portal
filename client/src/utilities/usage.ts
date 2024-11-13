import { PlatformUsage, StatsData } from '../context/data/types';

const processPlatformUsage = (platformUsage: StatsData): PlatformUsage => {
  const zeroPrefix = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  const parseFileSize = (size: string): number => {
    const match = size.match(/^(\d+(\.\d+)?)(G|M|K)?$/);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[3] || 'G';
    switch (unit) {
      case 'G':
        return value;
      case 'M':
        return value / 1024;
      case 'K':
        return value / (1024 * 1024);
      default:
        return value;
    }
  };

  const nowDate = new Date();
  const month = nowDate.getUTCMonth() + 1;
  const updated = `${nowDate.getUTCFullYear()}-${zeroPrefix(month)}-${zeroPrefix(nowDate.getUTCDate())} ${zeroPrefix(nowDate.getUTCHours())}:${zeroPrefix(nowDate.getMinutes())}`;

  const requestedRAMGB = parseFileSize(platformUsage.ram.requestedRAM);
  const availableRAMGB = parseFileSize(platformUsage.ram.ramAvailable);

  const generateColor = (index: number, isHover: boolean = false): string => {
    const hue = (index * 137.5) % 360;
    const saturation = isHover ? '75%' : '65%';
    const lightness = isHover ? '45%' : '55%';
    return `hsl(${hue}, ${saturation}, ${lightness})`;
  };

  const processedUsage: PlatformUsage = {
    updated,
    cpu: {
      used: platformUsage.cores.requestedCPUCores,
      free:
        platformUsage.cores.cpuCoresAvailable -
        platformUsage.cores.requestedCPUCores,
      total: platformUsage.cores.cpuCoresAvailable,
      display: {
        free: (
          platformUsage.cores.cpuCoresAvailable -
          platformUsage.cores.requestedCPUCores
        ).toFixed(1),
        total: platformUsage.cores.cpuCoresAvailable.toFixed(1),
      },
    },
    ram: {
      unit: 'GB',
      used: requestedRAMGB,
      free: availableRAMGB - requestedRAMGB,
      total: availableRAMGB,
      display: {
        free: (availableRAMGB - requestedRAMGB).toFixed(2),
        total: availableRAMGB.toFixed(2),
      },
    },
    instances: {
      labels: [],
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      total: platformUsage.instances.total,
      biggestCount: 0,
    },
    listType: 'data',
  };

  let biggestCount = 0;
  Object.entries(platformUsage.instances).forEach(([key, val], i) => {
    if (key !== 'total') {
      processedUsage.instances.labels.push(key);
      processedUsage.instances.data.push(val);
      processedUsage.instances.backgroundColor.push(generateColor(i));
      processedUsage.instances.hoverBackgroundColor.push(
        generateColor(i, true),
      );
      biggestCount = Math.max(val, biggestCount);
    }
  });

  processedUsage.instances.biggestCount = Math.ceil(biggestCount / 10) * 10;

  return processedUsage;
};

export default processPlatformUsage;
