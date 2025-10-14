import { Hash } from "lucide-react";

const Heading = ({ level, children, id, ...props }: any) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return (
    <Tag id={id} className="group scroll-mt-8" {...props}>
      {children}
      <a
        href={`#${id}`}
        className="ml-1 align-[2px] text-muted-foreground opacity-0 group-hover:opacity-100 transition"
      >
        <Hash className="inline" size={16} />
      </a>
    </Tag>
  );
};
// 見出しをまとめて生成
export const headings = Object.fromEntries(
  [1, 2, 3, 4, 5, 6].map((level) => [
    `h${level}`,
    (props: any) => <Heading level={level} {...props} />,
  ])
);
