import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

// WKO logo: red square with WKO letters + Austrian flag stripe
export const WkoLogo = ({ className }: Props) => (
  <div className={cn("inline-flex items-center", className)} aria-label="Wirtschaftskammer Österreich">
    <div className="flex h-12 w-16 items-center justify-center bg-wko-red text-white font-extrabold tracking-tight text-2xl">
      WKO
    </div>
    <div className="flex h-12 w-6 flex-col">
      <div className="flex-1 bg-wko-red" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-wko-red" />
    </div>
  </div>
);
