import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import type { ValidateResult } from "@/types/validation";
import { AlertTriangle } from "lucide-react";

export function TableColumnCell({ value, errorMessages }: ValidateResult) {
    const hasError = errorMessages && errorMessages.length > 0;

    return (
        <div>
            {hasError ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-x-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span>{value}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {errorMessages.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </TooltipContent>
                </Tooltip>
            ) : (
                <span>{value}</span>
            )}
        </div>
    );
}
