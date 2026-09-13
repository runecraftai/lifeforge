# Notes theme and dialog verification

Commit under test: `sq/lifeforge-notes-a11y-dark` on current `origin/main`

The browser walk used the freshly built production client and Notes module with
visible Chromium through Playwright at 1440x1000. The six captures below were
opened and inspected after the walk completed.

## Captures

- [Light search row and note list](notes-light-search-and-list.png)
- [Light selected note](notes-light-selected-note.png)
- [Light create modal](notes-light-create-modal.png)
- [Dark search row and note list](notes-dark-search-and-list.png)
- [Dark selected note](notes-dark-selected-note.png)
- [Dark create modal](notes-dark-create-modal.png)

Both themes visibly show the Notes header, styled search row, bordered note
list, readable note rows, and the empty detail state. The create-modal captures
show a centered card over a dimmed backdrop with readable `Title` and `Content`
fields and a visible `Create` button. The selected-note captures show the
created verification note and a readable `Updated Recently` fallback when the
fixture did not provide a valid timestamp.

## Accessibility proof

The browser observed one dialog while the create modal was open:

```json
{
  "role": "dialog",
  "ariaModal": "true",
  "ariaLabelledBy": "modal-title-_r_8_",
  "heading": "New note"
}
```

The dialog's accessible name comes from its `New note` heading through
`aria-labelledby`. The browser also verified that Shift+Tab and Tab stayed
inside the dialog, Escape closed it, and focus returned to the `New note`
button that opened it. The same checks passed in light and dark themes.

## Component chain

`NotesPage` opens `NoteFormModal` through `useModalStore`. `ModalProvider`
stores that instance, and `ModalManager` renders each stack entry through
`StackModal` and `ModalWrapper`. The shared `ModalWrapper` supplies the dialog
semantics, focus trap, Escape handling, and focus restoration to the Notes form
and to other modals using the manager.

The Notes client CSS is imported by the module and is emitted with the
federated client build. `bundleAllCSS: true` in
`packages/configs/src/vite/mod-client-vite.config.ts` makes that CSS available
when the remote module loads. The Notes header explicitly renders `Notes`
instead of the package identifier.
