import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function RegionalLeaderboard() {
  const players = [
    { rank: 1, username: 'Yerassyl', city: 'Almaty', rating: 2450 },
    { rank: 2, username: 'Darkhan', city: 'Almaty', rating: 2310 },
    { rank: 3, username: 'Amina', city: 'Almaty', rating: 2150 },
    { rank: 4, username: 'Timur', city: 'Almaty', rating: 1980 },
    { rank: 5, username: 'Zhan', city: 'Almaty', rating: 1850 },
  ];

  return (
    <Card className="w-full bg-zinc-900/30 border-zinc-800/50 shadow-none rounded-2xl">
      <CardHeader className="border-b border-zinc-800/50 pb-4">
        <CardTitle className="text-lg font-medium text-zinc-100">
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800/50 hover:bg-transparent">
              <TableHead className="w-[80px] text-zinc-500 font-medium text-xs pl-6">Rank</TableHead>
              <TableHead className="text-zinc-500 font-medium text-xs">Player</TableHead>
              <TableHead className="text-right text-zinc-500 font-medium text-xs pr-6">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((p) => (
              <TableRow key={p.rank} className="border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <TableCell className="text-zinc-400 pl-6 text-sm">{p.rank}</TableCell>
                <TableCell className="font-medium text-zinc-300 text-sm">{p.username}</TableCell>
                <TableCell className="text-right text-zinc-400 pr-6 text-sm">{p.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
