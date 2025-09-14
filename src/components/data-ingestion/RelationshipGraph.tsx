import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Network, Database, Key, Link2, Search, Filter } from "lucide-react";

interface RelationshipGraphProps {
  mappings: Array<{
    sourceColumn: string;
    role: 'primary_key' | 'foreign_key' | 'attribute';
    targetDataset?: string;
    targetColumn?: string;
    confidence: number;
    coverage?: number;
  }>;
  availableDatasets: Array<{
    id: string;
    name: string;
    columns: string[];
  }>;
  onMappingUpdate: (sourceColumn: string, updates: any) => void;
}

export const RelationshipGraph = ({ mappings, availableDatasets, onMappingUpdate }: RelationshipGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const relations = mappings.filter(m => m.role === 'foreign_key' && m.targetDataset && m.targetColumn);
  
  // Create nodes for current dataset and related datasets
  const nodes = [
    { id: 'current', name: 'Current Upload', type: 'upload', x: 400, y: 300 },
    ...availableDatasets
      .filter(dataset => relations.some(r => r.targetDataset === dataset.id))
      .map((dataset, index) => ({
        id: dataset.id,
        name: dataset.name,
        type: 'dataset',
        x: 200 + (index * 300),
        y: 100 + (index % 2) * 400
      }))
  ];

  const getEdgeColor = (coverage: number | undefined) => {
    if (!coverage) return '#94a3b8'; // gray
    if (coverage >= 95) return '#22c55e'; // green
    if (coverage >= 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getEdgeWidth = (confidence: number) => {
    return Math.max(2, confidence * 5);
  };

  return (
    <div className="space-y-6">
      {/* Graph Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Relationship Graph
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Current Upload</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>Existing Dataset</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-500"></div>
              <span>High Coverage (≥95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-yellow-500"></div>
              <span>Medium Coverage (70-95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500"></div>
              <span>Low Coverage (&lt;70%)</span>
            </div>
          </div>

          {/* SVG Graph */}
          <div className="border rounded-lg bg-muted/20 overflow-hidden" style={{ height: '500px' }}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 800 500"
              className="w-full h-full"
            >
              {/* Background grid */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Edges (Relationships) */}
              {relations.map((relation, index) => {
                const sourceNode = nodes.find(n => n.id === 'current');
                const targetNode = nodes.find(n => n.id === relation.targetDataset);
                
                if (!sourceNode || !targetNode) return null;

                const edgeColor = getEdgeColor(relation.coverage);
                const edgeWidth = getEdgeWidth(relation.confidence);

                return (
                  <g key={`edge-${index}`}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={edgeColor}
                      strokeWidth={edgeWidth}
                      opacity="0.8"
                    />
                    
                    {/* Edge Label */}
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 10}
                      textAnchor="middle"
                      fontSize="12"
                      fill="hsl(var(--foreground))"
                      className="font-mono"
                    >
                      {relation.sourceColumn} → {relation.targetColumn}
                    </text>
                    
                    {/* Coverage Badge */}
                    {relation.coverage && (
                      <rect
                        x={(sourceNode.x + targetNode.x) / 2 - 15}
                        y={(sourceNode.y + targetNode.y) / 2 + 5}
                        width="30"
                        height="16"
                        rx="8"
                        fill={edgeColor}
                      />
                    )}
                    {relation.coverage && (
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 + 15}
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontWeight="bold"
                      >
                        {relation.coverage}%
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const isUpload = node.type === 'upload';
                const nodeColor = isUpload ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
                const nodeRadius = isUpload ? 60 : 50;

                return (
                  <g key={node.id}>
                    {/* Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius}
                      fill={nodeColor}
                      stroke="white"
                      strokeWidth="3"
                      opacity={isUpload ? "1" : "0.8"}
                    />
                    
                    {/* Node Icon */}
                    <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                      {isUpload ? (
                        <rect x="4" y="4" width="12" height="12" fill="white" rx="2" />
                      ) : (
                        <Database width="16" height="16" fill="white" />
                      )}
                    </g>
                    
                    {/* Node Label */}
                    <text
                      x={node.x}
                      y={node.y + nodeRadius + 20}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="bold"
                      fill="hsl(var(--foreground))"
                    >
                      {node.name}
                    </text>
                    
                    {/* Relation count for existing datasets */}
                    {!isUpload && (
                      <text
                        x={node.x}
                        y={node.y + nodeRadius + 35}
                        textAnchor="middle"
                        fontSize="12"
                        fill="hsl(var(--muted-foreground))"
                      >
                        {relations.filter(r => r.targetDataset === node.id).length} relation(s)
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Current Dataset Columns */}
              <g transform="translate(320, 380)">
                <rect
                  width="160"
                  height="100"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x="80"
                  y="15"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="hsl(var(--foreground))"
                >
                  Upload Columns
                </text>
                {mappings.slice(0, 6).map((mapping, index) => (
                  <g key={mapping.sourceColumn} transform={`translate(10, ${25 + index * 12})`}>
                    {mapping.role === 'primary_key' && (
                      <Key width="8" height="8" fill="hsl(var(--primary))" />
                    )}
                    {mapping.role === 'foreign_key' && (
                      <Link2 width="8" height="8" fill="hsl(var(--secondary))" />
                    )}
                    <text
                      x="12"
                      y="6"
                      fontSize="10"
                      fill="hsl(var(--foreground))"
                    >
                      {mapping.sourceColumn}
                    </text>
                  </g>
                ))}
                {mappings.length > 6 && (
                  <text
                    x="80"
                    y="95"
                    textAnchor="middle"
                    fontSize="10"
                    fill="hsl(var(--muted-foreground))"
                  >
                    +{mappings.length - 6} more...
                  </text>
                )}
              </g>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Relationship Details */}
      {relations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Relationship Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relations.map((relation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">
                      {relation.sourceColumn} → {relation.targetDataset}.{relation.targetColumn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {Math.round(relation.confidence * 100)}% confidence
                    </Badge>
                    {relation.coverage && (
                      <Badge className={
                        relation.coverage >= 95 ? 'bg-green-100 text-green-800' :
                        relation.coverage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {relation.coverage}% coverage
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Relationships Message */}
      {relations.length === 0 && (
        <Alert>
          <Network className="h-4 w-4" />
          <AlertDescription>
            No foreign key relationships detected. Consider mapping columns to existing datasets 
            to enable data joins and maintain referential integrity.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};