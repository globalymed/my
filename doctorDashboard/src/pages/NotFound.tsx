
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md glassmorphism p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-8xl font-bold text-doctor-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <div className="space-y-3">
          <Button
            className="w-full bg-doctor-500 hover:bg-doctor-600"
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
