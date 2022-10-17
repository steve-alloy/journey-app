import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const personCount: Writable<number> = writable(0);
export const businessCount: Writable<number> = writable(0);
