"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "cancelkit_demo_pk";
const CUSTOMER_STORAGE_KEY = "cancelkit_demo_customer_id";
const DEFAULT_CUSTOMER_ID = "demo_customer_123";

type LogEntry = { time: string; message: string };

export function DemoClient() {
  const [pkInput, setPkInput] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState(DEFAULT_CUSTOMER_ID);
  const [log, setLog] = useState<LogEntry[]>([]);

  function appendLog(message: string) {
    setLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), message }].slice(-20));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key") || window.localStorage.getItem(STORAGE_KEY) || "";
    setPkInput(key);
    setActiveKey(key || null);

    const storedCustomerId = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (storedCustomerId) setCustomerId(storedCustomerId);
  }, []);

  useEffect(() => {
    if (!activeKey) return;

    const script = document.createElement("script");
    script.src = "/v1.js";
    script.dataset.key = activeKey;
    script.async = false;
    script.onload = () => {
      appendLog("Widget script loaded.");
      window.CancelKit?.init({
        onContinueCancel: (ctx) => {
          appendLog(
            `onContinueCancel fired — customerId=${ctx.customerId ?? "n/a"}, reasonId=${ctx.reasonId ?? "n/a"}`,
          );
        },
      });
    };
    script.onerror = () => appendLog("Failed to load /v1.js — run `npm run build:widget` first.");
    document.body.appendChild(script);

    return () => {
      script.remove();
      window.CancelKit = undefined;
    };
  }, [activeKey]);

  function handleCustomerIdChange(value: string) {
    setCustomerId(value);
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, value);
  }

  function handleLoad() {
    const trimmed = pkInput.trim();
    window.localStorage.setItem(STORAGE_KEY, trimmed);
    const url = new URL(window.location.href);
    if (trimmed) url.searchParams.set("key", trimmed);
    else url.searchParams.delete("key");
    window.location.href = url.toString();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CancelKit widget demo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A stand-in SaaS billing page for testing the embed end-to-end.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Developer panel</CardTitle>
          <CardDescription>
            Paste a project&apos;s publishable key (Settings → Widget snippet). Make sure{" "}
            <code className="font-mono">http://localhost:3000</code> is in that project&apos;s
            Allowed origins first.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="pk">Publishable key</Label>
              <Input
                id="pk"
                placeholder="pk_live_..."
                value={pkInput}
                onChange={(e) => setPkInput(e.target.value)}
              />
            </div>
            <Button onClick={handleLoad}>Load</Button>
          </div>
          <div className="space-y-1">
            <Label htmlFor="customer-id">Stripe Customer ID (cus_...)</Label>
            <Input
              id="customer-id"
              placeholder="cus_..."
              value={customerId}
              onChange={(e) => handleCustomerIdChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acme SaaS — Your subscription</CardTitle>
          <CardDescription>Pro plan · $49/month · renews Aug 10, 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            data-cancelkit
            data-ck-customer={customerId}
            data-ck-email="demo@customer.test"
            className="rounded-md border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/5"
          >
            Cancel subscription
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event log</CardTitle>
          <CardDescription>onContinueCancel callback + widget script events.</CardDescription>
        </CardHeader>
        <CardContent>
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          ) : (
            <ul className="space-y-1 font-mono text-xs">
              {log.map((entry, i) => (
                <li key={i} className="text-muted-foreground">
                  <span className="text-foreground">{entry.time}</span> — {entry.message}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
