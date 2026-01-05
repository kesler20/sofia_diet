import * as React from "react";

type ThemeMode = "system" | "light" | "dark";

type ItemStatus = "planned" | "failed";

type ShoppingItem = {
  id: string;
  name: string;
  qty: number;
  notes: string;
  image?: string | null; // data URL or remote URL
  link?: string | null;
  status: ItemStatus;
  createdAtIso: string;
  updatedAtIso: string;
};

type ShoppingList = {
  id: string;
  name: string;
  createdAtIso: string;
  updatedAtIso: string;
  items: ShoppingItem[];
};

type ConfirmState = null | {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
};

type ItemDialogMode = "create" | "edit";

type ItemDraft = {
  id?: string;
  name: string;
  qty: number;
  notes: string;
  image: string | null;
  link: string | null;
  status: ItemStatus;
};

type ListDialogMode = "create" | "rename";

type ListDraft = {
  id?: string;
  name: string;
};

function IconPlus(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEdit(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 20H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrash(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 7H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 11V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 7L7 20H17L18 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLink(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconImage(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10Z"
        fill="currentColor"
      />
      <path
        d="M20 16L15 11L6 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SurfaceCard(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "slm-surface rounded-3xl border border-[hsl(var(--accent)/0.22)] shadow-[0_18px_70px_-40px_hsl(var(--accent)/0.65)] backdrop-blur-md " +
        (props.className ?? "")
      }
    >
      {props.children}
    </div>
  );
}

function ChipButton(props: {
  label: string;
  isActive?: boolean;
  onEventClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onEventClick}
      className={
        props.isActive ? "slm-chip slm-chip--active" : "slm-chip slm-chip--inactive"
      }
    >
      {props.label}
    </button>
  );
}

function TopBar(props: {
  title: string;
  themeMode: ThemeMode;
  onEventCycleTheme: () => void;
}) {
  const themeLabel =
    props.themeMode === "system"
      ? "Theme: System"
      : props.themeMode === "light"
      ? "Theme: Light"
      : "Theme: Dark";

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
        {props.title}
      </h1>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="slm-tonal-btn"
          onClick={props.onEventCycleTheme}
        >
          {themeLabel}
        </button>
      </div>
    </div>
  );
}

function ListTabs(props: {
  lists: ShoppingList[];
  selectedListId: string;
  onEventSelectList: (listId: string) => void;
  onEventOpenCreateList: () => void;
  onEventOpenRenameList: (listId: string) => void;
  onEventRequestDeleteList: (listId: string) => void;
}) {
  return (
    <SurfaceCard className="p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-left">
            <div className="text-sm opacity-80">Shopping lists</div>
            <div className="text-lg font-medium">Choose a list</div>
          </div>

          <button
            type="button"
            className="slm-fab"
            onClick={props.onEventOpenCreateList}
            aria-label="Create new list"
          >
            <IconPlus className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center">
          {props.lists.map((list) => (
            <div key={list.id} className="flex items-center gap-2">
              <ChipButton
                label={list.name}
                isActive={props.selectedListId === list.id}
                onEventClick={() => props.onEventSelectList(list.id)}
              />

              <button
                type="button"
                className="slm-icon-btn"
                onClick={() => props.onEventOpenRenameList(list.id)}
                aria-label={`Rename ${list.name}`}
                title="Rename"
              >
                <IconEdit className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="slm-icon-btn slm-icon-btn--danger"
                onClick={() => props.onEventRequestDeleteList(list.id)}
                aria-label={`Delete ${list.name}`}
                title="Delete"
              >
                <IconTrash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}

function AddItemBar(props: {
  value: string;
  onEventChangeValue: (value: string) => void;
  onEventAddItem: () => void;
  isDisabled?: boolean;
}) {
  return (
    <SurfaceCard className="p-4 sm:p-5">
      <form
        className="flex items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          props.onEventAddItem();
        }}
      >
        <div className="slm-field flex-1">
          <input
            className="slm-input"
            value={props.value}
            onChange={(e) => props.onEventChangeValue(e.target.value)}
            placeholder="Enter item"
            aria-label="Enter item"
          />
          <label className="slm-label">Enter item</label>
        </div>

        <button
          type="submit"
          className={props.isDisabled ? "slm-fab slm-fab--disabled" : "slm-fab"}
          disabled={props.isDisabled}
          aria-label="Add item"
          title="Add item"
        >
          <IconPlus className="h-7 w-7" />
        </button>
      </form>
    </SurfaceCard>
  );
}

function SearchBar(props: {
  value: string;
  onEventChangeValue: (value: string) => void;
  onEventClear: () => void;
}) {
  return (
    <SurfaceCard className="p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="slm-field flex-1">
          <input
            className="slm-input"
            value={props.value}
            onChange={(e) => props.onEventChangeValue(e.target.value)}
            placeholder="Search"
            aria-label="Search"
          />
          <label className="slm-label">Search</label>
        </div>

        <button type="button" className="slm-tonal-btn" onClick={props.onEventClear}>
          Clear
        </button>
      </div>
    </SurfaceCard>
  );
}

function ItemSection(props: {
  title: string;
  subtitle?: string;
  items: ShoppingItem[];
  emptyText: string;
  onEventToggleStatus: (itemId: string) => void;
  onEventOpenEditItem: (itemId: string) => void;
  onEventRequestDeleteItem: (itemId: string) => void;
}) {
  return (
    <SurfaceCard className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-left">
          <div className="text-lg font-semibold">{props.title}</div>
          {props.subtitle ? (
            <div className="text-sm opacity-75">{props.subtitle}</div>
          ) : null}
        </div>
        <div className="slm-badge">{props.items.length}</div>
      </div>

      <div className="mt-4 space-y-3">
        {props.items.length === 0 ? (
          <div className="text-left opacity-75">{props.emptyText}</div>
        ) : null}

        {props.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onEventToggleStatus={props.onEventToggleStatus}
            onEventOpenEditItem={props.onEventOpenEditItem}
            onEventRequestDeleteItem={props.onEventRequestDeleteItem}
          />
        ))}
      </div>
    </SurfaceCard>
  );
}

