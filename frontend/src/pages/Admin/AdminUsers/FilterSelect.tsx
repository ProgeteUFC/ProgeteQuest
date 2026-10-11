import { useEffect, useId, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export default function FilterSelect({ label, value, options, onChange }: Props) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);
  function toggle() {
    setHighlight(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(!open);
  }
  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }
  return <div ref={container} className="users-filter" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <span id={`${id}-label`}>{label}</span>
    <button ref={trigger} className="users-filter-trigger" type="button"
      role="combobox" aria-labelledby={`${id}-label ${id}-value`}
      aria-expanded={open} aria-controls={`${id}-options`} aria-haspopup="listbox"
      aria-activedescendant={open ? `${id}-option-${highlight}` : undefined}
      onClick={toggle} onKeyDown={(event) => {
        if (event.key === "Escape") { setOpen(false); return; }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          setOpen(true);
          setHighlight((current) => event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
            : !open ? Math.max(0, options.findIndex((option) => option.value === value))
            : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
        } else if (open && ["Enter", " "].includes(event.key)) {
          event.preventDefault(); choose(highlight);
        }
      }}>
      <span id={`${id}-value`}>{options.find((option) => option.value === value)?.label}</span>
      <FiChevronDown aria-hidden="true" />
    </button>
    {open && <div className="users-filter-options" id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`}>
      {options.map((option, index) => <div key={option.value} id={`${id}-option-${index}`}
        role="option" aria-selected={option.value === value} data-highlighted={highlight === index}
        onMouseEnter={() => setHighlight(index)} onMouseDown={(event) => event.preventDefault()}
        onClick={() => choose(index)}>{option.label}</div>)}
    </div>}
  </div>;
}
