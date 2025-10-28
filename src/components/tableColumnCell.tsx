import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import type { ValidateResult } from "@/types/validation";

export function TableColumnCell({ value, errorMessages }: ValidateResult) {
    const hasError = errorMessages && errorMessages.length > 0;

    return (
        <div>
            {hasError ? (
                <Tooltip>
                    <TooltipTrigger>{value}</TooltipTrigger>
                    <TooltipContent>
                        {errorMessages.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </TooltipContent>
                </Tooltip>
            ) : (
                value
            )}
        </div>
    );
}
