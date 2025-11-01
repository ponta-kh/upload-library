import type { Meta, StoryObj } from "@storybook/react";
import { ErrorColumnCell } from "../components/errorColumCell";

const meta = {
    title: "Component/ErrorColumnCell",
    component: ErrorColumnCell,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ErrorColumnCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        rowCount: 1,
        errorMessages: ["エラーメッセージ1", "エラーメッセージ2"],
    },
};
