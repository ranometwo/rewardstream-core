import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";

const Rules: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Settings className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rules</h1>
            <p className="text-muted-foreground">This section has been moved to Schemes</p>
          </div>
        </div>

        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Scheme Authoring Moved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              All loyalty scheme creation and management features have been moved to the <strong>Schemes</strong> section for better organization.
            </p>
            <Button onClick={() => window.location.href = '/schemes'} className="bg-gradient-primary shadow-glass">
              Go to Schemes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Rules;