function ItemRow(props: {
  item: ShoppingItem;
  onEventToggleStatus: (itemId: string) => void;
  onEventOpenEditItem: (itemId: string) => void;
  onEventRequestDeleteItem: (itemId: string) => void;
}) {
  const isFailed = props.item.status === "failed";

  return (
    <div className="slm-row">
      <button
        type="button"
        className={isFailed ? "slm-checkbox slm-checkbox--checked" : "slm-checkbox"}
        onClick={() => props.onEventToggleStatus(props.item.id)}
        aria-label={isFailed ? "Mark as planned" : "Mark as not bought"}
        title={isFailed ? "Move back to planned" : "Move to not bought"}
      >
        {isFailed ? "✓" : ""}
      </button>

      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className={
                isFailed
                  ? "truncate text-xl font-medium line-through opacity-70"
                  : "truncate text-xl font-medium"
              }
            >
              {props.item.name}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm opacity-80">
              <div className="slm-pill">Qty: {props.item.qty}</div>
              {props.item.link ? (
                <a
                  href={props.item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="slm-pill slm-pill--link"
                  title="Open link"
                >
                  <IconLink className="h-4 w-4" />
                  <span>Link</span>
                </a>
              ) : null}
              {props.item.image ? (
                <div className="slm-pill" title="Has image">
                  <IconImage className="h-4 w-4" />
                  <span>Image</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="slm-square-btn"
              onClick={() => props.onEventOpenEditItem(props.item.id)}
              aria-label={`Edit ${props.item.name}`}
              title="Edit"
            >
              <IconEdit className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="slm-square-btn slm-square-btn--danger"
              onClick={() => props.onEventRequestDeleteItem(props.item.id)}
              aria-label={`Delete ${props.item.name}`}
              title="Delete"
            >
              <IconTrash className="h-6 w-6" />
            </button>
          </div>
        </div>

        {props.item.notes ? (
          <div className="mt-3 text-sm leading-relaxed opacity-90 whitespace-pre-wrap">
            {props.item.notes}
          </div>
        ) : null}

        {props.item.image ? (
          <div className="mt-3">
            <img
              src={props.item.image}
              alt=""
              className="max-h-36 w-full rounded-2xl object-cover border border-[hsl(var(--accent)/0.16)]"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DialogShell(props: {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  onEventClose: () => void;
}) {
  if (!props.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="slm-dialog-backdrop"
      onMouseDown={(e) => {
        // Click outside closes
        if (e.currentTarget === e.target) props.onEventClose();
      }}
    >
      <div className="slm-dialog">
        <div className="flex items-start justify-between gap-4">
          <div className="text-left">
            <div className="text-xl font-semibold">{props.title}</div>
            <div className="mt-1 text-sm opacity-75">
              Press Esc or click outside to close.
            </div>
          </div>
          <button
            type="button"
            className="slm-tonal-btn"
            onClick={props.onEventClose}
          >
            Close
          </button>
        </div>
        <div className="mt-5">{props.children}</div>
      </div>
    </div>
  );
}

function ItemEditDialog(props: {
  isOpen: boolean;
  mode: ItemDialogMode;
  draft: ItemDraft;
  onEventClose: () => void;
  onEventChangeField: <K extends keyof ItemDraft>(
    field: K,
    value: ItemDraft[K]
  ) => void;
  onEventPickImageFile: (file: File) => void;
  onEventSave: () => void;
}) {
  return (
    <DialogShell
      title={props.mode === "create" ? "Add item" : "Edit item"}
      isOpen={props.isOpen}
      onEventClose={props.onEventClose}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="slm-field">
            <input
              className="slm-input"
              value={props.draft.name}
              onChange={(e) => props.onEventChangeField("name", e.target.value)}
              placeholder="Item name"
              aria-label="Item name"
              autoFocus
            />
            <label className="slm-label">Item name</label>
          </div>

          <div className="slm-field">
            <input
              className="slm-input"
              value={String(props.draft.qty)}
              onChange={(e) => {
                const asNumber = Number(e.target.value);
                props.onEventChangeField(
                  "qty",
                  Number.isFinite(asNumber) && asNumber > 0 ? asNumber : 1
                );
              }}
              placeholder="Qty"
              aria-label="Quantity"
              inputMode="numeric"
            />
            <label className="slm-label">Qty</label>
          </div>
        </div>

        <div className="slm-field">
          <textarea
            className="slm-textarea"
            value={props.draft.notes}
            onChange={(e) => props.onEventChangeField("notes", e.target.value)}
            placeholder="Notes"
            aria-label="Notes"
            rows={4}
          />
          <label className="slm-label slm-label--textarea">Notes</label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="slm-field">
            <input
              className="slm-input"
              value={props.draft.link ?? ""}
              onChange={(e) =>
                props.onEventChangeField(
                  "link",
                  e.target.value.trim().length ? e.target.value : null
                )
              }
              placeholder="Link (optional)"
              aria-label="Link"
            />
            <label className="slm-label">Link (optional)</label>
          </div>

          <div className="slm-field">
            <input
              className="slm-input"
              value={props.draft.image ?? ""}
              onChange={(e) =>
                props.onEventChangeField(
                  "image",
                  e.target.value.trim().length ? e.target.value : null
                )
              }
              placeholder="Image URL (optional)"
              aria-label="Image URL"
            />
            <label className="slm-label">Image URL (optional)</label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="slm-tonal-btn cursor-pointer">
              Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  props.onEventPickImageFile(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            <button
              type="button"
              className={
                props.draft.image
                  ? "slm-tonal-btn"
                  : "slm-tonal-btn slm-tonal-btn--disabled"
              }
              onClick={() => props.onEventChangeField("image", null)}
              disabled={!props.draft.image}
            >
              Remove image
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="slm-tonal-btn"
              onClick={() =>
                props.onEventChangeField(
                  "status",
                  props.draft.status === "planned" ? "failed" : "planned"
                )
              }
            >
              {props.draft.status === "planned"
                ? "Mark as not bought"
                : "Mark as planned"}
            </button>

            <button
              type="button"
              className="slm-primary-btn"
              onClick={props.onEventSave}
            >
              Save
            </button>
          </div>
        </div>

        {props.draft.image ? (
          <div className="mt-2">
            <div className="text-left text-sm opacity-80">Preview</div>
            <img
              src={props.draft.image}
              alt=""
              className="mt-2 max-h-56 w-full rounded-3xl object-cover border border-[hsl(var(--accent)/0.16)]"
            />
          </div>
        ) : null}
      </div>
    </DialogShell>
  );
}

function ListDialog(props: {
  isOpen: boolean;
  mode: ListDialogMode;
  draft: ListDraft;
  onEventClose: () => void;
  onEventChangeName: (value: string) => void;
  onEventSave: () => void;
}) {
  return (
    <DialogShell
      title={props.mode === "create" ? "Create list" : "Rename list"}
      isOpen={props.isOpen}
      onEventClose={props.onEventClose}
    >
      <div className="grid gap-4">
        <div className="slm-field">
          <input
            className="slm-input"
            value={props.draft.name}
            onChange={(e) => props.onEventChangeName(e.target.value)}
            placeholder="List name"
            aria-label="List name"
            autoFocus
          />
          <label className="slm-label">List name</label>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="slm-tonal-btn"
            onClick={props.onEventClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="slm-primary-btn"
            onClick={props.onEventSave}
          >
            Save
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

function ConfirmDialog(props: { state: ConfirmState; onEventClose: () => void }) {
  if (!props.state) return null;

  return (
    <DialogShell
      title={props.state.title}
      isOpen={true}
      onEventClose={props.onEventClose}
    >
      <div className="grid gap-4">
        <div className="text-left opacity-90">{props.state.body}</div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="slm-tonal-btn"
            onClick={props.onEventClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="slm-primary-btn slm-primary-btn--danger"
            onClick={() => {
              props.state.onConfirm();
              props.onEventClose();
            }}
          >
            {props.state.confirmLabel}
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

export default function ShoppingListManager() {
  // ====================== //
  //                        //
  //   STATE VARIABLES      //
  //                        //
  // ====================== //

  const LOCAL_STORAGE_KEY = "shopping_list_manager.v1";

  const [themeMode, setThemeMode] = React.useState<ThemeMode>("system");

  const [lists, setLists] = React.useState<ShoppingList[]>(() => {
    const nowIso = new Date().toISOString();
    return [
      {
        id: createId(),
        name: "Tesco",
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        items: [
          {
            id: createId(),
            name: "Greek yoghurt",
            qty: 1,
            notes: "High protein",
            image: null,
            link: null,
            status: "planned",
            createdAtIso: nowIso,
            updatedAtIso: nowIso,
          },
          {
            id: createId(),
            name: "Blueberries",
            qty: 2,
            notes: "Frozen is fine",
            image: null,
            link: null,
            status: "failed",
            createdAtIso: nowIso,
            updatedAtIso: nowIso,
          },
        ],
      },
      {
        id: createId(),
        name: "Online",
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        items: [
          {
            id: createId(),
            name: "USB-C cable",
            qty: 1,
            notes: "2m braided",
            image: null,
            link: "https://example.com",
            status: "planned",
            createdAtIso: nowIso,
            updatedAtIso: nowIso,
          },
        ],
      },
    ];
  });

  const [selectedListId, setSelectedListId] = React.useState<string>(() => {
    // Matches the default seed above.
    return "";
  });

  const [draftNewItemName, setDraftNewItemName] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [isItemDialogOpen, setIsItemDialogOpen] = React.useState<boolean>(false);
  const [itemDialogMode, setItemDialogMode] =
    React.useState<ItemDialogMode>("create");
  const [itemDraft, setItemDraft] = React.useState<ItemDraft>(() => ({
    name: "",
    qty: 1,
    notes: "",
    image: null,
    link: null,
    status: "planned",
  }));

  const [isListDialogOpen, setIsListDialogOpen] = React.useState<boolean>(false);
  const [listDialogMode, setListDialogMode] =
    React.useState<ListDialogMode>("create");
  const [listDraft, setListDraft] = React.useState<ListDraft>({ name: "" });

  const [confirmState, setConfirmState] = React.useState<ConfirmState>(null);

  // Ensure selected list is set once lists exist
  React.useEffect(() => {
    setSelectedListId((prev) => {
      if (prev && lists.some((l) => l.id === prev)) return prev;
      return lists[0]?.id ?? "";
    });
  }, [lists]);

  const selectedList = React.useMemo(() => {
    return lists.find((l) => l.id === selectedListId) ?? null;
  }, [lists, selectedListId]);

  // ====================== //
  //                        //
  //   OBSERVE STATE        //
  //                        //
  // ====================== //

  console.log("themeMode", themeMode);
  console.log("lists", lists);
  console.log("selectedListId", selectedListId);
  console.log("selectedList", selectedList);
  console.log("draftNewItemName", draftNewItemName);
  console.log("searchQuery", searchQuery);

  // ====================== //
  //                        //
  //   SIDE EFFECTS         //
  //                        //
  // ====================== //

  // Load from localStorage once.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        themeMode?: ThemeMode;
        lists?: ShoppingList[];
        selectedListId?: string;
      };

      if (parsed.themeMode) setThemeMode(parsed.themeMode);
      if (Array.isArray(parsed.lists) && parsed.lists.length) setLists(parsed.lists);
      if (typeof parsed.selectedListId === "string")
        setSelectedListId(parsed.selectedListId);
    } catch (error) {
      console.log("Error loading from localStorage:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage.
  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ themeMode, lists, selectedListId })
      );
    } catch (error) {
      console.log("Error saving to localStorage:", error);
    }
  }, [themeMode, lists, selectedListId]);

  // Esc closes dialogs.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmState) {
        setConfirmState(null);
        return;
      }
      if (isItemDialogOpen) {
        setIsItemDialogOpen(false);
        return;
      }
      if (isListDialogOpen) {
        setIsListDialogOpen(false);
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmState, isItemDialogOpen, isListDialogOpen]);

  // ====================== //
  //                        //
  //   UI EVENT HANDLERS    //
  //                        //
  // ====================== //

  // ------------------------------------------------------ Theme
  const handleEventCycleTheme = () => {
    setThemeMode((prev) =>
      prev === "system" ? "light" : prev === "light" ? "dark" : "system"
    );
  };

  // ------------------------------------------------------ List
  const handleEventSelectList = (listId: string) => {
    setSelectedListId(listId);
  };

  const handleEventOpenCreateList = () => {
    setListDialogMode("create");
    setListDraft({ name: "" });
    setIsListDialogOpen(true);
  };

  const handleEventOpenRenameList = (listId: string) => {
    const target = lists.find((l) => l.id === listId);
    if (!target) return;

    setListDialogMode("rename");
    setListDraft({ id: target.id, name: target.name });
    setIsListDialogOpen(true);
  };

  const handleEventChangeListDraftName = (value: string) => {
    setListDraft((prev) => ({ ...prev, name: value }));
  };

  const handleEventSaveList = () => {
    const trimmed = listDraft.name.trim();
    if (!trimmed.length) return;

    if (listDialogMode === "create") {
      const nowIso = new Date().toISOString();
      const newList: ShoppingList = {
        id: createId(),
        name: trimmed,
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        items: [],
      };

      setLists((prev) => [...prev, newList]);
      setSelectedListId(newList.id);
      setIsListDialogOpen(false);
      return;
    }

    if (listDialogMode === "rename") {
      const targetId = listDraft.id;
      if (!targetId) return;

      setLists((prev) =>
        prev.map((l) =>
          l.id !== targetId
            ? l
            : {
                ...l,
                name: trimmed,
                updatedAtIso: new Date().toISOString(),
              }
        )
      );
      setIsListDialogOpen(false);
      return;
    }
  };

  const handleEventRequestDeleteList = (listId: string) => {
    const target = lists.find((l) => l.id === listId);
    if (!target) return;

    setConfirmState({
      title: "Delete list",
      body: `Delete “${target.name}”? This will remove all items in that list.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setLists((prev) => prev.filter((l) => l.id !== listId));
        setSelectedListId((prevSelected) => {
          if (prevSelected !== listId) return prevSelected;
          const next = lists.find((l) => l.id !== listId);
          return next?.id ?? "";
        });
      },
    });
  };

  // ------------------------------------------------------ Add Bar
  const handleEventChangeDraftNewItemName = (value: string) => {
    setDraftNewItemName(value);
  };

  const handleEventAddItemQuick = () => {
    const trimmed = draftNewItemName.trim();
    if (!trimmed.length) return;
    if (!selectedList) return;

    const nowIso = new Date().toISOString();
    const newItem: ShoppingItem = {
      id: createId(),
      name: trimmed,
      qty: 1,
      notes: "",
      image: null,
      link: null,
      status: "planned",
      createdAtIso: nowIso,
      updatedAtIso: nowIso,
    };

    setLists((prev) =>
      prev.map((l) =>
        l.id !== selectedList.id
          ? l
          : { ...l, updatedAtIso: nowIso, items: [...l.items, newItem] }
      )
    );

    setDraftNewItemName("");
  };

  // ------------------------------------------------------ Search
  const handleEventChangeSearchQuery = (value: string) => {
    setSearchQuery(value);
  };

  const handleEventClearSearch = () => {
    setSearchQuery("");
  };

  // ------------------------------------------------------ Item
  const handleEventToggleItemStatus = (itemId: string) => {
    if (!selectedList) return;

    const nowIso = new Date().toISOString();

    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== selectedList.id) return l;
        return {
          ...l,
          updatedAtIso: nowIso,
          items: l.items.map((it) =>
            it.id !== itemId
              ? it
              : {
                  ...it,
                  status: it.status === "planned" ? "failed" : "planned",
                  updatedAtIso: nowIso,
                }
          ),
        };
      })
    );
  };

  const handleEventOpenCreateItemDialog = () => {
    setItemDialogMode("create");
    setItemDraft({
      name: draftNewItemName.trim() || "",
      qty: 1,
      notes: "",
      image: null,
      link: null,
      status: "planned",
    });
    setIsItemDialogOpen(true);
  };

  const handleEventOpenEditItem = (itemId: string) => {
    if (!selectedList) return;
    const target = selectedList.items.find((it) => it.id === itemId);
    if (!target) return;

    setItemDialogMode("edit");
    setItemDraft({
      id: target.id,
      name: target.name,
      qty: target.qty,
      notes: target.notes,
      image: target.image ?? null,
      link: target.link ?? null,
      status: target.status,
    });
    setIsItemDialogOpen(true);
  };

  const handleEventCloseItemDialog = () => {
    setIsItemDialogOpen(false);
  };

  const handleEventChangeItemDraftField = <K extends keyof ItemDraft>(
    field: K,
    value: ItemDraft[K]
  ) => {
    setItemDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventPickItemImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setItemDraft((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEventSaveItemDraft = () => {
    if (!selectedList) return;

    const trimmed = itemDraft.name.trim();
    if (!trimmed.length) return;

    const nowIso = new Date().toISOString();

    if (itemDialogMode === "create") {
      const newItem: ShoppingItem = {
        id: createId(),
        name: trimmed,
        qty: itemDraft.qty,
        notes: itemDraft.notes,
        image: itemDraft.image,
        link: itemDraft.link,
        status: itemDraft.status,
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
      };

      setLists((prev) =>
        prev.map((l) =>
          l.id !== selectedList.id
            ? l
            : { ...l, updatedAtIso: nowIso, items: [...l.items, newItem] }
        )
      );

      setIsItemDialogOpen(false);
      setDraftNewItemName("");
      return;
    }

    if (itemDialogMode === "edit") {
      const targetId = itemDraft.id;
      if (!targetId) return;

      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== selectedList.id) return l;
          return {
            ...l,
            updatedAtIso: nowIso,
            items: l.items.map((it) =>
              it.id !== targetId
                ? it
                : {
                    ...it,
                    name: trimmed,
                    qty: itemDraft.qty,
                    notes: itemDraft.notes,
                    image: itemDraft.image,
                    link: itemDraft.link,
                    status: itemDraft.status,
                    updatedAtIso: nowIso,
                  }
            ),
          };
        })
      );

      setIsItemDialogOpen(false);
      return;
    }
  };

  const handleEventRequestDeleteItem = (itemId: string) => {
    if (!selectedList) return;

    const target = selectedList.items.find((it) => it.id === itemId);
    if (!target) return;

    setConfirmState({
      title: "Delete item",
      body: `Delete “${target.name}”?`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setLists((prev) =>
          prev.map((l) =>
            l.id !== selectedList.id
              ? l
              : { ...l, items: l.items.filter((it) => it.id !== itemId) }
          )
        );
      },
    });
  };

  // ====================== //
  //                        //
  //   UTILS METHODS        //
  //                        //
  // ====================== //

  const getFilteredItems = (items: ShoppingItem[]) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q.length) return items;

    return items.filter((it) => {
      const haystack = [it.name, it.notes, it.link ?? ""].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  };

  const getPlannedItems = () => {
    if (!selectedList) return [];
    return getFilteredItems(selectedList.items).filter(
      (it) => it.status === "planned"
    );
  };

  const getFailedItems = () => {
    if (!selectedList) return [];
    return getFilteredItems(selectedList.items).filter(
      (it) => it.status === "failed"
    );
  };

  const getThemeAttr = () => {
    if (themeMode === "system") return undefined;
    return themeMode;
  };

  // ====================== //
  //                        //
  //   UI COMPONENTS        //
  //                        //
  // ====================== //

  return (
    <div className="slm-root" color-scheme={getThemeAttr()}>
      <style>{getEmbeddedStyles()}</style>

      <div className="w-full flex justify-center px-4 sm:px-8 py-10 sm:py-14">
        <div className="w-full max-w-4xl">
          {/* Top bar */}
          <TopBar
            title="My Shopping Lists"
            themeMode={themeMode}
            onEventCycleTheme={handleEventCycleTheme}
          />

          {/* Main layout */}
          <div className="mt-10 space-y-6">
            {/* List tabs */}
            <ListTabs
              lists={lists}
              selectedListId={selectedListId}
              onEventSelectList={handleEventSelectList}
              onEventOpenCreateList={handleEventOpenCreateList}
              onEventOpenRenameList={handleEventOpenRenameList}
              onEventRequestDeleteList={handleEventRequestDeleteList}
            />

            {/* Add item + search */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AddItemBar
                value={draftNewItemName}
                onEventChangeValue={handleEventChangeDraftNewItemName}
                onEventAddItem={() => {
                  // Add quickly if there is a name; otherwise open full dialog.
                  if (draftNewItemName.trim().length) {
                    handleEventAddItemQuick();
                  } else {
                    handleEventOpenCreateItemDialog();
                  }
                }}
                isDisabled={!selectedList}
              />

              <SearchBar
                value={searchQuery}
                onEventChangeValue={handleEventChangeSearchQuery}
                onEventClear={handleEventClearSearch}
              />
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ItemSection
                title="🛒 Planned"
                subtitle={
                  selectedList ? `List: ${selectedList.name}` : "No list selected"
                }
                items={getPlannedItems()}
                emptyText="No planned items yet. Add one above."
                onEventToggleStatus={handleEventToggleItemStatus}
                onEventOpenEditItem={handleEventOpenEditItem}
                onEventRequestDeleteItem={handleEventRequestDeleteItem}
              />

              <ItemSection
                title="📉 Not bought"
                subtitle="Items you wanted, but did not purchase"
                items={getFailedItems()}
                emptyText="Nothing here. That is a good sign."
                onEventToggleStatus={handleEventToggleItemStatus}
                onEventOpenEditItem={handleEventOpenEditItem}
                onEventRequestDeleteItem={handleEventRequestDeleteItem}
              />
            </div>

            {/* Footer */}
            <div className="text-center text-sm opacity-75">
              Tip: Click a checkbox to move an item between Planned and Not bought.
              Click edit to add notes, an image, a link, or change quantity.
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ItemEditDialog
        isOpen={isItemDialogOpen}
        mode={itemDialogMode}
        draft={itemDraft}
        onEventClose={handleEventCloseItemDialog}
        onEventChangeField={handleEventChangeItemDraftField}
        onEventPickImageFile={handleEventPickItemImageFile}
        onEventSave={handleEventSaveItemDraft}
      />

      <ListDialog
        isOpen={isListDialogOpen}
        mode={listDialogMode}
        draft={listDraft}
        onEventClose={() => setIsListDialogOpen(false)}
        onEventChangeName={handleEventChangeListDraftName}
        onEventSave={handleEventSaveList}
      />

      <ConfirmDialog
        state={confirmState}
        onEventClose={() => setConfirmState(null)}
      />
    </div>
  );
}

function createId() {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto)
      return crypto.randomUUID();
  } catch {
    // ignore
  }

  return `id-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

function getEmbeddedStyles() {
  return `
  /* Minimal embedded theme inspired by your CSS variables + Material 3 elevation */
  .slm-root {
    --_hue: 245;

    --bg--light: var(--_hue) 30% 94%;
    --txt--light: var(--_hue) 40% 6%;
    --accent--light: var(--_hue) 55% 50%;
    --accent1--light: 10 80% 60%;
    --muted--light: var(--_hue) 30% 99%;

    --bg--dark: var(--_hue) 15% 10%;
    --txt--dark: var(--_hue) 30% 90%;
    --accent--dark: var(--_hue) 50% 60%;
    --accent1--dark: 10 55% 55%;
    --muted--dark: var(--_hue) 20% 4%;

    --bg: var(--bg--light);
    --txt: var(--txt--light);
    --accent: var(--accent--light);
    --accent1: var(--accent1--light);
    --muted: var(--muted--light);

    min-height: 100vh;
    width: 100%;
    background:
      radial-gradient(1200px 800px at 20% 0%, hsl(var(--accent)/0.18), transparent 60%),
      radial-gradient(900px 650px at 100% 30%, hsl(var(--accent1)/0.14), transparent 60%),
      hsl(var(--bg));
    color: hsl(var(--txt));
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
      Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  @media (prefers-color-scheme: dark) {
    .slm-root:not([color-scheme="light"]) {
      --bg: var(--bg--dark);
      --txt: var(--txt--dark);
      --accent: var(--accent--dark);
      --accent1: var(--accent1--dark);
      --muted: var(--muted--dark);
    }
  }

  .slm-root[color-scheme="dark"] {
    --bg: var(--bg--dark);
    --txt: var(--txt--dark);
    --accent: var(--accent--dark);
    --accent1: var(--accent1--dark);
    --muted: var(--muted--dark);
  }

  .slm-root[color-scheme="light"] {
    --bg: var(--bg--light);
    --txt: var(--txt--light);
    --accent: var(--accent--light);
    --accent1: var(--accent1--light);
    --muted: var(--muted--light);
  }

  .slm-surface {
    background: linear-gradient(
      180deg,
      hsl(var(--muted) / 0.62),
      hsl(var(--muted) / 0.38)
    );
  }

  .slm-chip {
    border-radius: 999px;
    padding: 0.5rem 0.85rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    transition: transform 140ms cubic-bezier(0.86, -0.1, 0.27, 1.15),
      box-shadow 180ms cubic-bezier(0.86, -0.1, 0.27, 1.15);
  }

  .slm-chip--active {
    background: hsl(var(--accent));
    color: hsl(var(--bg));
    box-shadow: 0 14px 30px -20px hsl(var(--accent) / 0.8);
  }

  .slm-chip--inactive {
    background: hsl(var(--bg) / 0.35);
    border: 1px solid hsl(var(--accent) / 0.2);
    color: hsl(var(--txt));
  }

  .slm-chip:hover {
    transform: translateY(-1px);
  }

  .slm-fab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 1.25rem;
    background: hsl(var(--accent));
    color: hsl(var(--bg));
    box-shadow: 0 16px 35px -22px hsl(var(--accent) / 0.9);
    transition: transform 140ms cubic-bezier(0.86, -0.1, 0.27, 1.15),
      background 180ms cubic-bezier(0.86, -0.1, 0.27, 1.15);
  }

  .slm-fab:hover {
    transform: translateY(-1px);
    background: hsl(var(--accent) / 0.85);
  }

  .slm-fab--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .slm-tonal-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 999px;
    padding: 0.55rem 0.9rem;
    background: hsl(var(--bg) / 0.4);
    border: 1px solid hsl(var(--accent) / 0.2);
    color: hsl(var(--txt));
    font-weight: 600;
    transition: transform 140ms cubic-bezier(0.86, -0.1, 0.27, 1.15);
  }

  .slm-tonal-btn:hover {
    transform: translateY(-1px);
  }

  .slm-tonal-btn--disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .slm-primary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 999px;
    padding: 0.6rem 1rem;
    background: hsl(var(--accent));
    color: hsl(var(--bg));
    font-weight: 700;
    box-shadow: 0 16px 35px -25px hsl(var(--accent) / 0.9);
  }

  .slm-primary-btn--danger {
    background: hsl(var(--accent1));
    box-shadow: 0 16px 35px -25px hsl(var(--accent1) / 0.9);
  }

  .slm-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.7rem;
    height: 2.7rem;
    border-radius: 1rem;
    background: hsl(var(--bg) / 0.4);
    border: 1px solid hsl(var(--accent) / 0.16);
    color: hsl(var(--txt));
  }

  .slm-icon-btn--danger {
    border-color: hsl(var(--accent1) / 0.25);
  }

  .slm-field {
    position: relative;
  }

  .slm-input {
    width: 100%;
    background: hsl(var(--muted) / 0.55);
    border: 1px solid hsl(var(--accent) / 0.18);
    border-radius: 1.25rem;
    padding: 1rem 1.1rem;
    font-size: 1.05rem;
    color: hsl(var(--txt));
    outline: none;
    transition: box-shadow 180ms cubic-bezier(0.86, -0.1, 0.27, 1.15);
  }

  .slm-input:focus {
    box-shadow: 0 0 0 0.22rem hsl(var(--bg)), 0 0 0 0.42rem hsl(var(--accent) / 0.55);
  }

  .slm-label {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    background: hsl(var(--bg));
    color: hsl(var(--accent) / 0.85);
    pointer-events: none;
    opacity: 0.92;
    transition: transform 180ms cubic-bezier(0.86, -0.1, 0.27, 1.15), opacity 180ms;
  }

  .slm-input:focus + .slm-label,
  .slm-input:not(:placeholder-shown) + .slm-label {
    transform: translateY(-2.25rem);
    opacity: 1;
  }

  .slm-textarea {
    width: 100%;
    background: hsl(var(--muted) / 0.55);
    border: 1px solid hsl(var(--accent) / 0.18);
    border-radius: 1.25rem;
    padding: 1.2rem 1.1rem;
    font-size: 1.05rem;
    color: hsl(var(--txt));
    outline: none;
    resize: vertical;
    min-height: 8rem;
    transition: box-shadow 180ms cubic-bezier(0.86, -0.1, 0.27, 1.15);
  }

  .slm-textarea:focus {
    box-shadow: 0 0 0 0.22rem hsl(var(--bg)), 0 0 0 0.42rem hsl(var(--accent) / 0.55);
  }

  .slm-label--textarea {
    top: 1.1rem;
    transform: translateY(0);
  }

  .slm-badge {
    min-width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: hsl(var(--accent) / 0.14);
    border: 1px solid hsl(var(--accent) / 0.22);
    font-weight: 800;
  }

  .slm-row {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 1.75rem;
    border: 1px solid hsl(var(--accent) / 0.16);
    background: hsl(var(--bg) / 0.25);
  }

  .slm-checkbox {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 0.85rem;
    border: 2px solid hsl(var(--accent) / 0.55);
    background: transparent;
    color: hsl(var(--bg));
    font-weight: 900;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  .slm-checkbox--checked {
    background: hsl(var(--accent));
  }

  .slm-square-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 1.25rem;
    background: hsl(var(--accent));
    color: hsl(var(--bg));
    box-shadow: 0 16px 35px -25px hsl(var(--accent) / 0.9);
    transition: transform 140ms cubic-bezier(0.86, -0.1, 0.27, 1.15);
  }

  .slm-square-btn:hover {
    transform: translateY(-1px);
  }

  .slm-square-btn--danger {
    background: hsl(var(--accent1));
    box-shadow: 0 16px 35px -25px hsl(var(--accent1) / 0.9);
  }

  .slm-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: hsl(var(--accent) / 0.12);
    border: 1px solid hsl(var(--accent) / 0.2);
  }

  .slm-pill--link {
    text-decoration: none;
  }

  .slm-dialog-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background: hsl(var(--bg) / 0.65);
    backdrop-filter: blur(10px);
  }

  .slm-dialog {
    width: 100%;
    max-width: 44rem;
    border-radius: 2rem;
    border: 1px solid hsl(var(--accent) / 0.22);
    background: linear-gradient(
      180deg,
      hsl(var(--muted) / 0.75),
      hsl(var(--muted) / 0.45)
    );
    box-shadow: 0 40px 100px -60px hsl(var(--accent) / 0.75);
    padding: 1.25rem;
  }

  @media (min-width: 640px) {
    .slm-dialog {
      padding: 1.75rem;
    }
  }
  `;
}
