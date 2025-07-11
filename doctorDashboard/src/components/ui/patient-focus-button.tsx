
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PatientFocusButtonProps {
  patient: {
    id: string;
    name: string;
    avatar?: string;
    initials: string;
  } | null;
  onClear: () => void;
  className?: string;
}

const PatientFocusButton: React.FC<PatientFocusButtonProps> = ({
  patient,
  onClear,
  className,
}) => {
  if (!patient) return null;

  return (
    <div 
      className={cn(
        "inline-flex items-center bg-doctor-50 border border-doctor-200 rounded-full px-2 py-1", 
        className
      )}
    >
      <Avatar className="h-6 w-6 mr-2">
        <AvatarImage src={patient.avatar} alt={patient.name} />
        <AvatarFallback className="bg-doctor-100 text-doctor-800 text-xs">
          {patient.initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-doctor-700 mr-1">
        {patient.name}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 p-0 hover:bg-doctor-100 text-doctor-500"
        onClick={onClear}
      >
        <span className="sr-only">Clear patient focus</span>
        <svg 
          width="15" 
          height="15" 
          viewBox="0 0 15 15" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
            fill="currentColor" 
            fillRule="evenodd" 
            clipRule="evenodd"
          ></path>
        </svg>
      </Button>
    </div>
  );
};

export default PatientFocusButton;
