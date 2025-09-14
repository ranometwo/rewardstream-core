import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onMetadataChange: (metadata: { delimiter: string; encoding: string }) => void;
  selectedFile: File | null;
}

export const FileUploadZone = ({ onFileSelect, onMetadataChange, selectedFile }: FileUploadZoneProps) => {
  const [delimiter, setDelimiter] = useState(',');
  const [encoding, setEncoding] = useState('UTF-8');
  const [preview, setPreview] = useState<string[][]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setErrors([]);
    
    // Validate file
    const validationErrors: string[] = [];
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      validationErrors.push('Only CSV files are supported');
    }
    
    if (file.size > 30 * 1024 * 1024) { // 30MB limit
      validationErrors.push('File size must be under 30MB');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Read file preview
    try {
      const text = await file.text();
      const lines = text.split('\n').slice(0, 5); // First 5 lines for preview
      const parsedLines = lines.map(line => {
        // Simple CSV parsing for preview
        return line.split(delimiter).map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
      });
      
      setPreview(parsedLines);
      onFileSelect(file);
      onMetadataChange({ delimiter, encoding });
    } catch (error) {
      setErrors(['Failed to read file. Please ensure it is a valid CSV file.']);
    }
  }, [delimiter, encoding, onFileSelect, onMetadataChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeFile = () => {
    onFileSelect(null);
    setPreview([]);
    setErrors([]);
  };

  const updateDelimiter = (newDelimiter: string) => {
    setDelimiter(newDelimiter);
    onMetadataChange({ delimiter: newDelimiter, encoding });
    
    // Re-parse preview if file exists
    if (selectedFile && preview.length > 0) {
      // Re-parse the preview with new delimiter
      const text = preview.map(row => row.join(delimiter)).join('\n');
      const lines = text.split('\n');
      const parsedLines = lines.map(line => {
        return line.split(newDelimiter).map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
      });
      setPreview(parsedLines);
    }
  };

  return (
    <div className="space-y-3">
      {/* Compact Upload Zone */}
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {isDragActive ? 'Drop CSV here' : 'Drop CSV or'} <Button variant="link" className="p-0 h-auto text-sm">browse</Button>
              </p>
              <div className="flex gap-1 mt-1">
                <Badge variant="outline" className="text-xs px-1 py-0">CSV</Badge>
                <Badge variant="outline" className="text-xs px-1 py-0">30MB max</Badge>
                <Badge variant="outline" className="text-xs px-1 py-0">Headers req.</Badge>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Compact File Info
        <div className="flex items-center justify-between p-2 bg-green-50/50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <div>
              <div className="font-medium text-sm">{selectedFile.name}</div>
              <div className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={removeFile}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Inline Metadata + Errors */}
      <div className="flex items-center gap-3 flex-wrap">
        {selectedFile && (
          <>
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Delimiter:</Label>
              <Select value={delimiter} onValueChange={updateDelimiter}>
                <SelectTrigger className="h-6 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma</SelectItem>
                  <SelectItem value=";">Semi</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Encoding:</Label>
              <Select value={encoding} onValueChange={setEncoding}>
                <SelectTrigger className="h-6 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTF-8">UTF-8</SelectItem>
                  <SelectItem value="UTF-16">UTF-16</SelectItem>
                  <SelectItem value="ISO-8859-1">ISO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {errors.length > 0 && (
          <Alert variant="destructive" className="p-2">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              {errors.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {selectedFile && errors.length === 0 && (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Ready</span>
          </div>
        )}
      </div>

      {/* Compact Preview Table */}
      {preview.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 px-2 py-1 border-b">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Preview (5 rows)</Label>
              <Badge variant="outline" className="text-xs">{preview[0]?.length || 0} cols</Badge>
            </div>
          </div>
          <div className="overflow-x-auto max-h-32">
            <table className="w-full text-xs">
              <thead className="bg-muted/30">
                <tr>
                  {preview[0]?.map((header, index) => (
                    <th key={index} className="text-left p-1 border-r last:border-r-0 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-1 border-r last:border-r-0 text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};