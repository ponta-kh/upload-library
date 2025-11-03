/* interface  */
export type { Validate, ValidateString, ValidateNumber, ValidateDate, ValidateResult } from "./types/validation";
export type { ValidateParsedDataResult, UploadValidationResult } from "./types/funcResult";
export type { ValidatedResultTableProps, ValidatedResultTableHeader } from "./types/componentProps";

/* function */
export { validateUploadedFile } from "./utils/validateUploadedFile";

/* component */
export { ValidatedResultTable } from "./components/validatedResultTable";
