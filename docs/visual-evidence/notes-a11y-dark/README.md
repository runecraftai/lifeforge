# Notes theme and dialog verification

Commit under test: `1635008ef`

The browser walk used the installed Chromium binary with Playwright and the
current Notes client build. Captures are included in this directory.

## Captures

- [Dark search row and note list](notes-dark-search-and-list.png)
- [Dark selected note](notes-dark-selected-note.png)
- [Dark create modal](notes-dark-create-modal.png)
- [Light search row and note list](notes-light-search-and-list.png)
- [Light selected note](notes-light-selected-note.png)
- [Light create modal](notes-light-create-modal.png)

The dark walk verified the search row, selected note, create modal, and Title
and Content fields. The dark modal rendered with the expected dimmed backdrop
and centered form.

## Accessibility proof

The browser observed one dialog while the create modal was open:

```json
{
  "roleCount": 1,
  "role": "dialog",
  "ariaModal": "true",
  "ariaLabelledBy": "modal-title-_r_8_",
  "heading": "New note",
  "focusableCount": 6,
  "shiftTabInside": true,
  "tabInside": true,
  "restoredFocus": true
}
```

The dialog's accessible name comes from its `New note` heading through
`aria-labelledby`. Shift+Tab and Tab remained inside the dialog, and closing
the modal restored focus to the **New note** button.

## Component chain

`NotesPage` calls `useModalStore().open(NoteFormModal, ...)`. `ModalProvider`
stores that instance, and `ModalManager` renders each stack entry through
`StackModal` and `ModalWrapper`. The updated `ModalWrapper` puts the dialog
semantics and keyboard behavior on the inner modal element. Therefore the
Notes `FormModal` receives the fix through the design-system wrapper, and every
other modal opened through `ModalManager` receives the same behavior.

The design system does not have a separate accessible Dialog component. The
existing `ModalWrapper` is the shared modal primitive, so it was enhanced
instead of adding a duplicate component.

## Verification limits

The dark theme was switched through the personalization UI and the `dark`
class was observed. The light-theme API action reported `changeTheme is not a
function` in this isolated running instance. The light captures therefore use
the browser's light visual state after removing the `dark` class; they verify
the light rendering contrast, but not persistence of the light-theme setting.

The pre-running container also served a stale legacy Notes remote. The walk
loaded the freshly built Notes client from this worktree so the captures cover
the checked-out implementation rather than that stale artifact.
