export default async function RegistryPage({
  params,
}: PageProps<"/[locale]/registry/[id]">) {
  const id = (await params).id;
  const post = await import(`@/app/[locale]/(main)/registry/docs/${id}.mdx`);
  const Content = post.default;

  return (
    <div>
      <div className="prose dark:prose-invert prose-neutral">
        <Content />
      </div>
    </div>
  );
}
