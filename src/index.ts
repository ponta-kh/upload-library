/* interface  */
export type { ValidateString, ValidateNumber, ValidateDate, ValidateResult } from "@/types/validation";
export type { ValidateParsedDataResult } from "@/types/funcResult";
export type { ValidatedResultTableProps } from "@/types/componentProps";

/* function */
export { validateUploadedFile } from "@/utils/validateUploadedFile";

/* component */
export { ValidatedResultTable } from "@/components/validatedResultTable";
