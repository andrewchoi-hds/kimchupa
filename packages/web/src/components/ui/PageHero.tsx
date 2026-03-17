interface PageHeroProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHero({ title, description, children, className = "" }: PageHeroProps) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 animate-slide-up">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
