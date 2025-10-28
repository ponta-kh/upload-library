export interface Validate {
    type: "string" | "number" | "date";
    isRequired: boolean;
}

export interface ValidateString extends Validate {
    type: "string";
    minLength?: number;
    maxLength?: number;
}

export interface ValidateNumber extends Validate {
    type: "number";
    minValue?: number;
    maxValue?: number;
    maxDecimalDigits?: number;
}

export interface ValidateDate extends Validate {
    type: "date";
    earliest?: Date;
    latest?: Date;
}

export interface ValidateResult {
    value: string;
    errorMessages: string[];
}
