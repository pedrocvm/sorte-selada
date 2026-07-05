import SortearTool from "@/components/SortearTool";

export const metadata = {
  title: "Sortear · Dourê Semijoias",
  robots: { index: false, follow: false },
};

export default function SortearPage() {
  return (
    <div className="h-full overflow-hidden">
      <SortearTool />
    </div>
  );
}
