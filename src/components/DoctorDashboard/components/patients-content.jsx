import React from "react";
import { Card } from "../ui/card";

export function PatientsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Patients</h2>
        <p className="text-gray-600">Manage your patient records</p>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Patient Management</h3>
          <p className="text-gray-600 mt-2">Patient management features will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
}
