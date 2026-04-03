"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  BarChart3, 
  Gauge, 
  Calendar, 
  Zap 
} from "lucide-react";

const navigation = [
  {
    name: "Vol Regime",
    href: "/vol-regime",
    icon: TrendingUp,
    description: "Volatility regime analysis"
  },
  {
    name: "Derivatives",
    href: "/derivatives",
    icon: BarChart3,
    description: "Options and derivatives desk"
  },
  {
    name: "Cockpit",
    href: "/cockpit",
    icon: Gauge,
    description: "Trader's cockpit overview"
  },
  {
    name: "Premarket",
    href: "/premarket",
    icon: Calendar,
    description: "Pre-market analysis"
  },
  {
    name: "Energy",
    href: "/energy",
    icon: Zap,
    description: "Gulf energy trading"
  }
];

export function TruddleNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white border-r border-gray-200 px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Truddle</h1>
        <p className="text-sm text-gray-500 mt-1">Trading Dashboard</p>
      </div>

      <ul className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (pathname === "/" && item.href === "/vol-regime");
          
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Connected to MC Backend
        </p>
        <div className="flex items-center mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Live Data</span>
        </div>
      </div>
    </nav>
  );
}