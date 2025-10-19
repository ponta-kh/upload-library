import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
interface ErrorColumnCellProps {
    rowCount: number;
    errorMessages: string[];
}

export function ErrorColumnCell({ rowCount, errorMessages }: ErrorColumnCellProps) {
    const dialogTitle = `${rowCount}行目 エラー内容`;

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="link">エラーまとめ</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>

                {/* keyにindexを使用するのは非推奨だが、このコンポーネントでは要素の入れ替わりなどは発生しないのでこの実装で進めてしまう */}
                {errorMessages.map((error, index) => (
                    <p key={index}>{error}</p>
                ))}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">閉じる</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
