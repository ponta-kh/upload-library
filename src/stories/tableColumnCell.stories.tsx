import type { Meta, StoryObj } from "@storybook/react";
import { TableColumnCell } from "../components/tableColumnCell";

const meta = {
    title: "Component/TableColumnCell",
    component: TableColumnCell,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof TableColumnCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: "セルの値",
        errorMessages: [],
    },
};

export const WithError: Story = {
    args: {
        value: "エラーのあるセルの値",
        errorMessages: ["エラーメッセージ1", "エラーメッセージ2"],
    },
};
