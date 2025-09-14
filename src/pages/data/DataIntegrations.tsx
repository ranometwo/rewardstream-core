import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, Link, Mail, ArrowRight, Webhook, Database, Cloud } from "lucide-react";

const DataIntegrations = () => {
  const integrationFeatures = [
    {
      icon: <Zap className="h-12 w-12 text-blue-500" />,
      title: "API & Webhooks",
      description: "Real-time data streaming with REST APIs and webhook notifications",
      features: [
        "Real-time data sync",
        "Webhook notifications", 
        "Custom API endpoints",
        "Rate limiting & security"
      ],
      status: "coming-soon"
    },
    {
      icon: <Calendar className="h-12 w-12 text-green-500" />,
      title: "Scheduled Imports", 
      description: "Automated batch processing with flexible scheduling options",
      features: [
        "Cron-based scheduling",
        "Multiple file formats",
        "Error handling & retry",
        "Progress monitoring"
      ],
      status: "coming-soon"
    },
    {
      icon: <Link className="h-12 w-12 text-purple-500" />,
      title: "Platform Connectors",
      description: "Direct integrations with popular business platforms and databases",
      features: [
        "CRM systems (Salesforce, HubSpot)",
        "E-commerce (Shopify, WooCommerce)", 
        "Databases (MySQL, PostgreSQL)",
        "Cloud storage (AWS S3, Google Drive)"
      ],
      status: "coming-soon"
    }
  ];

  const upcomingConnectors = [
    { name: "Salesforce", icon: <Cloud className="h-6 w-6" />, category: "CRM" },
    { name: "HubSpot", icon: <Database className="h-6 w-6" />, category: "CRM" },
    { name: "Shopify", icon: <Link className="h-6 w-6" />, category: "E-commerce" },
    { name: "WooCommerce", icon: <Webhook className="h-6 w-6" />, category: "E-commerce" },
    { name: "MySQL", icon: <Database className="h-6 w-6" />, category: "Database" },
    { name: "PostgreSQL", icon: <Database className="h-6 w-6" />, category: "Database" },
    { name: "AWS S3", icon: <Cloud className="h-6 w-6" />, category: "Storage" },
    { name: "Google Drive", icon: <Cloud className="h-6 w-6" />, category: "Storage" }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Integrations</h1>
            <p className="text-muted-foreground">Connect with external systems and automate data workflows</p>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Cloud className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-3">Integrations Coming Soon</h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Connect your loyalty engine directly with external systems for seamless data flow and automated processing.
                </p>
              </div>

              <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                Beta Release: Q2 2024
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrationFeatures.map((feature, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Features:</h4>
                  <ul className="space-y-1">
                    {feature.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full" disabled>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Connectors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Planned Platform Connectors</CardTitle>
            <p className="text-sm text-muted-foreground">
              Direct integrations with popular business platforms will be available in our first release
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {upcomingConnectors.map((connector, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {connector.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{connector.name}</div>
                    <div className="text-xs text-muted-foreground">{connector.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Signup */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Get Notified</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Be the first to know when integrations are available
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 max-w-md">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1"
              />
              <Button>
                Notify Me
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              We'll send you an email when integrations become available. No spam, unsubscribe anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DataIntegrations;