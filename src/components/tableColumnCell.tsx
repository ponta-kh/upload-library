import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import type { ValidateResult } from "@/types/validation";

export function TableColumnCell({ value, errorMessages }: ValidateResult) {
    return (
        <div>
            <Tooltip>
                <TooltipTrigger>{value}</TooltipTrigger>
                {errorMessages && (
                    <TooltipContent>
                        {errorMessages.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
    );
}
