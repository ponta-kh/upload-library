import type { Meta, StoryObj } from "@storybook/react";
import { ValidatedResultTable } from "../components/validatedResultTable";
import type { ValidatedResultTableProps } from "@/types/componentProps";

const meta = {
    title: "Component/ValidatedResultTable",
    component: ValidatedResultTable,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ValidatedResultTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs: ValidatedResultTableProps = {
    tableHeader: [{ label: "ヘッダー1" }, { label: "ヘッダー2" }, { label: "ヘッダー3" }],
    validatedData: [
        {
            values: [
                { value: "値1-1", errorMessages: [] },
                { value: "値1-2", errorMessages: ["セルエラー1"] },
                { value: "値1-3", errorMessages: [] },
            ],
            errorMessages: [],
        },
        {
            values: [
                { value: "値2-1", errorMessages: [] },
                { value: "値2-2", errorMessages: [] },
                { value: "値2-3", errorMessages: [] },
            ],
            errorMessages: ["行エラー1", "行エラー2"],
        },
        {
            values: [
                { value: "値3-1", errorMessages: [] },
                { value: "値3-2", errorMessages: [] },
                { value: "値3-3", errorMessages: [] },
            ],
            errorMessages: [],
        },
    ],
};

export const Default: Story = {
    args: defaultArgs,
};
