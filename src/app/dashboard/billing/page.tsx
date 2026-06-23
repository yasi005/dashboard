"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Perfect for trying EchoSaaS",
    features: ["5 campaigns / month", "3 channels", "Basic editor", "Email support"],
    cta: "Current Plan",
    highlighted: false,
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For creators shipping daily",
    features: [
      "Unlimited campaigns",
      "All 4 channels",
      "Parallel omni-editor",
      "Drag-and-drop calendar",
      "Priority pipeline processing",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    current: false,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/mo",
    description: "Teams managing multiple brands",
    features: [
      "Everything in Pro",
      "5 team seats",
      "White-label exports",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
    current: false,
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#E4E4E7] tracking-tight">Billing & Plans</h2>
        <p className="mt-1 text-[#E4E4E7]/55">Manage your subscription and usage.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative",
              plan.highlighted && "border-[#F59E0B]/40 shadow-lg shadow-[#F59E0B]/8"
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-[#F59E0B] px-3 py-0.5 text-xs font-semibold text-[#080808]">
                Most Popular
              </span>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold text-[#E4E4E7]">{plan.price}</span>
                <span className="text-[#E4E4E7]/55">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[#E4E4E7]/55">
                    <Check className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "default" : "secondary"}
                className="w-full"
                disabled={plan.current}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Track your campaign generation quota.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#E4E4E7]/55">Campaigns generated</span>
              <span className="text-[#E4E4E7] font-medium font-mono">3 / 5</span>
            </div>
            <div className="h-2 rounded-full bg-[#242424] overflow-hidden">
              <div className="h-full w-[60%] rounded-full bg-[#F59E0B]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
