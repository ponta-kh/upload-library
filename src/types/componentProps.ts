import type { ValidateParsedDataResult } from "@/types/funcResult";

export interface ValidatedResultTableProps {
    tableHeader: {
        label: React.ReactNode;
        className?: string;
    }[];
    validatedData: ValidateParsedDataResult[];
}

export interface ErrorColumnCellProps {
    rowCount: number;
    errorMessages: string[];
}
