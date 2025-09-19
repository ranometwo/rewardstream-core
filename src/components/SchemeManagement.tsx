import React, { useState } from "react";
import SchemesList from "./schemes/SchemesList";
import SchemeWizard from "./schemes/SchemeWizard";
import AdvancedBuilder from "./schemes/AdvancedBuilder";
import type { SchemeConfig } from "./schemes/SchemeWizard";

const SchemeManagement = () => {
  const [currentView, setCurrentView] = useState<"list" | "create" | "advanced">("list");
  const [editingScheme, setEditingScheme] = useState<string | null>(null);

  const handleCreateScheme = () => {
    setCurrentView("create");
    setEditingScheme(null);
  };

  const handleCreateAdvanced = () => {
    setCurrentView("advanced");
    setEditingScheme(null);
  };

  const handleEditScheme = (schemeId: string) => {
    setEditingScheme(schemeId);
    // For now, treat edit as create new
    setCurrentView("create");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingScheme(null);
  };

  const handleSchemeSaved = (config: SchemeConfig) => {
    console.log("Scheme saved:", config);
    // Here you would normally save to backend
    setCurrentView("list");
  };

  if (currentView === "create") {
    return (
      <SchemeWizard
        onBack={handleBackToList}
        onSchemeSaved={handleSchemeSaved}
      />
    );
  }

  if (currentView === "advanced") {
    return (
      <AdvancedBuilder
        onBack={handleBackToList}
      />
    );
  }

  return (
    <SchemesList
      onCreateScheme={handleCreateScheme}
      onCreateAdvanced={handleCreateAdvanced}
      onEditScheme={handleEditScheme}
    />
  );
};

export default SchemeManagement;