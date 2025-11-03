import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./shadcn/table";
import { ErrorColumnCell } from "./errorColumCell";
import { TableColumnCell } from "./tableColumnCell";
import type { ValidatedResultTableProps } from "../types/componentProps";

export function ValidatedResultTable({ tableHeader, validatedData }: ValidatedResultTableProps) {
    const errorCount = validatedData.filter(
        (item) => item.errorMessages.length > 0 || item.values.some((v) => v.errorMessages.length > 0),
    ).length;
    const validatedResult = `${errorCount}件 / ${validatedData.length}件`;

    return (
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                        {/* エラー表示列。何を表示するかは検討中。とりあえずセルだけは作っておく。 */}
                        <TableHead className="w-12"></TableHead>
                        {tableHeader.map((headerCell, index) => (
                            <TableHead key={index} className={`${headerCell.className} font-semibold`}>
                                {headerCell.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {validatedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="even:bg-muted/20">
                            <TableCell>
                                {row.errorMessages.length > 0 && (
                                    <ErrorColumnCell rowCount={rowIndex + 1} errorMessages={row.errorMessages} />
                                )}
                            </TableCell>
                            {row.values.map((cell, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className={cell.errorMessages.length > 0 ? "bg-destructive/10" : ""}
                                >
                                    <TableColumnCell value={cell.value} errorMessages={cell.errorMessages} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted hover:bg-muted">
                        <TableCell className="font-medium">エラー件数</TableCell>
                        {/* 残りのセルを全て結合する。テーブル列はエラー表示列 + 表示項目数になるので、colSpanはヘッダー用propsの要素数を使用すれば良い */}
                        <TableCell colSpan={tableHeader.length} className="font-medium">
                            {validatedResult}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
