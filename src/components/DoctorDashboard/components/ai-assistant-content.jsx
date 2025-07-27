import React from "react";
import { Card } from "../ui/card";

export function AIAssistantContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <p className="text-gray-600">Get medical insights and recommendations</p>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">AI Medical Assistant</h3>
          <p className="text-gray-600 mt-2">AI assistant features will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
}
