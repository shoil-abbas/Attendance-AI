import { CheckSquare } from 'lucide-react';

export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <div className="flex items-center gap-2" {...props}>
      <CheckSquare className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        Attrack
      </span>
    </div>
  ),
};
