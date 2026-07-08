// Ambient declaration so side-effect imports of the Tailwind/uniwind CSS entry
// (e.g. `import "../global.css"`) type-check under TypeScript's stricter
// module-resolution in 6.x.
declare module '*.css';
