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
  onMetadataChange: (metadata: { delimiter: string; encoding: 'UTF-8' | 'UTF-16' | 'ASCII' | 'ISO-8859-1' }) => void;
  selectedFile: File | null;
}

export const FileUploadZone = ({ onFileSelect, onMetadataChange, selectedFile }: FileUploadZoneProps) => {
  const [delimiter, setDelimiter] = useState(',');
  const [encoding, setEncoding] = useState<'UTF-8' | 'UTF-16' | 'ASCII' | 'ISO-8859-1'>('UTF-8');
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
    <div className="space-y-6">
      {/* File Upload Zone */}
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-muted-foreground mb-4">
                or <Button variant="link" className="p-0 h-auto">browse files</Button>
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">CSV format</Badge>
                <Badge variant="outline">UTF-8 encoding</Badge>
                <Badge variant="outline">Max 30MB</Badge>
                <Badge variant="outline">Headers required</Badge>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // File Selected
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={removeFile}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* File Metadata */}
      {selectedFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Delimiter</Label>
            <Select value={delimiter} onValueChange={updateDelimiter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
                <SelectItem value="\t">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Encoding</Label>
            <Select value={encoding} onValueChange={(value) => setEncoding(value as 'UTF-8' | 'UTF-16' | 'ASCII' | 'ISO-8859-1')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTF-8">UTF-8</SelectItem>
                <SelectItem value="UTF-16">UTF-16</SelectItem>
                <SelectItem value="ISO-8859-1">ISO-8859-1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* File Preview */}
      {preview.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">File Preview</Label>
            <Badge variant="outline" className="text-xs">First 5 rows</Badge>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {preview[0]?.map((header, index) => (
                      <th key={index} className="text-left p-3 border-r last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-3 border-r last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {selectedFile && errors.length === 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            File uploaded successfully. Ready for data profiling.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};