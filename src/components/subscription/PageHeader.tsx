
import React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { SunIcon, MoonIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: PageHeaderProps) => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="mb-12 text-center relative">
      <div className="absolute right-0 top-0 flex items-center gap-2 z-10">
        <SunIcon size={16} className="text-muted-foreground" />
        <Switch 
          checked={theme === "dark"} 
          onCheckedChange={toggleTheme}
          aria-label="Toggle dark mode"
          className="cursor-pointer"
        />
        <MoonIcon size={16} className="text-muted-foreground" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in">
        {title}
      </h1>
      <p className="text-muted-foreground max-w-3xl mx-auto text-lg animate-fade-up">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
