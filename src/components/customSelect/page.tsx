"use client";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const moods = [
  { name: "Tốt", value: "good" },
  { name: "Bình thường", value: "normal" },
  { name: "Kém", value: "bad" },
];

export default function CustomSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = moods.find((m) => m.value === value) || moods[0];

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={(val) => onChange(val.value)}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-white py-5 pl-4 pr-10 text-left border-2 border-gray-200 focus:border-none focus:ring-2 focus:ring-green-500 sm:text-sm">
            <span className="block truncate font-bold">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black/10 focus:outline-none sm:text-sm">
              {moods.map((mood) => (
                <Listbox.Option
                  key={mood.value}
                  value={mood}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "text-pink-900" : "text-pink-700"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected
                            ? "font-semibold text-cyan-400"
                            : "font-normal text-pink-700"
                        }`}
                      >
                        {mood.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-3 flex items-center text-cyan-400">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
