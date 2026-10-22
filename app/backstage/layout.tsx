import { BackstageNav } from "@/components/backstage/BackstageNav";

export default function BackstageLayout({
  children,
}: LayoutProps<"/backstage">) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pt-4">
        <BackstageNav />
      </div>
      {children}
    </div>
  );
}
