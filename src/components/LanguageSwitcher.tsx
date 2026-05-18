import { LANGUAGES, useI18n, flagUrl, type LangCode } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <img
            src={flagUrl(current.country)}
            alt={current.name}
            width={20}
            height={15}
            className="h-[15px] w-[20px] rounded-sm object-cover shadow-sm"
          />
          <span className="hidden sm:inline">{current.name}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as LangCode)}
            className={`gap-2 ${l.code === lang ? "font-semibold text-primary" : ""}`}
          >
            <img
              src={flagUrl(l.country)}
              alt=""
              width={20}
              height={15}
              className="h-[15px] w-[20px] rounded-sm object-cover shadow-sm"
            />
            <span>{l.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
