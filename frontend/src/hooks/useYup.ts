import { useCallback } from "react";
import { BaseSchema, ValidationError } from "yup";

export function useYup<T>(validationSchema: BaseSchema<T>) {
  return useCallback(async (data: T) => {
    try {
      const values = await validationSchema.validate(data, {
        abortEarly: false,
      });

      return {
        values,
        errors: {},
      };
    } catch (errors) {
      return {
        values: {},
        errors: (errors as ValidationError).inner.reduce(
          (allErrors, currentError) => ({
            ...allErrors,
            [currentError.path!]: {
              type: currentError.type ?? "validation",
              message: currentError.message,
            },
          }),
          {}
        ),
      };
    }
  }, []);
}
