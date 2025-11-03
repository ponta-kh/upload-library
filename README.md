# CSV Upload & Validation Library

CSVファイルのアップロードとバリデーションを行うためのReactライブラリです。

## 概要

本ライブラリは、CSVファイルのアップロード機能と、その内容を検証するためのユーティリティ関数および結果表示用のReactコンポーネントを提供します。
`papaparse` を利用してCSVをパースし、柔軟なバリデーションルールに基づいて各行・各セルを検証できます。

## 主な機能

-   **CSVファイルのパース**: UTF-8形式のCSVファイルを解析し、文字列の2次元配列に変換します。
-   **多彩なバリデーションルール**:
    -   **文字列**: 必須チェック、最小/最大長
    -   **数値**: 必須チェック、最小/最大値、小数部の桁数
    -   **日付**: 必須チェック、最早/最遅日
-   **カスタムバリデーション**: 行全体に対する独自の検証ロジックを追加できます。
-   **結果表示**: バリデーション結果（エラーを含む）をテーブル形式で表示する `ValidatedResultTable` コンポーネントを提供します。

## インストール

```bash
npm install @yourname/upload-library
```

**Note:** `@yourname/upload-library` は実際のパッケージ名に置き換えてください。

## 使用方法

### 1. バリデーションの実行

`validateUploadedFile` 関数を使用して、アップロードされたファイルを検証します。

```typescript
import { validateUploadedFile, Validate } from '@yourname/upload-library';
import type { UploadValidationResult } from '@yourname/upload-library';

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 各列のバリデーションルールを定義
    const validationRules: Validate[] = [
        { type: "string", isRequired: true, maxLength: 10 },
        { type: "number", isRequired: true, minValue: 0 },
        { type: "date", isRequired: false },
    ];

    // 行全体に対するカスタムバリデーション
    const customRowValidator = (dataRow: string[]): string[] => {
        const errors: string[] = [];
        // 例: 2列目の値が100以上の場合、3列目は必須
        if (Number(dataRow[1]) >= 100 && !dataRow[2]) {
            errors.push("3列目の日付は必須です。");
        }
        return errors;
    };

    const result: UploadValidationResult = await validateUploadedFile(
        file,
        [0], // スキップする行（ヘッダーなど）
        3,   // 期待される列数
        validationRules,
        customRowValidator
    );

    if (result.success) {
        console.log("Validation successful:", result.validatedData);
    } else {
        console.error("Validation failed:", result.errorMessage);
    }
};
```

### 2. バリデーション結果の表示

`ValidatedResultTable` コンポーネントを使用して、検証結果を表示します。

```tsx
import { ValidatedResultTable } from '@yourname/upload-library';
import type { ValidatedResultTableProps } from '@yourname/upload-library';

const MyValidationResultComponent = ({ validatedData }) => {
    const tableHeader: ValidatedResultTableProps['tableHeader'] = [
        { label: "商品名" },
        { label: "価格" },
        { label: "発売日" },
    ];

    return (
        <ValidatedResultTable
            tableHeader={tableHeader}
            validatedData={validatedData}
        />
    );
};
```

## 型定義

### `Validate`

各列のバリデーションルールを定義します。

-   `ValidateString`: 文字列のルール
-   `ValidateNumber`: 数値のルール
-   `ValidateDate`: 日付のルール

### `UploadValidationResult`

`validateUploadedFile` 関数の戻り値の型です。

-   `success`: パースとバリデーションが成功したかどうか
-   `validatedData`: 各行のバリデーション結果
-   `hasError`: データ内にエラーが存在するかどうか
-   `errorMessage`: ファイル全体のパースエラーなど

### `ValidatedResultTableProps`

`ValidatedResultTable` コンポーネントのPropsです。

-   `tableHeader`: テーブルヘッダーの定義
-   `validatedData`: `validateUploadedFile` から得られた検証済みデータ

## ライセンス

[MIT](./LICENSE)