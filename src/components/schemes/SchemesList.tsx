import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Play, Pause, Copy, Download, Eye } from "lucide-react";

interface Scheme {
  id: string;
  name: string;
  type: "Top Performers" | "Product Category + Slab" | "Bundles";
  status: "Draft" | "Live" | "Ended" | "Paused";
  duration: string;
  rewardType: "Cash" | "Points";
  owner: string;
  lastUpdated: string;
  participants?: number;
  budget?: number;
}

const mockSchemes: Scheme[] = [
  {
    id: "1",
    name: "Q4 Premium Paint Champions",
    type: "Top Performers",
    status: "Live",
    duration: "Oct 1 - Dec 31, 2025",
    rewardType: "Cash",
    owner: "Rajesh Kumar",
    lastUpdated: "2 hours ago",
    participants: 1247,
    budget: 250000
  },
  {
    id: "2", 
    name: "Interior Paint Volume Boost",
    type: "Product Category + Slab",
    status: "Draft",
    duration: "Nov 1 - Nov 30, 2025",
    rewardType: "Cash",
    owner: "Priya Sharma",
    lastUpdated: "1 day ago",
    participants: 0,
    budget: 180000
  },
  {
    id: "3",
    name: "Complete Solution Bundle Drive",
    type: "Bundles", 
    status: "Ended",
    duration: "Jul 1 - Sep 30, 2025",
    rewardType: "Cash",
    owner: "Amit Singh",
    lastUpdated: "5 days ago",
    participants: 892,
    budget: 320000
  }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Live": return "default";
    case "Draft": return "secondary";
    case "Ended": return "outline";
    case "Paused": return "destructive";
    default: return "secondary";
  }
};

interface SchemesListProps {
  onCreateScheme: () => void;
  onCreateAdvanced: () => void;
  onEditScheme: (schemeId: string) => void;
}

const SchemesList: React.FC<SchemesListProps> = ({ onCreateScheme, onCreateAdvanced, onEditScheme }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [schemes] = useState<Scheme[]>(mockSchemes);

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loyalty Schemes</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage contractor loyalty and incentive schemes
          </p>
        </div>
        <Button onClick={onCreateScheme} className="shadow-enterprise">
          <Plus className="h-4 w-4 mr-2" />
          Create New Scheme
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-enterprise">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <p className="text-sm font-medium text-muted-foreground">ACTIVE SCHEMES</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">3</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-enterprise">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <p className="text-sm font-medium text-muted-foreground">TOTAL PARTICIPANTS</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">2,139</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-enterprise">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-warning"></div>
              <p className="text-sm font-medium text-muted-foreground">REWARD POOL</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">₹7.5L</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-enterprise">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
              <p className="text-sm font-medium text-muted-foreground">AVG PAYOUT</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">₹3,507</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-border shadow-enterprise">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Schemes</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reward Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchemes.map((scheme) => (
                <TableRow key={scheme.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{scheme.name}</p>
                      {scheme.budget && (
                        <p className="text-sm text-muted-foreground">Budget: ₹{scheme.budget.toLocaleString()}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{scheme.type}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(scheme.status)}>
                      {scheme.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{scheme.duration}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{scheme.rewardType}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{scheme.owner}</TableCell>
                  <TableCell className="text-sm">
                    {scheme.participants ? scheme.participants.toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{scheme.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditScheme(scheme.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {scheme.status === "Draft" && (
                          <DropdownMenuItem onClick={() => onEditScheme(scheme.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Edit & Publish
                          </DropdownMenuItem>
                        )}
                        {scheme.status === "Live" && (
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Scheme
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Clone Scheme
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export Results
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSchemes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No schemes found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemesList;