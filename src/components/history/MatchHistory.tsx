"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GameRecord {
  id: string;
  difficulty: string;
  result: "win" | "loss";
  created_at: string;
}

export function MatchHistory({ userId }: { userId: string }) {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("games_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
        
      if (!error && data) {
        setHistory(data as GameRecord[]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [userId, supabase]);

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case "2": return "Easy";
      case "4": return "Medium";
      case "6": return "Hard";
      default: return diff;
    }
  };

  return (
    <Card className="w-full mt-12 bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-muted-foreground text-sm">No matches played yet.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {new Date(record.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getDifficultyLabel(record.difficulty)}</TableCell>
                    <TableCell>
                      <span className={record.result === 'win' ? 'text-primary font-bold' : 'text-destructive font-medium'}>
                        {record.result.toUpperCase()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
