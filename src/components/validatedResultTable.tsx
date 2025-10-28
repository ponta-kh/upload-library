import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { ErrorColumnCell } from "./errorColumCell";
import { TableColumnCell } from "./tableColumnCell";
import type { ValidatedResultTableProps } from "@/types/componentProps";

export async function ValidatedResultTable({ tableHeader, validatedData }: ValidatedResultTableProps) {
    const errorCount = validatedData.filter(
        (item) => item.errorMessages.length > 0 || item.values.some((v) => v.errorMessages.length > 0),
    ).length;
    const validatedResult = `${errorCount}件 / ${validatedData.length}件`;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {/* エラー表示列。何を表示するかは検討中。とりあえずセルだけは作っておく。 */}
                    <TableHead></TableHead>
                    {tableHeader.map((headerCell, index) => (
                        <TableHead key={index} className={headerCell.className}>
                            {headerCell.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {validatedData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell>
                            {row.errorMessages.length > 0 && (
                                <ErrorColumnCell rowCount={rowIndex + 1} errorMessages={row.errorMessages} />
                            )}
                        </TableCell>
                        {row.values.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className={cell.errorMessages.length > 0 ? "bg-red-100" : ""}>
                                <TableColumnCell value={cell.value} errorMessages={cell.errorMessages} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>エラー件数</TableCell>
                    {/* 残りのセルを全て結合する。テーブル列はエラー表示列 + 表示項目数になるので、colSpanはヘッダー用propsの要素数を使用すれば良い */}
                    <TableCell colSpan={tableHeader.length}>{validatedResult}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
