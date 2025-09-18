import React, { useState } from "react";
import SchemesList from "./schemes/SchemesList";
import SchemeWizard from "./schemes/SchemeWizard";
import type { SchemeConfig } from "./schemes/SchemeWizard";

const RuleEngine = () => {
  const [currentView, setCurrentView] = useState<"list" | "create">("list");
  const [editingScheme, setEditingScheme] = useState<string | null>(null);

  const handleCreateScheme = () => {
    setCurrentView("create");
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

  return (
    <SchemesList
      onCreateScheme={handleCreateScheme}
      onEditScheme={handleEditScheme}
    />
  );
};

export default RuleEngine;
