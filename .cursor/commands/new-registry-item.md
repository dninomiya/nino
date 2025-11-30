- packages/registry/registry.json に新しいレジストリアイテムを追加する
- apps/web/app/[locale]/(main)/registry/ に doc.mdx と preview.tsx を作成する
- 日付は date コマンドで取得し、YYYY-MM-DD 形式で設定する
- doc.mdx の frontmatter に sponsors: true を追加する
- doc.mdx 配下からはじまる

```
import Preview from "./preview";

説明文

<ComponentPreview>
  <ComponentPreviewCode>
```tsx file=./preview.tsx
```
  </ComponentPreviewCode>
  <ComponentPreviewDemo>
    <Preview />
  </ComponentPreviewDemo>
</ComponentPreview>
```