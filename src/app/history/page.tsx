"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface HistoryItem {
  id: string;
  contentType: string;
  status: string;
  overallScore: number | null;
  preview: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "FAILED":
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge variant="warning">In Progress</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">History</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">History</h1>
        <a href="/evaluate">
          <Button size="sm">New Evaluation</Button>
        </a>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No evaluations yet</p>
          <a href="/evaluate">
            <Button>Start Your First Evaluation</Button>
          </a>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <a key={item.id} href={`/results/${item.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {item.contentType.replace("_", " ")}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {item.preview}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {item.overallScore !== null && (
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 ml-4">
                      {item.overallScore.toFixed(1)}
                    </span>
                  )}
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
