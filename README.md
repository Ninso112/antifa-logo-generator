# Antifa Sticker Generator

[Antifa Sticker Generator](https://ninso112.github.io/antifa-logo-generator/index.html)

A client-side sticker generator for creating custom antifascist stickers. Adjust texts, positions, scales and icons to create your own designs. Download as SVG or PNG.

## Features

- Customizable text for top and bottom of the sticker
- Adjustable positions and scales for icons
- Drag-and-drop positioning for icons (in addition to sliders)
- Tooltips with helpful explanations for all controls
- Option to upload custom icons (black & white with transparency only)
- Toggle icon layer order (red on top of black or vice versa)
- Adjustable bleed for printing
- Download as SVG or PNG
- SVG import to restore previous designs
- Save/Load designs to/from browser localStorage
- Dark mode toggle with persistent preference storage
- Fully responsive layout optimized for desktop, tablet, and mobile

## Usage

1. Customize texts and icons to your liking
2. Adjust positions and scales using:
   - **Drag-and-drop**: Click and drag the icons directly in the preview
   - **Sliders**: Use the range sliders for precise control (hover over labels for tooltips)
3. Upload your own icons if desired (black & white with transparency only)
4. Save your design: Click "Save Design" to store it in your browser's localStorage
5. Load a saved design: Click "Load Design" to restore a previously saved design
6. Export: Click "Download SVG" or "Download PNG" to save your design
7. Import: Use "Import downloaded SVG" to restore a previously exported SVG file

## Technical Details

- Pure client-side application (no server required)
- Progressive Web App (PWA) - installable and works offline
- Optimized for desktop, tablet, and mobile devices
- Drag-and-drop icon positioning with touch support
- LocalStorage integration for saving designs locally
- Accessible with ARIA labels and keyboard navigation
- Performance optimized with debouncing for smooth interactions
- Dark mode support with system preference detection

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
