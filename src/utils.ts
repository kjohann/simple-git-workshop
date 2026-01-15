import { resolve } from 'path';

/**
 * Check if a specific flag is present
 */
export function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

/**
 * Get the path to a task repository
 */
export function getTaskPath(taskNumber: number): string {
  return resolve(process.cwd(), `task${taskNumber}`);
}
