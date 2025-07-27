import React from "react";
import { Card } from "../ui/card";

export function AvailabilityContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Availability</h2>
        <p className="text-gray-600">Manage your working hours and schedule</p>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Schedule Management</h3>
          <p className="text-gray-600 mt-2">Availability management features will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
}
