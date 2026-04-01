"use client";

import { useEffect, useRef, useState } from "react";
import { MENU_ITEMS } from "@/components/portfolio/data";
import type { ScreenId } from "@/components/portfolio/types";

type Direction = "up" | "down" | "left" | "right";

export function useDashboardNavigation({ disabled }: { disabled: boolean }) {
  const [selectedMenuId, setSelectedMenuId] = useState<ScreenId | null>(null);
  const menuButtonRefs = useRef<Map<ScreenId, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (!selectedMenuId || disabled) {
      return;
    }

    menuButtonRefs.current.get(selectedMenuId)?.focus({ preventScroll: true });
  }, [disabled, selectedMenuId]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const getDirectionalCandidate = (currentId: ScreenId, direction: Direction) => {
      const currentButton = menuButtonRefs.current.get(currentId);

      if (!currentButton) {
        return null;
      }

      const currentRect = currentButton.getBoundingClientRect();
      const currentCenterX = currentRect.left + currentRect.width / 2;
      const currentCenterY = currentRect.top + currentRect.height / 2;

      let nextId: ScreenId | null = null;
      let bestScore = Number.POSITIVE_INFINITY;

      for (const [candidateId, candidateButton] of menuButtonRefs.current.entries()) {
        if (candidateId === currentId) {
          continue;
        }

        const candidateRect = candidateButton.getBoundingClientRect();
        const candidateCenterX = candidateRect.left + candidateRect.width / 2;
        const candidateCenterY = candidateRect.top + candidateRect.height / 2;
        const deltaX = candidateCenterX - currentCenterX;
        const deltaY = candidateCenterY - currentCenterY;

        let primaryDelta = 0;
        let crossDelta = 0;

        switch (direction) {
          case "left":
            primaryDelta = -deltaX;
            crossDelta = Math.abs(deltaY);
            break;
          case "right":
            primaryDelta = deltaX;
            crossDelta = Math.abs(deltaY);
            break;
          case "up":
            primaryDelta = -deltaY;
            crossDelta = Math.abs(deltaX);
            break;
          case "down":
            primaryDelta = deltaY;
            crossDelta = Math.abs(deltaX);
            break;
        }

        if (primaryDelta <= 0) {
          continue;
        }

        const score = primaryDelta * primaryDelta + crossDelta * crossDelta * 2;

        if (score < bestScore) {
          bestScore = score;
          nextId = candidateId;
        }
      }

      return nextId;
    };

    const handleMenuKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase();

      const directionMap: Record<string, Direction> = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right",
      };

      const direction = directionMap[pressedKey];

      if (!direction) {
        return;
      }

      event.preventDefault();

      if (!selectedMenuId) {
        setSelectedMenuId(MENU_ITEMS[0]?.id ?? null);
        return;
      }

      const nextId = getDirectionalCandidate(selectedMenuId, direction);

      if (nextId) {
        setSelectedMenuId(nextId);
      }
    };

    window.addEventListener("keydown", handleMenuKeyDown);
    return () => window.removeEventListener("keydown", handleMenuKeyDown);
  }, [disabled, selectedMenuId]);

  const setMenuButtonRef = (id: ScreenId) => (node: HTMLButtonElement | null) => {
    if (node) {
      menuButtonRefs.current.set(id, node);
      return;
    }

    menuButtonRefs.current.delete(id);
  };

  return {
    selectedMenuId,
    setMenuButtonRef,
    setSelectedMenuId,
  };
}
