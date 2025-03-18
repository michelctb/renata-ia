
import React from "react";

type PageHeaderProps = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
