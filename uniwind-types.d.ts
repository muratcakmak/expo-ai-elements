// NOTE: This mirrors the uniwind-generated types reference so that the
// className prop augmentation (react-native ViewProps/TextProps/etc.) is
// available during type-checking of the library source.
/// <reference types="uniwind/types" />

declare module 'uniwind' {
    export interface UniwindConfig {
        themes: readonly ['light', 'dark']
    }
}

export {}
