import { ChildProcess, SpawnOptions } from "child_process";

/**
 * Spawn a process using async/await
 *
 * @param {string} command The first number to add.
 * @param {string[]} args The second number to add.
 * @param {SpawnOptions} options The second number to add.
 * @returns {ChildProcess} The resulting sum of the two numbers.
 */
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptions
): ChildProcess;
