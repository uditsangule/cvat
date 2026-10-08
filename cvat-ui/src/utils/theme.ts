// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'cvatTheme';
const listeners = new Set<() => void>();

function readTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
    } catch {
        // local storage is not available, fallback to the system preference
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    // is used by the markdown editor/viewer
    document.documentElement.setAttribute('data-color-mode', theme);
}

let currentTheme = readTheme();
applyTheme(currentTheme);

export function getTheme(): Theme {
    return currentTheme;
}

export function setTheme(theme: Theme): void {
    currentTheme = theme;
    applyTheme(theme);
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // the theme is applied anyway, but will not be restored after reload
    }

    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function useTheme(): Theme {
    return useSyncExternalStore(subscribe, getTheme);
}
