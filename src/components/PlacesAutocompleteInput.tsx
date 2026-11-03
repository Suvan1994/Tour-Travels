import React, { useEffect, useId, useRef, useState } from 'react';
import { PlaceSuggestionItem, usePlacesAutocomplete } from '../hooks/usePlacesAutocomplete';
import { SelectedPlaceInfo } from '../types/travel';

interface PlacesAutocompleteInputProps {
  id?: string;
  label: string;
  icon?: string;
  placeholder?: string;
  value: SelectedPlaceInfo;
  onSelect: (place: SelectedPlaceInfo) => void;
  error?: string;
  hasMapsApiKey: boolean;
}

export const PlacesAutocompleteInput: React.FC<PlacesAutocompleteInputProps> = ({
  id,
  label,
  icon = 'location_on',
  placeholder = 'Search city, airport, or landmark...',
  value,
  onSelect,
  error,
  hasMapsApiKey,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const listboxId = `${inputId}-listbox`;

  const [inputText, setInputText] = useState<string>(value.label);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync external changes (e.g. Swap Locations or Tour Package preset)
  useEffect(() => {
    setInputText(value.label);
  }, [value.label]);

  const { suggestions, isLoading, resolveSuggestionToPlace } = usePlacesAutocomplete(
    inputText,
    hasMapsApiKey && isOpen
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChooseSuggestion = async (item: PlaceSuggestionItem) => {
    setIsOpen(false);
    setInputText(item.fullText);
    const resolved = await resolveSuggestionToPlace(item);
    if (resolved) {
      setInputText(resolved.label);
      onSelect(resolved);
    }
  };

  const commitFreeTextIfChanged = () => {
    const trimmed = inputText.trim();
    if (trimmed && trimmed !== value.label) {
      onSelect({
        label: trimmed,
        formattedAddress: trimmed,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitFreeTextIfChanged();
        setIsOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        void handleChooseSuggestion(suggestions[highlightedIndex]);
      } else {
        commitFreeTextIfChanged();
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={containerRef}>
      <label
        htmlFor={inputId}
        className="text-label-md text-on-surface font-semibold flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
          {icon}
        </span>
        <span>{label}</span>
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          value={inputText}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onBlur={() => {
            // Allow suggestion click to fire before committing raw input
            window.setTimeout(() => {
              commitFreeTextIfChanged();
            }, 180);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full h-12 pl-space-md pr-9 bg-surface-subtle text-on-surface rounded-lg border transition-all text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
            error ? 'border-error' : 'border-primary-container/15'
          }`}
        />

        {isLoading ? (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-secondary border-t-transparent animate-spin"
            aria-label="Loading place suggestions"
          />
        ) : inputText ? (
          <button
            type="button"
            onClick={() => {
              setInputText('');
              setIsOpen(true);
            }}
            aria-label={`Clear ${label}`}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        ) : null}
      </div>

      {error && (
        <span className="text-body-sm text-error font-medium" role="alert">
          {error}
        </span>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-[74px] z-40 bg-surface-canvas rounded-xl shadow-xl border border-primary-container/10 max-h-64 overflow-y-auto py-1"
        >
          {suggestions.map((item, idx) => {
            const active = idx === highlightedIndex;
            return (
              <li
                key={item.placeId || idx}
                role="option"
                aria-selected={active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  void handleChooseSuggestion(item);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-3.5 py-2.5 cursor-pointer flex items-start gap-2.5 transition-colors ${
                  active ? 'bg-surface-container-low text-primary' : 'hover:bg-surface-subtle'
                }`}
              >
                <span
                  className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  location_on
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-label-lg font-semibold text-on-surface truncate">
                    {item.mainText}
                  </span>
                  {item.secondaryText && (
                    <span className="text-body-sm text-on-surface-variant truncate">
                      {item.secondaryText}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
          <li className="px-3.5 py-1.5 border-t border-primary-container/5 text-[11px] text-on-surface-variant text-right">
            Powered by Google
          </li>
        </ul>
      )}
    </div>
  );
};
