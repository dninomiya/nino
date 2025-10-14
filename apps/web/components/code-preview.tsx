import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

export function ComponentPreview({ children }: { children: React.ReactNode }) {
  return (
    <figure>
      <Tabs className="not-prose" defaultValue="demo">
        <TabsList>
          <TabsTrigger value="demo">プレビュー</TabsTrigger>
          <TabsTrigger value="code">コード</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </figure>
  );
}

export function ComponentPreviewCode({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TabsContent value="code">{children}</TabsContent>;
}

export function ComponentPreviewDemo({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabsContent value="demo" className="border rounded-lg p-6">
      {children}
    </TabsContent>
  );
}
