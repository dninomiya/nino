import { InView } from "@/registry/components/in-view";

export default function Preview() {
  return (
    <>
      <InView>
        <div
          className="duration-1000 transition delay-500 size-20 rounded-md border border-sky-500
      group-data-[in-view=true]:bg-sky-500
      "
        />
      </InView>
      <p className="text-muted-foreground text-xs mt-4">
        要素が画面に入ったら青くなります
      </p>
    </>
  );
}
