import { Button } from '@/components/ui/button';

import type { GameSettings, GridSize, PlayerCount, Theme } from '@/features/game';

interface SetupScreenProps {
  settings: GameSettings;
  onChange: (patch: Partial<GameSettings>) => void;
  onStart: () => void;
}

interface OptionGroupProps<T extends string | number> {
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

function OptionGroup<T extends string | number>({
  legend,
  value,
  options,
  onChange,
}: OptionGroupProps<T>) {
  const labelId = `setup-${legend.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col gap-150 sm:gap-200" role="group" aria-labelledby={labelId}>
      <p id={labelId} className="text-preset-5 font-bold text-blue-800">
        {legend}
      </p>
      <div className="flex gap-100 sm:gap-200">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Button
              key={String(option.value)}
              type="button"
              size="option"
              variant={selected ? 'selected' : 'soft'}
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className="text-preset-5 h-500 sm:h-600"
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function SetupScreen({ settings, onChange, onStart }: SetupScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-blue-950 px-300 py-500 sm:px-400 sm:py-600">
      <h1 className="text-preset-2 sm:text-preset-1 mb-500 font-bold text-white sm:mb-600">
        memory
      </h1>
      <form
        className="max-w-modal rounded-20 flex w-full flex-col gap-400 bg-white p-300 sm:gap-500 sm:p-600"
        onSubmit={(event) => {
          event.preventDefault();
          onStart();
        }}
      >
        <OptionGroup<Theme>
          legend="Select Theme"
          value={settings.theme}
          onChange={(theme) => onChange({ theme })}
          options={[
            { value: 'numbers', label: 'Numbers' },
            { value: 'icons', label: 'Icons' },
          ]}
        />
        <OptionGroup<PlayerCount>
          legend="Numbers of Players"
          value={settings.players}
          onChange={(players) => onChange({ players })}
          options={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
          ]}
        />
        <OptionGroup<GridSize>
          legend="Grid Size"
          value={settings.gridSize}
          onChange={(gridSize) => onChange({ gridSize })}
          options={[
            { value: 4, label: '4x4' },
            { value: 6, label: '6x6' },
          ]}
        />
        <Button type="submit" variant="primary" size="lg" className="mt-100 h-500 w-full sm:h-600">
          Start Game
        </Button>
      </form>
    </div>
  );
}
