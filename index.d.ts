import {
  ChildProcess,
  AsyncSpawnPromiseByStdio,
  AsyncSpawnPromiseWithoutNullStreams,
  SpawnOptions,
  SpawnOptionsWithoutStdio,
  SpawnOptionsWithStdioTuple,
} from "child_process";
import { Readable, Stream, Writable } from "stream";

type StdioNull = "inherit" | "ignore" | Stream;
type StdioPipeNamed = "pipe" | "overlapped";
type StdioPipe = undefined | null | StdioPipeNamed;

type Stdout = "" | BufferList;
type Stderr = "" | BufferList;

type AsyncSpawnError = Error & { stderr: Stderr; stdout: Stdout };
interface AsyncSpawnPromiseWithoutNullStreams extends Promise {
  child: AsyncSpawnPromiseWithoutNullStreams;
}
interface AsyncSpawnPromiseByStdio extends Promise {
  child: AsyncSpawnPromiseByStdio;
}
interface AsyncSpawnPromise extends Promise {
  child: ChildProcess;
}

/**
 * Exposes a single function, which has the same api as child_process.spawn().
 *
 * Returns a Promise with .child set to the spawned child process. The Promise resolves to the buffered output of child.stdout in the form of a BufferList object.
 *
 * If there was an error, the Promise rejects with an Error object, which has the following extra properties:
 *
 * code the error code
 * stdout the buffered output of stdout in the form of a BufferList object
 * stderr the buffered output of stderr in the form of a BufferList object
 * Note that child.stdout doesn't exist if options.stdio === 'inherit', so the Promise resolves to ''.
 *
 * **If the `shell` option is enabled, do not pass unsanitized user input to this**
 * **function. Any input containing shell metacharacters may be used to trigger**
 * **arbitrary command execution.**
 *
 * A third argument may be used to specify additional options, with these defaults:
 *
 * ```js
 * const defaults = {
 *   cwd: undefined,
 *   env: process.env,
 * };
 * ```
 *
 * Use `cwd` to specify the working directory from which the process is spawned.
 * If not given, the default is to inherit the current working directory. If given,
 * but the path does not exist, the child process emits an `ENOENT` error
 * and exits immediately. `ENOENT` is also emitted when the command
 * does not exist.
 *
 * Use `env` to specify environment variables that will be visible to the new
 * process, the default is `process.env`.
 *
 * `undefined` values in `env` will be ignored.
 *
 * Example of running `ls -lh /usr`, capturing `stdout`, `stderr`, and the
 * exit code:
 *
 * ```js
 * const { spawn } = require('node:child_process');
 * const ls = spawn('ls', ['-lh', '/usr']);
 *
 * ls.stdout.on('data', (data) => {
 *   console.log(`stdout: ${data}`);
 * });
 *
 * ls.stderr.on('data', (data) => {
 *   console.error(`stderr: ${data}`);
 * });
 *
 * ls.on('close', (code) => {
 *   console.log(`child process exited with code ${code}`);
 * });
 * ```
 *
 * Example: A very elaborate way to run `ps ax | grep ssh`
 *
 * ```js
 * const { spawn } = require('node:child_process');
 * const ps = spawn('ps', ['ax']);
 * const grep = spawn('grep', ['ssh']);
 *
 * ps.stdout.on('data', (data) => {
 *   grep.stdin.write(data);
 * });
 *
 * ps.stderr.on('data', (data) => {
 *   console.error(`ps stderr: ${data}`);
 * });
 *
 * ps.on('close', (code) => {
 *   if (code !== 0) {
 *     console.log(`ps process exited with code ${code}`);
 *   }
 *   grep.stdin.end();
 * });
 *
 * grep.stdout.on('data', (data) => {
 *   console.log(data.toString());
 * });
 *
 * grep.stderr.on('data', (data) => {
 *   console.error(`grep stderr: ${data}`);
 * });
 *
 * grep.on('close', (code) => {
 *   if (code !== 0) {
 *     console.log(`grep process exited with code ${code}`);
 *   }
 * });
 * ```
 *
 * Example of checking for failed `spawn`:
 *
 * ```js
 * const { spawn } = require('node:child_process');
 * const subprocess = spawn('bad_command');
 *
 * subprocess.on('error', (err) => {
 *   console.error('Failed to start subprocess.');
 * });
 * ```
 *
 * Certain platforms (macOS, Linux) will use the value of `argv[0]` for the process
 * title while others (Windows, SunOS) will use `command`.
 *
 * Node.js overwrites `argv[0]` with `process.execPath` on startup, so `process.argv[0]` in a Node.js child process will not match the `argv0` parameter passed to `spawn` from the parent. Retrieve
 * it with the `process.argv0` property instead.
 *
 * If the `signal` option is enabled, calling `.abort()` on the corresponding `AbortController` is similar to calling `.kill()` on the child process except
 * the error passed to the callback will be an `AbortError`:
 *
 * ```js
 * const { spawn } = require('node:child_process');
 * const controller = new AbortController();
 * const { signal } = controller;
 * const grep = spawn('grep', ['ssh'], { signal });
 * grep.on('error', (err) => {
 *   // This will be called with err being an AbortError if the controller aborts
 * });
 * controller.abort(); // Stops the child process
 * ```
 * @since v0.1.90
 * @param command The command to run.
 * @param args List of string arguments.
 */
export declare function spawn(
  command: string,
  options?: SpawnOptionsWithoutStdio
): AsyncSpawnPromiseWithoutNullStreams;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>
): AsyncSpawnPromiseByStdio<Writable, Readable, Readable>;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>
): AsyncSpawnPromiseByStdio<Writable, Readable, null>;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>
): AsyncSpawnPromiseByStdio<Writable, null, Readable>;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>
): AsyncSpawnPromiseByStdio<null, Readable, Readable>;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>
): AsyncSpawnPromiseByStdio<Writable, null, null>;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>
): AsyncSpawnPromiseByStdio<null, Readable, null>;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>
): AsyncSpawnPromiseByStdio<null, null, Readable>;
export declare function spawn(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>
): AsyncSpawnPromiseByStdio<null, null, null>;
export declare function spawn(
  command: string,
  options: SpawnOptions
): AsyncSpawnPromise;
// overloads of spawn with 'args'
export declare function spawn(
  command: string,
  args?: readonly string[],
  options?: SpawnOptionsWithoutStdio
): AsyncSpawnPromiseWithoutNullStreams;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>
): AsyncSpawnPromiseByStdio<Writable, Readable, Readable>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>
): AsyncSpawnPromiseByStdio<Writable, Readable, null>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>
): AsyncSpawnPromiseByStdio<Writable, null, Readable>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>
): AsyncSpawnPromiseByStdio<null, Readable, Readable>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>
): AsyncSpawnPromiseByStdio<Writable, null, null>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>
): AsyncSpawnPromiseByStdio<null, Readable, null>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>
): AsyncSpawnPromiseByStdio<null, null, Readable>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>
): AsyncSpawnPromiseByStdio<null, null, null>;
export declare function spawn(
  command: string,
  args: readonly string[],
  options: SpawnOptions
): AsyncSpawnPromise;
