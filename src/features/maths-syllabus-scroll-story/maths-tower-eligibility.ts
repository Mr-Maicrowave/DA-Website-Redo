export interface TowerPerformanceSignals {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  saveData?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readTowerPerformanceSignals(source: unknown): TowerPerformanceSignals {
  if (!isRecord(source)) return {};

  const signals: TowerPerformanceSignals = {};
  if (typeof source.hardwareConcurrency === 'number' && Number.isFinite(source.hardwareConcurrency)) {
    signals.hardwareConcurrency = source.hardwareConcurrency;
  }
  if (typeof source.deviceMemory === 'number' && Number.isFinite(source.deviceMemory)) {
    signals.deviceMemory = source.deviceMemory;
  }
  if (isRecord(source.connection) && typeof source.connection.saveData === 'boolean') {
    signals.saveData = source.connection.saveData;
  }

  return signals;
}

export function isLowPerformanceDevice(signals: TowerPerformanceSignals | undefined): boolean {
  if (!signals) return false;

  return signals.saveData === true
    || (typeof signals.deviceMemory === 'number' && signals.deviceMemory <= 4)
    || (typeof signals.hardwareConcurrency === 'number' && signals.hardwareConcurrency <= 4);
}
