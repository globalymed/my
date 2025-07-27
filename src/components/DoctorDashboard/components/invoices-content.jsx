import React from "react";
import { Card } from "../ui/card";

export function InvoicesContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Invoices</h2>
        <p className="text-gray-600">Manage billing and payments</p>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Invoice Management</h3>
          <p className="text-gray-600 mt-2">Invoice management features will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
}
