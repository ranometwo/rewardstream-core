import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  Upload,
  Database,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImportRun {
  id: string;
  dataset_id: string;
  file_name: string;
  import_mode: string;
  status: string;
  started_at: string;
  completed_at?: string;
  total_rows?: number;
  processed_rows: number;
  inserted_rows: number;
  updated_rows: number;
  skipped_rows: number;
  error_count: number;
  error_message?: string;
  file_size_bytes?: number;
  started_by?: string;
}

interface DataIngestionHistoryProps {
  onSelectRun?: (run: ImportRun) => void;
  dataType?: string;
}

export const DataIngestionHistory = ({ onSelectRun, dataType }: DataIngestionHistoryProps) => {
  const [runs, setRuns] = useState<ImportRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  useEffect(() => {
    loadImportHistory();
  }, [dataType]);

  const loadImportHistory = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('import_runs')
        .select(`
          *,
          datasets!inner(
            name,
            category
          )
        `)
        .order('started_at', { ascending: false })
        .limit(100);

      // Filter by data type if specified
      if (dataType && dataType !== 'all') {
        query = query.eq('datasets.category', dataType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRuns(data || []);
    } catch (error) {
      console.error('Error loading import history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      running: 'default',
      pending: 'secondary'
    } as const;

    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      running: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} 
             className={colors[status as keyof typeof colors] || ''}>
        {status}
      </Badge>
    );
  };

  const getModeBadge = (mode: string) => {
    const colors = {
      append: 'bg-green-50 text-green-700 border-green-200',
      upsert: 'bg-blue-50 text-blue-700 border-blue-200', 
      replace: 'bg-purple-50 text-purple-700 border-purple-200'
    };

    return (
      <Badge variant="outline" className={colors[mode as keyof typeof colors] || ''}>
        {mode}
      </Badge>
    );
  };

  const formatDuration = (startedAt: string, completedAt?: string) => {
    const start = new Date(startedAt);
    const end = completedAt ? new Date(completedAt) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const filteredRuns = runs.filter(run => {
    const matchesSearch = run.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         run.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    const matchesMode = modeFilter === 'all' || run.import_mode === modeFilter;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  const stats = {
    total: runs.length,
    completed: runs.filter(r => r.status === 'completed').length,
    failed: runs.filter(r => r.status === 'failed').length,
    running: runs.filter(r => r.status === 'running').length,
    totalRows: runs.reduce((sum, r) => sum + (r.inserted_rows || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading import history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Stats Bar */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{stats.total} imports</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">{stats.completed} completed</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm">{stats.failed} failed</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            <span className="text-sm">{stats.totalRows.toLocaleString()} rows</span>
          </div>
        </div>
        <Button variant="outline" size="default" onClick={loadImportHistory}>
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Compact Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search imports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
          </SelectContent>
        </Select>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="append">Append</SelectItem>
            <SelectItem value="upsert">Upsert</SelectItem>
            <SelectItem value="replace">Replace</SelectItem>
          </SelectContent>
        </Select>
      </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by filename or import ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="append">Append</SelectItem>
                <SelectItem value="upsert">Upsert</SelectItem>
                <SelectItem value="replace">Replace</SelectItem>
              </SelectContent>
            </Select>
          </div>

      {/* Compact Table */}
      {filteredRuns.length === 0 ? (
        <div className="text-center py-8">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {runs.length === 0 ? "No imports yet" : "No matches found"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 h-10">
                <TableHead className="w-8"></TableHead>
                <TableHead className="text-xs">File & ID</TableHead>
                <TableHead className="text-xs">Mode</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Started</TableHead>
                <TableHead className="text-xs">Duration</TableHead>
                <TableHead className="text-xs text-right">Rows</TableHead>
                <TableHead className="text-xs text-right">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRuns.map((run) => (
                <TableRow 
                  key={run.id}
                  className="hover:bg-muted/20 cursor-pointer h-12"
                  onClick={() => onSelectRun?.(run)}
                >
                  <TableCell className="py-2">{getStatusIcon(run.status)}</TableCell>
                  <TableCell className="py-2">
                    <div>
                      <div className="text-sm font-medium truncate max-w-[150px]">{run.file_name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {run.id.slice(0, 8)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">{getModeBadge(run.import_mode)}</TableCell>
                  <TableCell className="py-2">{getStatusBadge(run.status)}</TableCell>
                  <TableCell className="py-2">
                    <div className="text-xs">
                      {new Date(run.started_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="text-xs">
                      {formatDuration(run.started_at, run.completed_at)}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <div className="text-xs">
                      <div className="font-medium">
                        {(run.inserted_rows + run.updated_rows).toLocaleString()}
                      </div>
                      {run.error_count > 0 && (
                        <div className="text-red-600">
                          {run.error_count} errors
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <div className="text-xs">
                      {formatFileSize(run.file_size_bytes)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};