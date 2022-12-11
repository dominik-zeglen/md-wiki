import { useHotkeys } from "react-hotkeys-hook";

export const useFormSave = (onSubmit: () => void) =>
  useHotkeys(
    "meta+s",
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    { enableOnFormTags: true },
    []
  );
