import { InView } from "@/registry/components/in-view";

export default function Preview() {
  return (
    <div>
      <InView>
        <div
          className="duration-1000 transition relative size-20 rounded-md border border-sky-500/20 mx-auto
      group-data-[in-view=true]:bg-sky-500 group-data-[in-view=true]:delay-500
      "
        >
          <div
            className="size-10 bg-pink-500 rounded-md transition duration-1000 mx-auto absolute top-0 right-0
            group-data-[in-view=true]:delay-500
            group-data-[in-view=true]:rotate-45 group-data-[in-view=true]:scale-1.2 group-data-[in-view=true]:translate-x-2 group-data-[in-view=true]:-translate-y-2
          "
          ></div>
        </div>
      </InView>
    </div>
  );
}
