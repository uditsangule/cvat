// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import '../../theme.scss';
import React, { useEffect } from 'react';
import ConfigProvider, { ThemeConfig } from 'antd/lib/config-provider';
import antdTheme from 'antd/lib/theme';

import { Theme, useTheme } from 'utils/theme';

const themeConfigs: Record<Theme, ThemeConfig> = {
    light: {
        algorithm: antdTheme.defaultAlgorithm,
    },
    dark: {
        algorithm: antdTheme.darkAlgorithm,
        token: {
            // keep in sync with --cvat-background-color-* in theme.scss
            colorBgLayout: '#141414',
            colorBgContainer: '#1f1f1f',
            colorBgElevated: '#262626',
        },
    },
};

interface Props {
    // allows to render a part of the application in a fixed theme
    theme?: Theme;
    children: React.ReactNode;
}

function ThemeProvider(props: Readonly<Props>): JSX.Element {
    const { theme: forcedTheme, children } = props;
    const currentTheme = useTheme();
    const themeConfig = themeConfigs[forcedTheme ?? currentTheme];

    useEffect(() => {
        if (!forcedTheme) {
            // static methods like notification.error() or Modal.confirm() are rendered out of the React tree
            ConfigProvider.config({
                holderRender: (holderChildren: React.ReactNode) => (
                    <ConfigProvider theme={themeConfig}>{holderChildren}</ConfigProvider>
                ),
            });
        }
    }, [forcedTheme, themeConfig]);

    return (
        <ConfigProvider theme={themeConfig}>
            {children}
        </ConfigProvider>
    );
}

export default React.memo(ThemeProvider);
