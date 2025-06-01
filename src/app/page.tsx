import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CheckCircle, Copy, DatabaseZap, Zap, ShieldCheck, Cpu, Repeat, Focus, Settings, Users } from 'lucide-react';

function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                Achieve Perfect Replication, Every Time
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our platform ensures exact display and reproducible results, delivering unparalleled precision and consistency for your critical applications.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="transition-transform duration-200 hover:scale-105">Get Started</Button>
              <Button variant="outline" size="lg" className="transition-transform duration-200 hover:scale-105">Learn More</Button>
            </div>
          </div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="Hero Abstract"
            data-ai-hint="abstract technology"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: <Focus className="h-10 w-10 text-primary mb-4" />,
    title: 'Exact Display',
    description: 'Pixel-perfect rendering ensures that what you see is precisely what you get, across all platforms and devices.',
    dataAiHint: 'precision interface'
  },
  {
    icon: <Repeat className="h-10 w-10 text-primary mb-4" />,
    title: 'Reproducible Results',
    description: 'Generate consistent outputs from the same inputs, guaranteeing reliability and predictability in your workflows.',
    dataAiHint: 'data consistency'
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-accent mb-4" />,
    title: 'Unwavering Trustworthiness',
    description: 'Built on a foundation of security and integrity, our system provides results you can depend on without question.',
    dataAiHint: 'security shield'
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary mb-4" />,
    title: 'Professional & Machined',
    description: 'Engineered with a modern, neutral aesthetic and robust architecture for professional-grade performance.',
    dataAiHint: 'circuit board'
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Why Choose Exact Replica?</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover the core functionalities that set our platform apart, designed for precision, reliability, and professional use.
          </p>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="items-center text-center">
                {feature.icon}
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
            Engineered for Absolute Precision
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            At Exact Replica, we understand the critical importance of precision. Our technology is meticulously designed to eliminate discrepancies and ensure that every detail is captured and reproduced with flawless accuracy. From complex data visualizations to intricate design renderings, expect nothing less than perfection.
          </p>
          <ul className="grid gap-2 py-4">
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              Cutting-edge replication algorithms.
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              Cross-platform consistency guaranteed.
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              Validated for mission-critical applications.
            </li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://placehold.co/550x310.png"
            alt="About Us"
            data-ai-hint="team collaboration"
            width={550}
            height={310}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
            Ready for Unmatched Precision?
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Experience the difference that true accuracy makes. Join Exact Replica today and elevate your projects with perfect replication.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          {/* Could be a form or just a button */}
          <Button type="submit" size="lg" className="w-full transition-transform duration-200 hover:scale-105">
            Start Your Free Trial
          </Button>
          <p className="text-xs text-muted-foreground">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
