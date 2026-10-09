"use client";

/**
 * @file RegistryEditor.tsx
 * @description Windows Registry style editor for Element Engine configuration
 */

import React, { useState, useMemo } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { flattenRegistry } from "@/features/iot/engine";

export const RegistryEditor: React.FC = () => {
  const elementConfig = useIoTStore((s) => s.elementConfig);
  const updateRegistryValue = useIoTStore((s) => s.updateRegistryValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const registryItems = useMemo(() => flattenRegistry(elementConfig), [elementConfig]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    registryItems.forEach((item) => cats.add(item.category));
    return Array.from(cats);
  }, [registryItems]);

  const filteredItems = useMemo(() => {
    return registryItems.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        item.keyPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.value).toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [registryItems, selectedCategory, searchTerm]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="جستجوی کلید در Registry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
        >
          <option value="all">همه دسته‌ها</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-60 overflow-y-auto border border-white/10 rounded-xl bg-slate-950/70 p-2 space-y-1 font-mono text-xs">
        {filteredItems.map((item) => (
          <div
            key={item.keyPath}
            className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-amber-400 font-semibold truncate max-w-[200px]" title={item.keyPath}>
              {item.keyPath}
            </span>

            <input
              type={item.type === "number" ? "number" : "text"}
              value={String(item.value)}
              onChange={(e) => {
                const val = item.type === "number" ? Number(e.target.value) : e.target.value;
                updateRegistryValue(item.keyPath, val);
              }}
              className="bg-slate-900 border border-white/10 rounded px-2 py-0.5 text-slate-100 text-xs text-left w-48 focus:border-amber-500 focus:outline-none"
            />
          </div>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-center text-slate-500 text-xs py-4 font-sans">هیچ کلیدی یافت نشد.</p>
        )}
      </div>
    </div>
  );
};
