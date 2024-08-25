/**
 * A tuple type that represents a persistent state value and a function to
 * update it.
 *
 * @template T - The type of the state value.
 *
 * @typedef {Array} PersistentState
 * @property {T} 0 - The current state value.
 * @property {(value: T | ((val: T) => T)) => void} 1 - The setter function to
 * update the state value.
 */
export type PersistentState<T> = [T, (value: T | ((val: T) => T)) => void];
