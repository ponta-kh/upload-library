import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";

interface TableColumnCellProps {
    value: string;
    errorMessages?: string[];
}

export function TableColumnCell({ value, errorMessages }: TableColumnCellProps) {
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
