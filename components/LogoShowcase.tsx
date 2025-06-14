"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Sun, Moon, Sparkles } from "lucide-react";

export function LogoShowcase() {
  const logos = [
    {
      src: "/images/ourlabfun-forlight-transparent.png",
      title: "Light Theme",
      description: "Transparent background for light themes",
      icon: <Sun className="h-4 w-4" />,
      badge: "Transparent",
      bgClass: "bg-white border-2 border-gray-200"
    },
    {
      src: "/images/ourlabfun-fordarktheme-transparent.png",
      title: "Dark Theme", 
      description: "Transparent background for dark themes",
      icon: <Moon className="h-4 w-4" />,
      badge: "Transparent",
      bgClass: "bg-gray-900 border-2 border-gray-700"
    },
    {
      src: "/images/ourlabfun-forlight-bg.png",
      title: "Light Background",
      description: "With built-in light background",
      icon: <Sparkles className="h-4 w-4" />,
      badge: "Background",
      bgClass: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      src: "/images/ourlabfun-fordark-bg.png", 
      title: "Dark Background",
      description: "With built-in dark background",
      icon: <Palette className="h-4 w-4" />,
      badge: "Background", 
      bgClass: "bg-gradient-to-br from-gray-800 to-gray-900"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Our Brand Identity</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the different variations of our logo, designed to work beautifully across all themes and contexts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {logos.map((logo, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {logo.icon}
                    <CardTitle className="text-lg">{logo.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {logo.badge}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {logo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`${logo.bgClass} rounded-lg p-6 flex items-center justify-center min-h-[120px] transition-all duration-300 group-hover:scale-105`}>
                  <Image
                    src={logo.src}
                    alt={`OurLab.fun Logo - ${logo.title}`}
                    width={160}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Crafted with attention to detail for every use case
            </span>
          </div>
        </div>
      </div>
    </section>
  );
} 