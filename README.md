# Markdown Preview App

A fast, modern markdown editor with live preview built with Vue 3, TypeScript, and Vite.

##  Features

- **Live Preview** - Real-time markdown rendering
- **Split View** - Edit and preview side-by-side
- **File Operations** - Upload/download markdown files
- **Cloud Sync** - Save documents to cloud
- **Auto-save** - Automatic browser storage saving
- **Dark/Light Mode** - Theme toggle
- **Error Handling** - Comprehensive error management
- **Responsive** - Works on all devices

##  Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

##  Project Structure

```
src/
├── components/      # UI components (Editor, Preview, CloudSync, etc.)
├── views/          # Page components (Home, ErrorTest, ApiDemo, NotFound)
├── composables/    # Reusable logic
├── services/       # Logger, API services
├── lib/            # Utilities (api, fileOperations, markdownParser)
├── types/          # TypeScript types
├── App.vue         # Root component
├── main.ts         # Entry point
└── index.css       # Global styles
```

##  Usage

- **Edit** - Type markdown in the editor
- **View Mode** - Switch between Editor/Split/Preview
- **Save** - Download as .md file
- **Upload** - Load a markdown file
- **Cloud** - Save/load from cloud storage
- **Theme** - Toggle dark/light mode

## Dependencies

- Vue 3
- Vue Router
- Pinia
- TypeScript
- Marked (markdown parser)
- Axios (HTTP client)
- Lucide Icons


**Auto-save Delay** - Edit Home.vue:
```typescript
useThrottledAutosave(markdown, autosaveToStorage, { delay: 2000 })
```

##  Storage

- **Local**: Saves to browser storage (`markdown-content`)
- **Cloud**: Optional API integration for cloud sync

##  Troubleshooting

| Issue | Solution |
|-------|----------|
| Content not showing | Clear cache (Ctrl+Shift+R), check console |
| Cloud sync failing | Verify API endpoint, check network tab |
| Markdown not parsing | Check syntax, verify `marked` is installed |

##  License

MIT License

---

**Built with Vue 3 + TypeScript by Esther Bawo Tsotso** 
