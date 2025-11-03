import type { ValidateParsedDataResult } from "../types/funcResult";

/* ValidatedResultTable.tsx */
export interface ValidatedResultTableProps {
    tableHeader: ValidatedResultTableHeader[];
    validatedData: ValidateParsedDataResult[];
}

export interface ValidatedResultTableHeader {
    label: React.ReactNode;
    className?: string;
}

/* ErrorColumnCell.tsx */
export interface ErrorColumnCellProps {
    rowCount: number;
    errorMessages: string[];
}
