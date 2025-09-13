import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Brain, TrendingUp, Zap } from "lucide-react";

const AdvancedAnalytics: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "Predictive Modeling",
      description: "AI-powered predictions for customer behavior and campaign performance",
    },
    {
      icon: TrendingUp,
      title: "Advanced Segmentation",
      description: "Machine learning based customer segmentation and persona analysis",
    },
    {
      icon: Zap,
      title: "Real-time Insights", 
      description: "Live data processing with instant alerts and recommendations",
    },
    {
      icon: Target,
      title: "Custom Analytics",
      description: "Build custom reports and KPI dashboards tailored to your needs",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
            <p className="text-muted-foreground">Predictive modeling and deep business insights</p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">Advanced Analytics Suite</CardTitle>
            <p className="text-muted-foreground">
              Powered by machine learning and artificial intelligence
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-8">
              The Advanced Analytics system is currently under development. This cutting-edge platform will provide:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">What to Expect</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Data Intelligence</p>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Automated pattern recognition</p>
                    <p>• Anomaly detection</p>
                    <p>• Trend forecasting</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Predictive Analytics</p>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Churn prediction models</p>
                    <p>• Lifetime value calculation</p>
                    <p>• Campaign optimization</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Automation</p>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Smart recommendations</p>
                    <p>• Automated reporting</p>
                    <p>• Alert systems</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdvancedAnalytics;