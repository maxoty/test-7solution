"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ItemType = "Fruit" | "Vegetable";

type TodoItem = {
  type: ItemType;
  name: string;
};

type AssignedTodoItem = TodoItem & {
  assignedAt: number;
};

const initialItems: TodoItem[] = [
  { type: "Fruit", name: "Apple" },
  { type: "Vegetable", name: "Broccoli" },
  { type: "Vegetable", name: "Mushroom" },
  { type: "Fruit", name: "Banana" },
  { type: "Vegetable", name: "Tomato" },
  { type: "Fruit", name: "Orange" },
  { type: "Fruit", name: "Mango" },
  { type: "Fruit", name: "Pineapple" },
  { type: "Vegetable", name: "Cucumber" },
  { type: "Fruit", name: "Watermelon" },
  { type: "Vegetable", name: "Carrot" },
];

const itemTypes: ItemType[] = ["Fruit", "Vegetable"];
const returnDelay = 5000;

const buttonStyles =
  "flex w-full cursor-pointer h-10 items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors";

export default function FruitVegetableTodo() {
  const [availableItems, setAvailableItems] = useState(initialItems);
  const [assignedItems, setAssignedItems] = useState<
    Record<ItemType, AssignedTodoItem[]>
  >({ Fruit: [], Vegetable: [] });
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const scheduleReturn = useCallback((item: AssignedTodoItem) => {
    if (timers.current.has(item.name)) {
      return;
    }

    const remainingTime = Math.max(
      0,
      item.assignedAt + returnDelay - Date.now(),
    );
    const timer = setTimeout(() => {
      timers.current.delete(item.name);
      setAssignedItems((current) => ({
        ...current,
        [item.type]: current[item.type].filter(
          (assignedItem) => assignedItem.name !== item.name,
        ),
      }));
      setAvailableItems((current) => [
        ...current,
        { type: item.type, name: item.name },
      ]);
    }, remainingTime);

    timers.current.set(item.name, timer);
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;

    itemTypes.forEach((type) => assignedItems[type].forEach(scheduleReturn));

    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, [assignedItems, scheduleReturn]);

  function moveToCategory(item: TodoItem, assignedAt: number) {
    if (timers.current.has(item.name)) {
      return;
    }

    const assignedItem = { ...item, assignedAt };
    scheduleReturn(assignedItem);
    setAvailableItems((current) =>
      current.filter((availableItem) => availableItem.name !== item.name),
    );
    setAssignedItems((current) => ({
      ...current,
      [item.type]: [...current[item.type], assignedItem],
    }));
  }

  function returnToList(item: AssignedTodoItem) {
    const timer = timers.current.get(item.name);

    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(item.name);
    }

    setAssignedItems((current) => ({
      ...current,
      [item.type]: current[item.type].filter(
        (assignedItem) => assignedItem.name !== item.name,
      ),
    }));
    setAvailableItems((current) => [
      ...current,
      { type: item.type, name: item.name },
    ]);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <section aria-labelledby="available-items-heading">
          <h3
            className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100"
            id="available-items-heading"
          >
            Items
            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
              {availableItems.length}
            </span>
          </h3>
          <ul className="space-y-2">
            {availableItems.map((item) => (
              <li key={item.name}>
                <button
                  className={`${buttonStyles} border border-solid border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]`}
                  onClick={() => moveToCategory(item, Date.now())}
                  type="button"
                >
                  {item.name}
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {itemTypes.map((type) => (
          <section aria-labelledby={`${type}-items-heading`} key={type}>
            <h3
              className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100"
              id={`${type}-items-heading`}
            >
              {type}
              <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                {assignedItems[type].length}
              </span>
            </h3>
            <ul className="space-y-2">
              {assignedItems[type].map((item) => {
                const elapsedTime = Math.min(
                  returnDelay,
                  Math.max(0, Date.now() - item.assignedAt),
                );

                return (
                  <li key={item.name}>
                    <button
                      className={`${buttonStyles} todo-item-fade bg-foreground text-background`}
                      onClick={() => returnToList(item)}
                      style={{ animationDelay: `-${elapsedTime}ms` }}
                      type="button"
                    >
                      {item.name}
                      <span className="text-xs opacity-70">Return</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {availableItems.length} items in the main list.
      </p>
    </div>
  );
}
