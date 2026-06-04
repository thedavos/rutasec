// @vitest-environment jsdom

import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { Button } from "#/shared/presentation/ui/button";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "#/shared/presentation/ui/bottom-sheet";
import { renderNavLink } from "#/shared/presentation/testing/render-nav-link";

afterEach(() => {
  cleanup();
});

function DemoBottomSheet() {
  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <Button type="button">Open sheet</Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>Sheet title</BottomSheetTitle>
          <BottomSheetDescription>Sheet description</BottomSheetDescription>
        </BottomSheetHeader>
        <BottomSheetFooter>
          <BottomSheetClose asChild>
            <Button type="button" variant="outline">
              Done
            </Button>
          </BottomSheetClose>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

describe("BottomSheet", () => {
  it("opens and shows generic header and footer content", async () => {
    await renderNavLink("/", DemoBottomSheet);

    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Sheet title" })).toBeTruthy();
      expect(screen.getByText("Sheet description")).toBeTruthy();
      expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
    });
  });

  it("closes when BottomSheetClose is activated", async () => {
    await renderNavLink("/", DemoBottomSheet);

    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Sheet title" })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Sheet title" })).toBeNull();
    });
  });
});
