import React from "react";
import { Card } from "../ui/card";

export function DocumentsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Documents</h2>
        <p className="text-gray-600">Manage patient documents and files</p>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Document Management</h3>
          <p className="text-gray-600 mt-2">Document management features will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
}
